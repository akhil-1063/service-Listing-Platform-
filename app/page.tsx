import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import SalonCard from "@/components/SalonCard";
import connectDB from "@/lib/mongodb";
import Business from "@/models/Business";
import { Sparkles, ShieldCheck, HeartHandshake, ArrowRight } from "lucide-react";
import Link from "next/link";

async function getFeaturedSalons() {
  try {
    await connectDB();
    const salons = await Business.find({}).sort({ rating: -1, reviewCount: -1 }).limit(3);
    return JSON.parse(JSON.stringify(salons));
  } catch (error) {
    console.error("Failed to load featured salons:", error);
    return [];
  }
}

// Fallback luxury showcase in case the DB has no listings yet
const mockSalons = [
  {
    _id: "mock1",
    name: "The Royal Spa Doha",
    description: "Indulge in absolute luxury. Hammam, massage therapies, and organic facials inside West Bay's finest escape.",
    coverImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800",
    location: {
      address: "Tower 2, West Bay",
      city: "West Bay"
    },
    services: [
      { name: "Balinese Massage", price: 120, duration: 60 },
      { name: "Traditional Moroccan Hammam", price: 180, duration: 90 },
      { name: "Organic Hydrating Facial", price: 95, duration: 45 }
    ],
    rating: 4.9,
    reviewCount: 48
  },
  {
    _id: "mock2",
    name: "Pearl Barber & Styling Lounge",
    description: "Premium grooming, beard sculpting, and hair styling for the modern gentleman at The Pearl.",
    coverImage: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800",
    location: {
      address: "Porto Arabia, Marina Walk",
      city: "The Pearl"
    },
    services: [
      { name: "Signature Haircut & Style", price: 50, duration: 45 },
      { name: "Hot Towel Shave & Sculpt", price: 40, duration: 30 },
      { name: "Royal Beard Ritual", price: 65, duration: 45 }
    ],
    rating: 4.8,
    reviewCount: 32
  },
  {
    _id: "mock3",
    name: "Aura Nails & Beauty Clinic",
    description: "State-of-the-art manicure, pedicure, eyelash lifts, and custom skincare treatments.",
    coverImage: "https://images.unsplash.com/photo-1604654894610-df4906b18502?auto=format&fit=crop&q=80&w=800",
    location: {
      address: "Lusail Marina, Promenade Rd",
      city: "Lusail"
    },
    services: [
      { name: "Gel Manicure & Pedicure", price: 80, duration: 75 },
      { name: "Lash Lift & Tint", price: 70, duration: 50 },
      { name: "Radiance Facial Treatment", price: 110, duration: 60 }
    ],
    rating: 4.7,
    reviewCount: 24
  }
];

export default async function Home() {
  const dbSalons = await getFeaturedSalons();
  const displaySalons = dbSalons.length > 0 ? dbSalons : mockSalons;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* About / Mission Section */}
      <section id="about" className="py-24 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">Our Mission</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-2 mb-6">
              Elevating Wellness in Doha
            </h2>
            <p className="text-muted-foreground leading-relaxed font-light">
              Doha Wellness is a curated marketplace designed to bridge the gap between luxury beauty seekers and elite wellness providers. We bring convenience, trust, and exceptional service straight to your fingertips.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Box 1 */}
            <div className="p-8 rounded-2xl bg-secondary/10 border border-primary/5 hover:border-primary/10 transition-colors">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">Curated Selection</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                We handpick and review salon partners and freelance wellness experts in Doha to ensure you receive a five-star experience.
              </p>
            </div>

            {/* Box 2 */}
            <div className="p-8 rounded-2xl bg-secondary/10 border border-primary/5 hover:border-primary/10 transition-colors">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">Secure & Seamless</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                Book instantly, receive calendar confirmation notifications, and manage all your appointments in one unified customer dashboard.
              </p>
            </div>

            {/* Box 3 */}
            <div className="p-8 rounded-2xl bg-secondary/10 border border-primary/5 hover:border-primary/10 transition-colors">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">Empowering Businesses</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                We give local beauty salons and freelance therapists the software tools to display bookings, accept slots, and manage client files.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">Recommended</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-2">
                Featured Wellness Salons
              </h2>
            </div>
            <Link
              href="/explore"
              className="text-primary hover:text-accent font-semibold flex items-center gap-1.5 mt-4 sm:mt-0 transition-colors group text-sm"
            >
              <span>Explore All Partners</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displaySalons.map((salon: any) => (
              <SalonCard key={salon._id} business={salon} />
            ))}
          </div>
        </div>
      </section>

      {/* List Your Business Banner */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-primary-foreground leading-tight">
            Are you a Beauty or Wellness Professional in Doha?
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-10 font-light text-sm sm:text-base leading-relaxed">
            Join Doha Wellness today. List your services, operational hours, receive direct customer appointment requests, and manage your schedule effortlessly.
          </p>
          <Link
            href="/auth/signin?role=professional"
            className="inline-block bg-accent hover:bg-accent/95 text-accent-foreground font-semibold px-8 py-3.5 rounded-full transition-all duration-300 shadow-lg text-sm tracking-wide"
          >
            List Your Business Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
