import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ResetPassword() {
  const { updatePassword } = useAuth();
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
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
        <h1 className="font-display text-lg font-medium text-white">
          Choisis un nouveau mot de passe
        </h1>

        {done ? (
          <>
            <p className="mt-3 text-sm text-emerald-200">
              Mot de passe mis à jour.
            </p>
            <button
              type="button"
              onClick={() => navigate("/certifications")}
              className="mt-5 rounded-full bg-violet-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-400"
            >
              Continuer vers les certifications
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
            <input
              type="password"
              required
              minLength={8}
              placeholder="Nouveau mot de passe (8+ car., maj., min., chiffre)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-violet-400/50 focus:outline-none"
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 rounded-full bg-violet-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-400 disabled:opacity-60"
            >
              {loading ? "..." : "Mettre à jour"}
            </button>
          </form>
        )}
      </div>

      <Link
        to="/certifications"
        className="mt-6 inline-block text-sm text-white/50 hover:text-white"
      >
        ← Retour aux certifications
      </Link>
    </section>
  );
}
