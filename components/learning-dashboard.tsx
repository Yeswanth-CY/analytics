"use client"

import * as React from "react"
import { Chart, registerables } from "chart.js"
import { Bar, Doughnut, Line, Radar } from "react-chartjs-2"
import {
  Award,
  BookOpen,
  Brain,
  GraduationCap,
  LayoutDashboard,
  Moon,
  Settings,
  Sun,
  Target,
  Trophy,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { SkillRecommendations } from "@/components/skill-recommendations"
import Link from "next/link"

// Register Chart.js components
Chart.register(...registerables)

// Sample data - this would come from your Supabase database via Prisma
const sampleUserData = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  avatar: "/placeholder.svg?height=80&width=80",
  resumeScore: 8.5,
  quizScores: [7.2, 8.5, 9.0, 8.7, 9.5, 7.8],
  xpPoints: 78,
  skillMatches: {
    JavaScript: 85,
    React: 75,
    "Node.js": 65,
    Python: 60,
    "Data Analysis": 70,
  },
  skillsLearned: [
    { name: "JavaScript", level: 85, completed: true },
    { name: "React", level: 75, completed: true },
    { name: "Node.js", level: 65, completed: true },
    { name: "Python", level: 60, completed: false },
    { name: "Data Analysis", level: 70, completed: false },
  ],
  learningPath: [
    { month: "Jan", progress: 15 },
    { month: "Feb", progress: 30 },
    { month: "Mar", progress: 45 },
    { month: "Apr", progress: 60 },
    { month: "May", progress: 75 },
    { month: "Jun", progress: 78 },
  ],
  achievements: [
    { name: "First Quiz Completed", date: "Jan 15" },
    { name: "Perfect Score", date: "Feb 22" },
    { name: "10-Day Streak", date: "Mar 10" },
    { name: "All JavaScript Modules", date: "Apr 5" },
    { name: "Resume Expert", date: "May 20" },
  ],
}

// Chart.js options with consistent styling
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}

export default function LearningDashboard() {
  const [isDarkMode, setIsDarkMode] = React.useState(false)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeUsers, setActiveUsers] = useState(573)

  useEffect(() => {
    // Simulate real-time active users
    const interval = setInterval(() => {
      setActiveUsers((prev) => prev + Math.floor(Math.random() * 10) - 4)
    }, 5000)

    // Fetch real data from our API
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/user-data")
        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }
        const data = await response.json()
        setUserData(data)
      } catch (error) {
        console.error("Error fetching user data:", error)
        // Fall back to sample data if API fails
        setUserData(sampleUserData)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()

    return () => clearInterval(interval)
  }, [])

  // Add a loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  // Ensure userData is available (use sample data as fallback)
  const displayData = userData || sampleUserData

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  // Quiz scores chart data
  const quizScoresData = {
    labels: ["Quiz 1", "Quiz 2", "Quiz 3", "Quiz 4", "Quiz 5", "Quiz 6"],
    datasets: [
      {
        label: "Quiz Scores",
        data: displayData.quizScores,
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(255, 159, 64, 0.7)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  // Learning progress chart data
  const learningProgressData = {
    labels: displayData.learningPath.map((item) => item.month),
    datasets: [
      {
        label: "XP Progress",
        data: displayData.learningPath.map((item) => item.progress),
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.4,
      },
    ],
  }

  // Skill matches radar chart data
  const skillMatchesData = {
    labels: Object.keys(displayData.skillMatches),
    datasets: [
      {
        label: "Skill Match %",
        data: Object.values(displayData.skillMatches),
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(153, 102, 255, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(153, 102, 255, 1)",
      },
    ],
  }

  // Skills learned pie chart data
  const skillsLearnedData = {
    labels: displayData.skillsLearned.map((skill) => skill.name),
    datasets: [
      {
        label: "Skill Level",
        data: displayData.skillsLearned.map((skill) => skill.level),
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className={`min-h-screen p-8 bg-background text-foreground ${isDarkMode ? "dark" : ""}`}>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Learning Platform Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={toggleTheme}>
            {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/people">
              <Users className="mr-2 h-4 w-4" /> People Directory
            </Link>
          </Button>
          <Button>
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Button>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="mt-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={displayData.avatar || "/placeholder.svg"} alt={displayData.name} />
                <AvatarFallback>
                  {displayData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2 text-center md:text-left">
                <h2 className="text-2xl font-bold">{displayData.name}</h2>
                <p className="text-muted-foreground">{displayData.email}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {displayData.skillsLearned
                    .filter((skill) => skill.completed)
                    .map((skill) => (
                      <Badge key={skill.name} variant="secondary">
                        {skill.name}
                      </Badge>
                    ))}
                </div>
              </div>
              <div className="ml-auto flex flex-col items-center gap-2">
                <div className="text-center">
                  <h3 className="text-lg font-semibold">XP Points</h3>
                  <div className="text-3xl font-bold text-primary">{displayData.xpPoints}/100</div>
                  <Progress value={displayData.xpPoints} className="w-32 mt-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="overview">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="progress">
            <GraduationCap className="mr-2 h-4 w-4" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="skills">
            <Brain className="mr-2 h-4 w-4" />
            Skills
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resume Score</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{displayData.resumeScore}/10</div>
                <Progress value={displayData.resumeScore * 10} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Quiz Score</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(displayData.quizScores.reduce((a, b) => a + b, 0) / displayData.quizScores.length).toFixed(1)}/10
                </div>
                <Progress
                  value={(displayData.quizScores.reduce((a, b) => a + b, 0) / displayData.quizScores.length) * 10}
                  className="mt-2"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Skills Completed</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {displayData.skillsLearned.filter((skill) => skill.completed).length}/
                  {displayData.skillsLearned.length}
                </div>
                <Progress
                  value={
                    (displayData.skillsLearned.filter((skill) => skill.completed).length /
                      displayData.skillsLearned.length) *
                    100
                  }
                  className="mt-2"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Learners</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{activeUsers}</div>
                <p className="text-xs text-muted-foreground">+42 since last hour</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Performance</CardTitle>
                <CardDescription>Your scores across all quizzes</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <Bar data={quizScoresData} options={chartOptions} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
                <CardDescription>XP points earned over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <Line data={learningProgressData} options={chartOptions} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Learning Journey</CardTitle>
                <CardDescription>Your progress over the months</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <Line data={learningProgressData} options={chartOptions} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>Milestones you've reached</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayData.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-4 p-2 rounded-lg bg-muted/50">
                      <div className="bg-primary/20 p-2 rounded-full">
                        <Trophy className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{achievement.name}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quiz Performance Breakdown</CardTitle>
              <CardDescription>Detailed view of your quiz scores</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <Bar data={quizScoresData} options={chartOptions} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Skill Matches</CardTitle>
                <CardDescription>How your skills match job requirements</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <Radar data={skillMatchesData} options={chartOptions} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Skills Distribution</CardTitle>
                <CardDescription>Breakdown of your skill proficiency</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <Doughnut
                  data={skillsLearnedData}
                  options={{
                    ...chartOptions,
                    cutout: "65%",
                  }}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Skills Progress</CardTitle>
              <CardDescription>Detailed breakdown of each skill</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {displayData.skillsLearned.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{
                            backgroundColor: [
                              "rgb(255, 99, 132)",
                              "rgb(54, 162, 235)",
                              "rgb(255, 206, 86)",
                              "rgb(75, 192, 192)",
                              "rgb(153, 102, 255)",
                            ][index % 5],
                          }}
                        />
                        <span className="font-medium">{skill.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{skill.level}%</span>
                        {skill.completed && (
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          >
                            Completed
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <SkillRecommendations skills={displayData.skillsLearned} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
