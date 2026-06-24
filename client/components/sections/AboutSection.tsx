import { Search, Briefcase } from "lucide-react"

const features = [
  {
    icon: Search,
    title: "Easy Discovery",
    description: "Search and filter through hundreds of service providers by category, location, and more.",
  },
  {
    icon: Briefcase,
    title: "List Your Business",
    description: "Register your business in minutes and reach thousands of potential customers in your area.",
  },
]

export default function AboutSection() {
  return (
    <section id="about" className="bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">

        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Why Doha Wellness?
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            We make it simple for customers to find the right service and for businesses to get discovered.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 max-w-3xl mx-auto">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col gap-4 rounded-xl border bg-background p-6">
              <feature.icon className="size-6 text-primary" />
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
