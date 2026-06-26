import Link from "next/link";
import { Star, MapPin, Clock } from "lucide-react";

interface SalonCardProps {
  business: {
    _id: string;
    name: string;
    description: string;
    coverImage: string;
    location: {
      address: string;
      city: string;
    };
    services: Array<{
      name: string;
      price: number;
      duration: number;
    }>;
    rating: number;
    reviewCount: number;
  };
}

export default function SalonCard({ business }: SalonCardProps) {
  const displayServices = business.services.slice(0, 3);

  return (
    <div className="group bg-card rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Cover image & absolute rating badge */}
      <div className="relative h-56 overflow-hidden bg-muted">
        <img
          src={business.coverImage || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800"}
          alt={business.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
          <Star className="h-4 w-4 fill-accent text-accent" />
          <span className="text-sm font-semibold text-foreground">{business.rating > 0 ? business.rating : 'New'}</span>
          {business.rating > 0 && (
            <span className="text-xs text-muted-foreground">({business.reviewCount})</span>
          )}
        </div>
      </div>

      {/* Information contents */}
      <div className="p-6">
        <span className="text-xs font-semibold tracking-wider text-accent uppercase">
          {business.location.city}
        </span>
        <h3 className="font-serif text-xl font-bold text-foreground mt-1 mb-2 group-hover:text-primary transition-colors">
          {business.name}
        </h3>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{business.location.address}</span>
        </div>

        {/* Services List preview */}
        {displayServices.length > 0 && (
          <div className="border-t border-border pt-4 mt-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
              Services
            </h4>
            <div className="space-y-2">
              {displayServices.map((service, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-foreground/80 font-medium truncate pr-4">{service.name}</span>
                  <div className="flex items-center gap-3 text-muted-foreground flex-shrink-0 font-light">
                    <span className="flex items-center text-xs"><Clock className="h-3 w-3 mr-1" /> {service.duration}m</span>
                    <span className="text-foreground font-semibold">${service.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <Link
            href={`/salons/${business._id}`}
            className="block text-center bg-secondary hover:bg-primary hover:text-primary-foreground text-primary font-semibold py-3 px-4 rounded-xl transition-all duration-300 text-sm tracking-wide border border-primary/10 hover:border-transparent cursor-pointer"
          >
            View Services & Book
          </Link>
        </div>
      </div>
    </div>
  );
}
