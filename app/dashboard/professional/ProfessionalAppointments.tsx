"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Calendar, Clock, User, Check, X, AlertCircle, Loader2 } from "lucide-react";

interface ProfessionalAppointmentsProps {
  businessId: string;
}

export default function ProfessionalAppointments({ businessId }: ProfessionalAppointmentsProps) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

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

  const handleUpdateStatus = async (id: string, status: "confirmed" | "declined" | "completed") => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update booking status");
      }

      // Update local state
      setAppointments(appointments.map(apt => apt._id === id ? { ...apt, status } : apt));
    } catch (err: any) {
      alert(err.message || "An error occurred.");
    } finally {
      setProcessingId(null);
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
    <DashboardLayout role="professional">
      <div className="space-y-6 flex-1 flex flex-col justify-start">
        <div>
          <h2 className="font-serif text-2xl font-bold text-foreground">Appointment Requests</h2>
          <p className="text-sm text-muted-foreground font-light mt-0.5">
            Manage incoming booking requests from customers.
          </p>
        </div>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
            <span className="text-sm text-muted-foreground font-light">Loading schedule...</span>
          </div>
        ) : error ? (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl flex items-start gap-2.5">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 bg-secondary/10 border border-border border-dashed rounded-2xl text-center">
            <Calendar className="h-10 w-10 text-muted-foreground mb-3" />
            <h4 className="font-serif text-lg font-bold text-foreground mb-1">No Bookings Yet</h4>
            <p className="text-xs text-muted-foreground font-light max-w-xs mx-auto leading-relaxed">
              You don't have any customer bookings scheduled. Make sure your services and business hours are updated!
            </p>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-300">
            {appointments.map((apt) => {
              const customer = apt.customer || {};
              const formattedDate = new Date(apt.date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric"
              });

              return (
                <div
                  key={apt._id}
                  className="bg-card border border-border rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:border-primary/20"
                >
                  <div className="space-y-2 flex-1">
                    {/* Customer Info */}
                    <div className="flex items-center gap-2.5">
                      {customer.image ? (
                        <img src={customer.image} alt={customer.name} className="h-6 w-6 rounded-full" />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">
                          {customer.name?.[0]?.toUpperCase() || "U"}
                        </div>
                      )}
                      <span className="font-semibold text-sm text-foreground">
                        {customer.name || "Client"}
                      </span>
                      <span className="text-xs text-muted-foreground font-light">({customer.email})</span>
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

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground font-light">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-primary" /> {formattedDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-primary" /> {apt.timeSlot}
                      </span>
                    </div>
                  </div>

                  {/* Actions (Only if Pending) */}
                  {apt.status === "pending" && (
                    <div className="flex items-center gap-2 flex-shrink-0 w-full md:w-auto mt-2 md:mt-0">
                      <button
                        onClick={() => handleUpdateStatus(apt._id, "declined")}
                        disabled={processingId !== null}
                        className="flex-1 md:flex-none border border-rose-200 hover:bg-rose-50 text-rose-700 font-semibold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" /> Decline
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(apt._id, "confirmed")}
                        disabled={processingId !== null}
                        className="flex-1 md:flex-none bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-sm shadow-primary/10"
                      >
                        <Check className="h-3.5 w-3.5" /> Confirm
                      </button>
                    </div>
                  )}

                  {apt.status === "confirmed" && (
                    <button
                      onClick={() => handleUpdateStatus(apt._id, "completed")}
                      disabled={processingId !== null}
                      className="w-full md:w-auto bg-secondary hover:bg-primary hover:text-primary-foreground text-primary border border-primary/10 hover:border-transparent font-semibold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <Check className="h-3.5 w-3.5" /> Mark Completed
                    </button>
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
