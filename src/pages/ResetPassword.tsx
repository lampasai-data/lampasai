import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../i18n";
import BackLink from "../components/BackLink";

export default function ResetPassword() {
  const { updatePassword } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const err = await updatePassword(password);
    setLoading(false);
    if (err) setError(err);
    else setDone(true);
  }

  return (
    <section className="mx-auto max-w-md px-6 py-24">
      <div className="rounded-2xl border border-black/8 bg-white p-7 shadow-sm">
        <h1 className="font-display text-lg font-medium text-ink">
          {t.auth.resetPasswordTitle}
        </h1>

        {done ? (
          <>
            <p className="mt-3 text-sm text-green">{t.auth.resetPasswordDone}</p>
            <button
              type="button"
              onClick={() => navigate("/formations")}
              className="brand-gradient mt-5 rounded-full px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              {t.auth.resetPasswordContinue}
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
            <input
              type="password"
              required
              minLength={8}
              placeholder={t.auth.resetPasswordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-teal focus:outline-none"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="brand-gradient mt-1 rounded-full px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? t.auth.submitLoading : t.auth.resetPasswordSubmit}
            </button>
          </form>
        )}
      </div>

      <div className="mt-6">
        <BackLink to="/formations" label={t.auth.resetPasswordBack} />
      </div>
    </section>
  );
}
