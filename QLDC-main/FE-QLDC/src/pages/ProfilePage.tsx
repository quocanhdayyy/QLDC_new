"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import Layout from "../components/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useFormik } from "formik"
import * as Yup from "yup"
import axios from "axios"

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone is required"),
  currentPassword: Yup.string(),
  newPassword: Yup.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: Yup.string().oneOf([Yup.ref("newPassword")], "Passwords must match"),
})

export default function ProfilePage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const formik = useFormik({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true)
      setMessage("")
      try {
        await axios.put("/api/profile", values)
        setMessage("Profile updated successfully")
      } catch (error: any) {
        setMessage(error.response?.data?.message || "Failed to update profile")
      } finally {
        setLoading(false)
      }
    },
  })

  return (
    <Layout title="Profile">
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {message && (
                <div
                  className={`p-3 rounded-lg text-sm ${message.includes("successfully") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {message}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  {...formik.getFieldProps("name")}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-destructive text-sm mt-1">{formik.errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  {...formik.getFieldProps("email")}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-destructive text-sm mt-1">{formik.errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  {...formik.getFieldProps("phone")}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {formik.touched.phone && formik.errors.phone && (
                  <p className="text-destructive text-sm mt-1">{formik.errors.phone}</p>
                )}
              </div>

              <hr className="my-6" />

              <h3 className="font-semibold">Change Password</h3>

              <div>
                <label className="block text-sm font-medium mb-1">Current Password</label>
                <input
                  type="password"
                  {...formik.getFieldProps("currentPassword")}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input
                  type="password"
                  {...formik.getFieldProps("newPassword")}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {formik.touched.newPassword && formik.errors.newPassword && (
                  <p className="text-destructive text-sm mt-1">{formik.errors.newPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <input
                  type="password"
                  {...formik.getFieldProps("confirmPassword")}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <p className="text-destructive text-sm mt-1">{formik.errors.confirmPassword}</p>
                )}
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
