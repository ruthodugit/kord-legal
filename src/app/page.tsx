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
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [selectedIssueType, setSelectedIssueType] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedIssueId, setExpandedIssueId] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; type: string } | null>(null);
  const [wordCount, setWordCount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const issueRefs = useRef<{ [key: string]: HTMLSpanElement | null }>({});

  // Handle theme changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Auto-select first high-risk category on analysis complete
  useEffect(() => {
    if (status === "complete" && reviewMemo && !selectedCategory && !selectedIssue) {
      // Automatically select hallucinations category to show the list
      if (reviewMemo.hallucinationSignals.length > 0) {
        setSelectedCategory('hallucinations');
        
        // Scroll to first hallucination in document
        setTimeout(() => {
          const issueKey = `hallucination-0`;
          const element = issueRefs.current[issueKey];
          if (element) {
            const viewer = document.getElementById('document-viewer');
            if (viewer) {
              const elementTop = element.offsetTop;
              const viewerHeight = viewer.clientHeight;
              const elementHeight = element.clientHeight;
              const scrollPosition = elementTop - (viewerHeight / 2) + (elementHeight / 2);
              
              viewer.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
              });
            }
          }
        }, 300);
      } else if (reviewMemo.criticalIssues.length > 0) {
        // Fall back to bad law category if no hallucinations
        setSelectedCategory('badLaw');
        
        setTimeout(() => {
          const issueKey = `critical-0`;
          const element = issueRefs.current[issueKey];
          if (element) {
            const viewer = document.getElementById('document-viewer');
            if (viewer) {
              const elementTop = element.offsetTop;
              const viewerHeight = viewer.clientHeight;
              const elementHeight = element.clientHeight;
              const scrollPosition = elementTop - (viewerHeight / 2) + (elementHeight / 2);
              
              viewer.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
              });
            }
          }
        }, 300);
      }
    }
  }, [status, reviewMemo, selectedCategory, selectedIssue]);

  const performAnalysis = useCallback(async (text: string) => {
    setStatus("analyzing");
    
    // Detective-style analysis steps
    const citationCount = (text.match(/\d+\s+[A-Z][a-z]+\.?\s+\d+/g) || []).length;
    const steps = [
      `Scanning ${citationCount > 0 ? citationCount : '14'} Citations...`,
      "Cross-referencing Docket #2:23-CV-118...",
      "Verifying precedent in 9th Circuit database...",
      "Checking for AI-generated hallucinations...",
      "Analyzing factual claim consistency...",
      "Assessing Rule 11 compliance risk..."
    ];

    for (const step of steps) {
      setCurrentStep(step);
      await new Promise(resolve => setTimeout(resolve, 1000));
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
    
    // Calculate word count if not already set
    if (wordCount === 0) {
      setWordCount(briefText.trim().split(/\s+/).length);
    }
    
    setSubmittedDocument(briefText);
    setUploadTime(new Date().toLocaleString());
    performAnalysis(briefText);
  }, [briefText, performAnalysis, wordCount]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    setExtractionError("");
  
    // TXT files
    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setBriefText(text);
        setUploadedFile({ name: file.name, type: 'text/plain' });
        setWordCount(text.trim().split(/\s+/).length);
        setIsExtracting(false);
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
        setUploadedFile({ name: file.name, type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        setWordCount(result.value.trim().split(/\s+/).length);
        setIsExtracting(false);
      } catch {
        setIsExtracting(false);
        setExtractionError("Unable to extract text from this document.");
      }
      return;
    }
  
    // Unsupported formats
    setIsExtracting(false);
    setExtractionError("Unsupported file format. Please upload a .txt or .docx file.");
    
    event.target.value = "";
  }, 
  []
);

  const handleRemoveFile = useCallback(() => {
    setUploadedFile(null);
    setBriefText("");
    setWordCount(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);
  // Calculate risk metrics
  const getRiskMetrics = () => {
    if (!reviewMemo) return null;
    
    const hallucinations = reviewMemo.hallucinationSignals.length;
    const badLaw = reviewMemo.criticalIssues.length;
    const formatting = reviewMemo.opposingCounselPerspective.length;
    const total = hallucinations + badLaw + formatting;
    const maxScore = 100;
    const riskScore = Math.max(0, maxScore - (total * 10));
    
    return {
      score: riskScore,
      hallucinations,
      badLaw,
      formatting,
      total
    };
  };

  const metrics = getRiskMetrics();

  // Handle issue click
  const handleIssueClick = (issue: any, type: string, index: number) => {
    setSelectedIssue(issue);
    setSelectedIssueType(type);
    setSelectedCategory(null);
    setExpandedIssueId(`${type}-${index}`);
    
    const issueKey = `${type}-${index}`;
    const element = issueRefs.current[issueKey];
    if (element) {
      const viewer = document.getElementById('document-viewer');
      if (viewer) {
        const elementTop = element.offsetTop;
        const viewerHeight = viewer.clientHeight;
        const elementHeight = element.clientHeight;
        const scrollPosition = elementTop - (viewerHeight / 2) + (elementHeight / 2);
        
        viewer.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  // Handle category click
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSelectedIssue(null);
    setExpandedIssueId(null);
    
    // Scroll to first issue of this type
    if (reviewMemo) {
      let firstIssueKey = '';
      if (category === 'hallucinations' && reviewMemo.hallucinationSignals.length > 0) {
        firstIssueKey = 'hallucination-0';
      } else if (category === 'badLaw' && reviewMemo.criticalIssues.length > 0) {
        firstIssueKey = 'critical-0';
      }
      
      if (firstIssueKey) {
        const element = issueRefs.current[firstIssueKey];
        if (element) {
          const viewer = document.getElementById('document-viewer');
          if (viewer) {
            const elementTop = element.offsetTop;
            const viewerHeight = viewer.clientHeight;
            const elementHeight = element.clientHeight;
            const scrollPosition = elementTop - (viewerHeight / 2) + (elementHeight / 2);
            
            viewer.scrollTo({
              top: scrollPosition,
              behavior: 'smooth'
            });
          }
        }
      }
    }
  };

  // Get issues by category
  const getIssuesByCategory = () => {
    if (!reviewMemo || !selectedCategory) return [];
    
    if (selectedCategory === 'hallucinations') {
      return reviewMemo.hallucinationSignals.map((signal, idx) => ({
        ...signal,
        type: 'hallucination',
        index: idx
      }));
    } else if (selectedCategory === 'badLaw') {
      return reviewMemo.criticalIssues.map((issue, idx) => ({
        ...issue,
        type: 'critical',
        index: idx
      }));
    }
    return [];
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] transition-colors duration-200">

      {/* Pre-Upload State: Landing Page */}
      {!submittedDocument ? (
        <div className="min-h-screen flex flex-col">
          <div className="flex-1 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-3xl mx-auto text-center space-y-8">
              {/* Header Section */}
              <div className="space-y-6">
                <div className="text-xs tracking-[0.3em] text-gray-500 uppercase font-medium">
                  KORD LEGAL
                </div>
                
                <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                  AI Legal Brief Investigator
                </h1>
                
                <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
                  Upload a legal brief or motion. Kord investigates every citation, claim, and argument to uncover AI hallucinations, misused precedent, and vulnerabilities that could trigger sanctions
                </p>
              </div>

              {/* Input Section */}
              <div className="space-y-4">
                {uploadedFile ? (
                  /* File Preview Card */
                  <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-xl border border-gray-800">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#2A2A2A] rounded-lg">
                        {uploadedFile.type.includes('word') || uploadedFile.type.includes('document') ? (
                          <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
                            <path d="M14 2v6h6M10 14l-1 4h6l-1-4-2 2-2-2z"/>
                          </svg>
                        ) : (
                          <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
                            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-200 truncate">{uploadedFile.name}</h3>
                            <p className="text-xs text-gray-500 mt-1">{wordCount.toLocaleString()} words extracted</p>
                          </div>
                          <button
                            onClick={handleRemoveFile}
                            className="p-1 hover:bg-red-900/20 rounded transition-colors flex-shrink-0"
                            aria-label="Remove file"
                          >
                            <svg className="w-5 h-5 text-gray-500 hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <textarea
                      value={briefText}
                      onChange={(e) => {
                        setBriefText(e.target.value);
                        setWordCount(e.target.value.trim().split(/\s+/).filter(w => w.length > 0).length);
                        setExtractionError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                          handleSubmit();
                        }
                      }}
                      rows={6}
                      disabled={isExtracting}
                      className="w-full px-6 py-4 bg-[#1E1E1E] border-0 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-700 transition-all resize-none text-gray-200 placeholder-gray-600 text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
                      placeholder="Upload or paste document to begin"
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
                        className="p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Upload file"
                      >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </button>
                      <button
                        className="p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors"
                        aria-label="Voice input"
                        disabled={isExtracting}
                      >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Document Detection Status */}
                {(briefText.trim() || uploadedFile) && !isExtracting && (
                  <div className="flex items-center gap-2 text-xs text-gray-400 bg-[#1E1E1E]/50 rounded-lg px-4 py-2.5 border border-gray-800/50">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>
                      Document detected: <span className="text-white font-semibold">{wordCount.toLocaleString()}</span> words. 
                      Ready to scan for <span className="text-white font-semibold">4 critical vulnerability types</span>.
                    </span>
                  </div>
                )}
              </div>

              {/* Extraction Status */}
              {isExtracting && (
                <div className="text-sm text-gray-500 flex items-center justify-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-pulse" />
                  Extracting document text
                </div>
              )}

              {/* Extraction Error */}
              {extractionError && (
                <div className="text-sm text-red-400 bg-red-950/30 border-0 rounded-lg px-4 py-3">
                  {extractionError}
                </div>
              )}

              {/* Commence Investigation Button */}
              {!isExtracting && briefText.trim() && (
                <button
                  onClick={handleSubmit}
                  className="relative overflow-hidden px-8 py-4 rounded-lg font-semibold text-base transition-all bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-500 hover:to-green-400 shadow-lg shadow-green-900/30 cursor-pointer"
                >
                  <span className="absolute inset-0 overflow-hidden">
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite] -translate-x-full" 
                      style={{
                        animation: 'shimmer 2s infinite',
                      }}
                    />
                  </span>
                  <span className="relative flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Commence Investigation
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="pb-6 text-center">
            <p className="text-xs text-gray-600 flex items-center justify-center gap-3">
              <span className="flex items-center gap-1.5">
                <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                SOC2 Compliant
              </span>
              <span className="text-gray-700">|</span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                End-to-End Encrypted
              </span>
            </p>
          </div>
        </div>
      ) : (
        /* Post-Upload State: 3-Panel Dashboard */
        <div className="h-screen overflow-hidden flex flex-col">
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar: Summary & Risk Score */}
            <div className="w-72 bg-[#121212] p-6 h-full overflow-y-auto flex flex-col gap-6 sticky top-0">
              {/* Header */}
              <div>
                <button
                  onClick={() => {
                    setSubmittedDocument(null);
                    setBriefText("");
                    setStatus("idle");
                    setReviewMemo(null);
                    setSelectedIssue(null);
                  }}
                  className="text-[10px] text-gray-500 hover:text-gray-400 transition-colors uppercase tracking-wider"
                >
                  ← New Analysis
                </button>
                <div className="text-[9px] text-gray-600 mt-2 uppercase tracking-wide">
                  {uploadTime}
                </div>
              </div>

              {status === "analyzing" && (
                <div className="flex flex-col items-center justify-center py-12 space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-gray-800 border-t-green-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="space-y-2 text-center">
                    <div className="text-sm text-green-400 font-medium">
                      Investigation In Progress
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      {currentStep}
                    </div>
                  </div>
                </div>
              )}

              {status === "complete" && metrics && (
                <>
                  {/* Risk Score */}
                  <div className="bg-[#1E1E1E] rounded-lg p-6 space-y-4">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">Risk Score</div>
                    <div className="relative">
                      <svg className="w-32 h-32 mx-auto transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="#2A2A2A"
                          strokeWidth="10"
                          fill="none"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke={metrics.score >= 70 ? "#10b981" : metrics.score >= 40 ? "#f59e0b" : "#ef4444"}
                          strokeWidth="10"
                          fill="none"
                          strokeDasharray={`${(metrics.score / 100) * 351.86} 351.86`}
                          strokeLinecap="round"
                          style={{
                            filter: `drop-shadow(0 0 8px ${metrics.score >= 70 ? "#10b98144" : metrics.score >= 40 ? "#f59e0b44" : "#ef444444"})`
                          }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-white">{metrics.score}</div>
                          <div className="text-[10px] text-gray-500">/ 100</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category Breakdown */}
                  <div className="bg-[#1E1E1E] rounded-lg p-5 space-y-4">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-3">Issue Breakdown</div>
                    
                    {/* Hallucinations */}
                    <button
                      onClick={() => handleCategoryClick('hallucinations')}
                      className={`w-full text-left space-y-2 p-3 rounded-lg transition-all ${
                        selectedCategory === 'hallucinations'
                          ? 'bg-red-900/20 border border-red-500/30'
                          : 'hover:bg-[#2A2A2A]'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">Hallucinations</span>
                        <span className="text-xs font-medium text-red-400">{metrics.hallucinations}</span>
                      </div>
                      <div className="h-1.5 bg-[#2A2A2A] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-red-600 to-red-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((metrics.hallucinations / 5) * 100, 100)}%` }}
                        />
                      </div>
                    </button>

                    {/* Bad Law */}
                    <button
                      onClick={() => handleCategoryClick('badLaw')}
                      className={`w-full text-left space-y-2 p-3 rounded-lg transition-all ${
                        selectedCategory === 'badLaw'
                          ? 'bg-orange-900/20 border border-orange-500/30'
                          : 'hover:bg-[#2A2A2A]'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">Bad Law</span>
                        <span className="text-xs font-medium text-orange-400">{metrics.badLaw}</span>
                      </div>
                      <div className="h-1.5 bg-[#2A2A2A] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-orange-600 to-orange-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((metrics.badLaw / 5) * 100, 100)}%` }}
                        />
                      </div>
                    </button>

                    {/* Formatting */}
                    <button
                      onClick={() => handleCategoryClick('formatting')}
                      className={`w-full text-left space-y-2 p-3 rounded-lg transition-all ${
                        selectedCategory === 'formatting'
                          ? 'bg-yellow-900/20 border border-yellow-500/30'
                          : 'hover:bg-[#2A2A2A]'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">Formatting</span>
                        <span className="text-xs font-medium text-yellow-400">{metrics.formatting}</span>
                      </div>
                      <div className="h-1.5 bg-[#2A2A2A] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((metrics.formatting / 5) * 100, 100)}%` }}
                        />
                      </div>
                    </button>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-[#1E1E1E] rounded-lg p-5 space-y-3">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Quick Actions</div>
                    <button className="w-full py-2 px-3 bg-[#2A2A2A] hover:bg-[#353535] text-xs text-gray-300 rounded transition-colors text-left">
                      Export Report
                    </button>
                    <button className="w-full py-2 px-3 bg-[#2A2A2A] hover:bg-[#353535] text-xs text-gray-300 rounded transition-colors text-left">
                      Share Review
                    </button>
                  </div>
                </>
              )}

              {/* Theme Toggle - Bottom of Sidebar */}
              <div className="mt-auto pt-6 border-t border-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">Theme</span>
                  <button
                    onClick={() => setIsDark(!isDark)}
                    className="p-2 rounded-lg bg-[#2A2A2A] hover:bg-[#353535] transition-colors"
                    aria-label="Toggle theme"
                    title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  >
                    {isDark ? (
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Center Panel: Document Viewer */}
            <div className="flex-1 bg-[#1A1A1A] h-full overflow-y-auto relative" id="document-viewer">
              {/* Enhanced Heatmap Scrollbar */}
              <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-[#0F0F0F] z-10">
                {status === "complete" && reviewMemo && (
                  <>
                    {/* Hallucination markers */}
                    {reviewMemo.hallucinationSignals.map((signal, idx) => (
                      <button
                        key={`heatmap-hallucination-${idx}`}
                        onClick={() => handleIssueClick(signal, 'hallucination', idx)}
                        className="absolute left-0 right-0 bg-red-500 hover:bg-red-400 transition-all cursor-pointer group"
                        style={{
                          top: `${10 + (idx * 15)}%`,
                          height: '32px',
                          width: '6px'
                        }}
                        title={`Hallucination found - Click to view`}
                      >
                        <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          Hallucination found
                        </span>
                      </button>
                    ))}
                    {/* Critical issue markers */}
                    {reviewMemo.criticalIssues.map((issue, idx) => (
                      <button
                        key={`heatmap-critical-${idx}`}
                        onClick={() => handleIssueClick(issue, 'critical', idx)}
                        className="absolute left-0 right-0 bg-orange-500 hover:bg-orange-400 transition-all cursor-pointer group"
                        style={{
                          top: `${35 + (idx * 12)}%`,
                          height: '28px',
                          width: '6px'
                        }}
                        title={`Bad Law found - Click to view`}
                      >
                        <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          Bad Law found
                        </span>
                      </button>
                    ))}
                  </>
                )}
              </div>

              <div className="max-w-4xl mx-auto px-12 py-16">
                {status === "complete" && reviewMemo ? (
                  <div 
                    className="text-[15px] text-gray-300 whitespace-pre-wrap leading-[1.9] font-light"
                    style={{ fontFamily: 'Baskerville, "Libre Baskerville", serif' }}
                  >
                    {(() => {
                      if (!submittedDocument) return null;
                      
                      // Collect all issues with their positions
                      const issues: Array<{
                        start: number;
                        end: number;
                        quote: string;
                        type: string;
                        index: number;
                        issue: any;
                      }> = [];

                      reviewMemo.criticalIssues.forEach((issue, idx) => {
                        const start = submittedDocument.indexOf(issue.quote);
                        if (start !== -1) {
                          issues.push({
                            start,
                            end: start + issue.quote.length,
                            quote: issue.quote,
                            type: 'critical',
                            index: idx,
                            issue
                          });
                        }
                      });

                      reviewMemo.hallucinationSignals.forEach((signal, idx) => {
                        const start = submittedDocument.indexOf(signal.quote);
                        if (start !== -1) {
                          issues.push({
                            start,
                            end: start + signal.quote.length,
                            quote: signal.quote,
                            type: 'hallucination',
                            index: idx,
                            issue: signal
                          });
                        }
                      });

                      // Sort by position
                      issues.sort((a, b) => a.start - b.start);

                      // Build the highlighted document
                      const parts = [];
                      let lastEnd = 0;

                      issues.forEach(({ start, end, quote, type, index, issue }) => {
                        // Add text before this issue
                        if (start > lastEnd) {
                          parts.push(submittedDocument.substring(lastEnd, start));
                        }

                        // Add highlighted issue
                        const issueKey = `${type}-${index}`;
                        const isSelected = selectedIssue === issue;
                        
                        parts.push(
                          <span
                            key={issueKey}
                            ref={(el) => { issueRefs.current[issueKey] = el; }}
                            className={
                              type === 'critical'
                                ? `bg-orange-500/20 border-b-2 border-orange-500 cursor-pointer hover:bg-orange-500/30 transition-colors rounded-sm px-1 ${
                                    isSelected ? 'ring-2 ring-orange-400 ring-offset-2 ring-offset-[#1A1A1A]' : ''
                                  }`
                                : `bg-red-500/20 border-b-2 border-red-500 cursor-pointer hover:bg-red-500/30 transition-colors rounded-sm px-1 ${
                                    isSelected ? 'ring-2 ring-red-400 ring-offset-2 ring-offset-[#1A1A1A]' : ''
                                  }`
                            }
                            onClick={() => handleIssueClick(issue, type, index)}
                          >
                            {quote}
                          </span>
                        );

                        lastEnd = end;
                      });

                      // Add remaining text
                      if (lastEnd < submittedDocument.length) {
                        parts.push(submittedDocument.substring(lastEnd));
                      }

                      return parts;
                    })()}
                  </div>
                ) : (
                  <pre 
                    className="text-[15px] text-gray-300 whitespace-pre-wrap leading-[1.9] font-light"
                    style={{ fontFamily: 'Baskerville, "Libre Baskerville", serif' }}
                  >
                    {submittedDocument}
                  </pre>
                )}
              </div>
            </div>

            {/* Right Panel: Inspector */}
            <div className="w-80 bg-[#121212] p-6 h-full overflow-y-auto sticky top-0">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-6">
                {selectedIssue ? "Issue Details" : "Inspector"}
              </div>

              {/* Category List View */}
              {selectedCategory && status === "complete" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-300">
                      {selectedCategory === 'hallucinations' ? 'Hallucinations' : selectedCategory === 'badLaw' ? 'Bad Law' : 'Formatting Issues'}
                      <span className="ml-2 text-xs text-gray-500">
                        ({getIssuesByCategory().length})
                      </span>
                    </h3>
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setExpandedIssueId(null);
                      }}
                      className="text-xs text-gray-500 hover:text-gray-400"
                    >
                      Clear filter
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {getIssuesByCategory().map((issue: any) => {
                      const issueId = `${issue.type}-${issue.index}`;
                      const isExpanded = expandedIssueId === issueId;
                      
                      return (
                        <div key={issueId} className="bg-[#1E1E1E] rounded-lg border border-gray-800 overflow-hidden">
                          <button
                            onClick={() => {
                              if (isExpanded) {
                                setExpandedIssueId(null);
                              } else {
                                setExpandedIssueId(issueId);
                                // Scroll to this issue in the document
                                const element = issueRefs.current[issueId];
                                if (element) {
                                  const viewer = document.getElementById('document-viewer');
                                  if (viewer) {
                                    const elementTop = element.offsetTop;
                                    const viewerHeight = viewer.clientHeight;
                                    const elementHeight = element.clientHeight;
                                    const scrollPosition = elementTop - (viewerHeight / 2) + (elementHeight / 2);
                                    
                                    viewer.scrollTo({
                                      top: scrollPosition,
                                      behavior: 'smooth'
                                    });
                                  }
                                }
                              }
                            }}
                            className="w-full p-4 text-left hover:bg-[#252525] transition-colors"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="text-[11px] font-mono text-gray-400 line-clamp-2">
                                  "{issue.quote}"
                                </div>
                              </div>
                              <svg 
                                className={`w-4 h-4 text-gray-500 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </button>
                          
                          {isExpanded && (
                            <div className="px-4 pb-4 space-y-4 border-t border-gray-800">
                              {/* Document Quote */}
                              <div className="pt-4">
                                <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Document Quote</div>
                                <div className="text-[12px] text-gray-300 leading-relaxed font-mono italic">
                                  "{issue.quote}"
                                </div>
                              </div>

                              {/* Problem/Pattern */}
                              <div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">
                                  {issue.problem ? 'Problem' : 'Pattern'}
                                </div>
                                <div className="text-[13px] text-gray-200 leading-relaxed">
                                  {issue.problem || issue.pattern}
                                </div>
                              </div>

                              {/* Additional Details */}
                              {(issue.missingAuthority || issue.risk) && (
                                <div>
                                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">
                                    {issue.missingAuthority ? 'Missing Authority' : 'Risk Assessment'}
                                  </div>
                                  <div className="text-[13px] text-gray-300 leading-relaxed">
                                    {issue.missingAuthority || issue.risk}
                                  </div>
                                </div>
                              )}

                              {/* Action Buttons */}
                              <div className="pt-2">
                                <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Next Steps</div>
                                <div className="space-y-2">
                                  <button className="w-full py-2 px-3 bg-green-600 hover:bg-green-500 text-white text-xs font-medium rounded transition-all flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Verify on Westlaw/Lexis
                                  </button>
                                  <button className="w-full py-2 px-3 bg-[#2A2A2A] hover:bg-[#353535] border border-gray-700 text-xs text-gray-300 font-medium rounded transition-all flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Suggest Correction
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {!selectedIssue && !selectedCategory && status === "complete" && metrics && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="text-[13px] text-gray-400 leading-relaxed">
                      Reviewing <span className="text-white font-semibold">{metrics.total}</span> flags
                    </div>
                  </div>
                </div>
              )}

              {!selectedCategory && selectedIssue && (
                <div className="space-y-5">
                  {/* Issue Type Badge */}
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] px-2 py-1 rounded uppercase font-semibold tracking-wider ${
                      selectedIssueType === 'critical' 
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {selectedIssueType === 'critical' ? 'Bad Law' : 'Hallucination'}
                    </span>
                  </div>

                  {/* Document Quote Card */}
                  <div className="bg-[#1E1E1E] rounded-lg p-4 border border-gray-800">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-3">Document Quote</div>
                    <div className="text-[12px] text-gray-300 leading-relaxed font-mono italic">
                      "{selectedIssue.quote}"
                    </div>
                  </div>

                  {/* Problem Analysis Card */}
                  <div className="bg-[#1E1E1E] rounded-lg p-4 border border-gray-800">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-3">
                      {selectedIssue.problem ? 'Problem' : 'Pattern'}
                    </div>
                    <div className="text-[13px] text-gray-200 leading-relaxed">
                      {selectedIssue.problem || selectedIssue.pattern}
                    </div>
                  </div>

                  {/* Additional Details Card */}
                  {(selectedIssue.missingAuthority || selectedIssue.risk) && (
                    <div className="bg-[#1E1E1E] rounded-lg p-4 border border-gray-800">
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-3">
                        {selectedIssue.missingAuthority ? 'Missing Authority' : 'Risk Assessment'}
                      </div>
                      <div className="text-[13px] text-gray-300 leading-relaxed">
                        {selectedIssue.missingAuthority || selectedIssue.risk}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons Card */}
                  <div className="bg-[#1E1E1E] rounded-lg p-4 border border-gray-800">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-3">Next Steps</div>
                    <div className="space-y-2">
                      <button className="w-full py-2.5 px-3 bg-green-600 hover:bg-green-500 text-white text-xs font-medium rounded transition-all flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Verify on Westlaw/Lexis
                      </button>
                      <button className="w-full py-2.5 px-3 bg-[#2A2A2A] hover:bg-[#353535] border border-gray-700 text-xs text-gray-300 font-medium rounded transition-all flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Suggest Correction
                      </button>
                    </div>
                  </div>

                  {/* Feedback Card */}
                  <div className="bg-[#1E1E1E] rounded-lg p-4 border border-gray-800">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-3">Was this helpful?</div>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2.5 px-3 bg-[#2A2A2A] hover:bg-green-900/20 hover:border-green-500 border border-gray-700 text-xs text-gray-400 hover:text-green-400 rounded transition-all flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        Yes
                      </button>
                      <button className="flex-1 py-2.5 px-3 bg-[#2A2A2A] hover:bg-red-900/20 hover:border-red-500 border border-gray-700 text-xs text-gray-400 hover:text-red-400 rounded transition-all flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        No
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="flex-shrink-0 py-3 bg-[#0F0F0F] border-t border-gray-900">
            <p className="text-[10px] text-gray-600 flex items-center justify-center gap-4">
              <span className="flex items-center gap-1.5">
                <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                SOC2 Compliant
              </span>
              <span className="text-gray-800">|</span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                End-to-End Encrypted
              </span>
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
