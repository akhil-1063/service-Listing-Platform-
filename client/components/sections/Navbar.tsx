import Link from "next/link"

const navLinks = [
  { label: "Home",     href: "/" },
  { label: "Services", href: "/services" },
  { label: "About",    href: "/#about" },
  { label: "Contact",  href: "/#contact" },
]

export default function Navbar() {
  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Brand */}
          <Link href="/" className="text-lg font-bold tracking-tight shrink-0">
            Doha Wellness
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto scrollbar-none">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Service Listing button */}
          <Link
            href="/list-business"
            className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors whitespace-nowrap"
          >
            List Your Business
          </Link>

        </div>
      </div>
    </nav>
  )
}
