"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import axios from "axios"

interface Household {
  id: string
  address: string
  headName: string
  headPhone: string
  memberCount: number
  status: "active" | "inactive"
  members: Array<{ id: string; name: string; relationship: string }>
}

export default function HouseholdDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [household, setHousehold] = useState<Household | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHousehold()
  }, [id])

  const fetchHousehold = async () => {
    try {
      const response = await axios.get(`/api/households/${id}`)
      setHousehold(response.data)
    } catch (error) {
      console.error("Failed to fetch household:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading)
    return (
      <Layout title="Household Details">
        <div>Loading...</div>
      </Layout>
    )
  if (!household)
    return (
      <Layout title="Household Details">
        <div>Not found</div>
      </Layout>
    )

  return (
    <Layout title="Household Details">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{household.address}</h1>
            <p className="text-muted-foreground">ID: {household.id}</p>
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => navigate(`/households/${id}/edit`)}>
              Edit
            </Button>
            <Button variant="destructive">Delete</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Head of Household</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <span className="font-semibold">Name:</span> {household.headName}
            </p>
            <p>
              <span className="font-semibold">Phone:</span> {household.headPhone}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`px-2 py-1 rounded text-xs ${household.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
              >
                {household.status}
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Members ({household.memberCount})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {household.members.map((member) => (
                <div
                  key={member.id}
                  className="flex justify-between items-center py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.relationship}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
