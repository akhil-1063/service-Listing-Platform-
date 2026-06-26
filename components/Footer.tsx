import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background mt-auto border-t border-border/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold tracking-wide text-background">
              Doha Wellness
            </h3>
            <p className="text-sm text-background/60 font-light leading-relaxed">
              Doha's premium beauty and wellness booking marketplace. Connecting discerning customers with elite professionals.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-background/60 hover:text-accent transition-colors" aria-label="Instagram">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="text-background/60 hover:text-accent transition-colors" aria-label="Facebook">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-background/60 hover:text-accent transition-colors" aria-label="Twitter">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Sitemaps */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4 text-background">Explore</h4>
            <ul className="space-y-2.5 text-sm text-background/60 font-light">
              <li><Link href="/explore" className="hover:text-accent transition-colors">Find Services</Link></li>
              <li><Link href="/explore?query=Massage" className="hover:text-accent transition-colors">Spas & Massage</Link></li>
              <li><Link href="/explore?query=Haircut" className="hover:text-accent transition-colors">Hair Salons</Link></li>
              <li><Link href="/explore?query=Facial" className="hover:text-accent transition-colors">Skin & Facial</Link></li>
            </ul>
          </div>

          {/* Partnerships */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4 text-background">For Partners</h4>
            <ul className="space-y-2.5 text-sm text-background/60 font-light">
              <li><Link href="/auth/signin?role=professional" className="hover:text-accent transition-colors">List Your Business</Link></li>
              <li><Link href="/auth/signin" className="hover:text-accent transition-colors">Partner Log In</Link></li>
              <li><a href="#" className="hover:text-accent transition-colors">Success Stories</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Pricing & Features</a></li>
            </ul>
          </div>

          {/* Contact details */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4 text-background">Contact</h4>
            <ul className="space-y-3.5 text-sm text-background/60 font-light">
              <li className="flex items-center gap-2.5">
                <MapPin className="h-4.5 w-4.5 text-accent flex-shrink-0" />
                <span>West Bay, Doha, Qatar</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4.5 w-4.5 text-accent flex-shrink-0" />
                <span>support@doha-wellness.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-background/40 font-light space-y-4 sm:space-y-0">
          <p>&copy; {new Date().getFullYear()} Doha Wellness. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
