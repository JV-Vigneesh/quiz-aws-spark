import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Brain, Clock, Award, TrendingUp } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-secondary/30">
      <Header />
      
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="container px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in">
              Test Your Knowledge
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in">
              Challenge yourself with our interactive quizzes and track your progress
              as you master new topics.
            </p>
            <Link to="/quiz">
              <Button
                size="lg"
                className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl animate-fade-in"
              >
                Start Quiz Now
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="container px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="p-6 shadow-[var(--shadow-card)] border-border/50 hover:shadow-[var(--shadow-elevated)] transition-all duration-300">
              <Brain className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Smart Questions
              </h3>
              <p className="text-sm text-muted-foreground">
                Carefully curated questions to test your knowledge effectively
              </p>
            </Card>

            <Card className="p-6 shadow-[var(--shadow-card)] border-border/50 hover:shadow-[var(--shadow-elevated)] transition-all duration-300">
              <Clock className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Flexible Timing
              </h3>
              <p className="text-sm text-muted-foreground">
                Take quizzes at your own pace without time pressure
              </p>
            </Card>

            <Card className="p-6 shadow-[var(--shadow-card)] border-border/50 hover:shadow-[var(--shadow-elevated)] transition-all duration-300">
              <Award className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Instant Results
              </h3>
              <p className="text-sm text-muted-foreground">
                Get your score immediately and see detailed feedback
              </p>
            </Card>

            <Card className="p-6 shadow-[var(--shadow-card)] border-border/50 hover:shadow-[var(--shadow-elevated)] transition-all duration-300">
              <TrendingUp className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Track Progress
              </h3>
              <p className="text-sm text-muted-foreground">
                Monitor your improvement and identify areas to focus on
              </p>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container px-4 py-16 mb-16">
          <Card className="max-w-3xl mx-auto p-8 md:p-12 shadow-[var(--shadow-elevated)] border-border/50 text-center bg-gradient-to-br from-primary/10 to-accent/10">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground mb-6">
              Join now and start your learning journey today!
            </p>
            <Link to="/quiz">
              <Button
                size="lg"
                className="h-12 px-6 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300"
              >
                Take Your First Quiz
              </Button>
            </Link>
          </Card>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
