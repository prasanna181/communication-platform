"use client"

import { useState, useEffect } from "react"
import { PhoneOff, Mic, MicOff, Video, VideoOff, Share2, Signal } from "lucide-react"
import CallList from "./call-list"

type CallStatus = "idle" | "incoming" | "active"

export default function CallInterface() {
  const [callStatus, setCallStatus] = useState<CallStatus>("idle")
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [callDuration, setCallDuration] = useState(0)
  const [callQuality, setCallQuality] = useState<"excellent" | "good" | "fair">("excellent")

  useEffect(() => {
    if (callStatus === "active") {
      const interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [callStatus])

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "excellent":
        return "text-success"
      case "good":
        return "text-warning"
      case "fair":
        return "text-error"
      default:
        return "text-text-tertiary"
    }
  }

  return (
    <div className="flex h-full bg-background">
      {/* Call List */}
      <CallList setCallStatus={setCallStatus} />

      {/* Call Window */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-primary-light to-primary-lighter relative">
        {callStatus === "idle" ? (
          <div className="text-center">
            <div className="text-6xl mb-4">📞</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Ready for a call?</h2>
            <p className="text-text-tertiary">Select a contact to start calling</p>
          </div>
        ) : callStatus === "incoming" ? (
          <div className="flex flex-col items-center gap-8">
            <div className="w-32 h-32 bg-primary-lighter rounded-full border-4 border-accent flex items-center justify-center animate-pulse">
              <div className="text-6xl">👤</div>
            </div>

            <div className="text-center">
              <h3 className="text-3xl font-bold text-foreground mb-2">John Doe</h3>
              <p className="text-text-tertiary">Incoming call...</p>
            </div>

            <div className="flex gap-6">
              <button
                onClick={() => setCallStatus("active")}
                className="px-8 py-3 bg-success text-white rounded-full font-semibold hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <Mic size={20} />
                Accept
              </button>
              <button
                onClick={() => setCallStatus("idle")}
                className="px-8 py-3 bg-error text-white rounded-full font-semibold hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <PhoneOff size={20} />
                Decline
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8 w-full h-full p-8">
            {/* Call Header */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Signal className={`${getQualityColor(callQuality)}`} size={20} />
                <span className="text-sm text-text-tertiary capitalize">{callQuality} connection</span>
              </div>
              <div className="text-lg font-semibold text-foreground">{formatDuration(callDuration)}</div>
            </div>

            {/* Video Preview */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-80 h-80 bg-primary-lighter rounded-2xl border-2 border-border flex items-center justify-center shadow-lg">
                <div className="text-8xl">👤</div>
              </div>
            </div>

            {/* Call Info */}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground">John Doe</h3>
              <p className="text-text-tertiary mt-1">Call in progress</p>
            </div>

            {/* Call Controls */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-4 rounded-full transition-colors ${
                  isMuted
                    ? "bg-error text-white hover:bg-red-600"
                    : "bg-primary-lighter text-text-secondary hover:bg-primary-lighter"
                }`}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
              </button>

              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-4 rounded-full transition-colors ${
                  !isVideoOn
                    ? "bg-error text-white hover:bg-red-600"
                    : "bg-primary-lighter text-text-secondary hover:bg-primary-lighter"
                }`}
                title={isVideoOn ? "Stop video" : "Start video"}
              >
                {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
              </button>

              <button
                className="p-4 rounded-full bg-primary-lighter text-text-secondary hover:bg-primary-lighter transition-colors"
                title="Share screen"
              >
                <Share2 size={24} />
              </button>

              <button
                onClick={() => {
                  setCallStatus("idle")
                  setCallDuration(0)
                }}
                className="p-4 rounded-full bg-error text-white hover:bg-red-600 transition-colors"
                title="End call"
              >
                <PhoneOff size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
