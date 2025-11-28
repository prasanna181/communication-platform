"use client"

import { Save, AlertCircle } from "lucide-react"
import { useState } from "react"

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    maxUsers: 10000,
    maxStreams: 100,
    messageRetention: 30,
    maxFileSize: 100,
    enableAnalytics: true,
    enableNotifications: true,
    enableAutoBackup: true,
    maintenanceMode: false,
  })

  const [saved, setSaved] = useState(false)

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Save Notification */}
      {saved && (
        <div className="bg-success/20 border border-success rounded-lg p-4 flex items-center gap-3">
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <p className="text-success text-sm font-medium">Settings saved successfully</p>
        </div>
      )}

      {/* General Settings */}
      <div className="bg-primary-light border border-border rounded-lg p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">General Settings</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Maximum Users</label>
            <input
              type="number"
              value={settings.maxUsers}
              onChange={(e) => handleChange("maxUsers", Number.parseInt(e.target.value))}
              className="w-full bg-primary-lighter border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <p className="text-xs text-text-tertiary mt-1">Maximum concurrent users allowed on the platform</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Maximum Concurrent Streams</label>
            <input
              type="number"
              value={settings.maxStreams}
              onChange={(e) => handleChange("maxStreams", Number.parseInt(e.target.value))}
              className="w-full bg-primary-lighter border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <p className="text-xs text-text-tertiary mt-1">Maximum live streams running simultaneously</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Message Retention (days)</label>
            <input
              type="number"
              value={settings.messageRetention}
              onChange={(e) => handleChange("messageRetention", Number.parseInt(e.target.value))}
              className="w-full bg-primary-lighter border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <p className="text-xs text-text-tertiary mt-1">How long to keep messages before deletion</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Max File Size (MB)</label>
            <input
              type="number"
              value={settings.maxFileSize}
              onChange={(e) => handleChange("maxFileSize", Number.parseInt(e.target.value))}
              className="w-full bg-primary-lighter border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <p className="text-xs text-text-tertiary mt-1">Maximum file upload size per user</p>
          </div>
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="bg-primary-light border border-border rounded-lg p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Feature Toggles</h2>

        <div className="space-y-4">
          {[
            {
              key: "enableAnalytics",
              label: "Enable Analytics",
              description: "Track user behavior and platform metrics",
            },
            {
              key: "enableNotifications",
              label: "Enable Notifications",
              description: "Send push and email notifications to users",
            },
            { key: "enableAutoBackup", label: "Enable Auto Backup", description: "Automatically backup data daily" },
            {
              key: "maintenanceMode",
              label: "Maintenance Mode",
              description: "Restrict access while performing maintenance",
            },
          ].map((toggle) => (
            <label
              key={toggle.key}
              className="flex items-start gap-3 cursor-pointer p-3 hover:bg-primary-lighter rounded-lg transition-colors"
            >
              <input
                type="checkbox"
                checked={settings[toggle.key as keyof typeof settings] as boolean}
                onChange={(e) => handleChange(toggle.key, e.target.checked)}
                className="w-4 h-4 rounded border-border bg-primary-lighter cursor-pointer mt-1"
              />
              <div className="flex-1">
                <p className="text-foreground font-medium">{toggle.label}</p>
                <p className="text-xs text-text-tertiary">{toggle.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Maintenance Warning */}
      {settings.maintenanceMode && (
        <div className="bg-warning/20 border border-warning rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-warning mt-0.5" size={20} />
          <div>
            <p className="text-warning font-semibold">Maintenance Mode Active</p>
            <p className="text-warning text-sm mt-1">
              Users will see a maintenance message and cannot access the platform
            </p>
          </div>
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="flex items-center gap-2 px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors font-semibold"
      >
        <Save size={18} />
        Save Settings
      </button>
    </div>
  )
}
