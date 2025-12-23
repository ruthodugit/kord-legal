"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import mammoth from "mammoth";

type AnalysisStatus = "idle" | "analyzing" | "complete";

interface Citation {
  text: string;
  status: "verified" | "missing" | "mismatch";
  issue?: string;
}

interface Claim {
  text: string;
  hasSupport: boolean;
  issue?: string;
}

interface Inconsistency {
  description: string;
  severity: "high" | "medium" | "low";
}

interface RiskFlag {
  description: string;
  category: string;
}

interface AnalysisResults {
  citations: Citation[];
  claims: Claim[];
  inconsistencies: Inconsistency[];
  riskFlags: RiskFlag[];
}

export default function Home() {
  const [briefText, setBriefText] = useState("");
  const [isDark, setIsDark] = useState(true);
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [currentStep, setCurrentStep] = useState("");
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [submittedDocument, setSubmittedDocument] = useState<string | null>(null);
  const [uploadTime, setUploadTime] = useState<string>("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(isDarkMode);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const performAnalysis = useCallback(async (text: string) => {
    setStatus("analyzing");
    
    // Simulate multi-step analysis
    const steps = [
      "Parsing document structure",
      "Extracting citations",
      "Verifying legal authorities",
      "Reviewing factual claims",
      "Checking consistency"
    ];

    for (const step of steps) {
      setCurrentStep(step);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Mock analysis results
    const mockResults: AnalysisResults = {
      citations: [
        { text: "Smith v. Jones, 123 F.3d 456 (9th Cir. 2020)", status: "verified" },
        { text: "United States v. Brown, 789 F.2d 123 (2d Cir. 2019)", status: "mismatch", issue: "Case year is 2018, not 2019" },
        { text: "Johnson v. State, 456 U.S. 789 (2021)", status: "missing", issue: "Citation not found in federal reporters" },
      ],
      claims: [
        { text: "Defendant failed to appear at three consecutive hearings", hasSupport: true },
        { text: "Plaintiff suffered damages exceeding $500,000", hasSupport: false, issue: "No supporting documentation referenced" },
      ],
      inconsistencies: [
        { description: "Page 3 states incident occurred on March 15; page 7 references March 18", severity: "high" },
        { description: "Jurisdiction claimed under both state and federal law without conflict analysis", severity: "medium" },
      ],
      riskFlags: [
        { description: "Citation formatting does not conform to Bluebook standards", category: "Formatting" },
        { description: "Statute cited was amended after the date of alleged conduct", category: "Authority" },
      ]
    };

    setResults(mockResults);
    setStatus("complete");
  }, []);

  const handleSubmit = useCallback(() => {
    if (!briefText.trim()) return;
    
    setSubmittedDocument(briefText);
    setUploadTime(new Date().toLocaleString());
    performAnalysis(briefText);
  }, [briefText, performAnalysis]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    // TXT files
    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBriefText(e.target?.result as string);
      };
      reader.readAsText(file);
      return;
    }
  
    // DOCX files
    if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setBriefText(result.value);
      } catch {
        alert("Unable to extract text from this document.");
      }
      return;
    }
  
    // Unsupported formats
    alert("Unsupported file format. Please upload a .txt or .docx file.");

    reader.onerror = () => {
      setIsExtracting(false);
      setExtractionError("Error reading file. Please try again.");
    };

    reader.readAsText(file);
    
    event.target.value = "";
  }, 
  [performAnalysis]
);
  return (
    <main className="min-h-screen bg-white dark:bg-black transition-colors duration-200">
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

      {/* Pre-Upload State: Landing Page */}
      {!submittedDocument ? (
        <div className="min-h-screen flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-3xl mx-auto text-center space-y-8">
            {/* Header Section */}
            <div className="space-y-6">
              <div className="text-xs tracking-[0.3em] text-gray-400 dark:text-zinc-500 uppercase font-medium">
                KORD LEGAL
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                AI Legal Brief Investigator
              </h1>
              
              <p className="text-base md:text-lg text-gray-500 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
                Upload a legal brief or motion. Kord investigates every citation, claim, and argument to uncover AI hallucinations, misused precedent, and vulnerabilities that could trigger sanctions
              </p>
            </div>

            {/* Input Section */}
            <div className="relative">
              <textarea
                value={briefText}
                onChange={(e) => {
                  setBriefText(e.target.value);
                  setExtractionError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleSubmit();
                  }
                }}
                rows={6}
                disabled={isExtracting}
                className="w-full px-6 py-4 bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-zinc-700 transition-all resize-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Paste your legal brief, motion, or complaint here"
              />
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".txt,.doc,.docx,.pdf"
                className="hidden"
                disabled={isExtracting}
              />
              
              <div className="absolute bottom-4 right-4 flex items-center gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isExtracting}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Upload file"
                >
                  <svg className="w-5 h-5 text-gray-400 dark:text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </button>
                <button
                  className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  aria-label="Voice input"
                  disabled={isExtracting}
                >
                  <svg className="w-5 h-5 text-gray-400 dark:text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Extraction Status */}
            {isExtracting && (
              <div className="text-sm text-gray-500 dark:text-zinc-500 flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-zinc-600 rounded-full animate-pulse" />
                Extracting document text
              </div>
            )}

            {/* Extraction Error */}
            {extractionError && (
              <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3">
                {extractionError}
              </div>
            )}

            {/* Submit Button - Only for manual paste */}
            {briefText.trim() && !isExtracting && (
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                Analyze Document
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Post-Upload State: Two-Panel Review Interface */
        <div className="min-h-screen px-4 py-8">
          <div className="w-full max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Panel: Document */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-zinc-500 uppercase tracking-wide">
                      Document
                    </div>
                    <div className="text-xs text-gray-400 dark:text-zinc-600 mt-1">
                      Uploaded {uploadTime}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSubmittedDocument(null);
                      setBriefText("");
                      setStatus("idle");
                      setResults(null);
                    }}
                    className="text-xs text-gray-500 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-400 transition-colors"
                  >
                    New Document
                  </button>
                </div>
                
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6 h-[calc(100vh-12rem)] overflow-y-auto">
                  <pre className="text-sm text-gray-700 dark:text-zinc-300 whitespace-pre-wrap font-mono leading-relaxed">
                    {submittedDocument}
                  </pre>
                </div>
              </div>

              {/* Right Panel: Process/Results */}
              <div className="space-y-4">
                <div className="text-xs text-gray-500 dark:text-zinc-500 uppercase tracking-wide">
                  {status === "analyzing" ? "Analysis In Progress" : status === "complete" ? "Review Complete" : ""}
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6 h-[calc(100vh-12rem)] overflow-y-auto">
                  {status === "analyzing" && (
                    <div className="space-y-3 font-mono text-sm">
                      <div className="text-gray-500 dark:text-zinc-500">
                        <span className="text-gray-400 dark:text-zinc-600">[SYSTEM]</span> Analysis initiated
                      </div>
                      <div className="text-gray-700 dark:text-zinc-300">
                        <span className="text-gray-400 dark:text-zinc-600">[PROC]</span> {currentStep}
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-500">
                        <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-zinc-600 rounded-full animate-pulse" />
                        Processing...
                      </div>
                    </div>
                  )}

                  {status === "complete" && results && (
                    <div className="space-y-6">
                      {/* Citations */}
                      <div>
                        <h2 className="text-xs font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
                          Citations
                        </h2>
                        <div className="space-y-3">
                          {results.citations.map((citation, idx) => (
                            <div key={idx} className="text-sm border-l-2 pl-3 py-1.5" 
                              style={{ borderColor: citation.status === "verified" ? "#10b981" : citation.status === "mismatch" ? "#f59e0b" : "#ef4444" }}>
                              <div className="font-mono text-xs text-gray-900 dark:text-white mb-1">{citation.text}</div>
                              {citation.issue && (
                                <div className="text-xs text-gray-600 dark:text-zinc-400">{citation.issue}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Claims */}
                      <div>
                        <h2 className="text-xs font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
                          Claims
                        </h2>
                        <div className="space-y-3">
                          {results.claims.map((claim, idx) => (
                            <div key={idx} className="text-sm border-l-2 pl-3 py-1.5"
                              style={{ borderColor: claim.hasSupport ? "#10b981" : "#ef4444" }}>
                              <div className="text-xs text-gray-900 dark:text-white mb-1">{claim.text}</div>
                              {claim.issue && (
                                <div className="text-xs text-gray-600 dark:text-zinc-400">{claim.issue}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Inconsistencies */}
                      <div>
                        <h2 className="text-xs font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
                          Inconsistencies
                        </h2>
                        <div className="space-y-2">
                          {results.inconsistencies.map((item, idx) => (
                            <div key={idx} className="text-xs text-gray-700 dark:text-zinc-300 border-l-2 border-orange-500 pl-3 py-1.5">
                              {item.description}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Risk Flags */}
                      <div>
                        <h2 className="text-xs font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
                          Risk Flags
                        </h2>
                        <div className="space-y-2">
                          {results.riskFlags.map((flag, idx) => (
                            <div key={idx} className="text-xs border-l-2 border-red-500 pl-3 py-1.5">
                              <div className="text-gray-500 dark:text-zinc-500 uppercase text-[10px] mb-0.5">{flag.category}</div>
                              <div className="text-gray-700 dark:text-zinc-300">{flag.description}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
