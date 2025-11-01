import Layout from "../components/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", households: 45, citizens: 120 },
  { name: "Feb", households: 48, citizens: 135 },
  { name: "Mar", households: 52, citizens: 150 },
  { name: "Apr", households: 50, citizens: 145 },
]

export default function DashboardPage() {
  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Total Households" value="156" change="+5%" />
          <StatCard title="Total Citizens" value="428" change="+12%" />
          <StatCard title="Pending Requests" value="23" change="-3%" />
          <StatCard title="Pending Rewards" value="8" change="+2%" />
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Household & Citizen Growth</CardTitle>
            <CardDescription>Monthly statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="households" fill="#3b82f6" />
                <Bar dataKey="citizens" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <ActivityItem title="New household registered" time="2 hours ago" />
              <ActivityItem title="Edit request submitted" time="4 hours ago" />
              <ActivityItem title="Reward proposal approved" time="1 day ago" />
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

function StatCard({ title, value, change }: { title: string; value: string; change: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold mt-2">{value}</p>
        <p className="text-xs text-green-600 mt-1">{change} from last month</p>
      </CardContent>
    </Card>
  )
}

function ActivityItem({ title, time }: { title: string; time: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <p className="text-sm">{title}</p>
      <p className="text-xs text-muted-foreground">{time}</p>
    </div>
  )
}
