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
  requestType: Yup.string().required("Request type is required"),
  description: Yup.string().required("Description is required").min(10, "Description must be at least 10 characters"),
  attachments: Yup.string(),
})

export default function SubmitEditRequestPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const formik = useFormik({
    initialValues: {
      requestType: "",
      description: "",
      attachments: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true)
      setError("")
      try {
        await axios.post("/api/edit-requests", values)
        navigate("/request-history")
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to submit request")
      } finally {
        setLoading(false)
      }
    },
  })

  return (
    <Layout title="Submit Edit Request">
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Submit Edit Request</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {error && <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>}

              <div>
                <label className="block text-sm font-medium mb-1">Request Type</label>
                <select
                  {...formik.getFieldProps("requestType")}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select a type</option>
                  <option value="address_change">Address Change</option>
                  <option value="member_addition">Add Family Member</option>
                  <option value="member_removal">Remove Family Member</option>
                  <option value="information_update">Update Information</option>
                </select>
                {formik.touched.requestType && formik.errors.requestType && (
                  <p className="text-destructive text-sm mt-1">{formik.errors.requestType}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  {...formik.getFieldProps("description")}
                  rows={5}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Please describe your request in detail..."
                />
                {formik.touched.description && formik.errors.description && (
                  <p className="text-destructive text-sm mt-1">{formik.errors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Attachments (Optional)</label>
                <input
                  type="file"
                  {...formik.getFieldProps("attachments")}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  multiple
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Request"}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/request-history")}>
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
