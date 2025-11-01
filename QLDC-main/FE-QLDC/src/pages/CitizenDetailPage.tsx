"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import axios from "axios"

interface Citizen {
  id: string
  name: string
  email: string
  phone: string
  idNumber: string
  householdId: string
  status: "active" | "inactive"
  joinDate: string
}

export default function CitizenDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [citizen, setCitizen] = useState<Citizen | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCitizen()
  }, [id])

  const fetchCitizen = async () => {
    try {
      const response = await axios.get(`/api/citizens/${id}`)
      setCitizen(response.data)
    } catch (error) {
      console.error("Failed to fetch citizen:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading)
    return (
      <Layout title="Citizen Details">
        <div>Loading...</div>
      </Layout>
    )
  if (!citizen)
    return (
      <Layout title="Citizen Details">
        <div>Not found</div>
      </Layout>
    )

  return (
    <Layout title="Citizen Details">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{citizen.name}</h1>
            <p className="text-muted-foreground">ID: {citizen.id}</p>
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => navigate(`/citizens/${id}/edit`)}>
              Edit
            </Button>
            <Button variant="destructive">Delete</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <span className="font-semibold">Email:</span> {citizen.email}
            </p>
            <p>
              <span className="font-semibold">Phone:</span> {citizen.phone}
            </p>
            <p>
              <span className="font-semibold">ID Number:</span> {citizen.idNumber}
            </p>
            <p>
              <span className="font-semibold">Join Date:</span> {citizen.joinDate}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`px-2 py-1 rounded text-xs ${citizen.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
              >
                {citizen.status}
              </span>
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
