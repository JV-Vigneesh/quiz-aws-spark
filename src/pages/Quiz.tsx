import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, XCircle, LayoutGrid, LayoutList } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const API_BASE = ""; // Example: https://abcd1234.execute-api.ap-south-1.amazonaws.com/prod
const API_KEY = ""; // Paste your actual key here

interface Question {
  question_id: number;
  question_text: string;
  options: string[];
  correct_answer: string;
}

type QuizState = "welcome" | "quiz" | "results";
type ViewMode = "vertical" | "horizontal";

const Quiz = () => {
  const [state, setState] = useState<QuizState>("welcome");
  const [userName, setUserName] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("vertical");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { toast } = useToast();

  const loadQuestions = async () => {
    if (!userName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name to start the quiz.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/getQuestions`, {
        headers: { "x-api-key": API_KEY },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const text = await res.text();
      const data = JSON.parse(text);
      const parsedBody = JSON.parse(data.body);
      const fetchedQuestions = parsedBody.questions || [];

      if (fetchedQuestions.length === 0) {
        toast({
          title: "No Questions",
          description: "No questions found in the database.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      setQuestions(fetchedQuestions);
      setCurrentQuestionIndex(0);
      setState("quiz");
    } catch (err) {
      console.error("Error loading questions:", err);
      toast({
        title: "Error",
        description: "Failed to load questions. Please check your API configuration.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const submitQuiz = async () => {
    setLoading(true);
    const payload = {
      user_name: userName,
      answers: answers,
    };

    try {
      const res = await fetch(`${API_BASE}/submitQuiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setScore(data.score);
      setMessage(data.message);
      setState("results");
    } catch (err) {
      console.error("Error submitting quiz:", err);
      toast({
        title: "Submission Error",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    setState("welcome");
    setUserName("");
    setQuestions([]);
    setAnswers({});
    setScore(null);
    setMessage("");
    setCurrentQuestionIndex(0);
  };

  if (state === "welcome") {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-secondary/30">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4 relative">
          <Card className="w-full max-w-md p-8 shadow-[var(--shadow-elevated)] border-border/50 relative z-10">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <svg
                  className="w-10 h-10 text-primary-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to Quiz</h1>
              <p className="text-muted-foreground">Enter your name to begin the challenge</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-foreground">
                  Your Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && loadQuestions()}
                  className="h-12 text-base"
                  disabled={loading}
                />
              </div>

              <Button
                onClick={loadQuestions}
                disabled={loading || !userName.trim()}
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Loading Quiz...
                  </>
                ) : (
                  "Start Quiz"
                )}
              </Button>
            </div>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (state === "quiz") {
    const answeredCount = Object.keys(answers).length;
    const progress = (answeredCount / questions.length) * 100;

    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-secondary/30">
        <Header />
        <div className="flex-1 p-4 py-8 relative">
          <div className={`${viewMode === "horizontal" ? "max-w-7xl" : "max-w-3xl"} mx-auto relative z-10`}>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Quiz in Progress</h2>
                  <p className="text-muted-foreground">
                    Welcome, <span className="font-semibold text-foreground">{userName}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "vertical" ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("vertical")}
                    className="gap-2"
                  >
                    <LayoutList className="h-4 w-4" />
                    Vertical
                  </Button>
                  <Button
                    variant={viewMode === "horizontal" ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("horizontal")}
                    className="gap-2"
                  >
                    <LayoutGrid className="h-4 w-4" />
                    Horizontal
                  </Button>
                </div>
              </div>
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {answeredCount} of {questions.length} answered
              </p>
            </div>

            {viewMode === "vertical" ? (
              <div className="space-y-6">
                {questions.map((q, idx) => (
                  <Card
                    key={q.question_id}
                    className="p-6 shadow-[var(--shadow-card)] border-border/50 transition-all duration-300 hover:shadow-[var(--shadow-elevated)]"
                  >
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary mr-3">
                        {idx + 1}
                      </span>
                      {q.question_text}
                    </h3>

                    <RadioGroup
                      value={answers[q.question_id] || ""}
                      onValueChange={(value) =>
                        setAnswers((prev) => ({ ...prev, [q.question_id]: value }))
                      }
                      className="space-y-3"
                    >
                      {q.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          onClick={() =>
                            setAnswers((prev) => ({ ...prev, [q.question_id]: option }))
                          }
                          className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:border-primary/50 hover:bg-primary/5 ${
                            answers[q.question_id] === option
                              ? "border-primary bg-primary/10"
                              : "border-border"
                          }`}
                        >
                          <RadioGroupItem value={option} id={`q${q.question_id}-opt${optIndex}`} />
                          <Label
                            htmlFor={`q${q.question_id}-opt${optIndex}`}
                            className="flex-1 cursor-pointer font-medium"
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex gap-6">
                {/* Sidebar */}
                <Card className="w-64 p-4 shadow-[var(--shadow-card)] border-border/50 h-fit sticky top-24">
                  <h3 className="font-semibold text-foreground mb-3">Questions</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {questions.map((q, idx) => (
                      <button
                        key={q.question_id}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`w-10 h-10 rounded-lg font-medium text-sm transition-all duration-200 ${
                          currentQuestionIndex === idx
                            ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                            : answers[q.question_id]
                            ? "bg-accent/20 text-accent border border-accent"
                            : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-primary"></div>
                      <span className="text-muted-foreground">Current</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-accent/20 border border-accent"></div>
                      <span className="text-muted-foreground">Answered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-secondary"></div>
                      <span className="text-muted-foreground">Not answered</span>
                    </div>
                  </div>
                </Card>

                {/* Current Question */}
                <div className="flex-1">
                  <Card className="p-8 shadow-[var(--shadow-elevated)] border-border/50">
                    <h3 className="text-2xl font-semibold text-foreground mb-6">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary mr-4">
                        {currentQuestionIndex + 1}
                      </span>
                      {questions[currentQuestionIndex].question_text}
                    </h3>

                    <RadioGroup
                      value={answers[questions[currentQuestionIndex].question_id] || ""}
                      onValueChange={(value) =>
                        setAnswers((prev) => ({
                          ...prev,
                          [questions[currentQuestionIndex].question_id]: value,
                        }))
                      }
                      className="space-y-4"
                    >
                      {questions[currentQuestionIndex].options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          onClick={() =>
                            setAnswers((prev) => ({
                              ...prev,
                              [questions[currentQuestionIndex].question_id]: option,
                            }))
                          }
                          className={`flex items-center space-x-4 p-5 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:border-primary/50 hover:bg-primary/5 ${
                            answers[questions[currentQuestionIndex].question_id] === option
                              ? "border-primary bg-primary/10"
                              : "border-border"
                          }`}
                        >
                          <RadioGroupItem
                            value={option}
                            id={`q${questions[currentQuestionIndex].question_id}-opt${optIndex}`}
                          />
                          <Label
                            htmlFor={`q${questions[currentQuestionIndex].question_id}-opt${optIndex}`}
                            className="flex-1 cursor-pointer font-medium text-base"
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>

                    <div className="flex gap-4 mt-8">
                      <Button
                        onClick={() =>
                          setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
                        }
                        disabled={currentQuestionIndex === 0}
                        variant="outline"
                        className="flex-1"
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={() =>
                          setCurrentQuestionIndex((prev) =>
                            Math.min(questions.length - 1, prev + 1)
                          )
                        }
                        disabled={currentQuestionIndex === questions.length - 1}
                        variant="outline"
                        className="flex-1"
                      >
                        Next
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            <div className="mt-8">
              <Button
                onClick={submitQuiz}
                disabled={loading || answeredCount < questions.length}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  `Submit Quiz (${answeredCount}/${questions.length})`
                )}
              </Button>
              {answeredCount < questions.length && (
                <p className="text-center text-sm text-muted-foreground mt-2">
                  Please answer all questions to submit
                </p>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (state === "results") {
    const percentage = score !== null ? (score / questions.length) * 100 : 0;
    const passed = percentage >= 50;

    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-secondary/30">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4 relative">
          <Card className="w-full max-w-lg p-8 shadow-[var(--shadow-elevated)] border-border/50 text-center relative z-10">
            <div className="mb-6">
              {passed ? (
                <CheckCircle2 className="w-24 h-24 mx-auto text-green-500 mb-4" />
              ) : (
                <XCircle className="w-24 h-24 mx-auto text-destructive mb-4" />
              )}
              <h2 className="text-3xl font-bold text-foreground mb-2">Quiz Complete!</h2>
              <p className="text-muted-foreground">{message}</p>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 mb-6">
              <div className="text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                {score}/{questions.length}
              </div>
              <div className="text-2xl font-semibold text-foreground mb-1">
                {percentage.toFixed(0)}%
              </div>
              <p className="text-sm text-muted-foreground">
                {passed ? "Great job!" : "Keep practicing!"}
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={resetQuiz}
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300"
              >
                Take Another Quiz
              </Button>
            </div>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return null;
};

export default Quiz;
