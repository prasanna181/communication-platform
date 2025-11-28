"use client"

import { useState } from "react"
import { Users, Heart, Share2, Settings, Send, Eye } from "lucide-react"
import StreamList from "./stream-list"

export default function StreamingInterface() {
  const [isLive, setIsLive] = useState(false)
  const [viewers, setViewers] = useState(1234)
  const [chatMessage, setChatMessage] = useState("")
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: "Alex", message: "Great stream!", timestamp: "2:34 PM" },
    { id: 2, user: "Jordan", message: "Love this content", timestamp: "2:35 PM" },
    { id: 3, user: "Casey", message: "Thanks for streaming!", timestamp: "2:36 PM" },
  ])
  const [showViewers, setShowViewers] = useState(false)

  const handleSendChat = () => {
    if (chatMessage.trim()) {
      setChatMessages([
        ...chatMessages,
        {
          id: chatMessages.length + 1,
          user: "You",
          message: chatMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ])
      setChatMessage("")
    }
  }

  const mockViewers = [
    { id: 1, name: "Alex Johnson", avatar: "👤" },
    { id: 2, name: "Emma Davis", avatar: "👤" },
    { id: 3, name: "Mike Chen", avatar: "👤" },
    { id: 4, name: "Lisa Park", avatar: "👤" },
    { id: 5, name: "John Smith", avatar: "👤" },
  ]

  return (
    <div className="flex h-full bg-background">
      {/* Stream List */}
      <StreamList setIsLive={setIsLive} />

      {/* Stream Window */}
      <div className="flex-1 flex flex-col">
        {/* Video Player */}
        <div className="flex-1 bg-primary-lighter relative flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📹</div>
            <h2 className="text-2xl font-bold text-foreground">Live Stream</h2>
            <p className="text-text-tertiary mt-2">Select a stream to watch</p>
          </div>

          {/* Live Badge */}
          {isLive && (
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-error px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-semibold">LIVE</span>
            </div>
          )}

          {/* Stream Info */}
          {isLive && (
            <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-lg font-bold text-white">Tech Talk Live</h3>
              <p className="text-sm text-gray-200 mt-1">
                Join us for an exciting discussion about the latest tech trends
              </p>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-200">
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>{viewers.toLocaleString()} watching</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stream Controls and Chat */}
        <div className="border-t border-border bg-primary-light flex">
          {/* Controls */}
          <div className="flex-1 p-4 border-r border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <button
                  className="p-2 hover:bg-primary-lighter rounded-lg transition-colors text-text-secondary"
                  title="Like"
                >
                  <Heart size={20} />
                </button>
                <button
                  className="p-2 hover:bg-primary-lighter rounded-lg transition-colors text-text-secondary"
                  title="Share"
                >
                  <Share2 size={20} />
                </button>
                <button
                  className="p-2 hover:bg-primary-lighter rounded-lg transition-colors text-text-secondary"
                  title="Settings"
                >
                  <Settings size={20} />
                </button>
              </div>

              <button
                onClick={() => setIsLive(!isLive)}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  isLive ? "bg-error text-white hover:bg-red-600" : "bg-accent text-white hover:bg-accent-hover"
                }`}
              >
                {isLive ? "Stop Stream" : "Start Stream"}
              </button>
            </div>

            {/* Viewer List Toggle */}
            <button
              onClick={() => setShowViewers(!showViewers)}
              className="w-full flex items-center gap-2 px-3 py-2 bg-primary-lighter hover:bg-primary-lighter rounded-lg transition-colors text-text-secondary text-sm"
            >
              <Eye size={16} />
              <span>View Audience ({viewers.toLocaleString()})</span>
            </button>

            {/* Viewer List */}
            {showViewers && (
              <div className="mt-3 bg-primary-lighter rounded-lg p-3 max-h-40 overflow-y-auto">
                <p className="text-xs text-text-tertiary font-semibold mb-2">Active Viewers</p>
                <div className="space-y-2">
                  {mockViewers.map((viewer) => (
                    <div key={viewer.id} className="flex items-center gap-2">
                      <span className="text-lg">{viewer.avatar}</span>
                      <span className="text-sm text-foreground">{viewer.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Live Chat */}
          <div className="w-80 flex flex-col border-l border-border">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Live Chat</h3>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="text-sm">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-accent text-xs">{msg.user}</span>
                    <span className="text-text-tertiary text-xs">{msg.timestamp}</span>
                  </div>
                  <p className="text-foreground text-sm mt-1">{msg.message}</p>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendChat()}
                  placeholder="Send a message..."
                  className="flex-1 bg-primary-lighter border border-border rounded px-3 py-2 text-sm text-foreground placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button
                  onClick={handleSendChat}
                  className="p-2 bg-accent hover:bg-accent-hover rounded transition-colors text-white"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
