"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { BarChart3, CalendarCheck, Clock, TrendingUp, Sparkles, Loader2 } from "lucide-react";

export default function ProfessionalAnalytics() {
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

  // Compute metrics
  const totalBookings = appointments.length;
  const pendingCount = appointments.filter(apt => apt.status === "pending").length;
  const confirmedCount = appointments.filter(apt => apt.status === "confirmed").length;
  const completedCount = appointments.filter(apt => apt.status === "completed").length;
  
  // Confirmed and Completed count towards revenue
  const totalRevenue = appointments
    .filter(apt => apt.status === "confirmed" || apt.status === "completed")
    .reduce((sum, apt) => sum + (apt.service?.price || 0), 0);

  const stats = [
    { name: "Total Bookings", value: totalBookings, icon: BarChart3, color: "text-primary bg-primary/10" },
    { name: "Estimated Revenue", value: `$${totalRevenue}`, icon: TrendingUp, color: "text-emerald-600 bg-emerald-50 border border-emerald-100" },
    { name: "Confirmed Slots", value: confirmedCount, icon: CalendarCheck, color: "text-blue-600 bg-blue-50 border border-blue-100" },
    { name: "Pending Approval", value: pendingCount, icon: Clock, color: "text-amber-600 bg-amber-50 border border-amber-100" },
  ];

  return (
    <DashboardLayout role="professional">
      <div className="space-y-6 flex-1 flex flex-col justify-start">
        <div>
          <h2 className="font-serif text-2xl font-bold text-foreground">Analytics Overview</h2>
          <p className="text-sm text-muted-foreground font-light mt-0.5">
            Monitor booking distributions and total revenue estimations.
          </p>
        </div>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
            <span className="text-sm text-muted-foreground font-light">Compiling metrics...</span>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.name} className="bg-card border border-border rounded-2xl p-6 flex items-center justify-between shadow-sm">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">{stat.name}</span>
                      <span className="text-2xl font-serif font-bold text-foreground">{stat.value}</span>
                    </div>
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${stat.color}`}>
                      <Icon className="h-5.5 w-5.5" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Service Popularity breakdown */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
              <h3 className="font-serif text-lg font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
                <Sparkles className="h-5 w-5 text-primary" /> Popular Services Breakdown
              </h3>
              
              {appointments.length === 0 ? (
                <span className="text-sm text-muted-foreground font-light block">No data available.</span>
              ) : (
                <div className="space-y-4">
                  {/* Calculate frequency per service */}
                  {Array.from(new Set(appointments.map(a => a.service?.name))).map((serviceName) => {
                    const occurrences = appointments.filter(a => a.service?.name === serviceName).length;
                    const percentage = Math.round((occurrences / totalBookings) * 100);

                    return (
                      <div key={serviceName} className="space-y-2">
                        <div className="flex justify-between text-sm font-semibold">
                          <span className="text-foreground/80">{serviceName}</span>
                          <span className="text-primary">{occurrences} bookings ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
