"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { Mail, Lock, User as UserIcon, AlertCircle, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "professional">("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "professional") {
      setRole("professional");
    }
  }, [searchParams]);

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong during signup.");
      }

      setSuccess("Account created successfully! Redirecting to sign in...");
      setTimeout(() => {
        router.push(`/auth/signin?role=${role}`);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    signIn("google");
  };

  return (
    <div className="max-w-md w-full mx-auto bg-card border border-border rounded-2xl p-8 shadow-xl">
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl font-bold text-foreground">Create Account</h2>
        <p className="text-sm text-muted-foreground mt-1.5 font-light">
          Join Doha Wellness to book or list services.
        </p>
      </div>

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm p-4 rounded-xl mb-6">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl mb-6 flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Customer / Professional Picker */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
            I want to register as a:
          </label>
          <div className="flex gap-4">
            <label className="flex-1 flex items-center justify-center gap-2 border border-border rounded-xl p-3.5 cursor-pointer text-sm font-semibold hover:bg-secondary/40 transition-colors">
              <input
                type="radio"
                name="role"
                checked={role === "customer"}
                onChange={() => setRole("customer")}
                className="accent-primary"
              />
              <span>Customer</span>
            </label>
            <label className="flex-1 flex items-center justify-center gap-2 border border-border rounded-xl p-3.5 cursor-pointer text-sm font-semibold hover:bg-secondary/40 transition-colors">
              <input
                type="radio"
                name="role"
                checked={role === "professional"}
                onChange={() => setRole("professional")}
                className="accent-primary"
              />
              <span>Professional</span>
            </label>
          </div>
        </div>

        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Full Name
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-3.5 h-4.5 w-4.5 text-muted-foreground" />
            <input
              type="text"
              required
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-sm"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 h-4.5 w-4.5 text-muted-foreground" />
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-sm"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-4.5 w-4.5 text-muted-foreground" />
            <input
              type="password"
              required
              placeholder="Min. 6 characters"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/95 disabled:bg-primary/50 text-primary-foreground font-semibold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer"
        >
          {loading ? "Registering..." : "Create Account"}
        </button>
      </form>

      {/* Google separation line */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <button
        onClick={handleGoogleSignUp}
        className="w-full border border-border hover:bg-secondary/40 text-foreground font-medium py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-sm cursor-pointer shadow-sm"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.1.8-1.57 2.08v2.56h2.53c1.48-1.36 2.33-3.37 2.33-5.49z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.87-3c-1.08.72-2.47 1.15-4.09 1.15-3.15 0-5.82-2.13-6.77-5H1.27v3.1A11.94 11.94 0 0 0 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.23 14.24a7.19 7.19 0 0 1 0-4.48v-3.1H1.27a11.96 11.96 0 0 0 0 10.68l3.96-3.1z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.69 1.27 6.66l3.96 3.1c.95-2.87 3.62-5.01 6.77-5.01z"
          />
        </svg>
        <span>Sign Up with Google</span>
      </button>

      <div className="text-center mt-8 pt-6 border-t border-border text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/auth/signin"
          className="text-primary hover:text-accent font-semibold flex items-center justify-center gap-1.5 mt-1 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
}

export default function SignUp() {
  return (
    <div className="min-h-screen bg-secondary/15 flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={
          <div className="max-w-md w-full mx-auto text-center py-10">
            <span className="text-sm text-muted-foreground">Loading signup...</span>
          </div>
        }>
          <SignUpForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
