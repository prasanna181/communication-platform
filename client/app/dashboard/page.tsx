"use client"

import { useState } from "react"
import Sidebar from "@/components/layout/sidebar"
import ChatInterface from "@/components/chat/chat-interface"
import CallInterface from "@/components/calls/call-interface"
import StreamingInterface from "@/components/streaming/streaming-interface"
import AnalyticsDashboard from "@/components/analytics/analytics-dashboard"
import AdminDashboard from "@/components/admin/admin-dashboard"

type ViewType = "chat" | "calls" | "streaming" | "analytics" | "admin"

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>("chat")
  const [userRole, setUserRole] = useState<"user" | "admin">("user")

  const renderView = () => {
    switch (currentView) {
      case "chat":
        return <ChatInterface />
      case "calls":
        return <CallInterface />
      case "streaming":
        return <StreamingInterface />
      case "analytics":
        return <AnalyticsDashboard />
      case "admin":
        return <AdminDashboard />
      default:
        return <ChatInterface />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        userRole={userRole}
        setUserRole={setUserRole}
      />
      <main className="flex-1 overflow-hidden">{renderView()}</main>
    </div>
  )
}
