import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // 1. Get the key and remove any accidental spaces or hidden characters
    const apiKey = process.env.OPENROUTER_API_KEY?.trim();

    // 2. Log to your terminal so you can see if the key is actually there
    console.log("Checking API Key status...");
    if (!apiKey) {
      console.error("ERROR: OPENROUTER_API_KEY is missing from .env.local");
      return NextResponse.json({ error: "API Key is not configured" }, { status: 401 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Kord Legal",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemini-2.0-flash-exp:free",
        "messages": [
          { 
            "role": "system", 
            "content": "You are a senior legal investigator. Analyze the text for hallucinations or strategic vulnerabilities." 
          },
          { "role": "user", "content": prompt }
        ],
      })
    });

    const data = await response.json();

    // 3. If OpenRouter returns an error, pass it through so we can read it
    if (!response.ok) {
      console.error("OpenRouter Error Details:", data);
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
    
  } catch (error) {
    console.error("System Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}