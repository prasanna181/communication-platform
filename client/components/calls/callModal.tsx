import React, { useEffect, useRef } from "react";
import { CallType } from "@/hooks/useCallManager";
import {
  Phone,
  PhoneOff,
  Maximize2,
  Minimize2,
  Video,
  MicOff,
  Mic,
} from "lucide-react";

interface CallModalProps {
  isOpen: boolean;
  isMaximized: boolean;
  callType: CallType | null;
  inCall: boolean;
  isCaller: boolean;
  incomingCallerName?: string; // optional: fill from chat user data
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  onAccept: () => void;
  onReject: () => void;
  onEnd: () => void;
  onToggleMaximize: () => void;
  onToggleMute: () => void;
  onToggleVideo: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({
  isOpen,
  isMaximized,
  callType,
  inCall,
  isCaller,
  incomingCallerName,
  localStream,
  remoteStream,
  onAccept,
  onReject,
  onEnd,
  onToggleMaximize,
  onToggleMute,
  onToggleVideo,
}) => {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    if (callType === "audio" && remoteAudioRef.current && remoteStream) {
      remoteAudioRef.current.srcObject = remoteStream;
      remoteAudioRef.current.play().catch(() => {});
    }
  }, [remoteStream, callType]);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className={`bg-background border border-border rounded-xl shadow-lg flex flex-col transition-all ${
          isMaximized ? "w-[90vw] h-[80vh]" : "w-[380px] h-[420px]"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border">
          <div>
            <p className="text-sm text-text-tertiary">
              {callType === "video" ? "Video Call" : "Voice Call"}
            </p>
            <p className="text-base font-semibold">
              {incomingCallerName || "Calling..."}
            </p>
          </div>
          <button
            onClick={onToggleMaximize}
            className="p-1 rounded-md border border-border hover:bg-muted"
          >
            {isMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col gap-2 p-3">
          {callType === "video" ? (
            <div className="flex-1 relative rounded-lg bg-black overflow-hidden">
              {/* Remote video */}
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              {/* Local small preview */}
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="absolute bottom-3 right-3 w-28 h-20 rounded-lg border border-border object-cover"
              />
            </div>
          ) : (
            //   <div className="flex-1 flex flex-col items-center justify-center">
            //     <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center text-white text-2xl mb-3">
            //       {incomingCallerName?.[0] || "U"}
            //     </div>
            //     <p className="text-sm text-text-tertiary">
            //       {inCall
            //         ? "In call..."
            //         : isCaller
            //         ? "Calling..."
            //         : "Incoming call"}
            //     </p>
            //   </div>
            // )}

            <div className="flex-1 flex flex-col items-center justify-center">
              {/* 🔊 REMOTE AUDIO OUTPUT (critical fix) */}
              <audio
                ref={remoteAudioRef as React.RefObject<HTMLAudioElement>}
                autoPlay
                playsInline
              />

              {/* User avatar or initial */}
              <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center text-white text-2xl mb-3">
                {incomingCallerName?.[0] || "U"}
              </div>

              {/* Status text */}
              <p className="text-sm text-text-tertiary">
                {inCall
                  ? "In call..."
                  : isCaller
                  ? "Calling..."
                  : "Incoming call"}
              </p>
            </div>
          )}

        </div>

        {/* Controls */}
        <div className="p-3 border-t border-border flex items-center justify-center gap-4">
          {callType === "video" && (
            <button
              onClick={onToggleVideo}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
            >
              <Video size={18} />
            </button>
          )}
          <button
            onClick={onToggleMute}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
          >
            {/* You can manage actual mute state in parent if needed */}
            <Mic size={18} />
          </button>

          {!inCall && !isCaller && (
            <button
              onClick={onAccept}
              className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white"
            >
              <Phone size={18} />
            </button>
          )}

          <button
            onClick={inCall || isCaller ? onEnd : onReject}
            className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white"
          >
            <PhoneOff size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
