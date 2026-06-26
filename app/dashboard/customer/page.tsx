"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Calendar, Clock, MapPin, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CustomerDashboard() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments");
      if (!res.ok) throw new Error("Failed to load appointments");
      const data = await res.json();
      setAppointments(data);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200/60";
      case "confirmed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "declined":
        return "bg-rose-50 text-rose-700 border-rose-200/60";
      case "completed":
        return "bg-slate-50 text-slate-700 border-slate-200/60";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <DashboardLayout role="customer">
      <div className="space-y-6 flex-1 flex flex-col justify-start">
        <div>
          <h2 className="font-serif text-2xl font-bold text-foreground">My Appointments</h2>
          <p className="text-sm text-muted-foreground font-light mt-0.5">
            View status and schedules of your salon booking requests.
          </p>
        </div>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
            <span className="text-sm text-muted-foreground font-light">Loading bookings...</span>
          </div>
        ) : error ? (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl flex items-start gap-2.5">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 bg-secondary/10 border border-border border-dashed rounded-2xl text-center">
            <Calendar className="h-10 w-10 text-muted-foreground mb-3" />
            <h4 className="font-serif text-lg font-bold text-foreground mb-1">No Appointments Yet</h4>
            <p className="text-xs text-muted-foreground font-light max-w-xs mx-auto mb-6 leading-relaxed">
              You haven't requested any wellness appointments yet. Discover top-rated salons now!
            </p>
            <Link
              href="/explore"
              className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-6 py-2.5 rounded-xl text-xs transition-colors shadow-sm"
            >
              Explore Services
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => {
              const business = apt.business || {};
              const formattedDate = new Date(apt.date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric"
              });

              return (
                <div
                  key={apt._id}
                  className="bg-card border border-border rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:border-primary/20"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-serif font-bold text-base text-foreground">
                        {business.name || "Salon Partner"}
                      </span>
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 border rounded-full ${getStatusBadgeClass(
                          apt.status
                        )}`}
                      >
                        {apt.status}
                      </span>
                    </div>

                    <div className="text-sm font-semibold text-primary">
                      {apt.service.name}{" "}
                      <span className="text-muted-foreground font-normal">(${apt.service.price})</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground font-light">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-primary" /> {formattedDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-primary" /> {apt.timeSlot}
                      </span>
                      {business.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-primary" /> {business.location.address}, {business.location.city}
                        </span>
                      )}
                    </div>
                  </div>

                  {apt.status === "confirmed" && (
                    <Link
                      href={`/salons/${business._id}`}
                      className="bg-secondary hover:bg-primary hover:text-primary-foreground text-primary font-semibold py-2 px-4 rounded-lg text-xs border border-primary/10 hover:border-transparent transition-all flex-shrink-0 cursor-pointer"
                    >
                      Book Again
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
