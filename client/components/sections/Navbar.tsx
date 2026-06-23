import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b  bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold tracking-tight">
          ServeLocal
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
            Home
          </Link>
          <Link href="/services" className="text-muted-foreground transition-colors hover:text-foreground">
            Services
          </Link>
          <Link href="/#about" className="text-muted-foreground transition-colors hover:text-foreground">
            About
          </Link>
          <Link href="/#contact" className="text-muted-foreground transition-colors hover:text-foreground">
            Contact
          </Link>
        </nav>

        <Button asChild size="sm">
          <Link href="/services">Browse Services</Link>
        </Button>
      </div>
    </header>
  )
}
