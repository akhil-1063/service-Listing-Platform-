"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/sections/Navbar"
import Footer from "@/components/sections/Footer"
import { createService } from "@/lib/api"

export default function ListYourBusinessPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const body = {
      name: form.serviceName.value,
      category: form.category.value,
      location: form.location.value,
      description: form.description.value,
      imageUrl: form.imageUrl.value,
    }
    setLoading(true)
    setError("")
    const result = await createService(body)
    setLoading(false)
    if (!result) return setError("Something went wrong. Please try again.")
    router.push("/services")
  }

  return (
    <div>
      <Navbar />

      <main className="mx-auto max-w-lg px-4 py-12 sm:px-6">

        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">List Your Business</h1>
          <p className="text-muted-foreground">Fill in your details and get discovered by customers.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div className="flex flex-col gap-1.5">
            <label htmlFor="serviceName" className="text-sm font-medium">Business Name</label>
            <input
              id="serviceName"
              name="serviceName"
              type="text"
              required
            
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="category" className="text-sm font-medium">Category</label>
            <input
              id="category"
              name="category"
              type="text"
              required
            
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="location" className="text-sm font-medium">Location</label>
            <input
              id="location"
              name="location"
              type="text"
              required
              
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
             
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50 resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="imageUrl" className="text-sm font-medium">Image URL</label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              required
              
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors disabled:opacity-50"
          >
            {loading ? "Submitting..." : "List My Business"}
          </button>

        </form>

      </main>

      <Footer />
    </div>
  )
}
