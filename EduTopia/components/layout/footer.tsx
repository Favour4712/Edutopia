export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Edutopia</h3>
            <p className="text-sm text-muted-foreground">
              Blockchain-powered peer learning marketplace connecting students and tutors.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/browse" className="text-muted-foreground hover:text-foreground">
                  Find Tutors
                </a>
              </li>
              <li>
                <a href="/become-tutor" className="text-muted-foreground hover:text-foreground">
                  Become Tutor
                </a>
              </li>
              <li>
                <a href="/how-it-works" className="text-muted-foreground hover:text-foreground">
                  How It Works
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/about" className="text-muted-foreground hover:text-foreground">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </a>
              </li>
              <li>
                <a href="/blog" className="text-muted-foreground hover:text-foreground">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms
                </a>
              </li>
              <li>
                <a href="/disclaimer" className="text-muted-foreground hover:text-foreground">
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 flex justify-between items-center text-sm text-muted-foreground">
          <p>&copy; 2025 Edutopia. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              Twitter
            </a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
              Discord
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
