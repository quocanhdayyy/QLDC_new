"use client"

import { useState, useEffect } from "react"
import Layout from "../components/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"

interface AuditLog {
  id: string
  action: string
  performedBy: string
  targetType: string
  targetId: string
  timestamp: string
  details: string
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filterAction, setFilterAction] = useState<string>("all")

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      const response = await axios.get("/api/audit-logs")
      setLogs(response.data)
    } catch (error) {
      console.error("Failed to fetch logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLogs = filterAction === "all" ? logs : logs.filter((l) => l.action === filterAction)

  const actions = ["all", ...new Set(logs.map((l) => l.action))]

  return (
    <Layout title="Audit Logs">
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {actions.map((action) => (
            <button
              key={action}
              onClick={() => setFilterAction(action)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterAction === action
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {action.charAt(0).toUpperCase() + action.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="py-3 border-b border-border last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{log.action}</p>
                        <p className="text-sm text-muted-foreground">{log.details}</p>
                        <p className="text-xs text-muted-foreground">By: {log.performedBy}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{log.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}
