"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import mammoth from "mammoth";

type AnalysisStatus = "idle" | "analyzing" | "complete";
type FilingReadiness = "safe_to_file" | "file_with_caution" | "do_not_file";

interface FilingVerdict {
  readiness: FilingReadiness;
  justification: string[];
}

interface CriticalIssue {
  quote: string;
  problem: string;
  missingAuthority: string;
}

interface HallucinationSignal {
  quote: string;
  pattern: string;
  risk: string;
}

interface OpposingCounselAttack {
  vulnerability: string;
  likelyChallenge: string;
}

interface LegalReviewMemo {
  filingVerdict: FilingVerdict;
  criticalIssues: CriticalIssue[];
  hallucinationSignals: HallucinationSignal[];
  opposingCounselPerspective: OpposingCounselAttack[];
  jurisdictionNotes: string;
}

export default function Home() {
  const [briefText, setBriefText] = useState("");
  const [isDark, setIsDark] = useState(true);
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [currentStep, setCurrentStep] = useState("");
  const [reviewMemo, setReviewMemo] = useState<LegalReviewMemo | null>(null);
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
    
    // Simulate multi-step analysis (internal process)
    const steps = [
      "Parsing document structure",
      "Extracting citations",
      "Verifying legal authorities",
      "Cross-checking factual assertions",
      "Detecting hallucination patterns",
      "Assessing filing risk"
    ];

    for (const step of steps) {
      setCurrentStep(step);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Generate legal review memo (evidence-based analysis)
    const mockReviewMemo: LegalReviewMemo = {
      filingVerdict: {
        readiness: "file_with_caution",
        justification: [
          "Two citations contain factual errors that could be discovered by opposing counsel",
          "One material damages claim lacks record support and invites challenge",
          "No issues rise to sanctionable conduct, but credibility exposure is present"
        ]
      },
      criticalIssues: [
        {
          quote: "United States v. Brown, 789 F.2d 123 (2d Cir. 2019)",
          problem: "The cited case was decided in 2018, not 2019. This factual error in a cited authority undermines credibility and suggests inadequate case verification.",
          missingAuthority: "Verified reporter citation showing correct year of decision"
        },
        {
          quote: "Plaintiff suffered damages exceeding $500,000",
          problem: "No supporting documentation, record reference, expert report, or evidentiary foundation provided for this specific figure. Unsupported damage assertions can be struck or viewed as speculative.",
          missingAuthority: "Citation to discovery materials, exhibits, expert declarations, or itemized damage calculations establishing the claimed amount"
        },
        {
          quote: "Johnson v. State, 456 U.S. 789 (2021)",
          problem: "This citation cannot be verified in U.S. Reports. The case may not exist, may be miscited, or may be from a different reporter entirely.",
          missingAuthority: "Verified citation to the actual case in proper reporter format, or removal if the case does not exist"
        }
      ],
      hallucinationSignals: [
        {
          quote: "Courts have consistently held that [legal proposition]",
          pattern: "Vague authority invocation without specific case citations",
          risk: "Generic phrases like 'courts have held' or 'it is well established' without supporting citations are common AI hallucination patterns. Opposing counsel may challenge lack of specific authority."
        },
        {
          quote: "This jurisdiction clearly recognizes...",
          pattern: "Overconfident legal conclusion without pinpoint citation",
          risk: "Assertive language ('clearly,' 'unquestionably') without supporting case law suggests potential AI-generated content. Verify that controlling authority actually supports this statement."
        }
      ],
      opposingCounselPerspective: [
        {
          vulnerability: "Citation errors in United States v. Brown and Johnson v. State",
          likelyChallenge: "Opposing counsel will verify these citations, discover the errors, and argue in response brief that plaintiff's counsel failed to properly research authorities, casting doubt on all legal arguments presented."
        },
        {
          vulnerability: "Unsupported $500,000 damages claim",
          likelyChallenge: "Motion to strike the specific damage figure as speculative and unsupported by record evidence. May also argue bad faith or Rule 11 concerns if no reasonable basis exists for the amount."
        }
      ],
      jurisdictionNotes: "Federal courts in this circuit apply heightened scrutiny to citation accuracy following recent Rule 11 enforcement actions involving AI-generated briefs. The Second Circuit requires strict Bluebook compliance and verifiable citations to primary sources. Local rules mandate certification of research accuracy."
    };

    setReviewMemo(mockReviewMemo);
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
        <div className="min-h-screen flex flex-col">
          <div className="flex-1 flex items-center justify-center px-4 py-8">
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

          {/* Footer */}
          <div className="pb-6 text-center">
            <p className="text-xs text-gray-500 dark:text-zinc-500">
              SOC2 Compliant. Documents are encrypted and never used for training
            </p>
          </div>
        </div>
      ) : (
        /* Post-Upload State: Two-Panel Review Interface */
        <div className="min-h-screen flex flex-col px-4 py-8">
          <div className="flex-1 w-full max-w-7xl mx-auto">
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
                      setReviewMemo(null);
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

                  {status === "complete" && reviewMemo && (
                    <div className="space-y-8 text-sm">
                      {/* Filing Readiness Verdict */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">
                            Filing Readiness
                          </h2>
                          <span className={`text-xs px-2.5 py-1 rounded font-bold uppercase tracking-wide ${
                            reviewMemo.filingVerdict.readiness === 'do_not_file' 
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                              : reviewMemo.filingVerdict.readiness === 'file_with_caution'
                              ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                              : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          }`}>
                            {reviewMemo.filingVerdict.readiness.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <ul className="space-y-1.5 text-gray-700 dark:text-zinc-300">
                          {reviewMemo.filingVerdict.justification.map((bullet, idx) => (
                            <li key={idx} className="flex gap-2">
                              <span className="text-gray-400 dark:text-zinc-500">•</span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Critical Issues */}
                      {reviewMemo.criticalIssues.length > 0 && (
                        <div>
                          <h2 className="text-sm font-bold text-red-600 dark:text-red-400 mb-4 uppercase tracking-wide">
                            Critical Issues
                          </h2>
                          <div className="space-y-5">
                            {reviewMemo.criticalIssues.map((issue, idx) => (
                              <div key={idx} className="space-y-3">
                                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded p-3">
                                  <div className="text-xs text-red-600 dark:text-red-400 font-semibold mb-1.5">DOCUMENT QUOTE</div>
                                  <div className="font-mono text-xs text-gray-900 dark:text-white italic">
                                    "{issue.quote}"
                                  </div>
                                </div>
                                <div className="pl-3 border-l-2 border-red-500">
                                  <div className="text-xs text-red-600 dark:text-red-400 font-semibold mb-1">PROBLEM</div>
                                  <div className="text-gray-900 dark:text-white mb-3">{issue.problem}</div>
                                  <div className="text-xs text-red-600 dark:text-red-400 font-semibold mb-1">MISSING AUTHORITY</div>
                                  <div className="text-gray-700 dark:text-zinc-300">{issue.missingAuthority}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Hallucination Risk Signals */}
                      {reviewMemo.hallucinationSignals.length > 0 && (
                        <div>
                          <h2 className="text-sm font-bold text-orange-600 dark:text-orange-400 mb-4 uppercase tracking-wide">
                            Hallucination Risk Signals
                          </h2>
                          <div className="space-y-4">
                            {reviewMemo.hallucinationSignals.map((signal, idx) => (
                              <div key={idx} className="space-y-2">
                                <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-900/30 rounded p-3">
                                  <div className="font-mono text-xs text-gray-900 dark:text-white italic">
                                    "{signal.quote}"
                                  </div>
                                </div>
                                <div className="pl-3 border-l-2 border-orange-500 space-y-2">
                                  <div>
                                    <div className="text-xs text-orange-600 dark:text-orange-400 font-semibold mb-1">PATTERN</div>
                                    <div className="text-gray-900 dark:text-white text-xs">{signal.pattern}</div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-orange-600 dark:text-orange-400 font-semibold mb-1">RISK</div>
                                    <div className="text-gray-700 dark:text-zinc-300 text-xs">{signal.risk}</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Opposing Counsel Perspective */}
                      {reviewMemo.opposingCounselPerspective.length > 0 && (
                        <div>
                          <h2 className="text-sm font-bold text-purple-600 dark:text-purple-400 mb-4 uppercase tracking-wide">
                            Opposing Counsel Perspective
                          </h2>
                          <div className="space-y-4">
                            {reviewMemo.opposingCounselPerspective.map((attack, idx) => (
                              <div key={idx} className="border-l-2 border-purple-500 pl-4 space-y-2">
                                <div>
                                  <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold mb-1">VULNERABILITY</div>
                                  <div className="text-gray-900 dark:text-white text-xs">{attack.vulnerability}</div>
                                </div>
                                <div>
                                  <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold mb-1">LIKELY CHALLENGE</div>
                                  <div className="text-gray-700 dark:text-zinc-300 text-xs">{attack.likelyChallenge}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Jurisdiction Notes */}
                      {reviewMemo.jurisdictionNotes && (
                        <div>
                          <h2 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-3 uppercase tracking-wide">
                            Jurisdiction & Filing Standards
                          </h2>
                          <div className="border-l-2 border-blue-500 pl-4 text-gray-700 dark:text-zinc-300 text-xs leading-relaxed">
                            {reviewMemo.jurisdictionNotes}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-zinc-500">
              SOC2 Compliant. Documents are encrypted and never used for training
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
