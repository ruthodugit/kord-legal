"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [briefText, setBriefText] = useState("");
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check system preference on mount
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(isDarkMode);
  }, []);

  useEffect(() => {
    // Update document class when theme changes
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <main className="min-h-screen bg-white dark:bg-black transition-colors duration-200 px-4 flex items-center justify-center">
      {/* Theme Toggle Button */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2.5 rounded-lg bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors border border-gray-200 dark:border-zinc-800"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <svg className="w-4 h-4 text-zinc-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </div>

      <div className="w-full max-w-2xl mx-auto py-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="text-xs tracking-[0.2em] text-gray-400 dark:text-zinc-500 uppercase mb-8 font-medium">
            KORD LEGAL
          </div>
          
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 dark:text-white mb-6 leading-tight">
            AI Legal Brief Investigator
          </h1>
          
          <p className="text-base text-gray-500 dark:text-zinc-400 leading-relaxed mx-auto max-w-2xl">
            Upload a legal brief or motion. Kord investigates every citation, claim, and argument to uncover AI hallucinations, misused precedent, and vulnerabilities that could trigger sanctions
          </p>
        </div>

        {/* Input Section */}
        <div className="relative">
          <textarea
            value={briefText}
            onChange={(e) => setBriefText(e.target.value)}
            rows={4}
            className="w-full px-5 py-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-zinc-700 transition-all resize-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 text-sm"
            placeholder="Paste your legal brief, motion, or complaint here"
          />
          
          {/* Bottom Icons */}
          <div className="absolute bottom-4 right-4 flex items-center gap-3">
            <button
              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              aria-label="Upload file"
            >
              <svg className="w-4 h-4 text-gray-500 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </button>
            
            <button
              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              aria-label="Voice input"
            >
              <svg className="w-4 h-4 text-gray-500 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
