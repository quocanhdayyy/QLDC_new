"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import axios from "axios"

interface RewardProposal {
  id: string
  citizenName: string
  citizenId: string
  reason: string
  description: string
  status: "pending" | "approved" | "rejected"
  submittedDate: string
  reviewedDate?: string
  reviewedBy?: string
  rewardType?: string
  notes?: string
}

export default function RewardProposalDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [proposal, setProposal] = useState<RewardProposal | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchProposal()
  }, [id])

  const fetchProposal = async () => {
    try {
      const response = await axios.get(`/api/reward-proposals/${id}`)
      setProposal(response.data)
    } catch (error) {
      console.error("Failed to fetch proposal:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    setActionLoading(true)
    try {
      await axios.patch(`/api/reward-proposals/${id}`, { status: "approved" })
      fetchProposal()
    } catch (error) {
      console.error("Failed to approve:", error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    setActionLoading(true)
    try {
      await axios.patch(`/api/reward-proposals/${id}`, { status: "rejected" })
      fetchProposal()
    } catch (error) {
      console.error("Failed to reject:", error)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading)
    return (
      <Layout title="Reward Proposal Details">
        <div>Loading...</div>
      </Layout>
    )
  if (!proposal)
    return (
      <Layout title="Reward Proposal Details">
        <div>Not found</div>
      </Layout>
    )

  return (
    <Layout title="Reward Proposal Details">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{proposal.reason}</h1>
            <p className="text-muted-foreground">ID: {proposal.id}</p>
          </div>
          {proposal.status === "pending" && (
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
            <CardTitle>Proposal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <span className="font-semibold">Citizen:</span> {proposal.citizenName}
            </p>
            <p>
              <span className="font-semibold">Reason:</span> {proposal.reason}
            </p>
            <p>
              <span className="font-semibold">Description:</span> {proposal.description}
            </p>
            <p>
              <span className="font-semibold">Submitted Date:</span> {proposal.submittedDate}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`px-2 py-1 rounded text-xs ${proposal.status === "pending" ? "bg-yellow-100 text-yellow-800" : proposal.status === "approved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                {proposal.status}
              </span>
            </p>
          </CardContent>
        </Card>

        {proposal.reviewedDate && (
          <Card>
            <CardHeader>
              <CardTitle>Review Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <span className="font-semibold">Reviewed By:</span> {proposal.reviewedBy}
              </p>
              <p>
                <span className="font-semibold">Reviewed Date:</span> {proposal.reviewedDate}
              </p>
              {proposal.rewardType && (
                <p>
                  <span className="font-semibold">Reward Type:</span> {proposal.rewardType}
                </p>
              )}
              {proposal.notes && (
                <p>
                  <span className="font-semibold">Notes:</span> {proposal.notes}
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}
