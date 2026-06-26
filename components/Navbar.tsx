"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="font-serif text-2xl font-bold tracking-wide text-primary hover:text-accent transition-colors duration-300">
              Doha Wellness
            </Link>
          </div>

          {/* Centered nav links */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="text-foreground/80 hover:text-primary font-medium tracking-wide transition-colors">
              Home
            </Link>
            <Link href="/explore" className="text-foreground/80 hover:text-primary font-medium tracking-wide transition-colors">
              Explore
            </Link>
            <Link href="/#about" className="text-foreground/80 hover:text-primary font-medium tracking-wide transition-colors">
              About
            </Link>
          </div>

          {/* Right CTAs */}
          <div className="hidden md:flex space-x-4 items-center">
            {session ? (
              <div className="flex items-center space-x-6">
                <Link
                  href={session.user.role === "professional" ? "/dashboard/professional" : "/dashboard/customer"}
                  className="flex items-center gap-2 text-foreground/80 hover:text-primary font-medium transition-colors"
                >
                  {session.user.image ? (
                    <img src={session.user.image} alt={session.user.name || "User"} className="h-8 w-8 rounded-full border border-primary/20 object-cover" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold">
                      {session.user.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-1.5 text-sm font-medium text-destructive hover:text-destructive/80 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <Link href="/auth/signin" className="text-foreground/85 hover:text-primary font-medium transition-colors">
                  Sign In
                </Link>
                <Link
                  href="/auth/signin?role=professional"
                  className="bg-primary hover:bg-primary/95 text-primary-foreground px-5 py-2.5 rounded-full font-medium shadow-sm transition-all duration-300 tracking-wide text-sm"
                >
                  List Your Business
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground/75 hover:text-primary focus:outline-none cursor-pointer"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-border px-4 pt-2 pb-6 space-y-3 transition-all duration-300">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block text-foreground/80 hover:text-primary py-2 font-medium"
          >
            Home
          </Link>
          <Link
            href="/explore"
            onClick={() => setIsOpen(false)}
            className="block text-foreground/80 hover:text-primary py-2 font-medium"
          >
            Explore
          </Link>
          <Link
            href="/#about"
            onClick={() => setIsOpen(false)}
            className="block text-foreground/80 hover:text-primary py-2 font-medium"
          >
            About
          </Link>

          <div className="pt-4 border-t border-border space-y-3">
            {session ? (
              <>
                <Link
                  href={session.user.role === "professional" ? "/dashboard/professional" : "/dashboard/customer"}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-foreground/80 hover:text-primary font-medium py-2"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard ({session.user.name})
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="flex items-center gap-2 w-full text-destructive hover:text-destructive/80 font-medium py-2 cursor-pointer text-left"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  onClick={() => setIsOpen(false)}
                  className="block text-center text-foreground/85 hover:text-primary py-2 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signin?role=professional"
                  onClick={() => setIsOpen(false)}
                  className="block text-center bg-primary hover:bg-primary/95 text-primary-foreground py-2.5 rounded-full font-medium text-sm"
                >
                  List Your Business
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
