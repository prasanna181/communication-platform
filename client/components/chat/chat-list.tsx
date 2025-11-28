"use client"

import { Search, Plus } from "lucide-react"

interface ChatListProps {
  selectedChat: string | null
  setSelectedChat: (id: string) => void
}

const mockChats = [
  { id: "chat-1", name: "John Doe", lastMessage: "Hey, how are you?", unread: 2, avatar: "👤" },
  { id: "chat-2", name: "Team Project", lastMessage: "Meeting at 3 PM", unread: 0, avatar: "👥" },
  { id: "chat-3", name: "Sarah Smith", lastMessage: "Thanks for the update", unread: 1, avatar: "👤" },
  { id: "chat-4", name: "Design Team", lastMessage: "New mockups ready", unread: 0, avatar: "👥" },
]

export default function ChatList({ selectedChat, setSelectedChat }: ChatListProps) {
  return (
    <div className="w-80 border-r border-border bg-primary-light flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Messages</h2>
          <button className="p-2 hover:bg-primary-lighter rounded-lg transition-colors">
            <Plus size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full bg-primary-lighter border border-border rounded-lg pl-10 pr-4 py-2 text-foreground placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      {/* Chat Items */}
      <div className="flex-1 overflow-y-auto">
        {mockChats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => setSelectedChat(chat.id)}
            className={`w-full p-4 border-b border-border transition-colors text-left ${
              selectedChat === chat.id ? "bg-primary-lighter" : "hover:bg-primary-lighter"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{chat.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{chat.name}</h3>
                  {chat.unread > 0 && (
                    <span className="bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-tertiary truncate">{chat.lastMessage}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
