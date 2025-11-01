import { useState } from "react";
import { useAuth } from "react-oidc-context";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { adminApi } from "@/lib/api";
import { Users, Award, PlusCircle } from "lucide-react";

const Admin = () => {
  const auth = useAuth();
  const [activeView, setActiveView] = useState<"dashboard" | "addQuestion" | "createQuiz" | "viewUsers" | "viewScores">("dashboard");
  const [loading, setLoading] = useState(false);
  
  // Add Question form state
  const [questionForm, setQuestionForm] = useState({
    question_id: "",
    question_text: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correct_answer: "",
    topic: "",
  });

  // Create Quiz form state
  const [quizForm, setQuizForm] = useState({
    quiz_id: "",
    topic: "",
    question_ids: "",
    duration: "",
    total_marks: "",
  });

  // Data state
  const [users, setUsers] = useState<any[]>([]);
  const [scores, setScores] = useState<any[]>([]);

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const idToken = auth.user?.id_token;
      if (!idToken) throw new Error("No authentication token");

      await adminApi.addQuestion(idToken, {
        question_id: questionForm.question_id,
        question_text: questionForm.question_text,
        options: {
          A: questionForm.optionA,
          B: questionForm.optionB,
          C: questionForm.optionC,
          D: questionForm.optionD,
        },
        correct_answer: questionForm.correct_answer,
        topic: questionForm.topic,
      });

      toast({
        title: "Success",
        description: "Question added successfully!",
      });

      setQuestionForm({
        question_id: "",
        question_text: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correct_answer: "",
        topic: "",
      });
      setActiveView("dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add question",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const idToken = auth.user?.id_token;
      if (!idToken) throw new Error("No authentication token");

      const questionIds = quizForm.question_ids.split(",").map(id => id.trim());
      
      await adminApi.createQuiz(idToken, {
        quiz_id: quizForm.quiz_id,
        topic: quizForm.topic,
        question_ids: questionIds,
        duration: parseInt(quizForm.duration),
        total_marks: parseInt(quizForm.total_marks),
      });

      toast({
        title: "Success",
        description: "Quiz created successfully!",
      });

      setQuizForm({
        quiz_id: "",
        topic: "",
        question_ids: "",
        duration: "",
        total_marks: "",
      });
      setActiveView("dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create quiz",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewUsers = async () => {
    setLoading(true);
    setActiveView("viewUsers");

    try {
      const idToken = auth.user?.id_token;
      if (!idToken) throw new Error("No authentication token");

      const data = await adminApi.viewUsers(idToken);
      setUsers(data.users || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewScores = async () => {
    setLoading(true);
    setActiveView("viewScores");

    try {
      const idToken = auth.user?.id_token;
      if (!idToken) throw new Error("No authentication token");

      const data = await adminApi.viewScores(idToken);
      setScores(data.scores || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch scores",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-secondary/30">
      <Header />
      
      <main className="flex-1 container px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome, {auth.user?.profile.email}
            </p>
          </div>

          {activeView === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView("addQuestion")}>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <PlusCircle className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Add Question</h3>
                    <p className="text-sm text-muted-foreground">Add to question bank</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView("createQuiz")}>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <PlusCircle className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Create Quiz</h3>
                    <p className="text-sm text-muted-foreground">Link questions to quiz</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={handleViewUsers}>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <Users className="h-8 w-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">View Users</h3>
                    <p className="text-sm text-muted-foreground">Manage users</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={handleViewScores}>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-secondary/20 rounded-lg">
                    <Award className="h-8 w-8 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">View Scores</h3>
                    <p className="text-sm text-muted-foreground">Check results</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeView === "addQuestion" && (
            <Card className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">Add New Question</h2>
                <Button variant="outline" onClick={() => setActiveView("dashboard")}>
                  Back to Dashboard
                </Button>
              </div>

              <form onSubmit={handleAddQuestion} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="question_id">Question ID</Label>
                  <Input
                    id="question_id"
                    value={questionForm.question_id}
                    onChange={(e) => setQuestionForm({ ...questionForm, question_id: e.target.value })}
                    placeholder="e.g., q1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="question_text">Question Text</Label>
                  <Input
                    id="question_text"
                    value={questionForm.question_text}
                    onChange={(e) => setQuestionForm({ ...questionForm, question_text: e.target.value })}
                    placeholder="Enter the question"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    value={questionForm.topic}
                    onChange={(e) => setQuestionForm({ ...questionForm, topic: e.target.value })}
                    placeholder="e.g., AWS Basics"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="optionA">Option A</Label>
                    <Input
                      id="optionA"
                      value={questionForm.optionA}
                      onChange={(e) => setQuestionForm({ ...questionForm, optionA: e.target.value })}
                      placeholder="Option A text"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="optionB">Option B</Label>
                    <Input
                      id="optionB"
                      value={questionForm.optionB}
                      onChange={(e) => setQuestionForm({ ...questionForm, optionB: e.target.value })}
                      placeholder="Option B text"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="optionC">Option C</Label>
                    <Input
                      id="optionC"
                      value={questionForm.optionC}
                      onChange={(e) => setQuestionForm({ ...questionForm, optionC: e.target.value })}
                      placeholder="Option C text"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="optionD">Option D</Label>
                    <Input
                      id="optionD"
                      value={questionForm.optionD}
                      onChange={(e) => setQuestionForm({ ...questionForm, optionD: e.target.value })}
                      placeholder="Option D text"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="correct_answer">Correct Answer</Label>
                  <Input
                    id="correct_answer"
                    value={questionForm.correct_answer}
                    onChange={(e) => setQuestionForm({ ...questionForm, correct_answer: e.target.value })}
                    placeholder="A, B, C, or D"
                    required
                    maxLength={1}
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Adding..." : "Add Question"}
                </Button>
              </form>
            </Card>
          )}

          {activeView === "createQuiz" && (
            <Card className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">Create New Quiz</h2>
                <Button variant="outline" onClick={() => setActiveView("dashboard")}>
                  Back to Dashboard
                </Button>
              </div>

              <form onSubmit={handleCreateQuiz} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="quiz_id">Quiz ID</Label>
                  <Input
                    id="quiz_id"
                    value={quizForm.quiz_id}
                    onChange={(e) => setQuizForm({ ...quizForm, quiz_id: e.target.value })}
                    placeholder="e.g., quiz-001"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    value={quizForm.topic}
                    onChange={(e) => setQuizForm({ ...quizForm, topic: e.target.value })}
                    placeholder="e.g., AWS Basics"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="question_ids">Question IDs (comma-separated)</Label>
                  <Input
                    id="question_ids"
                    value={quizForm.question_ids}
                    onChange={(e) => setQuizForm({ ...quizForm, question_ids: e.target.value })}
                    placeholder="e.g., q1, q2, q3"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={quizForm.duration}
                      onChange={(e) => setQuizForm({ ...quizForm, duration: e.target.value })}
                      placeholder="10"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="total_marks">Total Marks</Label>
                    <Input
                      id="total_marks"
                      type="number"
                      value={quizForm.total_marks}
                      onChange={(e) => setQuizForm({ ...quizForm, total_marks: e.target.value })}
                      placeholder="20"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Creating..." : "Create Quiz"}
                </Button>
              </form>
            </Card>
          )}

          {activeView === "viewUsers" && (
            <Card className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">All Users</h2>
                <Button variant="outline" onClick={() => setActiveView("dashboard")}>
                  Back to Dashboard
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading users...</p>
                </div>
              ) : users.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user, index) => (
                      <TableRow key={index}>
                        <TableCell>{user.user_id || user.id || "N/A"}</TableCell>
                        <TableCell>{user.email || "N/A"}</TableCell>
                        <TableCell>{user.role || "User"}</TableCell>
                        <TableCell>{user.created_at || "N/A"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">No users found</p>
              )}
            </Card>
          )}

          {activeView === "viewScores" && (
            <Card className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">All Scores</h2>
                <Button variant="outline" onClick={() => setActiveView("dashboard")}>
                  Back to Dashboard
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
                      <TableHead>User Email</TableHead>
                      <TableHead>Quiz ID</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scores.map((score, index) => (
                      <TableRow key={index}>
                        <TableCell>{score.user_email || score.email || "N/A"}</TableCell>
                        <TableCell>{score.quiz_id || "N/A"}</TableCell>
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
                <p className="text-center text-muted-foreground py-8">No scores found</p>
              )}
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
