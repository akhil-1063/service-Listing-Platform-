"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Calendar, User, Building, BarChart3, LogOut, ChevronRight } from "lucide-react";
import Navbar from "./Navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "customer" | "professional";
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const customerLinks = [
    { name: "My Appointments", href: "/dashboard/customer", icon: Calendar },
    { name: "Profile Settings", href: "/dashboard/customer/profile", icon: User },
  ];

  const professionalLinks = [
    { name: "Bookings", href: "/dashboard/professional", icon: Calendar },
    { name: "My Business Profile", href: "/dashboard/professional/business", icon: Building },
    { name: "Analytics", href: "/dashboard/professional/analytics", icon: BarChart3 },
  ];

  const links = role === "professional" ? professionalLinks : customerLinks;

  return (
    <div className="min-h-screen bg-secondary/15 flex flex-col">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-stretch min-h-[600px]">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-28 space-y-8">
              {/* User Quick Info */}
              <div className="flex items-center gap-4 pb-6 border-b border-border">
                {session?.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="h-12 w-12 rounded-full border border-primary/10 object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-lg font-bold">
                    {session?.user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <div>
                  <h4 className="font-serif font-bold text-foreground truncate max-w-[140px]">
                    {session?.user.name}
                  </h4>
                  <span className="text-[10px] font-semibold tracking-wider text-accent uppercase">
                    {role === "professional" ? "Professional" : "Customer"}
                  </span>
                </div>
              </div>

              {/* Navigation list */}
              <nav className="space-y-1.5">
                {links.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;

                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/15"
                          : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-4 w-4 transition-colors ${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"}`} />
                        <span>{link.name}</span>
                      </div>
                      <ChevronRight className={`h-4 w-4 opacity-0 transition-all ${isActive ? "opacity-100 translate-x-0" : "group-hover:opacity-60 group-hover:translate-x-0.5"}`} />
                    </Link>
                  );
                })}

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-3 w-full px-4 py-3.5 mt-4 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/5 transition-all duration-200 cursor-pointer text-left"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Page Contents container */}
          <main className="flex-1 bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-start">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
