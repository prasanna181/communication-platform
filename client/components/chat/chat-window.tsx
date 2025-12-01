"use client";

import { useState, useEffect } from "react";
import { Check, CheckCheck, Clock } from "lucide-react";
import { apiCall } from "@/lib/services/api-client";
import { Utils } from "@/lib/services/storage";

interface Message {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
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
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2000);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    getAllMessages();
  }, [chatId]);

  const getAllMessages = async () => {
    try {
      setLoading(true);

      const response: any = await apiCall({
        endPoint: `messages/${chatId}`,
        method: "GET",
        params: {
          page: 1,
          perPage: 20,
        },
      });

      const currentUserId = await Utils.getItem("id");
      if (response.success && response.data) {
        setMessages(
          response.data.messages
            .map((msg: any) => ({
              id: msg.id,
              sender:
                msg.senderId == Number(currentUserId) ? "You" : msg?.user?.name,
              text: msg.message,
              timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              isOwn: msg.senderId == Number(currentUserId),
              status: "read",
            }))
            .reverse()
        );
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
    <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
      {groupedMessages.map((group, index) => (
        <div
          key={index}
          className={`flex ${group[0].isOwn ? "justify-start" : "justify-end"}`}
        >
          <div className="max-w-xs space-y-1">
            {/* show sender name for OTHER user */}
            {!group[0].isOwn && (
              <p className="text-xs text-text-tertiary mb-1">
                {group[0].sender}
              </p>
            )}

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
                  {msg.text}
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
    </div>
  );
}
