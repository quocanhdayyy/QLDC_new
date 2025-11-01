"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import axios from "axios"

interface Request {
  id: string
  requestType: string
  status: "pending" | "approved" | "rejected"
  submittedDate: string
  reviewedDate?: string
}

export default function RequestHistoryPage() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await axios.get("/api/my-edit-requests")
      setRequests(response.data)
    } catch (error) {
      console.error("Failed to fetch requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Layout title="Request History">
      <div className="space-y-4">
        <Button onClick={() => navigate("/submit-edit-request")}>Submit New Request</Button>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid gap-4">
            {requests.map((request) => (
              <Card
                key={request.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/edit-requests/${request.id}`)}
              >
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{request.requestType}</p>
                      <p className="text-sm text-muted-foreground">Submitted: {request.submittedDate}</p>
                      {request.reviewedDate && (
                        <p className="text-sm text-muted-foreground">Reviewed: {request.reviewedDate}</p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
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
