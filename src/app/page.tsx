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

interface FormattingIssue {
  quote: string;
  problem: string;
  recommendation: string;
}

interface LegalReviewMemo {
  filingVerdict: FilingVerdict;
  criticalIssues: CriticalIssue[];
  hallucinationSignals: HallucinationSignal[];
  formattingIssues: FormattingIssue[];
  opposingCounselPerspective: OpposingCounselAttack[];
  jurisdictionNotes: string;
}

export default function Home() {
  const [briefText, setBriefText] = useState("");
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
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; type: string } | null>(null);
  const [wordCount, setWordCount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const issueRefs = useRef<{ [key: string]: HTMLSpanElement | null }>({});

  // Ensure dark class is always present for single-theme mode
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // Hide scanline during analysis
  useEffect(() => {
    if (submittedDocument) {
      document.body.classList.add("hide-scanline");
    } else {
      document.body.classList.remove("hide-scanline");
    }
  }, [submittedDocument]);

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
      formattingIssues: [
        {
          quote: "Pursuant to Federal Rule of Civil Procedure 12(b)(6)",
          problem: "Inconsistent citation style - should use 'Fed. R. Civ. P.' abbreviation per Bluebook",
          recommendation: "Fed. R. Civ. P. 12(b)(6)"
        },
        {
          quote: "see Brown v.United States",
          problem: "Missing space after period in case name abbreviation",
          recommendation: "See Brown v. United States"
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
    const formatting = reviewMemo.formattingIssues.length;
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
    } else if (selectedCategory === 'formatting') {
      return reviewMemo.formattingIssues.map((issue, idx) => ({
        ...issue,
        type: 'formatting',
        index: idx
      }));
    }
    return [];
  };

  // Calculate sanction risk
  const getSanctionRisk = (issue: any, type: string) => {
    if (type === 'hallucination') return 'High';
    if (type === 'critical' && issue.quote.includes('v.')) return 'High';
    if (type === 'formatting') return 'Low';
    return 'Medium';
  };

  // Generate corrected draft
  const getCorrectedDraft = (issue: any, type: string) => {
    if (type === 'hallucination') {
      return "The court in Smith v. Jones, 123 F.3d 456 (9th Cir. 2020), established that [legal principle]. This precedent supports the position that [your argument].";
    }
    if (type === 'critical') {
      return "See Brown v. United States, 789 F.2d 123 (2d Cir. 2018), which held that [correct legal standard]. Accordingly, [your revised argument].";
    }
    return "Revised language based on verified authority.";
  };

  // Copy to clipboard
  const handleCopyToClipboard = (text: string, issueId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(issueId);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <main className="min-h-screen bg-[#FAF9F6] dark:bg-[#050505] transition-colors duration-200">

      {/* Pre-Upload State: Landing Page */}
      {!submittedDocument ? (
        <div className="min-h-screen flex flex-col">
          <div className="flex-1 flex items-center justify-center px-4 py-8">
            <div className="w-full mx-auto text-center space-y-6" style={{ maxWidth: '800px' }}>
              {/* Header Section */}
          <div className="space-y-4">
                <div className="text-xs tracking-[0.3em] text-gray-500 dark:text-gray-500 uppercase font-medium">
                KORD LEGAL
              </div>
              
                <h1 
                  className="text-5xl md:text-6xl font-light text-[#1A1A1A] dark:text-white leading-tight"
                  style={{ fontFamily: 'Baskerville, "Libre Baskerville", "Playfair Display", Georgia, serif', letterSpacing: '0.05em' }}
                >
                  AI Legal Brief Investigator
              </h1>
              
                <p className="text-base md:text-lg text-gray-700 dark:text-gray-400 leading-relaxed mx-auto">
                  Sanction-proof your legal briefs in seconds. Kord investigates every citation to uncover hallucinations and strategic vulnerabilities.
              </p>
            </div>

              {/* Security Metadata */}
              <div className="text-center">
                <p className="text-[9px] text-gray-400 dark:text-gray-600 uppercase tracking-[0.15em] font-medium">
                  System Status: Secured // Encryption: Active
                </p>
              </div>

              {/* Input Section */}
              <div className="space-y-4 relative">
                {uploadedFile ? (
                  /* File Preview Card */
                  <div className="bg-[#F2F1ED] dark:bg-[#0F0F0F] rounded-xl p-6 shadow-xl border border-gray-200/30 dark:border-white/5">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#E8E6E1] dark:bg-[#1A1A1A] rounded-lg">
                        {uploadedFile.type.includes('word') || uploadedFile.type.includes('document') ? (
                          <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
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
                            <h3 className="text-sm font-medium text-[#1A1A1A] dark:text-gray-200 truncate">{uploadedFile.name}</h3>
                            <p className="text-xs text-gray-600 dark:text-gray-500 mt-1">{wordCount.toLocaleString()} words extracted</p>
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
                  <div className="relative max-w-2xl mx-auto">
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
                      rows={3}
                      disabled={isExtracting}
                      className="w-full px-6 py-4 bg-[#F2F1ED] dark:bg-[#0F0F0F] border border-gray-200/30 dark:border-white/5 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-700 transition-all resize-none text-[#1A1A1A] dark:text-white placeholder-gray-500 dark:placeholder-gray-600 text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
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
              
                    <div className="absolute bottom-4 right-4 flex items-center gap-3 z-10">
                <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isExtracting}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-[#1A1A1A] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Upload file"
                >
                        <svg className="w-5 h-5 text-gray-600 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </button>
              </div>
            </div>
                )}

                {/* Document Detection Status */}
                {(briefText.trim() || uploadedFile) && !isExtracting && (
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 bg-[#F2F1ED] dark:bg-[#0F0F0F]/50 rounded-lg px-4 py-2.5 border border-gray-200/30 dark:border-white/5">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                    <span>
                      Document detected: <span className="text-[#1A1A1A] dark:text-white font-semibold">{wordCount.toLocaleString()}</span> words. 
                      Ready to scan for <span className="text-[#1A1A1A] dark:text-white font-semibold">4 critical vulnerability types</span>.
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
                  className="px-8 py-4 rounded-lg font-semibold text-base transition-all bg-white text-[#1A1A1A] hover:opacity-90 cursor-pointer border border-gray-300"
                >
                  Commence Investigation
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Post-Upload State: 3-Panel Dashboard */
        <div className="h-screen overflow-hidden flex flex-col">
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar: Summary & Risk Score */}
            <div className="w-72 bg-[#F2F1ED] dark:bg-[#0F0F0F] p-6 h-full overflow-y-auto flex flex-col gap-6 sticky top-0">
              {/* Header */}
                <div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      // Clear all state to return to upload state
                      setSubmittedDocument(null);
                      setBriefText("");
                      setStatus("idle");
                      setReviewMemo(null);
                      setSelectedIssue(null);
                      setSelectedIssueType("");
                      setSelectedCategory(null);
                      setExpandedIssueId(null);
                      setUploadedFile(null);
                      setWordCount(0);
                      setIsExtracting(false);
                      setExtractionError("");
                      setUploadTime("");
                      setCopiedText(null);
                    }}
                    className="text-[10px] text-[#141414] dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors uppercase tracking-wider"
                  >
                    ← New Analysis
                  </button>
                </div>
                <div className="text-[9px] text-[#141414] dark:text-gray-600 mt-2 uppercase tracking-wide">
                  {uploadTime}
                </div>
              </div>

              {status === "analyzing" && (
                <div className="flex flex-col items-center justify-center py-12 space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-gray-800 border-t-gray-400 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="space-y-2 text-center">
                    <div className="text-sm text-gray-300 font-medium">
                      Investigation In Progress
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" />
                      {currentStep}
                    </div>
                  </div>
                </div>
              )}

              {status === "complete" && metrics && (
                <>
                  {/* Risk Score */}
                  <div className="bg-[#F2F1ED] dark:bg-[#0A0A0A] rounded-lg p-6 space-y-4 border border-gray-200 dark:border-white/5">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">Risk Score</div>
                    <div className="relative">
                      <svg className="w-32 h-32 mx-auto transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="#E8E6E1"
                          className="dark:stroke-[#1A1A1A]"
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
                          <div className="text-4xl font-bold text-[#1A1A1A] dark:text-white">{metrics.score}</div>
                          <div className="text-[10px] text-gray-500">/ 100</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category Breakdown */}
                  <div className="bg-[#F2F1ED] dark:bg-[#0A0A0A] rounded-lg p-5 space-y-4 border border-gray-200 dark:border-white/5">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-3">Issue Breakdown</div>
                    
                    {/* Hallucinations */}
                    <button
                      onClick={() => handleCategoryClick('hallucinations')}
                      className={`w-full text-left space-y-2 p-3 rounded-lg transition-all ${
                        selectedCategory === 'hallucinations'
                          ? 'bg-red-900/20 border border-red-500/30'
                          : 'hover:bg-[#E8E6E1] dark:hover:bg-[#1A1A1A]'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">Hallucinations</span>
                        <span className="text-xs font-medium text-red-400">{metrics.hallucinations}</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 dark:bg-[#1A1A1A] rounded-full overflow-hidden">
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
                          : 'hover:bg-[#E8E6E1] dark:hover:bg-[#1A1A1A]'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">Bad Law</span>
                        <span className="text-xs font-medium text-orange-400">{metrics.badLaw}</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 dark:bg-[#1A1A1A] rounded-full overflow-hidden">
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
                          ? 'bg-slate-800/40 border border-slate-600/30'
                          : 'hover:bg-[#E8E6E1] dark:hover:bg-[#1A1A1A]'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">Formatting</span>
                        <span className="text-xs font-medium text-slate-400">{metrics.formatting}</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 dark:bg-[#1A1A1A] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-slate-600 to-slate-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((metrics.formatting / 5) * 100, 100)}%` }}
                        />
                      </div>
                    </button>
                  </div>

                </>
              )}
            </div>

            {/* Center Panel: Document Viewer */}
            <div className="flex-1 bg-[#F2F1ED] dark:bg-[#0F0F0F] h-full overflow-y-auto relative" id="document-viewer">
              {/* Enhanced Heatmap Scrollbar */}
              <div className="hidden absolute right-0 top-0 bottom-0 w-1.5 bg-[#E8E6E1] dark:bg-[#0A0A0A] z-10">
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
                    className="text-[15px] whitespace-pre-wrap leading-[1.9] font-light text-[#141414] dark:text-white"
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
                    className="text-[15px] whitespace-pre-wrap leading-[1.9] font-light text-[#141414] dark:text-white"
                    style={{ fontFamily: 'Baskerville, "Libre Baskerville", serif' }}
                  >
                    {submittedDocument}
                  </pre>
                )}
              </div>
            </div>

            {/* Right Panel: Inspector */}
            <div className="w-80 bg-[#F2F1ED] dark:bg-[#0F0F0F] p-6 h-full overflow-y-auto sticky top-0">
              <div className="text-[10px] text-[#141414] dark:text-gray-500 uppercase tracking-wider mb-6">
                {selectedIssue ? "Issue Details" : "Inspector"}
              </div>

              {/* Category List View */}
              {selectedCategory && status === "complete" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-[#141414] dark:text-gray-300">
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
                        <div key={issueId} className="bg-[#F2F1ED] dark:bg-[#0A0A0A] rounded-lg border border-gray-200 dark:border-white/10 overflow-hidden">
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
                            <div className="px-4 pb-4 space-y-5 border-t border-gray-800">
                              {/* Sanction Risk Badge */}
                              <div className="pt-4 flex items-center justify-between">
                                <span className={`text-[9px] px-2.5 py-1 rounded-full uppercase font-bold tracking-wider ${
                                  getSanctionRisk(issue, issue.type) === 'High'
                                    ? 'bg-red-500/20 text-red-400 border border-red-500'
                                    : getSanctionRisk(issue, issue.type) === 'Low'
                                    ? 'bg-slate-500/20 text-slate-400 border border-slate-500'
                                    : 'bg-orange-500/20 text-orange-400 border border-orange-500'
                                }`}>
                                  {getSanctionRisk(issue, issue.type)} Sanction Risk
                                </span>
                              </div>

                              {/* Document Quote */}
                              <div>
                                <div className="text-[10px] text-red-400 uppercase tracking-wider mb-2 font-semibold">⚠️ Problematic Text</div>
                                <div className="text-[12px] text-gray-300 leading-relaxed font-mono italic bg-red-950/20 p-3 rounded border-l-2 border-red-500">
                                  "{issue.quote}"
                                </div>
                              </div>

                              {/* Strategic Vulnerability */}
                              <div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">
                                  Strategic Vulnerability
                                </div>
                                <div className="text-[13px] text-gray-200 leading-relaxed">
                                  {issue.problem || issue.pattern}
                                </div>
                              </div>

                              {/* Database Scan Results (for hallucinations) */}
                              {issue.type === 'hallucination' && (
                                <div className="bg-[#1A1A1A] rounded p-3 border border-red-900/30">
                                  <div className="text-[10px] text-red-400 uppercase tracking-wider mb-2 font-semibold">Database Scan Results</div>
                                  <div className="space-y-1.5 text-[11px]">
                                    <div className="flex items-center justify-between">
                                      <span className="text-gray-400">Westlaw</span>
                                      <span className="text-red-400 font-mono">0 results</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-gray-400">LexisNexis</span>
                                      <span className="text-red-400 font-mono">0 results</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-gray-400">PACER</span>
                                      <span className="text-red-400 font-mono">0 results</span>
                                    </div>
                                  </div>
                                  <div className="mt-2 pt-2 border-t border-gray-800">
                                    <div className="text-[10px] text-red-400 flex items-center gap-1">
                                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                      </svg>
                                      Citation does not exist in legal databases
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Diff View (for misquoted cases) */}
                              {issue.type === 'critical' && issue.quote.includes('2019') && (
                                <div>
                                  <div className="text-[10px] text-orange-400 uppercase tracking-wider mb-2 font-semibold">Source Comparison</div>
                                  <div className="space-y-2">
                                    <div className="bg-red-950/20 p-3 rounded border-l-2 border-red-500">
                                      <div className="text-[9px] text-red-400 uppercase mb-1">Your Brief</div>
                                      <div className="text-[11px] font-mono text-gray-300">
                                        United States v. Brown, 789 F.2d 123 (2d Cir. <span className="bg-red-500/30 px-1">2019</span>)
                                      </div>
                                    </div>
                                    <div className="bg-gray-800/40 p-3 rounded border-l-2 border-gray-400">
                                      <div className="text-[9px] text-gray-300 uppercase mb-1">Actual Citation</div>
                                      <div className="text-[11px] font-mono text-gray-300">
                                        United States v. Brown, 789 F.2d 123 (2d Cir. <span className="bg-gray-600/30 px-1">2018</span>)
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Opposition Playbook - Not shown for formatting issues */}
                              {issue.type !== 'formatting' && (
                                <div className="rounded p-3 border border-purple-900/30 dark:border-purple-900/30">
                                  <div className="text-[10px] text-purple-400 uppercase tracking-wider mb-2 font-semibold">⚔️ Opposition Exploit</div>
                                  <div className="text-[12px] text-[#141414] dark:text-gray-300 leading-relaxed">
                                    {issue.type === 'hallucination' 
                                      ? "Opposing counsel will verify this citation, discover it's fabricated, and file a motion arguing counsel violated Rule 11 by submitting false information to the court. They will request sanctions and use this error to undermine the credibility of your entire filing, potentially seeking attorney's fees."
                                      : "Opposing counsel will cite the correct year and argue that your misrepresentation of controlling authority demonstrates inadequate legal research. They will use this to cast doubt on all your legal arguments and may seek to strike portions of your brief."
                                    }
                                  </div>
                                </div>
                              )}

                              {/* Corrected Draft */}
                              <div>
                                <div className="text-[10px] text-gray-300 uppercase tracking-wider mb-2 font-semibold">✓ {issue.type === 'formatting' ? 'Correct Format' : 'Corrected Draft'}</div>
                                <div className="bg-gray-800/20 rounded p-3 border border-gray-700/30">
                                  <div className="text-[12px] text-gray-300 leading-relaxed mb-3">
                                    {issue.recommendation || getCorrectedDraft(issue, issue.type)}
                                  </div>
                    <button
                      onClick={() => handleCopyToClipboard(getCorrectedDraft(issue, issue.type), issueId)}
                      className="w-full py-2 px-3 bg-[#F2F1ED] dark:bg-[#0F0F0F] hover:opacity-90 border border-gray-300 dark:border-white/10 text-[#1A1A1A] dark:text-white text-xs font-semibold rounded transition-all flex items-center justify-center gap-2"
                    >
                                    {copiedText === issueId ? (
                                      <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Copied!
                                      </>
                                    ) : (
                                      <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        Copy to Clipboard
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>

                              {/* Verify Button */}
                              <button className="w-full py-2.5 px-3 bg-[#F2F1ED] hover:bg-gray-100 text-[#1A1A1A] text-xs font-semibold rounded transition-all flex items-center justify-center gap-2 border border-gray-200">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Verify on Westlaw/Lexis
                              </button>
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
                    <div className="w-12 h-12 mx-auto bg-gray-500/10 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  {/* Sanction Risk & Type Badge */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] px-2.5 py-1 rounded-full uppercase font-bold tracking-wider ${
                      getSanctionRisk(selectedIssue, selectedIssueType) === 'High'
                        ? 'bg-red-500/20 text-red-400 border border-red-500'
                        : getSanctionRisk(selectedIssue, selectedIssueType) === 'Low'
                        ? 'bg-slate-500/20 text-slate-400 border border-slate-500'
                        : 'bg-orange-500/20 text-orange-400 border border-orange-500'
                    }`}>
                      {getSanctionRisk(selectedIssue, selectedIssueType)} Sanction Risk
                    </span>
                    <span className={`text-[9px] px-2 py-1 rounded uppercase font-semibold tracking-wider ${
                      selectedIssueType === 'critical' 
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        : selectedIssueType === 'formatting'
                        ? 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {selectedIssueType === 'critical' ? 'Bad Law' : selectedIssueType === 'formatting' ? 'Formatting' : 'Hallucination'}
                    </span>
                  </div>

                  {/* Document Quote Card */}
                  <div className="bg-[#F2F1ED] dark:bg-[#0A0A0A] rounded-lg p-4 border border-gray-200 dark:border-white/10">
                    <div className="text-[10px] text-red-400 uppercase tracking-wider mb-3 font-semibold">⚠️ Problematic Text</div>
                    <div className="text-[12px] text-gray-300 leading-relaxed font-mono italic bg-red-950/20 p-3 rounded border-l-2 border-red-500">
                      "{selectedIssue.quote}"
                    </div>
                  </div>

                  {/* Strategic Vulnerability Card */}
                  <div className="bg-[#F2F1ED] dark:bg-[#0A0A0A] rounded-lg p-4 border border-gray-200 dark:border-white/10">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-3">
                      {selectedIssue.problem ? 'Problem' : selectedIssue.pattern ? 'Pattern' : 'Issue'}
                    </div>
                    <div className="text-[13px] text-gray-200 leading-relaxed">
                      {selectedIssue.problem || selectedIssue.pattern}
                    </div>
                  </div>

                  {/* Recommendation Card (for formatting issues) */}
                  {selectedIssueType === 'formatting' && selectedIssue.recommendation && (
                    <div className="bg-[#F2F1ED] dark:bg-[#0A0A0A] rounded-lg p-4 border border-gray-200 dark:border-white/10">
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-3">
                        Recommendation
                      </div>
                      <div className="text-[13px] text-gray-200 leading-relaxed">
                        {selectedIssue.recommendation}
                      </div>
                    </div>
                  )}

                  {/* Database Scan Results (for hallucinations) */}
                  {selectedIssueType === 'hallucination' && (
                    <div className="bg-[#1A1A1A] rounded p-4 border border-red-900/30">
                      <div className="text-[10px] text-red-400 uppercase tracking-wider mb-3 font-semibold">Database Scan Results</div>
                      <div className="space-y-2 text-[11px]">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Westlaw</span>
                          <span className="text-red-400 font-mono">0 results</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">LexisNexis</span>
                          <span className="text-red-400 font-mono">0 results</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">PACER</span>
                          <span className="text-red-400 font-mono">0 results</span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-800">
                        <div className="text-[10px] text-red-400 flex items-center gap-1.5">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          Citation does not exist in legal databases
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Diff View (for misquoted cases) */}
                  {selectedIssueType === 'critical' && selectedIssue.quote.includes('2019') && (
                    <div className="bg-[#F2F1ED] dark:bg-[#0A0A0A] rounded-lg p-4 border border-gray-200 dark:border-white/10">
                      <div className="text-[10px] text-orange-400 uppercase tracking-wider mb-3 font-semibold">Source Comparison</div>
                  <div className="space-y-2">
                        <div className="bg-red-950/20 p-3 rounded border-l-2 border-red-500">
                          <div className="text-[9px] text-red-400 uppercase mb-1.5">Your Brief</div>
                          <div className="text-[11px] font-mono text-gray-300">
                            United States v. Brown, 789 F.2d 123 (2d Cir. <span className="bg-red-500/30 px-1">2019</span>)
                          </div>
                        </div>
                        <div className="bg-gray-800/40 p-3 rounded border-l-2 border-gray-400">
                          <div className="text-[9px] text-gray-300 uppercase mb-1.5">Actual Citation</div>
                          <div className="text-[11px] font-mono text-gray-300">
                            United States v. Brown, 789 F.2d 123 (2d Cir. <span className="bg-gray-600/30 px-1">2018</span>)
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Opposition Playbook Card - Not shown for formatting issues */}
                  {selectedIssueType !== 'formatting' && (
                    <div className="rounded-lg p-4 border border-purple-900/30 dark:border-purple-900/30">
                      <div className="text-[10px] text-purple-400 uppercase tracking-wider mb-3 font-semibold">⚔️ Opposition Exploit</div>
                      <div className="text-[12px] text-[#141414] dark:text-gray-300 leading-relaxed">
                        {selectedIssueType === 'hallucination' 
                          ? "Opposing counsel will verify this citation, discover it's fabricated, and file a motion arguing counsel violated Rule 11 by submitting false information to the court. They will request sanctions and use this error to undermine the credibility of your entire filing, potentially seeking attorney's fees."
                          : "Opposing counsel will cite the correct year and argue that your misrepresentation of controlling authority demonstrates inadequate legal research. They will use this to cast doubt on all your legal arguments and may seek to strike portions of your brief."
                        }
                      </div>
                    </div>
                  )}

                  {/* Corrected Draft Card */}
                  <div className="bg-[#F2F1ED] dark:bg-[#0A0A0A] rounded-lg p-4 border border-gray-200 dark:border-white/10">
                    <div className="text-[10px] text-gray-300 uppercase tracking-wider mb-3 font-semibold">✓ Corrected Draft</div>
                    <div className="bg-gray-800/20 rounded p-3 border border-gray-700/30 mb-3">
                      <div className="text-[12px] text-gray-300 leading-relaxed">
                        {getCorrectedDraft(selectedIssue, selectedIssueType)}
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopyToClipboard(getCorrectedDraft(selectedIssue, selectedIssueType), 'single-issue')}
                      className="w-full py-2.5 px-3 bg-[#F2F1ED] dark:bg-[#0A0A0A] hover:opacity-90 border border-gray-300 dark:border-white/10 text-[#1A1A1A] dark:text-white text-xs font-semibold rounded transition-all flex items-center justify-center gap-2"
                    >
                      {copiedText === 'single-issue' ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy to Clipboard
                        </>
                      )}
                    </button>
                  </div>

                  {/* Verify Button */}
                  <button className="w-full py-2.5 px-3 bg-[#F2F1ED] hover:bg-gray-100 text-[#1A1A1A] text-xs font-semibold rounded transition-all flex items-center justify-center gap-2 border border-gray-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Verify on Westlaw/Lexis
                  </button>
                </div>
              )}

              {/* Quick Actions - Bottom of Inspector */}
              {status === "complete" && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 space-y-3">
                  <div className="text-[10px] text-[#141414] dark:text-gray-500 uppercase tracking-wider mb-3">Quick Actions</div>
                  <button 
                    onClick={() => {
                      // Mock download
                      const blob = new Blob(['KORD Legal Analysis Report\n\nThis is a mock export.'], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'kord-legal-report.txt';
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full py-2.5 px-3 bg-[#F2F1ED] dark:bg-[#0A0A0A] hover:bg-gray-100 dark:hover:bg-[#1A1A1A] text-xs text-[#1A1A1A] dark:text-white rounded transition-colors text-left font-medium border border-gray-200 dark:border-white/10"
                  >
                    Export Report
                  </button>
                  <button 
                    onClick={() => {
                      // Mock share link
                      const shareUrl = `https://kord.legal/share/${Date.now()}`;
                      navigator.clipboard.writeText(shareUrl);
                      alert(`Share link copied: ${shareUrl}`);
                    }}
                    className="w-full py-2.5 px-3 bg-[#F2F1ED] dark:bg-[#0A0A0A] hover:bg-gray-100 dark:hover:bg-[#1A1A1A] text-xs text-[#1A1A1A] dark:text-white rounded transition-colors text-left font-medium border border-gray-200 dark:border-white/10"
                  >
                    Share Review
                  </button>
              </div>
            )}

            </div>
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="flex-shrink-0 py-3 bg-[#F2F1ED] dark:bg-[#0A0A0A] border-t border-gray-200 dark:border-white/5">
            <p className="text-[10px] text-gray-600 flex items-center justify-center gap-4">
              <span className="flex items-center gap-1.5">
                <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                SOC2 Compliant
              </span>
              <span className="text-gray-800">|</span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
