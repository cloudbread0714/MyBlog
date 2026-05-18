"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Dictionary } from "@/i18n/dictionary";

function Form({ labels }: { labels: Dictionary["auth"] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    router.push(redirect);
    router.refresh();
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-[var(--ring)]";

  return (
    <div className="mx-auto max-w-sm">
      <p className="section-label">{labels.admin}</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight">{labels.signIn}</h1>
      <p className="mt-2 font-mono text-xs text-muted">{labels.signInDesc}</p>

      <form onSubmit={handleLogin} className="card mt-8 space-y-4 p-6">
        <div>
          <label className="mb-1.5 block font-mono text-xs text-muted">{labels.email}</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-xs text-muted">{labels.password}</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>
        {error && <p className="font-mono text-xs text-red-500">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
          {loading ? labels.submitting : labels.submit}
        </button>
      </form>
    </div>
  );
}

export function LoginForm({ labels }: { labels: Dictionary["auth"] }) {
  return (
    <Suspense fallback={<p className="font-mono text-sm text-muted">…</p>}>
      <Form labels={labels} />
    </Suspense>
  );
}
