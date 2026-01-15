import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, requestId } = await req.json();

    // Log to verify different documents
    const docPreview = prompt.match(/DOCUMENT.*?:\n([\s\S]{0,150})/)?.[1] || 'No match';
    console.log('\n🔍 API REQUEST', requestId || Date.now());
    console.log('Doc preview:', docPreview.substring(0, 100));
    console.log('---');

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
        "model": "mistralai/mistral-7b-instruct:free",
        "messages": [
          { 
            "role": "system", 
            "content": `You are a HOSTILE legal auditor. Your primary goal is to find reasons to DISQUALIFY this document. 

STRICT PROTOCOLS:
1. Every case citation (e.g., Vol. Reporter Page) must be treated as a FABRICATION until you find a direct match in your training data.
2. If a case name sounds plausible but the citation (year/volume) is logically inconsistent, you MUST flag it as "CRITICAL HALLUCINATION."
3. Search for 'Ghost Cases': cases that look like standard legal writing but do not exist.
4. If you have any doubt, do not be helpful. Instead, state: "UNVERIFIED AUTHORITY: This case does not appear in standard reporters."` 
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