"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/lib/supabase"
import { Users, Zap } from "lucide-react"

export function RealTimeStats() {
  const [activeUsers, setActiveUsers] = useState(573)
  const [recentActivity, setRecentActivity] = useState<{ name: string; action: string; time: string }[]>([
    { name: "Sarah L.", action: "Completed React Quiz", time: "2 min ago" },
    { name: "John D.", action: "Earned JavaScript Badge", time: "5 min ago" },
    { name: "Maria G.", action: "Started Python Course", time: "12 min ago" },
  ])

  useEffect(() => {
    // Simulate real-time active users
    const interval = setInterval(() => {
      setActiveUsers((prev) => prev + Math.floor(Math.random() * 10) - 4)
    }, 5000)

    // Set up real-time subscription to achievements
    const achievementsSubscription = supabase
      .channel("public:achievements")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "achievements",
        },
        (payload) => {
          // In a real app, you would fetch the user name and format this properly
          const newActivity = {
            name: "New User",
            action: `Earned ${payload.new.name}`,
            time: "just now",
          }
          setRecentActivity((prev) => [newActivity, ...prev.slice(0, 2)])
        },
      )
      .subscribe()

    return () => {
      clearInterval(interval)
      supabase.removeChannel(achievementsSubscription)
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-Time Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span>Active Learners</span>
          </div>
          <span className="text-xl font-bold text-primary">{activeUsers}</span>
        </div>
        <Progress value={75} className="h-2" />

        <div className="space-y-4 mt-6">
          <h4 className="text-sm font-medium">Recent Activity</h4>
          {recentActivity.map((activity, i) => (
            <div key={i} className="flex items-start space-x-3 text-sm">
              <Zap className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <span className="font-medium">{activity.name}</span> {activity.action}
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
