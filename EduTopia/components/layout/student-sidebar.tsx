"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BookOpen, Home, Clock, Award, LogOut } from "lucide-react"
import { useUserRole } from "@/lib/hooks/use-user-role"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/student/browse", label: "Find Tutors", icon: Home },
  { href: "/student/sessions", label: "My Sessions", icon: Clock },
  { href: "/student/certificates", label: "My Certificates", icon: Award },
]

export function StudentSidebar() {
  const pathname = usePathname()
  const { setRole } = useUserRole()

  const handleLogout = () => {
    setRole(null)
    window.location.href = "/"
  }

  return (
    <aside className="hidden lg:block w-64 border-r border-border bg-card">
      <div className="p-6 space-y-8">
        {/* Logo/Header */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <BookOpen className="w-5 h-5 text-primary" />
          <span>Student</span>
        </Link>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                pathname === href ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted",
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="pt-8 border-t border-border">
          <Button variant="outline" onClick={handleLogout} className="w-full justify-start bg-transparent">
            <LogOut className="w-4 h-4 mr-2" />
            Switch Role
          </Button>
        </div>
      </div>
    </aside>
  )
}
