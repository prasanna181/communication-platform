"use client";

import { useState, useEffect, useRef } from "react";
import { Check, CheckCheck, Clock } from "lucide-react";
import { apiCall } from "@/lib/services/api-client";
import { Utils } from "@/lib/services/storage";
import { socket } from "@/lib/services/socket";

interface Message {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  type?: string;
  originalName?: string;
  fileType?: string;
  fileSize?: string;

  status?: "sending" | "sent" | "delivered" | "read";
}

interface ChatWindowProps {
  chatId: number;
  receiverId: number;
}

const mockMessages: Message[] = [
  {
    id: 1,
    sender: "John Doe",
    text: "Hey, how are you?",
    timestamp: "10:30 AM",
    isOwn: false,
    status: "read",
  },
  {
    id: 2,
    sender: "You",
    text: "I'm doing great! How about you?",
    timestamp: "10:31 AM",
    isOwn: true,
    status: "read",
  },
  {
    id: 3,
    sender: "John Doe",
    text: "Pretty good! Want to grab coffee later?",
    timestamp: "10:32 AM",
    isOwn: false,
    status: "read",
  },
  {
    id: 4,
    sender: "You",
    text: "Let's meet at 3 PM",
    timestamp: "10:33 AM",
    isOwn: true,
    status: "delivered",
  },
];

export default function ChatWindow({ chatId, receiverId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const loadingMoreRef = useRef(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const skipAutoScrollRef = useRef(false);
    const firstLoadRef = useRef(true);

  useEffect(() => {
    if (skipAutoScrollRef.current) {
      skipAutoScrollRef.current = false;
      return;
    }

    if (firstLoadRef.current) {
      scrollToBottom();
      firstLoadRef.current = false; // only first load
    }
  }, [messages]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIsTyping(true);
  //     setTimeout(() => setIsTyping(false), 2000);
  //   }, 3000);
  //   return () => clearTimeout(timer);
  // }, []);

  useEffect(() => {
    if (!chatId) return;
    setPage(1);
    setHasMore(true);
      firstLoadRef.current = true;
    getAllMessages(1);

    console.log("Joining room:", chatId);
    socket.emit("join_conversation", chatId);
  }, [chatId]);

  useEffect(() => {
    if (!chatId) return;

    let isMounted = true;

    const handleNewMessage = async (msg: any) => {
      console.log("New message received:", msg);

      const currentUserId = Number(await Utils.getItem("id"));

      if (!isMounted) return;

      console.log(msg, "........................msg,,,,,,,hello");

      setMessages((prev) => [
        ...prev,
        {
          id: msg.id,
          sender:
            msg.senderId == Number(currentUserId)
              ? "You"
              : msg?.user?.name || "User",
          text: msg.message,
          type: msg.type,
          fileType: msg.fileType,
          fileSize: msg.fileSize,
          originalName: msg.originalName,
          timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isOwn: msg.senderId == Number(currentUserId),
          status: "sent",
        },
      ]);
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      isMounted = false;
      socket.off("new_message", handleNewMessage); // CLEANUP
    };
  }, [chatId]);

  useEffect(() => {
    if (!chatId) return;

    socket.on("typing", (data) => {
      if (Number(data.conversationId) != Number(chatId)) return;
      console.log(
        data.conversationId,
        Number(chatId),
        "...............ids for chat inside typing event"
      );
      setOtherUserTyping(true);
    });

    socket.on("stop_typing", (data) => {
      if (data.conversationId != Number(chatId)) return;
      setOtherUserTyping(false);
    });

    return () => {
      socket.off("typing");
      socket.off("stop_typing");
    };
  }, [chatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getAllMessages = async (pageNumber: number) => {
    try {
      setLoading(true);

      if (!chatId || loadingMoreRef.current) return;

      loadingMoreRef.current = true;

      const response: any = await apiCall({
        endPoint: `messages/${chatId}`,
        method: "GET",
        params: {
          page: pageNumber,
          perPage: 20,
        },
      });

      const currentUserId = await Utils.getItem("id");
      if (response.success && response.data) {
        let newMessages = response.data.messages
          .map((msg: any) => ({
            id: msg.id,
            sender:
              msg.senderId == Number(currentUserId) ? "You" : msg?.user?.name,
            text: msg.message,
            type: msg.type,
            fileType: msg.fileType,
            fileSize: msg.fileSize,
            originalName: msg.originalName,
            timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isOwn: msg.senderId == Number(currentUserId),
            status: "read",
          }))
          .reverse();

        if (pageNumber === 1) {
          setMessages(newMessages);
        } else {
          skipAutoScrollRef.current = true;
          setMessages((prev) => [...newMessages, ...prev]);
        }

        if (newMessages.length < 20) setHasMore(false);

        loadingMoreRef.current = false;
      } else if (!response.success) {
        setError(response.message);
      }
    } catch (error: any) {
      console.error("Error in retrieving messages", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderMessageContent = (msg: Message) => {
    // FILE MESSAGE
    if (msg.type === "file") {
      // IMAGE
      if (msg.fileType?.startsWith("image/")) {
        return (
          <img
            src={msg.text}
            alt="image"
            className="rounded-lg max-w-[200px] cursor-pointer"
          />
        );
      }

      // VIDEO
      if (msg.fileType?.startsWith("video/")) {
        return (
          <video controls className="max-w-[200px] rounded-lg">
            <source src={msg.text} type={msg.fileType} />
          </video>
        );
      }

      // PDF OR OTHER DOCUMENTS
      return (
        <a
          href={msg.text}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-blue-500"
        >
          📄 {msg.originalName || "Download File"}
        </a>
      );
    }

    // TEXT MESSAGE
    return <p>{msg.text}</p>;
  };

  const handleScroll = () => {
    if (!containerRef.current || !hasMore) return;

    // If user reached top
    if (containerRef.current.scrollTop === 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      preserveScrollPositionWhileLoading(nextPage);
    }
  };

  const preserveScrollPositionWhileLoading = async (nextPage: number) => {
    const container = containerRef.current;
    if (!container) return;

    const oldHeight = container.scrollHeight;

    await getAllMessages(nextPage);

    // Wait frame
    requestAnimationFrame(() => {
      const newHeight = container.scrollHeight;
      container.scrollTop = newHeight - oldHeight;
    });
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "sending":
        return <Clock size={14} className="text-text-tertiary" />;
      case "sent":
        return <Check size={14} className="text-text-tertiary" />;
      case "delivered":
        return <CheckCheck size={14} className="text-text-tertiary" />;
      case "read":
        return <CheckCheck size={14} className="text-accent" />;
      default:
        return null;
    }
  };

  const groupedMessages = messages.reduce((groups, msg) => {
    const lastGroup = groups[groups.length - 1];

    if (lastGroup && lastGroup[0].isOwn === msg.isOwn) {
      lastGroup.push(msg);
    } else {
      groups.push([msg]);
    }

    return groups;
  }, [] as Message[][]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col"
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="w-14 h-14 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {groupedMessages.map((group, index) => (
        <div
          key={index}
          className={`flex ${group[0].isOwn ? "justify-start" : "justify-end"}`}
        >
          <div className="max-w-xs space-y-1">
            {/* show sender name for OTHER user */}

            <p className="text-xs text-text-tertiary mb-1">{group[0].sender}</p>

            {/* message bubbles */}
            {group.map((msg) => (
              <div key={msg.id} className="flex items-end gap-2">
                <div
                  className={`px-4 py-2 rounded-lg text-sm ${
                    msg.isOwn
                      ? "bg-primary-lighter text-foreground rounded-bl-none"
                      : "bg-accent text-white rounded-br-none"
                  }`}
                >
                  {renderMessageContent(msg)}
                </div>

                {!msg.isOwn && (
                  <div className="flex items-end pb-1">
                    {getStatusIcon(msg.status)}
                  </div>
                )}
              </div>
            ))}

            {/* timestamp */}
            <p
              className={`text-xs ${
                group[0].isOwn ? "text-left" : "text-right"
              } text-text-tertiary`}
            >
              {group[group.length - 1].timestamp}
            </p>
          </div>
        </div>
      ))}
      {otherUserTyping && (
        <div className="flex gap-1 text-text-tertiary ml-2">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
