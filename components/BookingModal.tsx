"use client";

import { useState } from "react";
import { X, Calendar as CalIcon, Clock, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface BookingModalProps {
  businessId: string;
  businessName: string;
  service: {
    name: string;
    price: number;
    duration: number;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({
  businessId,
  businessName,
  service,
  isOpen,
  onClose,
}: BookingModalProps) {
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  if (!isOpen || !service) return null;

  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
  ];

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !timeSlot) {
      setError("Please select both a date and time slot.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId,
          service,
          date,
          timeSlot,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to make appointment.");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setSuccess(false);
    setDate("");
    setTimeSlot("");
    onClose();
    router.push("/dashboard/customer");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay backdrop */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal dialog box */}
      <div className="relative bg-card w-full max-w-lg rounded-2xl border border-border shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-border bg-secondary/20">
          <div>
            <h3 className="font-serif text-xl font-bold text-foreground">Book Appointment</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{businessName}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center animate-in fade-in duration-300">
            <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <h4 className="font-serif text-2xl font-bold text-foreground mb-3">Booking Requested!</h4>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-8 font-light">
              Your appointment for <strong>{service.name}</strong> has been submitted. The professional has been notified.
            </p>
            <button
              onClick={handleSuccessClose}
              className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-3.5 rounded-xl transition-all duration-300 cursor-pointer text-sm shadow-md"
            >
              Go to Appointments
            </button>
          </div>
        ) : (
          <form onSubmit={handleBook} className="p-6 space-y-6">
            {/* Service details */}
            <div className="bg-secondary/40 p-4 rounded-xl flex justify-between items-center text-sm border border-border/50">
              <div>
                <span className="font-medium text-foreground">{service.name}</span>
                <span className="text-xs text-muted-foreground block mt-0.5">{service.duration} mins</span>
              </div>
              <span className="text-lg font-bold text-primary">${service.price}</span>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Date Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <CalIcon className="h-4 w-4" /> Select Date
              </label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
              />
            </div>

            {/* Grid layout time slot selection */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> Select Time Slot
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTimeSlot(slot)}
                    className={`py-2.5 px-1 rounded-lg text-xs font-medium border text-center transition-all duration-200 cursor-pointer ${
                      timeSlot === slot
                        ? "bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/10"
                        : "bg-card border-border hover:border-primary/50 text-foreground/80"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/95 disabled:bg-primary/50 text-primary-foreground font-semibold py-3.5 rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 text-sm shadow-md"
              >
                {loading ? "Processing..." : "Confirm Request"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
