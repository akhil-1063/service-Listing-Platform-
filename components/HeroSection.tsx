"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";

export default function HeroSection() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (location) params.set("location", location);
    router.push(`/explore?${params.toString()}`);
  };

  return (
    <div className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/50 via-background to-background pt-16 pb-24 md:py-32">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply pointer-events-none">
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute -bottom-10 left-10 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest text-accent uppercase bg-accent/10 rounded-full">
          The Beauty & Wellness Marketplace
        </span>

        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] mb-6 max-w-4xl mx-auto">
          Discover and book <br />
          <span className="text-primary italic">wellness professionals</span> in Doha
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Book appointments instantly with top-rated salons, therapist spas, beauty clinics, and styling studios tailored to you.
        </p>

        {/* Location & Service Search Bar */}
        <form
          onSubmit={handleSearch}
          className="max-w-3xl mx-auto bg-card rounded-2xl md:rounded-full p-3 md:p-2 border border-border shadow-xl shadow-primary/5 flex flex-col md:flex-row items-stretch gap-2 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10"
        >
          {/* Service name */}
          <div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-border/80">
            <Search className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
            <input
              type="text"
              placeholder="What service? (e.g. Haircut, Massage)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 text-sm py-1"
            />
          </div>

          {/* Location city/address */}
          <div className="flex-1 flex items-center px-4 py-2">
            <MapPin className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
            <input
              type="text"
              placeholder="Where? (e.g. West Bay, Pearl Doha)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-transparent border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 text-sm py-1"
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-8 py-3 rounded-xl md:rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary/10 hover:shadow-lg text-sm"
          >
            <span>Search</span>
          </button>
        </form>
      </div>
    </div>
  );
}
