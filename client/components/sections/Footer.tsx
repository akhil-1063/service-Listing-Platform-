import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

const footerLinks = [
  { label: "Home",     href: "/" },
  { label: "Services", href: "/services" },
  { label: "About",    href: "/#about" },
]

export default function Footer() {
  return (
    <footer id="contact" className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">

          {/* Brand */}
          <div className="flex flex-col gap-2">
            <Link href="/" className="text-lg font-bold tracking-tight">
              Doha Wellness
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Browse and connect with trusted service providers in your area.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium">Quick Links</p>
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium">Contact Us</p>
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="size-4" /> +974 1234 5678
            </span>
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="size-4" /> hello@doahwellness.com
            </span>
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4" /> Doha, Qatar
            </span>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Doha Wellness. All rights reserved.
        </div>

      </div>
    </footer>
  )
}
