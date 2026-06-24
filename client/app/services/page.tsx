"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/sections/Navbar"
import Footer from "@/components/sections/Footer"
import { Search, MapPin, Tag } from "lucide-react"
import Image from "next/image"
import { getServices, getFilterOptions } from "@/lib/api"
import { ServiceProvider } from "@/lib/types"

export default function ServicesPage() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [activeLocation, setActiveLocation] = useState("All")
  const [services, setServices] = useState<ServiceProvider[]>([])
  const [categories, setCategories] = useState<string[]>(["All"])
  const [locations, setLocations] = useState<string[]>(["All"])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFilterOptions().then(({ categories, locations }) => {
      setCategories(categories)
      setLocations(locations)
    })
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true)
      getServices({ search, category: activeCategory, location: activeLocation })
        .then(setServices)
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(timer)
  }, [search, activeCategory, activeLocation])

  return (
    <div>
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">All Services</h1>
          <p className="text-muted-foreground">Browse and filter from our list of trusted service providers.</p>
        </div>

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center">

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search services..."
              className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={activeLocation}
            onChange={(e) => setActiveLocation(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          {loading ? "Loading..." : `${services.length} ${services.length === 1 ? "result" : "results"} found`}
        </p>

        {loading ? (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            <p className="text-lg font-medium">No services found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div key={service._id} className="flex flex-col rounded-xl border bg-background overflow-hidden">
                <div className="relative h-48 w-full bg-muted">
                  <Image src={service.imageUrl} alt={service.name} fill className="object-cover" />
                </div>
                <div className="flex flex-col gap-2 p-5">
                  <h3 className="font-semibold">{service.name}</h3>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Tag className="size-3" />{service.category}</span>
                    <span className="flex items-center gap-1"><MapPin className="size-3" />{service.location}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  )
}
