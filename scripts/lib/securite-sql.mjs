// Execution d'un fichier de supabase/tests/securite/ contre la base liee (supabase link),
// partagee par scripts/test-securite.mjs.
//
// Un fichier s'execute dans UNE transaction : BEGIN + delais + _outils.sql + test + _bilan.sql.
// _bilan.sql leve toujours une exception : la transaction est annulee, aucune donnee de test ne
// reste en base (et les requetes pg_net en file, e-mails compris, partent avec).

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const DOSSIER = join(RACINE, 'supabase', 'tests', 'securite');

// La base est celle de PRODUCTION : un test qui attend un verrou abandonne apres quelques
// secondes au lieu de faire patienter les requetes des utilisateurs derriere lui.
const DELAI_VERROU = '3s';
const DELAI_REQUETE = '60s';

const outils = readFileSync(join(DOSSIER, '_outils.sql'), 'utf8');
const bilan = readFileSync(join(DOSSIER, '_bilan.sql'), 'utf8');
const tmp = mkdtempSync(join(tmpdir(), 'lampasai-tests-'));

// N'importe ou dans le texte (hors commentaires) : un « END $$; COMMIT; » ecrirait les donnees
// de test en production.
export function contientFinDeTransaction(sql) {
  return /\b(COMMIT|ROLLBACK|ABORT|END\s+(TRANSACTION|WORK))\s*;/i.test(sql.replace(/--[^\n]*/g, ''));
}

const execFileAsync = promisify(execFile);

// Resultat : { statut: 'ok', n } | { statut: 'echec', lignes } | { statut: 'erreur', message, verrou }
export async function executer(nom, test) {
  const chemin = join(tmp, nom.replace(/[^\w.-]/g, '_'));
  writeFileSync(chemin, `BEGIN;\nSET LOCAL lock_timeout = '${DELAI_VERROU}';\nSET LOCAL statement_timeout = '${DELAI_REQUETE}';\n`
    + `${outils}\n-- ── ${nom} ──\n${test}\n${bilan}\n`);
  let sortie;
  try {
    const r = await execFileAsync('supabase', ['db', 'query', '--linked', '--file', chemin],
      { cwd: RACINE, encoding: 'utf8', timeout: 120_000, maxBuffer: 16 * 1024 * 1024 });
    sortie = `${r.stdout}${r.stderr}`;
  } catch (e) {
    sortie = `${e.stdout ?? ''}${e.stderr ?? ''}`;
  }
  return analyser(sortie);
}

function analyser(sortie) {
  // Message d'erreur Postgres, echappe dans le JSON de la CLI.
  const texte = sortie.replace(/\\\\n/g, '\n').replace(/\\n/g, '\n').replace(/\\+"/g, '"').replace(/\\\\/g, '\\');
  const ok = texte.match(/TEST_OK (\d+)/);
  if (ok) return { statut: 'ok', n: Number(ok[1]) };
  const ko = texte.match(/TEST_ECHEC\n([\s\S]*?)(\nCONTEXT:|"\}|$)/);
  if (ko) return { statut: 'echec', lignes: ko[1].trimEnd().split('\n') };
  const err = texte.match(/ERROR:[^\n]*/);
  return { statut: 'erreur', message: err ? err[0] : texte.slice(0, 600), verrou: /lock timeout|deadlock detected/i.test(texte) };
}
