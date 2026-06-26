"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Star, MapPin, Clock, ArrowLeft, Heart, Sparkles, MessageSquare, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";

function SalonDetailContent() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();

  // Business profile
  const [salon, setSalon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Reviews
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Review Form
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");

  // Booking Modal
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchSalonDetails();
      fetchReviews();
    }
  }, [id]);

  const fetchSalonDetails = async () => {
    try {
      const res = await fetch(`/api/businesses/${id}`);
      if (!res.ok) {
        throw new Error("Salon not found or server error");
      }
      const data = await res.json();
      setSalon(data);
    } catch (err: any) {
      setError(err.message || "Could not retrieve details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?businessId=${id}`);
      if (!res.ok) {
        throw new Error("Failed to load reviews");
      }
      const data = await res.json();
      setReviews(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleBookClick = (service: any) => {
    if (!session) {
      // Redirect to sign in, but keep return URL
      router.push(`/auth/signin?callbackUrl=/salons/${id}`);
      return;
    }
    if (session.user.role === "professional") {
      alert("Professionals cannot book appointments.");
      return;
    }
    setSelectedService(service);
    setIsBookingOpen(true);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setReviewError("Please write a comment.");
      return;
    }

    setSubmittingReview(true);
    setReviewError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: id,
          rating,
          comment
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review.");
      }

      // Reset review form and refresh reviews list + salon rating
      setComment("");
      setRating(5);
      fetchReviews();
      fetchSalonDetails();
    } catch (err: any) {
      setReviewError(err.message || "An unexpected error occurred.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <span className="text-sm text-muted-foreground font-light">Loading salon profile...</span>
      </div>
    );
  }

  if (error || !salon) {
    return (
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-20 text-center">
        <h3 className="font-serif text-2xl font-bold text-foreground mb-4">Error Loading Profile</h3>
        <p className="text-sm text-muted-foreground mb-8">{error || "The salon you are looking for does not exist."}</p>
        <Link href="/explore" className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold text-sm">
          Back to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {/* Cover Image Banner */}
      <div className="relative h-80 sm:h-96 md:h-[450px]">
        <img
          src={salon.coverImage || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200"}
          alt={salon.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        {/* Back Link */}
        <Link
          href="/explore"
          className="absolute top-6 left-6 bg-background/90 backdrop-blur-sm p-3 rounded-full hover:bg-background transition-colors shadow-md text-foreground cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>

      {/* Main Info Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-wider text-accent uppercase bg-accent/10 px-3 py-1 rounded-full">
                {salon.location.city}
              </span>
              <div className="flex items-center gap-1 text-sm font-semibold">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span>{salon.rating > 0 ? salon.rating : "New"}</span>
                {salon.rating > 0 && <span className="text-xs text-muted-foreground font-normal">({salon.reviewCount} reviews)</span>}
              </div>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">{salon.name}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-light">
              <MapPin className="h-4.5 w-4.5 text-primary flex-shrink-0" />
              <span>{salon.location.address}</span>
            </div>
          </div>

          <div className="border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6 space-y-1.5 flex-shrink-0 text-sm">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Operating Hours</span>
            <div className="flex items-center gap-2 font-medium text-foreground">
              <Clock className="h-4 w-4 text-primary" />
              <span>{salon.operatingHours.open} AM - {salon.operatingHours.close} PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Page Layout Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Services Offered list */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold flex items-center gap-2 border-b border-border pb-3">
                <Sparkles className="h-6 w-6 text-primary" /> Services Menu
              </h2>
              <p className="text-sm text-muted-foreground font-light">
                Select a service to request an appointment. Confirmation will be sent to your email.
              </p>
            </div>

            <div className="space-y-4">
              {salon.services.map((service: any) => (
                <div
                  key={service._id}
                  className="bg-card border border-border rounded-xl p-5 hover:border-primary/45 transition-colors flex justify-between items-center gap-4"
                >
                  <div className="space-y-1">
                    <h3 className="font-serif font-bold text-lg text-foreground">{service.name}</h3>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground font-light">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {service.duration} mins
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="text-xl font-bold text-primary">${service.price}</span>
                    <button
                      onClick={() => handleBookClick(service)}
                      className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
                    >
                      Book
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Reviews Section */}
            <div className="space-y-8 pt-8">
              <h2 className="font-serif text-2xl font-bold flex items-center gap-2 border-b border-border pb-3">
                <MessageSquare className="h-6 w-6 text-primary" /> Client Reviews ({reviews.length})
              </h2>

              {/* Reviews List */}
              {reviewsLoading ? (
                <span className="text-sm text-muted-foreground font-light block">Loading reviews...</span>
              ) : reviews.length === 0 ? (
                <div className="bg-secondary/20 rounded-xl p-6 text-center border border-border/50 text-sm text-muted-foreground font-light">
                  No reviews left yet for this salon.
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div key={rev._id} className="bg-card border border-border rounded-xl p-5 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          {rev.customer?.image ? (
                            <img src={rev.customer.image} alt={rev.customer.name} className="h-8 w-8 rounded-full border" />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                              {rev.customer?.name?.[0]?.toUpperCase() || "U"}
                            </div>
                          )}
                          <div>
                            <span className="text-sm font-semibold text-foreground block">{rev.customer?.name || "Verified Customer"}</span>
                            <span className="text-[10px] text-muted-foreground font-light">{new Date(rev.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < rev.rating ? "fill-accent text-accent" : "text-muted/30"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed font-light pl-1">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Area: Salon Info & Review Submission */}
          <div className="space-y-8">
            {/* About Box */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-foreground">About the Salon</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                {salon.description}
              </p>
            </div>

            {/* Leave a Review Form (If Customer) */}
            {session && session.user.role === "customer" && (
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
                <h3 className="font-serif text-lg font-bold text-foreground">Leave a Review</h3>
                
                {reviewError && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-lg">
                    {reviewError}
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {/* Rating Selector */}
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Rating</span>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="text-accent hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star className={`h-6 w-6 ${rating >= star ? "fill-accent text-accent" : "text-muted-foreground/30"}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Review Comments</span>
                    <textarea
                      rows={4}
                      required
                      placeholder="Share your experience (staff, hygiene, service quality)..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:border-primary text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-2.5 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        businessId={salon._id}
        businessName={salon.name}
        service={selectedService}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}

export default function SalonDetail() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <Suspense fallback={
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <span className="text-sm text-muted-foreground font-light">Loading salon...</span>
        </div>
      }>
        <SalonDetailContent />
      </Suspense>
      <Footer />
    </div>
  );
}
