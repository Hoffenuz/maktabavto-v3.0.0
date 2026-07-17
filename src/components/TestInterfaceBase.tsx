import { useState, useEffect, useRef } from "react";
import { QuestionNavigation } from "./QuestionNavigation";
import { TestResults } from "./TestResults";
import { QuestionExplanationDialog } from "./QuestionExplanationDialog";
import { VideoModal } from "./darslik/VideoModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Clock, ChevronLeft, ChevronRight, X, Check, Maximize, Minimize, ToggleLeft, ToggleRight, BookOpen, PlayCircle } from "lucide-react";
import { ImageLightbox } from "./ImageLightbox";
import { parseTestQuestions, type Question } from "@/lib/parseTestQuestions";

interface TestInterfaceBaseProps {
  onExit: () => void;
  dataSource: string;
  testName: string;
  questionCount?: number;
  timeLimit?: number;
  randomize?: boolean;
  imagePrefix?: string;
  learningMode?: boolean;
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const TestInterfaceBase = ({ 
  onExit, 
  dataSource, 
  testName,
  questionCount = 20,
  timeLimit = 25 * 60,
  randomize = false,
  imagePrefix = "/images/",
  learningMode = false,
}: TestInterfaceBaseProps) => {
  const { t, questionLang } = useLanguage();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [correctAnswers, setCorrectAnswers] = useState<Record<number, boolean>>({});
  const [revealedQuestions, setRevealedQuestions] = useState<Record<number, boolean>>({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [testStartTime] = useState(Date.now());
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoAdvanceEnabled, setAutoAdvanceEnabled] = useState(!learningMode);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setShowResults(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Fullscreen handlers
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Auto-enter fullscreen when the test loads
  useEffect(() => {
    if (!loading && questions.length > 0 && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }, [loading, questions.length]);

  const loadQuestions = async () => {
    const cacheBuster = `${dataSource}${dataSource.includes("?") ? "&" : "?"}v=${Date.now()}`;
    const response = await fetch(cacheBuster, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(t("test.errorLoadingData"));
    }

    const jsonData = await response.json();
    const transformedQuestions = parseTestQuestions(
      jsonData,
      questionLang,
      imagePrefix,
      questionCount,
      randomize,
      shuffleArray
    );

    if (transformedQuestions.length === 0) {
      throw new Error(t("test.noQuestionsFound"));
    }

    return transformedQuestions;
  };

  // Fetch test data from JSON file
  useEffect(() => {
    const fetchTestData = async () => {
      try {
        setLoading(true);
        setError(null);
        const transformedQuestions = await loadQuestions();
        setQuestions(transformedQuestions);
      } catch (err: unknown) {
        console.error("Error fetching test data:", err);
        const message = err instanceof Error ? err.message : t("test.errorLoadingData");
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchTestData();
  }, [dataSource, questionLang, t, questionCount, randomize, imagePrefix]);

  // Timer - stored in ref so we can clear it when test ends
  useEffect(() => {
    startTimer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // Cleanup auto-advance timeout on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setShowExplanation(false);
    setShowVideo(false);
  }, [currentQuestion]);

  const clearAutoAdvance = () => {
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
  };

  const openExplanation = () => {
    clearAutoAdvance();
    setShowVideo(false);
    setShowExplanation(true);
  };

  const openVideo = () => {
    clearAutoAdvance();
    setShowExplanation(false);
    setShowVideo(true);
  };

  useEffect(() => {
    if (!autoAdvanceEnabled) {
      clearAutoAdvance();
    }
  }, [autoAdvanceEnabled]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalQuestions = questions.length;
  const question = questions[currentQuestion - 1];
  const isRevealed = revealedQuestions[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];

  const handleAnswerSelect = (answerId: number) => {
    if (isRevealed) return;
    
    const isCorrect = answerId === question.correctAnswer;
    
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerId
    }));
    
    setCorrectAnswers(prev => ({
      ...prev,
      [currentQuestion]: isCorrect
    }));
    
    setRevealedQuestions(prev => ({
      ...prev,
      [currentQuestion]: true
    }));

    const hasLearningContent = !!(question.explanation || question.videoUrl);

    if (!autoAdvanceEnabled || (learningMode && hasLearningContent)) {
      return;
    }

    // Check if this was the last question - auto-submit after brief delay
    const answeredCount = Object.keys(selectedAnswers).length + 1; // +1 for current answer
    if (answeredCount >= totalQuestions) {
      // Clear timer and auto-submit after showing feedback
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current);
      }
      autoAdvanceTimeoutRef.current = setTimeout(() => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        autoAdvanceTimeoutRef.current = null;
        setShowResults(true);
      }, 1500);
      return;
    }

    // Auto-advance to next question after 2.5 seconds
    if (currentQuestion < totalQuestions) {
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current);
      }
      autoAdvanceTimeoutRef.current = setTimeout(() => {
        autoAdvanceTimeoutRef.current = null;
        setCurrentQuestion(prev => Math.min(totalQuestions, prev + 1));
      }, 1100);
    }
  };

  const getAnswerState = (answerId: number) => {
    if (!isRevealed || !question) return "default";
    if (answerId === question.correctAnswer) return "correct";
    if (answerId === selectedAnswer && answerId !== question.correctAnswer) return "incorrect";
    return "default";
  };

  const handleFinishTest = () => {
    setShowFinishDialog(true);
  };

  const confirmFinishTest = () => {
    setShowFinishDialog(false);
    // Stop timer before showing results
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    exitFullscreen();
    setShowResults(true);
  };

  const getTestStats = () => {
    let correct = 0;
    let incorrect = 0;
    
    Object.entries(correctAnswers).forEach(([_, isCorrect]) => {
      if (isCorrect) correct++;
      else incorrect++;
    });
    
    return { correct, incorrect };
  };

  // Show results screen
  if (showResults) {
    const stats = getTestStats();
    const timeTaken = Math.floor((Date.now() - testStartTime) / 1000);
    exitFullscreen();

    return (
      <TestResults
        totalQuestions={totalQuestions}
        correctAnswers={stats.correct}
        incorrectAnswers={stats.incorrect}
        timeTaken={timeTaken}
        variant={0}
        onBackToHome={onExit}
        onTryAgain={async () => {
          setSelectedAnswers({});
          setCorrectAnswers({});
          setRevealedQuestions({});
          setCurrentQuestion(1);
          setTimeRemaining(timeLimit);
          setShowResults(false);
          setShowExplanation(false);
          setShowVideo(false);
          setLoading(true);
          startTimer();

          try {
            const transformedQuestions = await loadQuestions();
            setQuestions(transformedQuestions);
          } catch {
            setError(t("test.errorLoadingData"));
          } finally {
            setLoading(false);
          }
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">{testName} {t("test.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 max-w-md text-center">
          <p className="text-destructive mb-6 text-lg">{error}</p>
          <Button size="lg" onClick={onExit}>{t("test.goBack")}</Button>
        </Card>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 max-w-md text-center">
          <p className="text-muted-foreground mb-6 text-lg">{t("test.noQuestionsFound")}</p>
          <Button size="lg" onClick={onExit}>{t("test.goBack")}</Button>
        </Card>
      </div>
    );
  }

  const hasLearningAids = !!(question.explanation || question.videoUrl);
  const showLearningButtons = learningMode ? hasLearningAids : isRevealed && hasLearningAids;

  const learningButtons = showLearningButtons ? (
    <>
      {question.explanation && (
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-9 gap-1.5 border-primary/30 bg-primary/5 px-3 text-primary hover:bg-primary/10 md:h-10 md:px-4"
          onClick={openExplanation}
        >
          <BookOpen className="h-4 w-4" />
          <span className="text-xs md:text-sm">{t("test.viewExplanation")}</span>
        </Button>
      )}
      {question.videoUrl && (
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-9 gap-1.5 border-blue-500/30 bg-blue-500/5 px-3 text-blue-600 hover:bg-blue-500/10 md:h-10 md:px-4"
          onClick={openVideo}
        >
          <PlayCircle className="h-4 w-4" />
          <span className="text-xs md:text-sm">{t("test.viewVideo")}</span>
        </Button>
      )}
    </>
  ) : null;

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-card border-b border-border px-3 py-2 md:px-4 md:py-2.5 shrink-0">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <span className="text-xs md:text-sm font-medium text-muted-foreground">{testName}</span>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="text-sm md:text-base font-medium">{formatTime(timeRemaining)}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 md:h-8 md:px-3 text-xs gap-1.5"
              onClick={() => setAutoAdvanceEnabled(prev => !prev)}
              title={`${t("test.autoAdvance")}: ${autoAdvanceEnabled ? t("test.autoAdvanceOn") : t("test.autoAdvanceOff")}`}
            >
              {autoAdvanceEnabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
              <span className="hidden md:inline">{t("test.autoAdvance")}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 md:h-8 md:px-3"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Kichraytirish" : "To'liq ekran"}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 md:h-8 md:px-3 text-xs bg-green-500/10 text-green-600 border-green-500/30 hover:bg-green-500/20"
              onClick={handleFinishTest}
            >
              {t("test.finish")}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 px-2 md:h-8 md:px-3 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={onExit}
            >
              {t("test.exit")}
            </Button>
          </div>
        </div>
      </header>

      {/* Question Navigation */}
      <QuestionNavigation
        currentQuestion={currentQuestion}
        totalQuestions={totalQuestions}
        answeredQuestions={selectedAnswers}
        correctAnswers={correctAnswers}
        onQuestionSelect={(num) => {
          if (autoAdvanceTimeoutRef.current) {
            clearTimeout(autoAdvanceTimeoutRef.current);
            autoAdvanceTimeoutRef.current = null;
          }
          setCurrentQuestion(num);
        }}
      />

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 md:px-8 md:py-5 w-full overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Question Number */}
          <div className="text-sm md:text-base text-muted-foreground mb-3 font-medium">
            {t("test.question")} {currentQuestion} / {totalQuestions}
          </div>

          {/* Desktop: 55/45 split layout */}
          <div className="md:flex md:gap-8 md:items-start">
            {/* Left Column: Question + Answers (55%) */}
            <div className="md:w-[55%] md:flex-shrink-0">
              {/* Question Text */}
              <Card className="p-4 md:p-5 bg-card border-border mb-4">
                <p className="text-base md:text-lg font-medium text-foreground leading-relaxed">
                  {question.text}
                </p>
              </Card>

              {/* Mobile Only: Question Image - bosilsa kattalashadi */}
              {question.image && (
                <Card className="md:hidden p-3 bg-card border-border mb-4 overflow-hidden">
                  <button type="button" className="block w-full cursor-zoom-in focus:outline-none" onClick={() => setZoomImage(question.image!)}>
                    <img src={question.image} alt="Question illustration" className="w-full h-auto object-contain rounded" />
                  </button>
                </Card>
              )}

              {/* Answer Options */}
              <div className="space-y-3">
                {question.answers.map((answer) => {
                  const state = getAnswerState(answer.id);
                  const isSelected = selectedAnswer === answer.id;
                  
                  return (
                    <button
                      key={answer.id}
                      onClick={() => handleAnswerSelect(answer.id)}
                      disabled={isRevealed}
                      className={`
                        w-full p-4 md:p-4 rounded-lg border text-left transition-all duration-200
                        flex items-center gap-4
                        ${state === "correct" 
                          ? "border-transparent bg-green-500 text-white" 
                          : state === "incorrect"
                          ? "border-transparent bg-red-400 text-white"
                          : isSelected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card hover:bg-muted/50 text-foreground"
                        }
                      `}
                    >
                      <div className={`
                        w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0
                        ${state === "correct"
                          ? "bg-white/20"
                          : state === "incorrect"
                          ? "bg-white/20"
                          : "border-2 border-muted-foreground/50"
                        }
                      `}>
                        {state === "correct" ? (
                          <Check className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        ) : state === "incorrect" ? (
                          <X className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        ) : null}
                      </div>
                      <span className="text-base md:text-base font-medium">{answer.text}</span>
                    </button>
                  );
                })}
              </div>

              {showLearningButtons && (
                <div className="mt-5 rounded-xl border border-primary/15 bg-gradient-to-r from-primary/5 via-background to-blue-500/5 p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t("test.learnMore")}
                  </p>
                  <div className="flex flex-wrap gap-3">{learningButtons}</div>
                </div>
              )}
            </div>

            {/* Right Column: Image (Desktop only - 45%) - bosilsa kattalashadi */}
            {question.image && (
              <div className="hidden md:block md:w-[45%] md:flex-shrink-0">
                <Card className="p-4 bg-card border-border overflow-hidden sticky top-4">
                  <button type="button" className="block w-full cursor-zoom-in focus:outline-none" onClick={() => setZoomImage(question.image!)}>
                    <img src={question.image} alt="Question illustration" className="w-full h-auto object-contain rounded max-h-[88vh]" />
                  </button>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Learning aids bar — footer ustida doim ko'rinadi */}
      {showLearningButtons && (
        <div className="shrink-0 border-t border-primary/20 bg-gradient-to-r from-primary/5 via-card to-blue-500/5 px-3 py-2.5 md:px-4">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-2 md:gap-3">
            <span className="w-full text-center text-[11px] font-medium uppercase tracking-wide text-muted-foreground md:w-auto md:text-xs">
              {t("test.learnMore")}
            </span>
            {learningButtons}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <footer className="bg-card border-t border-border px-3 py-2.5 md:px-4 md:py-3 shrink-0">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="default"
            className="h-9 px-3 md:h-10 md:px-4 text-sm"
            disabled={currentQuestion === 1}
            onClick={() => {
              clearAutoAdvance();
              setCurrentQuestion(prev => Math.max(1, prev - 1));
            }}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {t("test.previous")}
          </Button>
          
          <div className="text-xs md:text-sm text-muted-foreground text-center">
            <span className="font-medium text-primary">{Object.keys(selectedAnswers).length}</span>
            <span> / {totalQuestions}</span>
          </div>

          <Button
            size="default"
            className="h-9 px-3 md:h-10 md:px-4 text-sm"
            disabled={currentQuestion === totalQuestions}
            onClick={() => {
              clearAutoAdvance();
              setCurrentQuestion(prev => Math.min(totalQuestions, prev + 1));
            }}
          >
            {t("test.next")}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </footer>

      {/* Finish Confirmation Dialog */}
      <AlertDialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">{t("test.finishConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              {t("test.finishConfirmDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-11">{t("test.cancel")}</AlertDialogCancel>
            <AlertDialogAction 
              className="h-11 bg-green-500 hover:bg-green-600"
              onClick={confirmFinishTest}
            >
              {t("test.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <ImageLightbox imageUrl={zoomImage} onClose={() => setZoomImage(null)} />

      {question.explanation && (
        <QuestionExplanationDialog
          open={showExplanation}
          onOpenChange={setShowExplanation}
          title={t("test.explanationTitle")}
          explanation={question.explanation}
          correctAnswerText={
            question.answers.find((answer) => answer.id === question.correctAnswer)?.text
          }
        />
      )}

      {question.videoUrl && showVideo && (
        <VideoModal
          url={question.videoUrl}
          index={currentQuestion - 1}
          title={`${t("test.question")} ${currentQuestion} — ${t("test.viewVideo")}`}
          onClose={() => setShowVideo(false)}
        />
      )}
    </div>
  );
};
