"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useFormik } from "formik"
import * as Yup from "yup"
import axios from "axios"

const validationSchema = Yup.object({
  citizenName: Yup.string().required("Citizen name is required"),
  reason: Yup.string().required("Reason is required"),
  description: Yup.string().required("Description is required").min(10, "Description must be at least 10 characters"),
})

export default function SubmitRewardProposalPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const formik = useFormik({
    initialValues: {
      citizenName: "",
      reason: "",
      description: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true)
      setError("")
      try {
        await axios.post("/api/reward-proposals", values)
        navigate("/reward-history")
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to submit proposal")
      } finally {
        setLoading(false)
      }
    },
  })

  return (
    <Layout title="Submit Reward Proposal">
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Submit Reward Proposal</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {error && <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>}

              <div>
                <label className="block text-sm font-medium mb-1">Citizen Name</label>
                <input
                  type="text"
                  {...formik.getFieldProps("citizenName")}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter citizen name"
                />
                {formik.touched.citizenName && formik.errors.citizenName && (
                  <p className="text-destructive text-sm mt-1">{formik.errors.citizenName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Reason for Reward</label>
                <select
                  {...formik.getFieldProps("reason")}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select a reason</option>
                  <option value="community_service">Community Service</option>
                  <option value="volunteer_work">Volunteer Work</option>
                  <option value="good_behavior">Good Behavior</option>
                  <option value="achievement">Achievement</option>
                </select>
                {formik.touched.reason && formik.errors.reason && (
                  <p className="text-destructive text-sm mt-1">{formik.errors.reason}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  {...formik.getFieldProps("description")}
                  rows={5}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Please describe why this citizen deserves a reward..."
                />
                {formik.touched.description && formik.errors.description && (
                  <p className="text-destructive text-sm mt-1">{formik.errors.description}</p>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Proposal"}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/reward-history")}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
