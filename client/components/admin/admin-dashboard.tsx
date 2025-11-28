"use client"

import { useState } from "react"
import UserManagement from "./user-management"
import SystemSettings from "./system-settings"
import { Users, Settings, BarChart3, AlertCircle } from "lucide-react"

type AdminTab = "users" | "settings" | "reports" | "alerts"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("users")

  const tabs = [
    { id: "users", label: "User Management", icon: Users },
    { id: "settings", label: "System Settings", icon: Settings },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "alerts", label: "Alerts", icon: AlertCircle },
  ]

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      {/* Header */}
      <div className="border-b border-border bg-primary-light sticky top-0 z-10">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-foreground mb-4">Admin Dashboard</h1>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-border -mb-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-accent text-accent"
                      : "border-transparent text-text-secondary hover:text-foreground"
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "users" && <UserManagement />}
        {activeTab === "settings" && <SystemSettings />}
        {activeTab === "reports" && (
          <div className="bg-primary-light border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Reports</h2>
            <p className="text-text-tertiary">Reports section coming soon...</p>
          </div>
        )}
        {activeTab === "alerts" && (
          <div className="bg-primary-light border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">System Alerts</h2>
            <p className="text-text-tertiary">No active alerts</p>
          </div>
        )}
      </div>
    </div>
  )
}
