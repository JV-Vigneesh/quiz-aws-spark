import { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { userApi } from "@/lib/api";
import { BookOpen, Award, ArrowLeft } from "lucide-react";

interface Quiz {
  quiz_id: string;
  topic: string;
  duration: number;
  total_marks: number;
}

interface Question {
  question_id: string;
  question_text: string;
  options: Record<string, string>;
}

const User = () => {
  const auth = useAuth();
  const [activeView, setActiveView] = useState<"dashboard" | "quizList" | "takeQuiz" | "viewScores">("dashboard");
  const [loading, setLoading] = useState(false);
  
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [scores, setScores] = useState<any[]>([]);
  const [quizResult, setQuizResult] = useState<any>(null);

  const loadQuizzes = async () => {
    setLoading(true);
    try {
      const idToken = auth.user?.id_token;
      if (!idToken) throw new Error("No authentication token");

      const data = await userApi.listQuizzes(idToken);
      setQuizzes(data.quizzes || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load quizzes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async (quiz: Quiz) => {
    setLoading(true);
    setSelectedQuiz(quiz);
    setAnswers({});
    setQuizResult(null);

    try {
      const idToken = auth.user?.id_token;
      if (!idToken) throw new Error("No authentication token");

      const data = await userApi.getQuizQuestions(idToken, quiz.quiz_id);
      setQuestions(data.questions || []);
      setActiveView("takeQuiz");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load quiz questions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const submitQuiz = async () => {
    if (!selectedQuiz) return;

    setLoading(true);
    try {
      const idToken = auth.user?.id_token;
      if (!idToken) throw new Error("No authentication token");

      const result = await userApi.submitQuiz(idToken, selectedQuiz.quiz_id, answers);
      setQuizResult(result);
      
      toast({
        title: "Quiz Submitted!",
        description: `You scored ${result.score || 0} out of ${selectedQuiz.total_marks}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit quiz",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadScores = async () => {
    setLoading(true);
    setActiveView("viewScores");

    try {
      const idToken = auth.user?.id_token;
      if (!idToken) throw new Error("No authentication token");

      const data = await userApi.viewScore(idToken);
      setScores(data.scores || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load scores",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeView === "quizList") {
      loadQuizzes();
    }
  }, [activeView]);

  const allQuestionsAnswered = questions.length > 0 && questions.every(q => answers[q.question_id]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-secondary/30">
      <Header />
      
      <main className="flex-1 container px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">User Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome, {auth.user?.profile.email}
            </p>
          </div>

          {activeView === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView("quizList")}>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Take Quiz</h3>
                    <p className="text-sm text-muted-foreground">Start a new quiz</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={loadScores}>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <Award className="h-8 w-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">My Scores</h3>
                    <p className="text-sm text-muted-foreground">View your results</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeView === "quizList" && (
            <Card className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">Available Quizzes</h2>
                <Button variant="outline" onClick={() => setActiveView("dashboard")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading quizzes...</p>
                </div>
              ) : quizzes.length > 0 ? (
                <div className="grid gap-4">
                  {quizzes.map((quiz) => (
                    <Card key={quiz.quiz_id} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">{quiz.topic}</h3>
                          <p className="text-sm text-muted-foreground">
                            Duration: {quiz.duration} mins • Total Marks: {quiz.total_marks}
                          </p>
                        </div>
                        <Button onClick={() => startQuiz(quiz)}>
                          Start Quiz
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No quizzes available</p>
              )}
            </Card>
          )}

          {activeView === "takeQuiz" && selectedQuiz && !quizResult && (
            <Card className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{selectedQuiz.topic}</h2>
                  <p className="text-sm text-muted-foreground">
                    Duration: {selectedQuiz.duration} mins • Total Marks: {selectedQuiz.total_marks}
                  </p>
                </div>
                <Button variant="outline" onClick={() => setActiveView("quizList")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading questions...</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {questions.map((question, index) => (
                    <div key={question.question_id} className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">
                        {index + 1}. {question.question_text}
                      </h3>
                      <RadioGroup
                        value={answers[question.question_id] || ""}
                        onValueChange={(value) =>
                          setAnswers({ ...answers, [question.question_id]: value })
                        }
                      >
                        {Object.entries(question.options).map(([key, value]) => (
                          <div key={key} className="flex items-center space-x-2">
                            <RadioGroupItem value={key} id={`${question.question_id}-${key}`} />
                            <Label htmlFor={`${question.question_id}-${key}`} className="cursor-pointer">
                              {value}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  ))}

                  <Button
                    onClick={submitQuiz}
                    disabled={!allQuestionsAnswered || loading}
                    className="w-full"
                  >
                    {loading ? "Submitting..." : "Submit Quiz"}
                  </Button>
                </div>
              )}
            </Card>
          )}

          {activeView === "takeQuiz" && quizResult && (
            <Card className="p-8 text-center">
              <Award className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-foreground mb-2">Quiz Completed!</h2>
              <p className="text-xl text-muted-foreground mb-6">
                You scored {quizResult.score || 0} out of {selectedQuiz?.total_marks || 0}
              </p>
              <p className="text-2xl font-semibold text-primary mb-8">
                {((quizResult.score / (selectedQuiz?.total_marks || 1)) * 100).toFixed(1)}%
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => setActiveView("quizList")}>
                  Take Another Quiz
                </Button>
                <Button variant="outline" onClick={loadScores}>
                  View All Scores
                </Button>
              </div>
            </Card>
          )}

          {activeView === "viewScores" && (
            <Card className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">My Scores</h2>
                <Button variant="outline" onClick={() => setActiveView("dashboard")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading scores...</p>
                </div>
              ) : scores.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Quiz</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scores.map((score, index) => (
                      <TableRow key={index}>
                        <TableCell>{score.quiz_id || score.topic || "N/A"}</TableCell>
                        <TableCell>{score.score || 0}</TableCell>
                        <TableCell>{score.total_marks || score.total || 0}</TableCell>
                        <TableCell>
                          {score.percentage || 
                            (score.score && score.total_marks 
                              ? ((score.score / score.total_marks) * 100).toFixed(1) + "%" 
                              : "N/A")}
                        </TableCell>
                        <TableCell>{score.submitted_at || score.date || "N/A"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">No scores yet. Take a quiz to see your results!</p>
              )}
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default User;
