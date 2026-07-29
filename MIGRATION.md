# Paiement : Gumroad ↔ Stripe

## État actuel

`ENABLE_GUMROAD = true` dans `src/lib/paymentConfig.ts` - l'app est branchée sur
**Gumroad**. Le code Stripe (Edge Functions `create-checkout-session` et
`stripe-webhook`, logique multi-sélection dans `UpgradeModal.tsx`) est resté
**intact et déployé**, juste inatteignable depuis l'UI tant que ce flag est à
`true`.

Raison du choix initial : Gumroad ne demande pas de SIRET/immatriculation pour
commencer à vendre (juste un compte bancaire ou PayPal), contrairement à
Stripe. Les deux coexistent dans le code pour permettre de rebasculer sans
tout réécrire une fois l'activité lancée.

## Comment ça marche aujourd'hui (Gumroad)

- Chaque certification a son propre produit Gumroad (permalink), mappé dans
  deux endroits qui doivent rester synchronisés :
  - `supabase/functions/_shared/gumroadMatch.ts` (`PERMALINK_TO_CERT_SLUG`,
    lu depuis les secrets `GUMROAD_PERMALINK_POWERBI` /
    `GUMROAD_PERMALINK_SNOWFLAKE`)
  - `src/lib/paymentConfig.ts` (`GUMROAD_PERMALINKS`, en dur côté frontend -
    ces valeurs ne sont pas secrètes, elles apparaissent dans l'URL publique)
- `gumroad-webhook` reçoit le ping Gumroad à chaque vente, vérifie la vente
  via l'API Gumroad (`/v2/sales/{id}`), et enregistre l'accès dans
  `certification_purchases` (`source = 'gumroad'`) ou, si l'email ne
  correspond à aucun compte, dans `pending_gumroad_purchases`.
- `gumroad-reconcile` (cron `pg_cron`/`pg_net` toutes les 6h) rattrape les
  ventes des 14 derniers jours au cas où un ping aurait été perdu.
- `reconcile-pending-purchases` tourne à chaque login/signup (appelé depuis
  `AuthContext.tsx`) pour rattacher un achat en attente dès que le compte
  correspondant existe.
- `/admin/gumroad` (réservé à `mbairo.allatessem@gmail.com`) liste les achats
  non rattachés après 48h et permet un rattachement manuel par email.
- L'accès expire après 3 mois (`expires_at`), identique à Stripe - géré par
  la même table `certification_purchases`, juste avec `source = 'gumroad'`
  au lieu de `'stripe'`.

## Comment revenir à Stripe seul

1. Dans `src/lib/paymentConfig.ts`, passer `ENABLE_GUMROAD = false`.
   → `UpgradeModal.tsx` retombe automatiquement sur le flux Stripe existant
   (sélection multiple + `createCheckoutSession`), sans rien changer d'autre
   dans ce fichier.
2. Vérifier que les secrets Stripe sont toujours valides côté Edge Functions
   (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`) - ils n'ont pas été touchés
   pendant l'intégration Gumroad, mais ça vaut le coup de re-tester un
   paiement en mode test avant de rouvrir au public.
3. Optionnel, pour désactiver proprement Gumroad plutôt que de le laisser
   tourner en silence :
   - Retirer/dépublier les produits sur Gumroad (ou simplement ne plus
     communiquer les liens).
   - Le webhook `gumroad-webhook` peut rester déployé sans risque : s'il ne
     reçoit plus de pings, il ne fait rien. Pas besoin de le supprimer.
   - Désactiver le job cron si voulu :
     ```sql
     select cron.unschedule('gumroad-reconcile-sweep');
     ```

## Faire coexister les deux en même temps (les deux boutons visibles)

Pas encore implémenté - aujourd'hui `ENABLE_GUMROAD` est un choix binaire
global, pas un "les deux en parallèle". Si ce besoin arrive : `UpgradeModal`
devrait afficher deux boutons par certification ("Payer avec Gumroad" /
"Payer avec Stripe") au lieu de brancher sur un seul flag - la logique
serveur (deux webhooks distincts, écriture dans la même table
`certification_purchases` avec `source` différent) le supporte déjà sans
changement.

## Tables/colonnes ajoutées par l'intégration Gumroad

Voir `supabase/migrations/009_gumroad_integration.sql` :

- `certification_purchases.source` (`'stripe' | 'gumroad'`)
- `certification_purchases.gumroad_sale_id` (unique, idempotence webhook)
- `pending_gumroad_purchases` (achats Gumroad non encore rattachés à un
  compte)
- `gumroad_webhook_logs` (trace de chaque événement webhook/reconciliation,
  consultable sur `/admin/gumroad`)

Rien de tout ça n'est utilisé par le flux Stripe - aucun risque de conflit
si on repasse dessus.
