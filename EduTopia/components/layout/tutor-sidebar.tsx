"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Briefcase, Home, Calendar, TrendingUp, User, LogOut } from "lucide-react"
import { useUserRole } from "@/lib/hooks/use-user-role"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/tutor", label: "Dashboard", icon: Home },
  { href: "/tutor/sessions", label: "My Sessions", icon: Calendar },
  { href: "/tutor/schedule", label: "Schedule", icon: Calendar },
  { href: "/tutor/earnings", label: "Earnings", icon: TrendingUp },
  { href: "/tutor/profile", label: "Profile", icon: User },
]

export function TutorSidebar() {
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
          <Briefcase className="w-5 h-5 text-secondary" />
          <span>Tutor</span>
        </Link>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                pathname === href ? "bg-secondary text-secondary-foreground" : "text-foreground hover:bg-muted",
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
