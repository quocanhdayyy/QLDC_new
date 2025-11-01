"use client"

import type { ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Button } from "@/components/ui/button"
import { Menu, LogOut, Bell, User } from "lucide-react"
import { useState } from "react"

interface LayoutProps {
  children: ReactNode
  title?: string
}

export default function Layout({ children, title }: LayoutProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const isWardLeader = user?.role === "ward_leader"

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-card border-r border-border transition-all duration-300`}>
        <div className="p-4 border-b border-border">
          <h1 className={`font-bold text-primary ${!sidebarOpen && "text-center"}`}>
            {sidebarOpen ? "Residential Mgmt" : "RM"}
          </h1>
        </div>

        <nav className="p-4 space-y-2">
          {isWardLeader ? (
            <>
              <NavItem
                icon="📊"
                label="Dashboard"
                path="/dashboard"
                open={sidebarOpen}
                onClick={() => navigate("/dashboard")}
              />
              <NavItem
                icon="🏠"
                label="Households"
                path="/households"
                open={sidebarOpen}
                onClick={() => navigate("/households")}
              />
              <NavItem
                icon="👥"
                label="Citizens"
                path="/citizens"
                open={sidebarOpen}
                onClick={() => navigate("/citizens")}
              />
              <NavItem
                icon="📝"
                label="Edit Requests"
                path="/edit-requests"
                open={sidebarOpen}
                onClick={() => navigate("/edit-requests")}
              />
              <NavItem
                icon="🏆"
                label="Rewards"
                path="/reward-proposals"
                open={sidebarOpen}
                onClick={() => navigate("/reward-proposals")}
              />
              <NavItem
                icon="📋"
                label="Audit Logs"
                path="/audit-logs"
                open={sidebarOpen}
                onClick={() => navigate("/audit-logs")}
              />
            </>
          ) : (
            <>
              <NavItem
                icon="🏠"
                label="My Household"
                path="/my-household"
                open={sidebarOpen}
                onClick={() => navigate("/my-household")}
              />
              <NavItem
                icon="📝"
                label="Submit Request"
                path="/submit-edit-request"
                open={sidebarOpen}
                onClick={() => navigate("/submit-edit-request")}
              />
              <NavItem
                icon="🏆"
                label="Submit Reward"
                path="/submit-reward-proposal"
                open={sidebarOpen}
                onClick={() => navigate("/submit-reward-proposal")}
              />
              <NavItem
                icon="📜"
                label="Request History"
                path="/request-history"
                open={sidebarOpen}
                onClick={() => navigate("/request-history")}
              />
              <NavItem
                icon="🎖️"
                label="Reward History"
                path="/reward-history"
                open={sidebarOpen}
                onClick={() => navigate("/reward-history")}
              />
            </>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="w-5 h-5" />
            </Button>
            {title && <h2 className="text-xl font-semibold">{title}</h2>}
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/notifications")}>
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate("/profile")}>
              <User className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}

interface NavItemProps {
  icon: string
  label: string
  path: string
  open: boolean
  onClick: () => void
}

function NavItem({ icon, label, open, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-left"
    >
      <span className="text-xl">{icon}</span>
      {open && <span className="text-sm">{label}</span>}
    </button>
  )
}
