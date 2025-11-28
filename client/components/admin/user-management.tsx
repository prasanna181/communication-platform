"use client"

import { Search, Edit, Shield, Ban } from "lucide-react"
import { useState } from "react"

interface User {
  id: number
  name: string
  email: string
  role: "user" | "moderator" | "admin"
  status: "active" | "inactive" | "banned"
  joinDate: string
  lastActive: string
  messageCount: number
}

const mockUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    status: "active",
    joinDate: "2024-01-15",
    lastActive: "2 hours ago",
    messageCount: 342,
  },
  {
    id: 2,
    name: "Sarah Smith",
    email: "sarah@example.com",
    role: "moderator",
    status: "active",
    joinDate: "2024-02-20",
    lastActive: "30 minutes ago",
    messageCount: 1205,
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "user",
    status: "inactive",
    joinDate: "2024-03-10",
    lastActive: "5 days ago",
    messageCount: 89,
  },
  {
    id: 4,
    name: "Emma Davis",
    email: "emma@example.com",
    role: "user",
    status: "active",
    joinDate: "2024-01-25",
    lastActive: "1 hour ago",
    messageCount: 567,
  },
]

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<"all" | "user" | "moderator" | "admin">("all")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive" | "banned">("all")

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || user.role === filterRole
    const matchesStatus = filterStatus === "all" || user.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/20 text-success"
      case "inactive":
        return "bg-warning/20 text-warning"
      case "banned":
        return "bg-error/20 text-error"
      default:
        return "bg-text-tertiary/20 text-text-tertiary"
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-primary-light border border-border rounded-lg pl-10 pr-4 py-2 text-foreground placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <button className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors font-semibold">
            Add User
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3 flex-wrap">
          <div className="flex gap-2">
            <span className="text-sm text-text-tertiary font-semibold">Role:</span>
            {["all", "user", "moderator", "admin"].map((role) => (
              <button
                key={role}
                onClick={() => setFilterRole(role as any)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filterRole === role
                    ? "bg-accent text-white"
                    : "bg-primary-light border border-border text-text-secondary hover:text-foreground"
                }`}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <span className="text-sm text-text-tertiary font-semibold">Status:</span>
            {["all", "active", "inactive", "banned"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status as any)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filterStatus === status
                    ? "bg-accent text-white"
                    : "bg-primary-light border border-border text-text-secondary hover:text-foreground"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-primary-light border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-primary-lighter border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Last Active</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Messages</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-border hover:bg-primary-lighter transition-colors">
                <td className="px-6 py-4 text-foreground font-medium">{user.name}</td>
                <td className="px-6 py-4 text-text-secondary text-sm">{user.email}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-primary-lighter rounded-full text-xs font-semibold text-accent capitalize">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(user.status)}`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-text-secondary text-sm">{user.lastActive}</td>
                <td className="px-6 py-4 text-foreground text-sm">{user.messageCount}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      className="p-2 hover:bg-primary-lighter rounded-lg transition-colors text-text-secondary hover:text-foreground"
                      title="Edit user"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="p-2 hover:bg-primary-lighter rounded-lg transition-colors text-text-secondary hover:text-foreground"
                      title="Change role"
                    >
                      <Shield size={16} />
                    </button>
                    <button
                      className="p-2 hover:bg-primary-lighter rounded-lg transition-colors text-text-secondary hover:text-error"
                      title="Ban user"
                    >
                      <Ban size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="p-8 text-center text-text-tertiary">
            <p>No users found matching your filters</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-primary-light border border-border rounded-lg p-4">
          <p className="text-text-tertiary text-sm mb-1">Total Users</p>
          <p className="text-2xl font-bold text-foreground">{mockUsers.length}</p>
        </div>
        <div className="bg-primary-light border border-border rounded-lg p-4">
          <p className="text-text-tertiary text-sm mb-1">Active Users</p>
          <p className="text-2xl font-bold text-success">{mockUsers.filter((u) => u.status === "active").length}</p>
        </div>
        <div className="bg-primary-light border border-border rounded-lg p-4">
          <p className="text-text-tertiary text-sm mb-1">Moderators</p>
          <p className="text-2xl font-bold text-accent">{mockUsers.filter((u) => u.role === "moderator").length}</p>
        </div>
      </div>
    </div>
  )
}
