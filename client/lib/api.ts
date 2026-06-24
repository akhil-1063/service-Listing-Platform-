import axios from "axios"
import { ServiceProvider } from "./types"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",

  
})

export async function getServices(params?: {
  search?: string
  category?: string
  location?: string
}): Promise<ServiceProvider[]> {
  try {
    const { data } = await api.get("/services", {
      params: {
        ...(params?.search && { search: params.search }),
        ...(params?.category && params.category !== "All" && { category: params.category }),
        ...(params?.location && params.location !== "All" && { location: params.location }),
      }
    })
    return data.data
  } catch (error) {
    console.error("getServices:", error)
    return []
  }
}

export async function getFeaturedServices(): Promise<ServiceProvider[]> {
  try {
    const { data } = await api.get("/services")
    return data.data.slice(0, 3)
  } catch (error) {
    console.error("getFeaturedServices:", error)
    return []
  }
}

export async function getFilterOptions(): Promise<{ categories: string[]; locations: string[] }> {
  try {
    const { data } = await api.get("/services")
    const services: ServiceProvider[] = data.data
    return {
      categories: ["All", ...Array.from(new Set(services.map((s) => s.category)))],
      locations: ["All", ...Array.from(new Set(services.map((s) => s.location)))],
    }
  } catch (error) {
    console.error("getFilterOptions:", error)
    return { categories: ["All"], locations: ["All"] }
  }
}

export async function getServiceById(id: string): Promise<ServiceProvider | null> {
  try {
    const { data } = await api.get(`/services/${id}`)
    return data.data
  } catch (error) {
    console.error("getServiceById:", error)
    return null
  }
}

export async function createService(body: Omit<ServiceProvider, "_id">): Promise<ServiceProvider | null> {
  try {
    const { data } = await api.post("/services", body)
    return data.data
  } catch (error) {
    console.error("createService:", error)
    return null
  }
}

export async function updateService(id: string, body: Partial<ServiceProvider>): Promise<ServiceProvider | null> {
  try {
    const { data } = await api.put(`/services/${id}`, body)
    return data.data
  } catch (error) {
    console.error("updateService:", error)
    return null
  }
}

export async function deleteService(id: string): Promise<boolean> {
  try {
    await api.delete(`/services/${id}`)
    return true
  } catch (error) {
    console.error("deleteService:", error)
    return false
  }
}
