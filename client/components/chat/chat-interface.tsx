"use client";

import { useEffect, useRef, useState } from "react";
import {
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreVertical,
} from "lucide-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import ChatList, { IChatList } from "./chat-list";
import ChatWindow from "./chat-window";
import { apiCall } from "@/lib/services/api-client";
import { socket } from "@/lib/services/socket";
import { Utils } from "@/lib/services/storage";
import { useRouter } from "next/navigation";

export default function ChatInterface() {
  const [selectedChat, setSelectedChat] = useState<IChatList | null>(null);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const typingTimeoutRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);


  const handleTyping = (e: any) => {
    const value = e.target.value;

    console.log(value, "................value");
    setMessage(value);

    emitTypingEvent(); // run async work here
  };

  const emitTypingEvent = async () => {
    const currentUserId = Number(await Utils.getItem("id"));

    if (!selectedChat?.chatId) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", {
        conversationId: selectedChat?.chatId,
        userId: currentUserId,
      });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(async () => {
      setIsTyping(false);

      socket.emit("stop_typing", {
        conversationId: selectedChat?.chatId,
        userId: currentUserId,
      });
    }, 1000);
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      console.log("Sending message:", message);

      const currentUserId = Number(await Utils.getItem("id"));
      try {
        socket.emit("send_message", {
          conversationId: selectedChat?.chatId,
          senderId: currentUserId,
          message,
          type: 'text'
        });
      } catch (error) {
        console.error("Error in sending message", error);
      }

      setMessage("");
    }
  };

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file || !selectedChat?.chatId) return;

    const formData = new FormData();
    formData.append("file", file);

    const response = await apiCall({
      endPoint: `messages/send-file/${selectedChat.chatId}`,
      method: "POST",
      data: formData,
      isMultipart: true,
    });

    // Broadcast via socket
    const currentUserId = Number(await Utils.getItem("id"));

    socket.emit("send_message", {
      conversationId: selectedChat.chatId,
      senderId: currentUserId,
      message: response.data.message, // fileUrl
      type: "file",
    });
  };



  const chatDetails: Record<
    string,
    { name: string; status: string; avatar: string }
  > = {
    "chat-1": { name: "John Doe", status: "Active now", avatar: "👤" },
    "chat-2": { name: "Team Project", status: "3 members", avatar: "👥" },
    "chat-3": { name: "Sarah Smith", status: "Active 2m ago", avatar: "👤" },
    "chat-4": { name: "Design Team", status: "5 members", avatar: "👥" },
  };

  return (
    <div className="flex h-full bg-background">
      {/* Chat List */}
      <ChatList selectedChat={selectedChat} setSelectedChat={setSelectedChat} />

      {/* Chat Window */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col">
          <div className="border-b border-border p-4 bg-primary-light flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* <div className="text-2xl">{currentChat?.avatar}</div> */}
              <div>
                <h2 className="font-semibold text-foreground">
                  {selectedChat?.name}
                </h2>
                {/* <p className="text-xs text-text-tertiary">
                  {currentChat?.status}
                </p> */}
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

          <ChatWindow
            chatId={selectedChat.chatId}
            receiverId={selectedChat.userId}
          />

          {/* Message Input */}
          <div className="border-t border-border p-4 bg-primary-light">
            <div className="flex items-end gap-3">
              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 hover:bg-primary-lighter rounded-lg transition-colors text-text-secondary"
                >
                  <Paperclip size={20} />
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="image/*,application/pdf,video/*"
                />

                <button
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                  className="p-2 hover:bg-primary-lighter rounded-lg transition-colors text-text-secondary"
                >
                  <Smile size={20} />
                </button>
              </div>

              {showEmojiPicker && (
                <div className="absolute bottom-16 left-10 z-50">
                  <Picker
                    data={data}
                    onEmojiSelect={(emoji: any) => {
                      setMessage((prev) => prev + emoji.native);
                    }}
                    theme="light"
                  />
                </div>
              )}

              <input
                type="text"
                value={message}
                onChange={(e) => handleTyping(e)}
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
          {/* EMPTY STATE */}
          <div className="flex flex-1 flex-col items-center justify-center text-center px-6">
            <div className="w-24 h-24 rounded-full bg-primary-lighter flex items-center justify-center shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4 8-9 8a9.77 9.77 0 01-4-.8L3 20l1.3-3.5A7.6 7.6 0 013 12c0-4.418 4-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>

            <h2 className="mt-6 text-2xl font-semibold text-foreground">
              Your messages live here
            </h2>

            <p className="mt-2 text-text-tertiary max-w-sm">
              Select a chat from the left to start messaging. You can send text,
              files, emojis, and more!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
