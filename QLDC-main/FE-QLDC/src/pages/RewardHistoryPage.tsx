"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import axios from "axios"

interface Reward {
  id: string
  reason: string
  status: "pending" | "approved" | "rejected"
  submittedDate: string
  reviewedDate?: string
}

export default function RewardHistoryPage() {
  const navigate = useNavigate()
  const [rewards, setRewards] = useState<Reward[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRewards()
  }, [])

  const fetchRewards = async () => {
    try {
      const response = await axios.get("/api/my-reward-proposals")
      setRewards(response.data)
    } catch (error) {
      console.error("Failed to fetch rewards:", error)
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
    <Layout title="Reward History">
      <div className="space-y-4">
        <Button onClick={() => navigate("/submit-reward-proposal")}>Submit New Proposal</Button>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid gap-4">
            {rewards.map((reward) => (
              <Card
                key={reward.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/reward-proposals/${reward.id}`)}
              >
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{reward.reason}</p>
                      <p className="text-sm text-muted-foreground">Submitted: {reward.submittedDate}</p>
                      {reward.reviewedDate && (
                        <p className="text-sm text-muted-foreground">Reviewed: {reward.reviewedDate}</p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reward.status)}`}>
                      {reward.status}
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
