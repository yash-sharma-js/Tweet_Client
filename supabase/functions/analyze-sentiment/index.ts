
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { username, tweet } = await req.json()

    if (!username || !tweet) {
      return new Response(
        JSON.stringify({ error: "Username and tweet are required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      )
    }

    // Basic sentiment analysis algorithm
    // In a real app, you would integrate with a proper NLP service
    const lowerTweet = tweet.toLowerCase()
    const containsOffensiveWords = 
      lowerTweet.includes("hate") || 
      lowerTweet.includes("stupid") || 
      lowerTweet.includes("terrible") ||
      lowerTweet.includes("awful") ||
      lowerTweet.includes("bad")
    
    const hasPositiveWords =
      lowerTweet.includes("great") ||
      lowerTweet.includes("love") ||
      lowerTweet.includes("excellent") ||
      lowerTweet.includes("happy") ||
      lowerTweet.includes("good")

    let score: number
    if (containsOffensiveWords) {
      score = -Math.random() * 0.8 - 0.2 // -0.2 to -1.0
    } else if (hasPositiveWords) {
      score = Math.random() * 0.8 + 0.2 // 0.2 to 1.0
    } else {
      score = Math.random() * 0.4 - 0.2 // -0.2 to 0.2
    }
    
    let label: string
    if (score > 0.2) {
      label = "positive"
    } else if (score < -0.2) {
      label = "negative"
    } else {
      label = "neutral"
    }
    
    const confidence = Math.abs(score) * 0.8 + 0.2 // 0.2 to 1.0
    
    return new Response(
      JSON.stringify({ 
        score,
        label,
        confidence
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    )
  }
})
