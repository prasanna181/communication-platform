// hooks/useCallManager.ts
import { useEffect, useRef, useState } from "react";
import { socket } from "@/lib/services/socket";
import { Utils } from "@/lib/services/storage";

export type CallType = "audio" | "video";

interface IncomingCall {
  fromUserId: number;
  callType: CallType;
  offer: RTCSessionDescriptionInit;
}

interface UseCallManagerResult {
  inCall: boolean;
  callType: CallType | null;
  isCaller: boolean;
  incomingCall: IncomingCall | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isCallModalOpen: boolean;
  isMaximized: boolean;
  startCall: (toUserId: number, callType: CallType) => Promise<void>;
  acceptCall: () => Promise<void>;
  rejectCall: () => void;
  endCall: () => void;
  toggleMaximize: () => void;
  muteAudio: () => void;
  toggleVideo: () => void;
}

export function useCallManager(): UseCallManagerResult {
  const [inCall, setInCall] = useState(false);
  const [callType, setCallType] = useState<CallType | null>(null);
  const [isCaller, setIsCaller] = useState(false);
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const peerRef = useRef<RTCPeerConnection | null>(null);
  const currentUserIdRef = useRef<number | null>(null);
  const otherUserIdRef = useRef<number | null>(null);

  useEffect(() => {
    (async () => {
      const id = await Utils.getItem("id");
      currentUserIdRef.current = Number(id);
    })();
  }, []);

  useEffect(() => {
    // Incoming call from backend
    socket.on("call:incoming", handleIncomingCall);
    socket.on("call:answered", handleCallAnswered);
    socket.on("call:rejected", handleCallRejected);
    socket.on("call:ice-candidate", handleRemoteIceCandidate);
    socket.on("call:ended", handleRemoteEnd);

    return () => {
      socket.off("call:incoming", handleIncomingCall);
      socket.off("call:answered", handleCallAnswered);
      socket.off("call:rejected", handleCallRejected);
      socket.off("call:ice-candidate", handleRemoteIceCandidate);
      socket.off("call:ended", handleRemoteEnd);
    };
  }, []);

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (event) => {
      if (
        event.candidate &&
        otherUserIdRef.current &&
        currentUserIdRef.current
      ) {
        socket.emit("call:ice-candidate", {
          toUserId: otherUserIdRef.current,
          fromUserId: currentUserIdRef.current,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      const [stream] = event.streams;
      setRemoteStream(stream);
    };

    peerRef.current = pc;
    return pc;
  };

  const getMediaStream = async (type: CallType) => {
    const constraints: MediaStreamConstraints = {
      audio: true,
      video: type === "video",
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    setLocalStream(stream);

    if (!peerRef.current) createPeerConnection();
    const pc = peerRef.current!;
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    return stream;
  };

  const startCall = async (toUserId: number, type: CallType) => {
    if (!currentUserIdRef.current) return;

    setIsCaller(true);
    setCallType(type);
    otherUserIdRef.current = toUserId;
    setIsCallModalOpen(true);
    setInCall(false); // not connected yet

    const pc = createPeerConnection();
    await getMediaStream(type);

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit("call:initiate", {
      toUserId,
      fromUserId: currentUserIdRef.current,
      callType: type,
      offer,
    });
  };

  const handleIncomingCall = (payload: any) => {
    const { fromUserId, callType, offer } = payload;
    otherUserIdRef.current = fromUserId;
    setIncomingCall({ fromUserId, callType, offer });
    setCallType(callType);
    setIsCaller(false);
    setIsCallModalOpen(true);
    setInCall(false);
  };

  const acceptCall = async () => {
    if (!incomingCall || !currentUserIdRef.current || !otherUserIdRef.current)
      return;

    const pc = createPeerConnection();
    await getMediaStream(incomingCall.callType);

    await pc.setRemoteDescription(
      new RTCSessionDescription(incomingCall.offer)
    );

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socket.emit("call:answer", {
      toUserId: incomingCall.fromUserId,
      fromUserId: currentUserIdRef.current,
      answer,
    });

    setIncomingCall(null);
    setInCall(true);
  };

  const handleCallAnswered = async (payload: any) => {
    const { answer } = payload;
    if (!peerRef.current) return;

    await peerRef.current.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
    setInCall(true);
  };

  const rejectCall = () => {
    if (!incomingCall || !currentUserIdRef.current) return;

    socket.emit("call:reject", {
      toUserId: incomingCall.fromUserId,
      fromUserId: currentUserIdRef.current,
    });

    cleanup();
  };

  const handleCallRejected = () => {
    // caller side
    cleanup();
  };

  const handleRemoteIceCandidate = async (payload: any) => {
    const { candidate } = payload;
    if (peerRef.current && candidate) {
      try {
        await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Error adding received ice candidate", err);
      }
    }
  };

  const endCall = () => {
    if (currentUserIdRef.current && otherUserIdRef.current) {
      socket.emit("call:end", {
        toUserId: otherUserIdRef.current,
        fromUserId: currentUserIdRef.current,
      });
    }
    cleanup();
  };

  const handleRemoteEnd = () => {
    cleanup();
  };

  const cleanup = () => {
    setInCall(false);
    setCallType(null);
    setIncomingCall(null);
    setIsCallModalOpen(false);
    setIsMaximized(false);
    setRemoteStream(null);

    if (peerRef.current) {
      peerRef.current.getSenders().forEach((sender) => sender.track?.stop());
      peerRef.current.close();
      peerRef.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
      setLocalStream(null);
    }
  };

  const toggleMaximize = () => setIsMaximized((prev) => !prev);

  const muteAudio = () => {
    if (!localStream) return;
    localStream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
  };

  const toggleVideo = () => {
    if (!localStream) return;
    localStream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
  };

  return {
    inCall,
    callType,
    isCaller,
    incomingCall,
    localStream,
    remoteStream,
    isCallModalOpen,
    isMaximized,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    toggleMaximize,
    muteAudio,
    toggleVideo,
  };
}
