#!/usr/bin/env node
// Garde d'acces des Edge Functions - controle statique, sans base ni secret.
//
//   node scripts/test-edge-auth.mjs
//
// Les Edge Functions echappent a la suite SQL (supabase/tests/securite/) et
// `supabase functions deploy` ne verifie rien. Or la cle anon, embarquee dans le site donc
// publique, est un JWT valide : chaque fonction doit controler son appelant elle-meme, et le
// faire en FAIL-CLOSED (un secret absent de l'environnement refuse tout, il n'accepte jamais tout).
//
// Une fonction sans garde reconnue fait echouer le controle : on tranche (garde ajoutee, ou
// regle ci-dessous apres relecture), jamais par defaut.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DOSSIER = join(RACINE, 'supabase', 'functions');

// Appel serveur a serveur (cron) : secret partage en en-tete, refus s'il est absent ou different.
const secret = (en_tete, variable) => [
  new RegExp(`req\\.headers\\.get\\(\\s*["']${en_tete}["']\\s*\\)`),
  new RegExp(`if\\s*\\(\\s*!secret\\s*\\|\\|\\s*secret\\s*!==\\s*Deno\\.env\\.get\\(\\s*["']${variable}["']\\s*\\)\\s*\\)`),
  /\b401\b/,
];
// Appel depuis le site : l'utilisateur est resolu depuis son jeton ET un jeton invalide est refuse.
const UTILISATEUR = [/auth\.getUser\(/, /\b401\b/];

// Garde de chaque fonction, relue une par une.
const REGLES = {
  'admin-create-exam-voucher': [/requireAdmin\(/, /"response" in auth/],
  'admin-delete-accounts': [/requireAdmin\(/, /"response" in auth/],
  'admin-link-gumroad-purchase': [/requireAdmin\(/, /"response" in auth/],
  'admin-send-email': [/requireAdmin\(/, /"response" in auth/],
  'admin-trigger-reconcile': [/requireAdmin\(/, /"response" in auth/],
  'create-checkout-session': UTILISATEUR,
  'delete-my-account': [...UTILISATEUR, /admin_account/],
  'delete-orphan-oauth-user': UTILISATEUR,
  'reconcile-pending-purchases': UTILISATEUR,
  'redeem-exam-voucher': [...UTILISATEUR, /record_and_count_rate_limit|rate_limited/],
  'gumroad-reconcile': secret('X-Reconcile-Secret', 'GUMROAD_RECONCILE_SECRET'),
  'send-expiry-reminders': secret('X-Reminder-Secret', 'EXPIRY_REMINDER_SECRET'),
  'notify-feedback': secret('X-Feedback-Secret', 'FEEDBACK_NOTIFY_SECRET'),
  // Appels sans compte : une preuve propre a chaque cas.
  'stripe-webhook': [/Stripe-Signature/, /if\s*\(\s*!signature\s*\)/, /Invalid signature/],
  // Gumroad ne signe pas ses appels : la vente est reverifiee aupres de l'API Gumroad avant tout acces.
  'gumroad-webhook': [/verifySale\(/, /Gumroad pings aren't cryptographically signed/],
  'email-unsubscribe': [/isValidToken\(/],
  // Avant inscription / formulaire public : pas de compte, mais un plafond par adresse IP.
  'signup-with-custom-email': [/record_and_count_rate_limit/, /rate_limited/, /429/],
  'contact-message': [/record_and_count_rate_limit/, /rate_limited/, /429/],
};

const fonctions = readdirSync(DOSSIER, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !d.name.startsWith('_') && existsSync(join(DOSSIER, d.name, 'index.ts')))
  .map((d) => d.name)
  .sort();

let echecs = 0;
for (const nom of fonctions) {
  const code = readFileSync(join(DOSSIER, nom, 'index.ts'), 'utf8');
  const regle = REGLES[nom];
  if (!regle) {
    console.log(`✗ ${nom} : aucune garde reconnue (nouvelle fonction ? ajouter sa regle apres relecture)`);
    echecs++;
    continue;
  }
  const manquantes = regle.filter((r) => !r.test(code));
  if (manquantes.length) {
    console.log(`✗ ${nom} : garde incomplete (${manquantes.map(String).join(' ; ')})`);
    echecs++;
  } else {
    console.log(`✓ ${nom}`);
  }
}
for (const nom of Object.keys(REGLES)) {
  if (!fonctions.includes(nom)) {
    console.log(`✗ regle orpheline : ${nom} n'existe plus, retirer sa regle`);
    echecs++;
  }
}

console.log(`\n${fonctions.length - echecs}/${fonctions.length} fonctions gardees.`);
process.exit(echecs ? 1 : 0);
