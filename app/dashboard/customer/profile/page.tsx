"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/DashboardLayout";
import { User, Mail, Lock, AlertCircle, CheckCircle2 } from "lucide-react";

export default function CustomerProfile() {
  const { data: session, update } = useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
      setImage(session.user.image || "");
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          image,
          password: password || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile.");
      }

      setSuccess("Profile updated successfully!");
      setPassword("");
      setConfirmPassword("");

      await update({
        ...session,
        user: {
          ...session?.user,
          name,
          email,
          image,
        },
      });
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="customer">
      <div className="space-y-6 flex-1 flex flex-col justify-start">
        <div>
          <h2 className="font-serif text-2xl font-bold text-foreground">Profile Settings</h2>
          <p className="text-sm text-muted-foreground font-light mt-0.5">
            Manage your contact details, avatars, and security settings.
          </p>
        </div>

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm p-4 rounded-xl flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
          {/* Avatar URL */}
          <div className="flex items-center gap-5">
            {image ? (
              <img src={image} alt={name} className="h-16 w-16 rounded-full border border-primary/20 object-cover" />
            ) : (
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                {name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Avatar Image URL</span>
              <input
                type="url"
                placeholder="https://example.com/avatar.jpg"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:border-primary text-xs w-64"
              />
            </div>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 h-4.5 w-4.5 text-muted-foreground" />
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
          </div>

          {/* Password update fields */}
          <div className="border-t border-border pt-6 mt-6 space-y-4">
            <h3 className="font-serif font-bold text-base text-foreground">Update Password</h3>
            <p className="text-xs text-muted-foreground font-light">
              Leave blank if you do not want to change your password.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-4.5 w-4.5 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="Min. 6 characters"
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-4.5 w-4.5 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="Confirm password"
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/95 disabled:bg-primary/50 text-primary-foreground font-semibold px-8 py-3 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
            >
              {loading ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
