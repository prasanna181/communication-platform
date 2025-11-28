"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, Users, MessageSquare, Phone, Download } from "lucide-react"

const chartData = [
  { name: "Mon", messages: 400, calls: 240, streams: 120 },
  { name: "Tue", messages: 520, calls: 290, streams: 150 },
  { name: "Wed", messages: 480, calls: 310, streams: 180 },
  { name: "Thu", messages: 620, calls: 350, streams: 200 },
  { name: "Fri", messages: 750, calls: 420, streams: 250 },
  { name: "Sat", messages: 680, calls: 380, streams: 220 },
  { name: "Sun", messages: 590, calls: 340, streams: 190 },
]

const pieData = [
  { name: "Messages", value: 45 },
  { name: "Calls", value: 30 },
  { name: "Streams", value: 25 },
]

const engagementData = [
  { name: "Week 1", engagement: 65 },
  { name: "Week 2", engagement: 72 },
  { name: "Week 3", engagement: 68 },
  { name: "Week 4", engagement: 85 },
]

const COLORS = ["#3b82f6", "#10b981", "#f59e0b"]

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState("week")

  const stats = [
    { label: "Total Messages", value: "12,543", change: "+12%", icon: MessageSquare, color: "text-accent" },
    { label: "Active Calls", value: "342", change: "+8%", icon: Phone, color: "text-success" },
    { label: "Active Users", value: "1,234", change: "+23%", icon: Users, color: "text-info" },
    { label: "Growth", value: "+23%", change: "+5%", icon: TrendingUp, color: "text-warning" },
  ]

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
            <p className="text-text-tertiary">Track your communication metrics and performance</p>
          </div>

          {/* Date Range and Export */}
          <div className="flex gap-3">
            <div className="flex gap-2 bg-primary-light border border-border rounded-lg p-1">
              {["day", "week", "month"].map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 py-2 rounded transition-colors text-sm font-medium capitalize ${
                    dateRange === range ? "bg-accent text-white" : "text-text-secondary hover:text-foreground"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-primary-light border border-border rounded-lg hover:bg-primary-lighter transition-colors text-text-secondary">
              <Download size={18} />
              <span className="text-sm">Export</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div key={idx} className="bg-primary-light border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-text-tertiary text-sm mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <Icon className={`${stat.color} opacity-20`} size={32} />
                </div>
                <p className="text-xs text-success">{stat.change} from last period</p>
              </div>
            )
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Line Chart */}
          <div className="lg:col-span-2 bg-primary-light border border-border rounded-lg p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Activity Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
                <Legend />
                <Line type="monotone" dataKey="messages" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="calls" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="streams" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-primary-light border border-border rounded-lg p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Usage Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={{ fill: "#f1f5f9" }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Area Chart - Engagement */}
          <div className="bg-primary-light border border-border rounded-lg p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">User Engagement</h2>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
                <Area type="monotone" dataKey="engagement" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart - Weekly Comparison */}
          <div className="bg-primary-light border border-border rounded-lg p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Weekly Comparison</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
                <Legend />
                <Bar dataKey="messages" fill="#3b82f6" />
                <Bar dataKey="calls" fill="#10b981" />
                <Bar dataKey="streams" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mt-6 bg-primary-light border border-border rounded-lg p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-text-tertiary text-sm mb-2">Average Response Time</p>
              <p className="text-2xl font-bold text-foreground">245ms</p>
              <p className="text-xs text-success mt-1">-12% from last week</p>
            </div>
            <div>
              <p className="text-text-tertiary text-sm mb-2">System Uptime</p>
              <p className="text-2xl font-bold text-foreground">99.98%</p>
              <p className="text-xs text-success mt-1">Excellent</p>
            </div>
            <div>
              <p className="text-text-tertiary text-sm mb-2">User Satisfaction</p>
              <p className="text-2xl font-bold text-foreground">4.8/5.0</p>
              <p className="text-xs text-success mt-1">+0.3 from last month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
