"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import axios from "axios"

interface Household {
  id: string
  address: string
  headName: string
  memberCount: number
  status: "active" | "inactive"
}

export default function HouseholdListPage() {
  const navigate = useNavigate()
  const [households, setHouseholds] = useState<Household[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchHouseholds()
  }, [])

  const fetchHouseholds = async () => {
    try {
      const response = await axios.get("/api/households")
      setHouseholds(response.data)
    } catch (error) {
      console.error("Failed to fetch households:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredHouseholds = households.filter(
    (h) =>
      h.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.headName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Layout title="Households">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="Search by address or head name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-input rounded-lg"
          />
          <Button onClick={() => navigate("/households/new")} className="ml-4">
            Add Household
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid gap-4">
            {filteredHouseholds.map((household) => (
              <Card
                key={household.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/households/${household.id}`)}
              >
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{household.address}</p>
                      <p className="text-sm text-muted-foreground">Head: {household.headName}</p>
                      <p className="text-sm text-muted-foreground">Members: {household.memberCount}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${household.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                    >
                      {household.status}
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
