"use client"

import { Radio, Users } from "lucide-react"

interface StreamListProps {
  setIsLive: (live: boolean) => void
}

const mockStreams = [
  { id: 1, title: "Tech Talk Live", streamer: "Alex Johnson", viewers: 5234, avatar: "👤", isLive: true },
  { id: 2, title: "Design Workshop", streamer: "Emma Davis", viewers: 2156, avatar: "👤", isLive: true },
  { id: 3, title: "Coding Session", streamer: "Mike Chen", viewers: 1890, avatar: "👤", isLive: true },
  { id: 4, title: "Q&A Session", streamer: "Lisa Park", viewers: 3421, avatar: "👤", isLive: false },
]

export default function StreamList({ setIsLive }: StreamListProps) {
  return (
    <div className="w-80 border-r border-border bg-primary-light flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold">Live Streams</h2>
      </div>

      {/* Stream Items */}
      <div className="flex-1 overflow-y-auto">
        {mockStreams.map((stream) => (
          <button
            key={stream.id}
            onClick={() => setIsLive(stream.isLive)}
            className="w-full p-4 border-b border-border hover:bg-primary-lighter transition-colors text-left"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl relative">
                {stream.avatar}
                {stream.isLive && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-error rounded-full border border-primary-light"></div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{stream.title}</h3>
                <p className="text-sm text-text-tertiary">{stream.streamer}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-text-secondary">
                  <Users size={12} />
                  <span>{stream.viewers.toLocaleString()} watching</span>
                </div>
              </div>
              {stream.isLive && (
                <div className="flex items-center gap-1 bg-error/20 text-error px-2 py-1 rounded text-xs font-semibold">
                  <Radio size={12} />
                  LIVE
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
