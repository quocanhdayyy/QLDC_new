"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import axios from "axios"

interface EditRequest {
  id: string
  citizenName: string
  citizenId: string
  requestType: string
  description: string
  status: "pending" | "approved" | "rejected"
  submittedDate: string
  reviewedDate?: string
  reviewedBy?: string
  notes?: string
}

export default function EditRequestDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [request, setRequest] = useState<EditRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchRequest()
  }, [id])

  const fetchRequest = async () => {
    try {
      const response = await axios.get(`/api/edit-requests/${id}`)
      setRequest(response.data)
    } catch (error) {
      console.error("Failed to fetch request:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    setActionLoading(true)
    try {
      await axios.patch(`/api/edit-requests/${id}`, { status: "approved" })
      fetchRequest()
    } catch (error) {
      console.error("Failed to approve:", error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    setActionLoading(true)
    try {
      await axios.patch(`/api/edit-requests/${id}`, { status: "rejected" })
      fetchRequest()
    } catch (error) {
      console.error("Failed to reject:", error)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading)
    return (
      <Layout title="Edit Request Details">
        <div>Loading...</div>
      </Layout>
    )
  if (!request)
    return (
      <Layout title="Edit Request Details">
        <div>Not found</div>
      </Layout>
    )

  return (
    <Layout title="Edit Request Details">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{request.requestType}</h1>
            <p className="text-muted-foreground">ID: {request.id}</p>
          </div>
          {request.status === "pending" && (
            <div className="space-x-2">
              <Button onClick={handleApprove} disabled={actionLoading} className="bg-green-600 hover:bg-green-700">
                Approve
              </Button>
              <Button onClick={handleReject} disabled={actionLoading} variant="destructive">
                Reject
              </Button>
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Request Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <span className="font-semibold">Citizen:</span> {request.citizenName}
            </p>
            <p>
              <span className="font-semibold">Type:</span> {request.requestType}
            </p>
            <p>
              <span className="font-semibold">Description:</span> {request.description}
            </p>
            <p>
              <span className="font-semibold">Submitted Date:</span> {request.submittedDate}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`px-2 py-1 rounded text-xs ${request.status === "pending" ? "bg-yellow-100 text-yellow-800" : request.status === "approved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                {request.status}
              </span>
            </p>
          </CardContent>
        </Card>

        {request.reviewedDate && (
          <Card>
            <CardHeader>
              <CardTitle>Review Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <span className="font-semibold">Reviewed By:</span> {request.reviewedBy}
              </p>
              <p>
                <span className="font-semibold">Reviewed Date:</span> {request.reviewedDate}
              </p>
              {request.notes && (
                <p>
                  <span className="font-semibold">Notes:</span> {request.notes}
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}
