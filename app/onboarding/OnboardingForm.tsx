"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash, ArrowRight, Building2, Clock, MapPin, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function OnboardingForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState(
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000"
  );
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Doha");
  const [openTime, setOpenTime] = useState("09:00");
  const [closeTime, setCloseTime] = useState("20:00");
  const [services, setServices] = useState<Array<{ name: string; price: number; duration: number }>>([
    { name: "Swedish Massage", price: 90, duration: 60 },
    { name: "Signature Haircut", price: 45, duration: 45 }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAddService = () => {
    setServices([...services, { name: "", price: 0, duration: 30 }]);
  };

  const handleRemoveService = (index: number) => {
    if (services.length <= 1) {
      setError("Please list at least one service.");
      return;
    }
    const newServices = [...services];
    newServices.splice(index, 1);
    setServices(newServices);
  };

  const handleServiceChange = (index: number, field: "name" | "price" | "duration", value: string | number) => {
    const newServices = [...services];
    newServices[index] = {
      ...newServices[index],
      [field]: value
    };
    setServices(newServices);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate services
    const invalidService = services.find((s) => !s.name.trim() || s.price <= 0 || s.duration <= 0);
    if (invalidService) {
      setError("Please fill out all service details with valid names, prices, and durations.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          coverImage,
          location: {
            address,
            city
          },
          services,
          operatingHours: {
            open: openTime,
            close: closeTime
          }
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create business profile.");
      }

      router.push("/dashboard/professional");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/15 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-12">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">Partnership</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-1 text-foreground">
              List Your Wellness Business
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto font-light leading-relaxed">
              Create your business profile to start accepting appointments from Doha Wellness clients.
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* General Info */}
            <div className="space-y-5">
              <h3 className="font-serif text-lg font-bold border-b border-border pb-2.5 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" /> General Information
              </h3>
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Business / Salon Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Doha Spa"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Description / Bio
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your spa, salon, or styling clinic services, experience, and certifications..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  required
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-sm"
                />
                <span className="text-[10px] text-muted-foreground block mt-1">
                  We pre-populate a high-quality wellness image. You can replace this with any online image link.
                </span>
              </div>
            </div>

            {/* Location & Hours */}
            <div className="space-y-5">
              <h3 className="font-serif text-lg font-bold border-b border-border pb-2.5 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" /> Location & Hours
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    City
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-sm"
                  >
                    <option value="Doha">Doha</option>
                    <option value="West Bay">West Bay</option>
                    <option value="The Pearl">The Pearl</option>
                    <option value="Lusail">Lusail</option>
                    <option value="Al Waab">Al Waab</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Full Address
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marina Walk, Tower 4, Suite 10"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Opening Time
                  </label>
                  <input
                    type="time"
                    required
                    value={openTime}
                    onChange={(e) => setOpenTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Closing Time
                  </label>
                  <input
                    type="time"
                    required
                    value={closeTime}
                    onChange={(e) => setCloseTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Services Offered */}
            <div className="space-y-5">
              <div className="flex justify-between items-end border-b border-border pb-2.5">
                <h3 className="font-serif text-lg font-bold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" /> Services Offered
                </h3>
                <button
                  type="button"
                  onClick={handleAddService}
                  className="text-primary hover:text-accent font-semibold flex items-center gap-1 text-xs cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Add Service
                </button>
              </div>

              <div className="space-y-4">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row gap-3 bg-secondary/20 p-4 rounded-xl border border-border/50 items-center justify-between"
                  >
                    <div className="flex-1 w-full space-y-1.5">
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Service Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Balinese Massage"
                        value={service.name}
                        onChange={(e) => handleServiceChange(index, "name", e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:border-primary text-sm"
                      />
                    </div>

                    <div className="w-full sm:w-28 space-y-1.5">
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        required
                        min={1}
                        placeholder="Price"
                        value={service.price || ""}
                        onChange={(e) => handleServiceChange(index, "price", parseFloat(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:border-primary text-sm"
                      />
                    </div>

                    <div className="w-full sm:w-32 space-y-1.5">
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Duration (m)
                      </label>
                      <select
                        value={service.duration}
                        onChange={(e) => handleServiceChange(index, "duration", parseInt(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:border-primary text-sm"
                      >
                        <option value={15}>15 mins</option>
                        <option value={30}>30 mins</option>
                        <option value={45}>45 mins</option>
                        <option value={60}>60 mins</option>
                        <option value={75}>75 mins</option>
                        <option value={90}>90 mins</option>
                        <option value={120}>120 mins</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveService(index)}
                      className="text-destructive hover:text-destructive/80 mt-6 sm:mt-5 p-2 rounded-lg hover:bg-destructive/5 cursor-pointer"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Register Action */}
            <div className="pt-4 border-t border-border flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary/95 disabled:bg-primary/50 text-primary-foreground font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 flex items-center gap-2 cursor-pointer text-sm shadow-md"
              >
                {loading ? "Creating Profile..." : "Create Business Profile"}
                <ArrowRight className="h-4.5 w-4.5" />
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
