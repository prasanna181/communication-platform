"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@/lib/services/api-client";
import { socket } from "@/lib/services/socket";
import { Utils } from "@/lib/services/storage";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [users, setUsers] = useState<any[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      const id = Number(await Utils.getItem("id"));
      setCurrentUserId(id);

      loadUsers();
      loadFriendRequests();
      loadFriends();
      setupSocketListeners(id);
    })();
  }, []);

  const loadUsers = async () => {
    const res = await apiCall({ endPoint: "/users/all_users", method: "GET" });
    if (res.success) setUsers(res.data.users || []);
  };

  const loadFriendRequests = async () => {
    const res = await apiCall({
      endPoint: "/friends/my_friend_requests",
      method: "GET",
    });
    if (res.success) {
      setIncomingRequests(res.data.requestMadeToUser || []);
      setOutgoingRequests(res.data.requestMadeByUser || []);
    }
  };

  const loadFriends = async () => {
    const res = await apiCall({
      endPoint: "/friends/my_friends",
      method: "GET",
    });
    if (res.success) {
      const list = (res.data || []).map((f: any) => f.friend);
      setFriends(list);
    }
  };

  const setupSocketListeners = (uid: number) => {
    socket.on("new_friend_request", ({ receiverId }) => {
      if (receiverId === uid) loadFriendRequests();
    });

    socket.on("friend_request_accepted", ({ receiverId }) => {
      if (receiverId === uid) {
        loadFriendRequests();
        loadFriends();
      }
    });
  };

  const sendFriendRequest = async (userId: number) => {
    const res = await apiCall({
      endPoint: `/friends/make_friend_request/${userId}`,
      method: "POST",
    });

    if (res.success && currentUserId) {
      socket.emit("send_friend_request", {
        senderId: currentUserId,
        receiverId: userId,
      });

      loadFriendRequests();
    }
  };

  const acceptRequest = async (reqId: number, senderId: number) => {
    const res = await apiCall({
      endPoint: `/friends/${reqId}`,
      method: "PUT",
      data: { status: "approved" },
    });

    if (res.success && currentUserId) {
      socket.emit("friend_request_accepted", {
        senderId,
        receiverId: currentUserId,
      });

      loadFriendRequests();
      loadFriends();
    }
  };

  const rejectRequest = async (reqId: number) => {
    await apiCall({
      endPoint: `/friends/${reqId}`,
      method: "PUT",
      data: { status: "rejected" },
    });

    loadFriendRequests();
  };

  const isFriend = (userId: number) =>
    Array.isArray(friends) && friends.some((f: any) => f.id === userId);

  const isOutgoingRequest = (userId: number) =>
    outgoingRequests.some((r: any) => r.friendId === userId);

  const isIncomingRequest = (userId: number) =>
    incomingRequests.some((r: any) => r.userId === userId);

  // -------------------------
  // TABLE COMPONENT
  // -------------------------
  const Table = ({ rows, type }: any) => (
    <table className="w-full border-collapse mt-4">
      <thead>
        <tr className="bg-primary-light border">
          <th className="p-3 text-left">User</th>
          <th className="p-3 text-left">Action</th>
        </tr>
      </thead>

      <tbody>
        {rows.length === 0 && (
          <tr>
            <td colSpan={2} className="p-4 text-center text-text-tertiary">
              No data found.
            </td>
          </tr>
        )}

        {rows.map((u: any) => (
          <tr key={u.id || u.userId} className="border">
            <td className="p-3">
              {u.name || u.sender?.name || u.friend?.name || u.user?.name}
            </td>

            <td className="p-3">
              {/* All Users */}
              {type === "all" && (
                <>
                  {isFriend(u.id) ? (
                    <span className="text-green-600">Friend ✓</span>
                  ) : isOutgoingRequest(u.id) ? (
                    <span className="text-yellow-600">Pending…</span>
                  ) : isIncomingRequest(u.id) ? (
                    <span className="text-yellow-600">Sent you a request</span>
                  ) : (
                    <button
                      onClick={() => sendFriendRequest(u.id)}
                      className="px-2 py-1 bg-accent text-white rounded"
                    >
                      Add Friend
                    </button>
                  )}
                </>
              )}

              {/* Incoming Requests */}
              {type === "incoming" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => acceptRequest(u.id, u.userId)}
                    className="px-2 py-1 bg-green-600 text-white rounded"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => rejectRequest(u.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded"
                  >
                    Reject
                  </button>
                </div>
              )}

              {/* Outgoing Requests */}
              {type === "outgoing" && (
                <span className="text-yellow-600">Pending…</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // -------------------------
  // UI WITH TABS
  // -------------------------
  return (
    <div className="p-6">
      <button
        onClick={() => router.push("/dashboard")}
        className="flex items-center gap-2 text-accent hover:text-accent-hover mb-4"
      >
        <ArrowLeft size={20} />
        <span>Back to Dashboard</span>
      </button>

      <h1 className="text-2xl font-semibold mb-4">Find Friends</h1>

      {/* TABS */}
      <div className="flex gap-4 border-b pb-2">
        <button
          onClick={() => setActiveTab("all")}
          className={`pb-2 ${
            activeTab === "all" ? "border-b-2 border-accent font-semibold" : ""
          }`}
        >
          All Users
        </button>

        <button
          onClick={() => setActiveTab("incoming")}
          className={`pb-2 ${
            activeTab === "incoming"
              ? "border-b-2 border-accent font-semibold"
              : ""
          }`}
        >
          Incoming Requests
        </button>

        <button
          onClick={() => setActiveTab("outgoing")}
          className={`pb-2 ${
            activeTab === "outgoing"
              ? "border-b-2 border-accent font-semibold"
              : ""
          }`}
        >
          Sent Requests
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === "all" && (
        <Table rows={users.filter((u) => u.id !== currentUserId)} type="all" />
      )}

      {activeTab === "incoming" && (
        <Table rows={incomingRequests} type="incoming" />
      )}

      {activeTab === "outgoing" && (
        <Table rows={outgoingRequests} type="outgoing" />
      )}
    </div>
  );
}
