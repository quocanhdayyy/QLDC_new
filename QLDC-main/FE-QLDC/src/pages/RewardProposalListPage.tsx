"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import { Card, CardContent } from "@/components/ui/card"
import axios from "axios"

interface RewardProposal {
  id: string
  citizenName: string
  reason: string
  status: "pending" | "approved" | "rejected"
  submittedDate: string
}

export default function RewardProposalListPage() {
  const navigate = useNavigate()
  const [proposals, setProposals] = useState<RewardProposal[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {
    fetchProposals()
  }, [])

  const fetchProposals = async () => {
    try {
      const response = await axios.get("/api/reward-proposals")
      setProposals(response.data)
    } catch (error) {
      console.error("Failed to fetch proposals:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProposals = filterStatus === "all" ? proposals : proposals.filter((p) => p.status === filterStatus)

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
    <Layout title="Reward Proposals">
      <div className="space-y-4">
        <div className="flex gap-2">
          {["all", "pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid gap-4">
            {filteredProposals.map((proposal) => (
              <Card
                key={proposal.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/reward-proposals/${proposal.id}`)}
              >
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{proposal.citizenName}</p>
                      <p className="text-sm text-muted-foreground">{proposal.reason}</p>
                      <p className="text-xs text-muted-foreground">{proposal.submittedDate}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                      {proposal.status}
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
