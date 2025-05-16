import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

export async function GET() {
  try {
    // In a real application, you would get the user ID from the session
    // For now, we'll fetch the first user in the database

    // Fetch user profile
    const { data: userData, error: userError } = await supabaseServer.from("users").select("*").limit(1).single()

    if (userError) throw userError

    // Fetch quiz scores
    const { data: quizScores, error: quizError } = await supabaseServer
      .from("quiz_scores")
      .select("score")
      .eq("user_id", userData.id)
      .order("created_at", { ascending: true })

    if (quizError) throw quizError

    // Fetch skills learned
    const { data: skillsLearned, error: skillsError } = await supabaseServer
      .from("skills_learned")
      .select("*")
      .eq("user_id", userData.id)

    if (skillsError) throw skillsError

    // Fetch skill matches
    const { data: skillMatches, error: matchesError } = await supabaseServer
      .from("skill_matches")
      .select("*")
      .eq("user_id", userData.id)

    if (matchesError) throw matchesError

    // Fetch learning path progress
    const { data: learningPath, error: pathError } = await supabaseServer
      .from("learning_path")
      .select("*")
      .eq("user_id", userData.id)
      .order("created_at", { ascending: true })

    if (pathError) throw pathError

    // Fetch achievements
    const { data: achievements, error: achievementsError } = await supabaseServer
      .from("achievements")
      .select("*")
      .eq("user_id", userData.id)
      .order("date", { ascending: false })

    if (achievementsError) throw achievementsError

    // Format the data for the frontend
    const formattedData = {
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar_url,
      resumeScore: userData.resume_score,
      quizScores: quizScores.map((q) => q.score),
      xpPoints: userData.xp_points,
      skillMatches: skillMatches.reduce((acc, curr) => {
        acc[curr.skill_name] = curr.match_percentage
        return acc
      }, {}),
      skillsLearned: skillsLearned.map((skill) => ({
        name: skill.name,
        level: skill.level,
        completed: skill.completed,
      })),
      learningPath: learningPath.map((path) => ({
        month: path.month,
        progress: path.progress,
      })),
      achievements: achievements.map((achievement) => ({
        name: achievement.name,
        date: new Date(achievement.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      })),
    }

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error("Error fetching user data:", error)
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 })
  }
}
