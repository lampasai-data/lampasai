export default function ProUpsell({ certName }: { certName: string }) {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-teal/25 bg-teal/5 p-7 text-center">
      <span className="text-xs font-medium uppercase tracking-widest text-teal-dark">
        Mode Pro
      </span>
      <h3 className="mt-3 font-display text-xl font-medium text-ink">
        Tu as terminé tes 20 questions gratuites
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Passe en mode Pro pour continuer à t'entraîner sans limite sur la
        certification {certName} pendant toute la durée de ta préparation.
      </p>
      <a
        href="mailto:contact@lampasai.com?subject=Passage%20au%20mode%20Pro"
        className="brand-gradient mt-6 inline-block rounded-full px-7 py-3.5 text-sm font-medium text-white transition hover:opacity-90"
      >
        Contacter Lampas AI pour passer en Pro
      </a>
      <p className="mt-3 text-xs text-muted">
        Le paiement en ligne arrive bientôt — en attendant, on active ton
        accès Pro manuellement.
      </p>
    </div>
  );
}
