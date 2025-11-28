"use client"

import { Phone, Video, Trash2 } from "lucide-react"

interface CallListProps {
  setCallStatus: (status: "idle" | "incoming" | "active") => void
}

const mockCalls = [
  { id: 1, name: "John Doe", type: "video", duration: "45 min", avatar: "👤", date: "Today" },
  { id: 2, name: "Sarah Smith", type: "audio", duration: "12 min", avatar: "👤", date: "Today" },
  { id: 3, name: "Team Meeting", type: "video", duration: "1 hour", avatar: "👥", date: "Yesterday" },
  { id: 4, name: "Client Call", type: "audio", duration: "30 min", avatar: "👤", date: "Yesterday" },
]

export default function CallList({ setCallStatus }: CallListProps) {
  return (
    <div className="w-80 border-r border-border bg-primary-light flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold">Recent Calls</h2>
      </div>

      {/* Call Items */}
      <div className="flex-1 overflow-y-auto">
        {mockCalls.map((call) => (
          <div key={call.id} className="p-4 border-b border-border hover:bg-primary-lighter transition-colors group">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{call.avatar}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">{call.name}</h3>
                <div className="flex items-center gap-2 text-sm text-text-tertiary">
                  {call.type === "video" ? <Video size={14} /> : <Phone size={14} />}
                  <span>{call.duration}</span>
                  <span className="text-xs">• {call.date}</span>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setCallStatus("active")}
                  className="p-2 hover:bg-primary-lighter rounded-lg transition-colors"
                  title="Call again"
                >
                  <Phone size={18} className="text-accent" />
                </button>
                <button className="p-2 hover:bg-primary-lighter rounded-lg transition-colors" title="Delete">
                  <Trash2 size={18} className="text-error" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
