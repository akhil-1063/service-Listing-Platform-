"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, MapPin, Star, Filter, X, SlidersHorizontal, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SalonCard from "@/components/SalonCard";

function ExploreContent() {
  const searchParams = useSearchParams();
  
  // Search state
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300]);
  const [category, setCategory] = useState("");
  
  // Mobile filters sidebar toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Salons state
  const [salons, setSalons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Sync state from query parameters on mount
  useEffect(() => {
    const q = searchParams.get("query") || "";
    const l = searchParams.get("location") || "";
    setQuery(q);
    setLocation(l);
    fetchSalons(q, l);
  }, [searchParams]);

  const fetchSalons = async (searchQuery = query, searchLoc = location) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("query", searchQuery);
      if (searchLoc) params.set("location", searchLoc);
      if (selectedRating > 0) params.set("rating", selectedRating.toString());
      if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString());
      if (priceRange[1] < 300) params.set("maxPrice", priceRange[1].toString());

      const res = await fetch(`/api/businesses?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to load listings");
      }
      const data = await res.json();
      setSalons(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setShowMobileFilters(false);
    fetchSalons();
  };

  const handleResetFilters = () => {
    setQuery("");
    setLocation("");
    setSelectedRating(0);
    setPriceRange([0, 300]);
    setCategory("");
    setShowMobileFilters(false);
    fetchSalons("", "");
  };

  const handleCategoryClick = (cat: string) => {
    const newQuery = query.toLowerCase() === cat.toLowerCase() ? "" : cat;
    setQuery(newQuery);
    fetchSalons(newQuery, location);
  };

  const categoriesList = ["Massage", "Haircut", "Facial", "Nails", "Grooming", "Spa"];

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col">
      {/* Search Header Banner */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">Explore Services</h1>
        <p className="text-sm text-muted-foreground mt-1.5 font-light">
          Discover and book wellness and beauty salons across Doha.
        </p>
      </div>

      {/* Quick Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
        {categoriesList.map((cat) => {
          const isSelected = query.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-300 cursor-pointer border ${
                isSelected
                  ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/10"
                  : "bg-card border-border hover:border-primary/45 text-foreground"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Main Grid Content */}
      <div className="flex flex-col lg:flex-row gap-8 items-stretch flex-1">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <form onSubmit={handleApplyFilters} className="bg-card border border-border rounded-2xl p-6 sticky top-28 space-y-6 shadow-sm">
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <h3 className="font-serif font-bold text-lg flex items-center gap-2">
                <SlidersHorizontal className="h-4.5 w-4.5 text-primary" /> Filters
              </h3>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-muted-foreground hover:text-primary font-semibold transition-colors cursor-pointer"
              >
                Reset All
              </button>
            </div>

            {/* Keyword Search */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Keyword / Service
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="e.g. massage, haircut"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-xs"
                />
              </div>
            </div>

            {/* Location Search */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="e.g. The Pearl, West Bay"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-xs"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Minimum Rating
              </label>
              <div className="flex gap-2">
                {[0, 3, 4, 4.5].map((stars) => (
                  <button
                    key={stars}
                    type="button"
                    onClick={() => setSelectedRating(stars)}
                    className={`flex-1 py-1.5 border rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedRating === stars
                        ? "bg-primary border-primary text-primary-foreground"
                        : "bg-card border-border hover:border-primary/50 text-foreground"
                    }`}
                  >
                    {stars === 0 ? "All" : `${stars}★`}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <span>Price Max Limit</span>
                <span className="text-primary">${priceRange[1]}</span>
              </div>
              <input
                type="range"
                min={0}
                max={300}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Apply Button */}
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-3 rounded-xl transition-all duration-300 text-xs shadow-sm cursor-pointer"
            >
              Apply Filters
            </button>
          </form>
        </aside>

        {/* Salons Grid Listing Column */}
        <div className="flex-1 flex flex-col justify-start">
          {/* Mobile Filter toggle header */}
          <div className="flex lg:hidden justify-between items-center mb-6">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex items-center gap-2 border border-border px-4 py-2.5 rounded-xl text-sm font-semibold text-foreground/80 hover:bg-secondary/40 transition-all cursor-pointer"
            >
              <Filter className="h-4 w-4 text-primary" /> Filter / Search
            </button>
            <span className="text-xs text-muted-foreground font-medium">
              {salons.length} results
            </span>
          </div>

          {loading ? (
            /* Loader */
            <div className="flex-1 flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <span className="text-sm text-muted-foreground font-light">Searching salon partners...</span>
            </div>
          ) : error ? (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          ) : salons.length === 0 ? (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center py-20 bg-card border border-border border-dashed rounded-2xl">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-serif text-lg font-bold text-foreground mb-1">No Salons Found</h3>
              <p className="text-sm text-muted-foreground font-light max-w-xs text-center leading-relaxed">
                We couldn't find any wellness partners matching your criteria. Try adjusting your search keywords.
              </p>
            </div>
          ) : (
            /* Salons list */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {salons.map((salon) => (
                <SalonCard key={salon._id} business={salon} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Slide-over Filter Panel */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-xs" onClick={() => setShowMobileFilters(false)} />
          <div className="relative w-full max-w-sm bg-card h-full border-l border-border shadow-2xl p-6 flex flex-col z-10 animate-in slide-in-from-right duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-border mb-6">
              <h3 className="font-serif font-bold text-lg">Filters</h3>
              <button onClick={() => setShowMobileFilters(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleApplyFilters} className="space-y-6 flex-1 overflow-y-auto pr-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Keyword / Service
                </label>
                <input
                  type="text"
                  placeholder="e.g. massage, haircut"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-foreground focus:outline-none text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. The Pearl, West Bay"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-foreground focus:outline-none text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Minimum Rating
                </label>
                <div className="flex gap-2">
                  {[0, 3, 4, 4.5].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setSelectedRating(stars)}
                      className={`flex-1 py-1.5 border rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        selectedRating === stars
                          ? "bg-primary border-primary text-primary-foreground"
                          : "bg-card border-border text-foreground"
                      }`}
                    >
                      {stars === 0 ? "All" : `${stars}★`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <span>Price Limit</span>
                  <span className="text-primary">${priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={300}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div className="pt-6 flex gap-3">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="flex-1 border border-border hover:bg-secondary/40 text-foreground font-semibold py-3 rounded-xl transition-all text-xs cursor-pointer text-center"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-3 rounded-xl transition-all text-xs cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Explore() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <Suspense fallback={
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <span className="text-sm text-muted-foreground font-light">Loading explore...</span>
        </div>
      }>
        <ExploreContent />
      </Suspense>
      <Footer />
    </div>
  );
}
