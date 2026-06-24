"use client"

import { useEffect, useState } from "react"
import { MapPin, Tag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ServiceProvider } from "@/lib/types"
import { getFeaturedServices } from "@/lib/api"

export default function FeaturedServices() {
  const [services, setServices] = useState<ServiceProvider[]>([])

  useEffect(() => {
    getFeaturedServices().then(setServices)
  }, [])

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">

        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Featured Services
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            A selection of trusted service providers on our platform.
          </p>
        </div>

        {services.length === 0 ? (
          <p className="mt-12 text-center text-sm text-muted-foreground">
            No services listed yet.{" "}
            <Link href="/list-your-business" className="text-primary underline underline-offset-4">
              Be the first to list yours.
            </Link>
          </p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div key={service._id} className="flex flex-col rounded-xl border bg-background overflow-hidden">
                <div className="relative h-48 w-full bg-muted">
                  <Image
                    src={service.imageUrl}
                    alt={service.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2 p-5">
                  <h3 className="font-semibold">{service.name}</h3>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Tag className="size-3" />{service.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3" />{service.location}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/services"
            className="rounded-lg border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-muted transition-colors"
          >
            View All Services
          </Link>
        </div>

      </div>
    </section>
  )
}
