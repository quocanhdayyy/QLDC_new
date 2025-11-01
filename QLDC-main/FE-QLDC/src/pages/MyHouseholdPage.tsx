"use client"

import { useState, useEffect } from "react"
import Layout from "../components/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"

interface HouseholdMember {
  id: string
  name: string
  relationship: string
  phone?: string
}

interface Household {
  id: string
  address: string
  headName: string
  members: HouseholdMember[]
}

export default function MyHouseholdPage() {
  const [household, setHousehold] = useState<Household | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHousehold()
  }, [])

  const fetchHousehold = async () => {
    try {
      const response = await axios.get("/api/my-household")
      setHousehold(response.data)
    } catch (error) {
      console.error("Failed to fetch household:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading)
    return (
      <Layout title="My Household">
        <div>Loading...</div>
      </Layout>
    )
  if (!household)
    return (
      <Layout title="My Household">
        <div>No household found</div>
      </Layout>
    )

  return (
    <Layout title="My Household">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Household Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <span className="font-semibold">Address:</span> {household.address}
            </p>
            <p>
              <span className="font-semibold">Head of Household:</span> {household.headName}
            </p>
            <p>
              <span className="font-semibold">Total Members:</span> {household.members.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Family Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {household.members.map((member) => (
                <div key={member.id} className="py-2 border-b border-border last:border-0">
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.relationship}</p>
                  {member.phone && <p className="text-sm text-muted-foreground">{member.phone}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
