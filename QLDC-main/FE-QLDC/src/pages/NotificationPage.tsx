"use client"

import { useState, useEffect } from "react"
import Layout from "../components/Layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import axios from "axios"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  read: boolean
  createdAt: string
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/api/notifications")
      setNotifications(response.data)
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await axios.patch(`/api/notifications/${id}`, { read: true })
      fetchNotifications()
    } catch (error) {
      console.error("Failed to mark as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await axios.post("/api/notifications/mark-all-read")
      fetchNotifications()
    } catch (error) {
      console.error("Failed to mark all as read:", error)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "info":
        return "bg-blue-100 text-blue-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "success":
        return "bg-green-100 text-green-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Layout title="Notifications">
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={markAllAsRead} variant="outline">
            Mark All as Read
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card key={notification.id} className={notification.read ? "opacity-60" : ""}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold">{notification.title}</p>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(notification.type)}`}>
                          {notification.type}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{notification.createdAt}</p>
                    </div>
                    {!notification.read && (
                      <Button size="sm" variant="outline" onClick={() => markAsRead(notification.id)}>
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
