import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Play, Clock, HelpCircle, CheckCircle, GraduationCap } from "lucide-react";
import { TestInterfaceBase } from "@/components/TestInterfaceBase";
import { TestInterfaceCombined } from "@/components/TestInterfaceCombined";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function TestIshlash() {
  const [testStarted, setTestStarted] = useState(false);
  const [questionCount, setQuestionCount] = useState<20 | 50>(20);
  const { user, isLoading } = useAuth();
  const { language } = useLanguage();

  const isLoggedIn = Boolean(user);
  const freeDataFile = language === "uz-lat" ? "700baza2.json" : "700baza.json";
  const dataFile = isLoggedIn ? "1200.json" : freeDataFile;

  if (testStarted) {
    if (questionCount === 50) {
      return <TestInterfaceCombined onExit={() => setTestStarted(false)} dataSources={[`/${dataFile}`]} testName="Test ishlash (50 ta)" questionCount={50} timeLimit={50 * 60} randomize={true} imagePrefix={isLoggedIn ? "/rasm3/" : "/images/"} />;
    }
    return <TestInterfaceBase onExit={() => setTestStarted(false)} dataSource={`/${dataFile}`} testName="Test ishlash" questionCount={20} timeLimit={25 * 60} randomize={true} imagePrefix={isLoggedIn ? "/rasm3/" : "/images/"} />;
  }

  const timeLimit = questionCount === 20 ? 25 : 50;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <SEO title="Test ishlash" description="Tasodifiy savollar bilan test ishlang" path="/test-ishlash" keywords="test ishlash, onlayn test" />
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border bg-card/90 backdrop-blur-xl px-4 py-3 shadow-sm">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-1.5">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Bosh sahifa</span>
              </Button>
            </Link>
            <div className="flex items-center gap-1.5">
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-sm text-center space-y-6">
            <div className="animate-fade-up">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-accent flex items-center justify-center mb-4 shadow-md">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Test ishlash</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {isLoggedIn ? "1200 ta savoldan" : "700 ta savoldan"} {questionCount} tasi tasodifiy olinadi
              </p>
            </div>

            {/* Question count */}
            <Card className="p-5 border-0 shadow-md animate-fade-up-delay-1">
              <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Savollar sonini tanlang</p>
              <div className="grid grid-cols-2 gap-3">
                {([20, 50] as const).map((count) => (
                  <button
                    key={count}
                    onClick={() => setQuestionCount(count)}
                    className={`relative flex flex-col items-center py-4 rounded-xl border-2 transition-all ${
                      questionCount === count ? "border-primary bg-accent shadow-sm" : "border-border hover:border-primary/30"
                    }`}
                  >
                    {questionCount === count && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-sm">
                        <CheckCircle className="w-3 h-3 text-primary-foreground" />
                      </span>
                    )}
                    <span className={`text-2xl font-bold ${questionCount === count ? "text-primary" : "text-foreground"}`}>{count}</span>
                    <span className="text-xs text-muted-foreground mt-0.5">savollar</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Stats */}
            <div className="flex justify-center gap-8 animate-fade-up-delay-2">
              {[
                { icon: HelpCircle, label: "Savollar", value: questionCount },
                { icon: Clock, label: "Daqiqa", value: timeLimit },
                { icon: CheckCircle, label: "O'tish", value: "90%" },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center mb-1.5">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-lg font-bold text-foreground">{s.value}</span>
                    <span className="text-[10px] text-muted-foreground">{s.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="animate-fade-up-delay-3">
              <Button size="lg" className="w-full h-12 text-base gap-2 shadow-lg shadow-primary/25 rounded-xl" onClick={() => setTestStarted(true)}>
                <Play className="w-5 h-5" />
                Testni boshlash
              </Button>
              <p className="text-xs text-muted-foreground mt-3">
                {isLoggedIn ? "Akkauntga kirgan foydalanuvchi 1200 ta savol bazasidan foydalanadi" : "Akauntsiz 700 ta savol bazasi ochiq"}
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
