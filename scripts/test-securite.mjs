#!/usr/bin/env node
// Suite de tests de securite, contre la base liee (supabase link).
//
//   node scripts/test-securite.mjs            tous les tests
//   node scripts/test-securite.mjs acces      ceux dont le nom contient "acces"
//
// A lancer apres chaque migration (et avant de la committer) : une regle de securite qui saute
// se voit ici, pas en production. Le hook .githooks/pre-commit la lance tout seul quand le
// commit touche supabase/.
//
// Chaque supabase/tests/securite/NN_*.sql est execute dans UNE transaction toujours annulee
// (voir scripts/lib/securite-sql.mjs) : rien n'est ecrit en base. Un test ne doit donc jamais
// contenir COMMIT ni ROLLBACK (verifie ici). Les fichiers sont independants : lances 3 a la fois.

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { DOSSIER, contientFinDeTransaction, executer } from './lib/securite-sql.mjs';

const filtre = process.argv[2] ?? '';
const tests = readdirSync(DOSSIER).filter((f) => /^\d+_.*\.sql$/.test(f) && f.includes(filtre)).sort();
if (tests.length === 0) {
  console.error(`Aucun test ne correspond a "${filtre}".`);
  process.exit(1);
}

const textes = new Map(tests.map((f) => [f, readFileSync(join(DOSSIER, f), 'utf8')]));
const resultats = new Map();
for (const f of tests) if (contientFinDeTransaction(textes.get(f))) resultats.set(f, { refuse: true });

let prochain = 0;
let echecs = 0;
let assertions = 0;
function afficher() {
  while (prochain < tests.length && resultats.has(tests[prochain])) {
    const fichier = tests[prochain++];
    const r = resultats.get(fichier);
    if (r.refuse) {
      echecs++;
      console.log(`✗ ${fichier} : contient COMMIT/ROLLBACK, refuse (les donnees de test seraient ecrites)`);
    } else if (r.statut === 'ok' && r.n === 0) {
      echecs++;
      console.log(`✗ ${fichier} : aucune verification enregistree`);
    } else if (r.statut === 'ok') {
      assertions += r.n;
      console.log(`✓ ${fichier} (${r.n} verifications)`);
    } else if (r.statut === 'echec') {
      echecs++;
      console.log(`✗ ${fichier}\n${r.lignes.join('\n')}`);
    } else {
      echecs++;
      const verrou = r.verrou ? '\n  (verrou non obtenu a temps : relancer le test)' : '';
      console.log(`✗ ${fichier} : le test n'a pas pu s'executer\n  ${r.message}${verrou}`);
    }
  }
}

const file = tests.filter((f) => !resultats.has(f));
async function ouvrier() {
  for (let f = file.shift(); f; f = file.shift()) {
    resultats.set(f, await executer(f, textes.get(f)));
    afficher();
  }
}
afficher();
await Promise.all(Array.from({ length: Math.min(3, file.length) }, ouvrier));
afficher();

console.log(`\n${assertions} verifications, ${echecs} fichier(s) en echec.`);
process.exit(echecs ? 1 : 0);
