import { ServiceProvider } from "./types"

export const CATEGORIES = [
  "All",
  "Plumbing",
  "Electrical",
  "Cleaning",
  "Carpentry",
  "Painting",
  "Landscaping",
]

export const LOCATIONS = [
  "All",
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
]

export const MOCK_SERVICES: ServiceProvider[] = [
  {
    _id: "1",
    name: "ProFix Plumbing",
    category: "Plumbing",
    location: "New York",
    description: "Expert plumbing services for residential and commercial properties. Available 24/7 for emergencies.",
    imageUrl: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&auto=format&fit=crop",
  },
  {
    _id: "2",
    name: "BrightSpark Electrical",
    category: "Electrical",
    location: "Los Angeles",
    description: "Licensed electricians handling installations, repairs, and inspections with safety as top priority.",
    imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop",
  },
  {
    _id: "3",
    name: "SparkleClean Services",
    category: "Cleaning",
    location: "Chicago",
    description: "Professional deep cleaning for homes and offices using eco-friendly products.",
    imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop",
  },
  {
    _id: "4",
    name: "MasterCraft Carpentry",
    category: "Carpentry",
    location: "Houston",
    description: "Custom furniture, repairs, and woodwork crafted with precision and quality materials.",
    imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop",
  },
  {
    _id: "5",
    name: "ColorPro Painting",
    category: "Painting",
    location: "Phoenix",
    description: "Interior and exterior painting services with flawless finishes and on-time delivery.",
    imageUrl: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=600&auto=format&fit=crop",
  },
  {
    _id: "6",
    name: "GreenThumb Landscaping",
    category: "Landscaping",
    location: "New York",
    description: "Transform your outdoor space with expert landscaping, lawn care, and garden design.",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop",
  },
]
