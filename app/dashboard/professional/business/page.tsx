"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, Trash, CheckCircle2, AlertCircle, Sparkles, Building2, MapPin, Clock, Loader2 } from "lucide-react";

export default function ProfessionalBusiness() {
  const [businessId, setBusinessId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Doha");
  const [openTime, setOpenTime] = useState("09:00");
  const [closeTime, setCloseTime] = useState("20:00");
  const [services, setServices] = useState<Array<{ name: string; price: number; duration: number }>>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBusiness();
  }, []);

  const fetchBusiness = async () => {
    try {
      // Find the business owned by the logged-in professional
      // We can query our GET /api/businesses (since it lists, we search for our ownership or get from a helper)
      // Actually, since we are logged in, we fetch a list of businesses. The backend GET /api/businesses returns all,
      // but let's filter client-side or we can just fetch the business directly by checking our ownership.
      // Wait, can we fetch a specific professional business?
      // Yes! In the backend, we can check GET /api/businesses and filter by user id, or search.
      // Let's call GET /api/businesses. We can loop and find the one where owner._id === session.user.id.
      // Or, to make it even cleaner, we fetch user profile, or call GET /api/businesses with a param.
      // Let's call GET /api/businesses. Since our route handles populate, we can find the business.
      const res = await fetch("/api/businesses");
      if (!res.ok) throw new Error("Failed to load business details");
      const data = await res.json();
      
      // Let's fetch session to identify our user
      const sessRes = await fetch("/api/auth/session");
      const session = await sessRes.json();

      if (session?.user) {
        const myBiz = data.find((b: any) => b.owner?._id === session.user.id || b.owner === session.user.id);
        if (myBiz) {
          setBusinessId(myBiz._id);
          setName(myBiz.name);
          setDescription(myBiz.description);
          setCoverImage(myBiz.coverImage);
          setAddress(myBiz.location.address);
          setCity(myBiz.location.city);
          setOpenTime(myBiz.operatingHours.open);
          setCloseTime(myBiz.operatingHours.close);
          setServices(myBiz.services || []);
        } else {
          setError("No business listed. Please onboard first.");
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load business details.");
    } finally {
      setLoading(false);
    }
  };

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
    setSuccess("");
    setSaving(true);

    // Validate services
    const invalidService = services.find((s) => !s.name.trim() || s.price <= 0 || s.duration <= 0);
    if (invalidService) {
      setError("Please fill out all service details with valid names, prices, and durations.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/businesses/${businessId}`, {
        method: "PUT",
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
        throw new Error(data.error || "Failed to update business profile.");
      }

      setSuccess("Business profile updated successfully!");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout role="professional">
      <div className="space-y-6 flex-1 flex flex-col justify-start">
        <div>
          <h2 className="font-serif text-2xl font-bold text-foreground">My Business Profile</h2>
          <p className="text-sm text-muted-foreground font-light mt-0.5">
            Modify your listed spa, services catalogue, operational timings, and contact addresses.
          </p>
        </div>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
            <span className="text-sm text-muted-foreground font-light">Loading profile details...</span>
          </div>
        ) : (
          <div className="space-y-6 max-w-2xl animate-in fade-in duration-300">
            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm p-4 rounded-xl flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl flex items-start gap-2.5">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* General Details */}
              <div className="space-y-5">
                <h3 className="font-serif text-lg font-bold border-b border-border pb-2 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" /> General Info
                </h3>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Business / Salon Name
                  </label>
                  <input
                    type="text"
                    required
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
                </div>
              </div>

              {/* Location & Hours */}
              <div className="space-y-5">
                <h3 className="font-serif text-lg font-bold border-b border-border pb-2 flex items-center gap-2">
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
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Opening Time
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
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Closing Time
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

              {/* Services Offered list */}
              <div className="space-y-5">
                <div className="flex justify-between items-end border-b border-border pb-2 text-foreground">
                  <h3 className="font-serif text-lg font-bold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" /> Services Menu
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
                          placeholder="e.g. Swedish Massage"
                          value={service.name}
                          onChange={(e) => handleServiceChange(index, "name", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:border-primary text-xs"
                        />
                      </div>

                      <div className="w-full sm:w-24 space-y-1.5">
                        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                          Price ($)
                        </label>
                        <input
                          type="number"
                          required
                          min={1}
                          value={service.price || ""}
                          onChange={(e) => handleServiceChange(index, "price", parseFloat(e.target.value))}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:border-primary text-xs"
                        />
                      </div>

                      <div className="w-full sm:w-32 space-y-1.5">
                        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                          Duration
                        </label>
                        <select
                          value={service.duration}
                          onChange={(e) => handleServiceChange(index, "duration", parseInt(e.target.value))}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:border-primary text-xs"
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
                        <Trash className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-primary hover:bg-primary/95 disabled:bg-primary/50 text-primary-foreground font-semibold px-8 py-3 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
                >
                  {saving ? "Saving Changes..." : "Save Business Profile"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
