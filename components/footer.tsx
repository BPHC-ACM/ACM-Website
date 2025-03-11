import Link from "next/link"
import Image from "next/image"
import { Github, Instagram, Linkedin, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative h-12 w-12 overflow-hidden">
                <Image
                  src="/placeholder.svg?height=48&width=48"
                  alt="ACM Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary">ACM BITS Pilani</h3>
                <p className="text-xs">Hyderabad Chapter</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Promoting computing as a science and profession through education, networking, and advocacy.
            </p>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <h3 className="mb-4 text-lg font-semibold blue-accent inline-block">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/events" className="text-muted-foreground hover:text-primary transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-muted-foreground hover:text-primary transition-colors">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <h3 className="mb-4 text-lg font-semibold blue-accent inline-block">Connect With Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com/BPHC-ACM"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors hover-lift"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors hover-lift"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors hover-lift"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors hover-lift"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                Email:{" "}
                <a href="mailto:acm@hyderabad.bits-pilani.ac.in" className="hover:text-primary transition-colors">
                  acm@hyderabad.bits-pilani.ac.in
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ACM BITS Pilani Hyderabad Chapter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

