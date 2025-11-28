"use client"

import { useState } from "react"
import { Send, Paperclip, Smile, Phone, Video, MoreVertical } from "lucide-react"
import ChatList from "./chat-list"
import ChatWindow from "./chat-window"

export default function ChatInterface() {
  const [selectedChat, setSelectedChat] = useState<string | null>("chat-1")
  const [message, setMessage] = useState("")

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message)
      setMessage("")
    }
  }

  const chatDetails: Record<string, { name: string; status: string; avatar: string }> = {
    "chat-1": { name: "John Doe", status: "Active now", avatar: "👤" },
    "chat-2": { name: "Team Project", status: "3 members", avatar: "👥" },
    "chat-3": { name: "Sarah Smith", status: "Active 2m ago", avatar: "👤" },
    "chat-4": { name: "Design Team", status: "5 members", avatar: "👥" },
  }

  const currentChat = selectedChat ? chatDetails[selectedChat] : null

  return (
    <div className="flex h-full bg-background">
      {/* Chat List */}
      <ChatList selectedChat={selectedChat} setSelectedChat={setSelectedChat} />

      {/* Chat Window */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col">
          <div className="border-b border-border p-4 bg-primary-light flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{currentChat?.avatar}</div>
              <div>
                <h2 className="font-semibold text-foreground">{currentChat?.name}</h2>
                <p className="text-xs text-text-tertiary">{currentChat?.status}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-primary-lighter rounded-lg transition-colors text-text-secondary">
                <Phone size={20} />
              </button>
              <button className="p-2 hover:bg-primary-lighter rounded-lg transition-colors text-text-secondary">
                <Video size={20} />
              </button>
              <button className="p-2 hover:bg-primary-lighter rounded-lg transition-colors text-text-secondary">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>

          <ChatWindow chatId={selectedChat} />

          {/* Message Input */}
          <div className="border-t border-border p-4 bg-primary-light">
            <div className="flex items-end gap-3">
              <div className="flex gap-2">
                <button className="p-2 hover:bg-primary-lighter rounded-lg transition-colors text-text-secondary">
                  <Paperclip size={20} />
                </button>
                <button className="p-2 hover:bg-primary-lighter rounded-lg transition-colors text-text-secondary">
                  <Smile size={20} />
                </button>
              </div>

              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-primary-lighter border border-border rounded-lg px-4 py-2 text-foreground placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
              />

              <div className="flex gap-2">
                <button className="p-2 hover:bg-primary-lighter rounded-lg transition-colors text-text-secondary">
                  <Phone size={20} />
                </button>
                <button className="p-2 hover:bg-primary-lighter rounded-lg transition-colors text-text-secondary">
                  <Video size={20} />
                </button>
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-accent hover:bg-accent-hover rounded-lg transition-colors text-white"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-text-tertiary">
          <p>Select a chat to start messaging</p>
        </div>
      )}
    </div>
  )
}
