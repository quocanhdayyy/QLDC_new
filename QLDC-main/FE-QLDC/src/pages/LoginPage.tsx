"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
})

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true)
      setError("")
      try {
        await login(values.email, values.password)
        navigate("/dashboard")
      } catch (err: any) {
        setError(err.response?.data?.message || "Login failed")
      } finally {
        setLoading(false)
      }
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Residential Management System</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>}

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                {...formik.getFieldProps("email")}
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="your@email.com"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-destructive text-sm mt-1">{formik.errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                {...formik.getFieldProps("password")}
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-destructive text-sm mt-1">{formik.errors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-lg text-sm">
            <p className="font-semibold mb-2">Demo Credentials:</p>
            <p>Ward Leader: leader@example.com / password123</p>
            <p>Citizen: citizen@example.com / password123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
