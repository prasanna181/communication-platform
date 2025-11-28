"use client"

import { Utils } from "@/lib/services/storage"
import { MessageSquare, Phone, Radio, BarChart3, Settings, LogOut, Menu } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface SidebarProps {
  currentView: string
  setCurrentView: (view: any) => void
  userRole: "user" | "admin"
  setUserRole: (role: "user" | "admin") => void
}

export default function Sidebar({ currentView, setCurrentView, userRole, setUserRole }: SidebarProps) {
  const router= useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false)


  const handleLogOut= async()=>{
    Utils.removeItem('authToken');
    router.push('/login')
  }

  const menuItems = [
    { id: "chat", label: "Messages", icon: MessageSquare },
    { id: "calls", label: "Calls", icon: Phone },
    { id: "streaming", label: "Live Stream", icon: Radio },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ]

  const adminItems = [{ id: "admin", label: "Admin Panel", icon: Settings }]

  return (
    <aside
      className={`bg-primary-light border-r border-border transition-all duration-300 flex flex-col ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-accent">ConnectHub</h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-primary-lighter rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === item.id
                  ? "bg-accent text-white"
                  : "text-text-secondary hover:bg-primary-lighter"
              }`}
            >
              <Icon size={20} />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}

        {/* Admin Section */}
        {userRole === "admin" && (
          <div className="pt-4 border-t border-border">
            {adminItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    currentView === item.id
                      ? "bg-accent text-white"
                      : "text-text-secondary hover:bg-primary-lighter"
                  }`}
                >
                  <Icon size={20} />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <button
          onClick={() => setUserRole(userRole === "user" ? "admin" : "user")}
          className="w-full flex items-center gap-3 px-4 py-2 text-text-secondary hover:bg-primary-lighter rounded-lg transition-colors text-sm"
        >
          <Settings size={18} />
          {!isCollapsed && (
            <span>
              {userRole === "user" ? "Switch to Admin" : "Switch to User"}
            </span>
          )}
        </button>
        <button
          onClick={handleLogOut}
          className="w-full flex items-center gap-3 px-4 py-2 text-text-secondary hover:bg-primary-lighter rounded-lg transition-colors text-sm hover:cursor-pointer"
        >
          <LogOut size={18} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
