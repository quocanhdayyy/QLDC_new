"use client"

import type React from "react"

import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "ward_leader" | "citizen"
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
