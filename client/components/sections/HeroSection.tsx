import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-muted/50 to-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        
        <div className="flex flex-col items-center gap-6 text-center">

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl max-w-3xl">
            Find Trusted Service Providers Near You
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl">
            Connect with verified professionals across Qatar. Browse services, read reviews, and grow your business with Doha Wellness.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 mt-4">
            <Link
              href="/services"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors"
            >
              Browse Services
            </Link>
            <Link
              href="/list-business"
              className="rounded-lg border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-muted transition-colors"
            >
              List Your Business
            </Link>
          </div>

        </div>

      </div>
    </section>
  )
}
