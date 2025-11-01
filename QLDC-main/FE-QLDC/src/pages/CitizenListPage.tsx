"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import axios from "axios"

interface Citizen {
  id: string
  name: string
  email: string
  phone: string
  householdId: string
  status: "active" | "inactive"
}

export default function CitizenListPage() {
  const navigate = useNavigate()
  const [citizens, setCitizens] = useState<Citizen[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchCitizens()
  }, [])

  const fetchCitizens = async () => {
    try {
      const response = await axios.get("/api/citizens")
      setCitizens(response.data)
    } catch (error) {
      console.error("Failed to fetch citizens:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCitizens = citizens.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Layout title="Citizens">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-input rounded-lg"
          />
          <Button onClick={() => navigate("/citizens/new")} className="ml-4">
            Add Citizen
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid gap-4">
            {filteredCitizens.map((citizen) => (
              <Card
                key={citizen.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/citizens/${citizen.id}`)}
              >
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{citizen.name}</p>
                      <p className="text-sm text-muted-foreground">{citizen.email}</p>
                      <p className="text-sm text-muted-foreground">{citizen.phone}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${citizen.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                    >
                      {citizen.status}
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
