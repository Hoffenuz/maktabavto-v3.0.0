import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Database, Play, User, LogIn } from "lucide-react";

interface TalimBazaStartPageProps {
  onStartTest: (ticket: number) => void;
}

const TOTAL_TICKETS = 62;
const tickets = Array.from({ length: TOTAL_TICKETS }, (_, i) => i + 1);

export const TalimBazaStartPage = ({ onStartTest }: TalimBazaStartPageProps) => {
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handleStart = () => {
    if (selectedTicket !== null) {
      onStartTest(selectedTicket);
    }
  };

  const getTicketClass = (t: number) => {
    const isSelected = selectedTicket === t;
    return isSelected
      ? "bg-teal-50 text-teal-700 border-teal-400 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-600"
      : "bg-background text-foreground border-border hover:border-teal-400/60 hover:bg-teal-50/40 dark:hover:bg-teal-950/30";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-teal-500/5">
      {/* ───── MOBILE LAYOUT ───── */}
      <div className="lg:hidden flex flex-col min-h-screen bg-background">
        {/* Sticky Header */}
        <div className="bg-card border-b border-border p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-3">
            <Link to="/">
              <Button variant="outline" size="sm" className="gap-2">
                <Home className="w-4 h-4" />
                Bosh sahifa
              </Button>
            </Link>
            {user ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/profile")}
                className="gap-2"
              >
                <User className="w-4 h-4" />
                <span className="text-xs truncate max-w-[100px]">
                  {profile?.full_name || profile?.username || "Profil"}
                </span>
              </Button>
            ) : (
              <Button size="sm" onClick={() => navigate("/auth")} className="gap-2">
                <LogIn className="w-4 h-4" />
                <span className="text-xs">Kirish</span>
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/15 flex items-center justify-center flex-shrink-0">
              <Database className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
            <h1 className="text-base font-bold text-foreground">Ta'lim Baza</h1>
          </div>
        </div>

        {/* Selected + Start */}
        <div className="bg-card border-b border-border p-4">
          {selectedTicket ? (
            <div className="mb-3 p-4 bg-teal-500/8 rounded-lg border border-teal-400/25 text-center">
              <div className="text-5xl font-bold text-teal-600 dark:text-teal-400 mb-1">
                {selectedTicket}
              </div>
              <div className="text-xs text-muted-foreground">Bilet № {selectedTicket}</div>
            </div>
          ) : (
            <div className="mb-3 p-4 bg-muted/30 rounded-lg border border-border text-center">
              <div className="text-sm text-muted-foreground">Quyidan bilet raqamini tanlang</div>
            </div>
          )}
          <Button
            size="lg"
            className="w-full gap-2 bg-teal-600 hover:bg-teal-700 text-white"
            onClick={handleStart}
            disabled={selectedTicket === null}
          >
            <Play className="w-5 h-5" />
            {selectedTicket ? `Bilet ${selectedTicket} ni boshlash` : "Biletni tanlang"}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 p-4 bg-muted/30">
          {[
            { value: "20", label: "Savol" },
            { value: "25", label: "Daqiqa" },
            { value: "90%", label: "O'tish" },
          ].map((s) => (
            <div
              key={s.label}
              className="text-center p-2 bg-card rounded-lg border border-border"
            >
              <div className="text-xl font-bold text-teal-600 dark:text-teal-400">{s.value}</div>
              <div className="text-[10px] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Ticket Grid */}
        <div className="flex-1 p-4 overflow-y-auto">
          <h2 className="text-base font-bold text-foreground mb-3">Bilet raqamini tanlang</h2>
          <div className="grid grid-cols-6 gap-2">
            {tickets.map((t) => (
              <Button
                key={t}
                variant="outline"
                className={`h-11 text-sm font-semibold transition-all ${getTicketClass(t)}`}
                onClick={() => setSelectedTicket(t)}
              >
                {t}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* ───── DESKTOP LAYOUT ───── */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        {/* Left Panel (30%) */}
        <div className="w-[30%] bg-card border-r border-border p-6 flex flex-col">
          <div className="flex-1 flex flex-col">
            {/* Home button */}
            <div className="mb-4">
              <Link to="/">
                <Button variant="outline" size="sm" className="gap-2">
                  <Home className="w-4 h-4" />
                  Bosh sahifa
                </Button>
              </Link>
            </div>

            {/* Profile */}
            <div className="mb-4">
              {user ? (
                <Button
                  variant="outline"
                  onClick={() => navigate("/profile")}
                  className="w-full flex items-center gap-2 h-auto py-2.5 px-3 justify-start"
                >
                  <div className="w-8 h-8 rounded-full bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-semibold text-xs truncate">
                      {profile?.full_name || profile?.username || "Profil"}
                    </div>
                    {profile?.username && profile?.full_name && (
                      <div className="text-[10px] text-muted-foreground truncate">
                        @{profile.username}
                      </div>
                    )}
                  </div>
                </Button>
              ) : (
                <Button onClick={() => navigate("/auth")} className="w-full gap-2" size="sm">
                  <LogIn className="w-4 h-4" />
                  Kirish
                </Button>
              )}
            </div>

            {/* Branding */}
            <div className="mb-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/15 flex items-center justify-center flex-shrink-0">
                <Database className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <div className="font-bold text-foreground">Ta'lim Baza</div>
                <div className="text-[10px] text-muted-foreground">62 ta bilet</div>
              </div>
            </div>

            {/* Selected ticket display */}
            {selectedTicket ? (
              <div className="mb-4 p-6 bg-gradient-to-br from-teal-500/10 to-teal-500/5 rounded-xl border-2 border-teal-400/25 shadow-sm">
                <div className="text-center">
                  <div className="text-6xl font-bold text-teal-600 dark:text-teal-400 mb-1">
                    {selectedTicket}
                  </div>
                  <div className="text-[11px] font-medium text-muted-foreground">
                    Bilet № {selectedTicket}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-4 p-6 bg-muted/20 rounded-xl border-2 border-dashed border-border">
                <div className="text-center text-muted-foreground text-xs">
                  O'ng tomondan bilet raqamini tanlang
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { value: "20", label: "Savol", color: "blue" },
                { value: "25", label: "Daqiqa", color: "purple" },
                { value: "90%", label: "O'tish", color: "teal" },
              ].map((s) => (
                <div
                  key={s.label}
                  className={`text-center p-2.5 rounded-lg border
                    ${s.color === "blue"
                      ? "bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950 dark:to-blue-900/50 border-blue-200 dark:border-blue-800"
                      : s.color === "purple"
                      ? "bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950 dark:to-purple-900/50 border-purple-200 dark:border-purple-800"
                      : "bg-gradient-to-br from-teal-50 to-teal-100/50 dark:from-teal-950 dark:to-teal-900/50 border-teal-200 dark:border-teal-800"
                    }`}
                >
                  <div className={`text-xl font-bold
                    ${s.color === "blue"
                      ? "text-blue-600 dark:text-blue-400"
                      : s.color === "purple"
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-teal-600 dark:text-teal-400"
                    }`}>
                    {s.value}
                  </div>
                  <div className="text-[9px] text-muted-foreground mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Start Button */}
            <Button
              size="lg"
              className="w-full mb-3 gap-2 h-12 text-sm font-semibold shadow-lg hover:shadow-xl transition-all bg-teal-600 hover:bg-teal-700 text-white"
              onClick={handleStart}
              disabled={selectedTicket === null}
            >
              <Play className="w-4 h-4" />
              {selectedTicket ? `Bilet ${selectedTicket} ni boshlash` : "Biletni tanlang"}
            </Button>

            {/* Instructions */}
            <div className="p-3 bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg border border-border">
              <h3 className="text-[10px] font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-teal-500" />
                Ko'rsatmalar
              </h3>
              <div className="text-[10px] text-muted-foreground space-y-1">
                <div className="flex items-start gap-1.5">
                  <span className="text-teal-500 mt-0.5">•</span>
                  <span>Har bir biletda 20 ta savol bor</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-teal-500 mt-0.5">•</span>
                  <span>Vaqt chegarasi: 25 daqiqa</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-teal-500 mt-0.5">•</span>
                  <span>O'tish bali: 90% (18/20 savol)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel (70%) */}
        <div className="w-[70%] bg-background p-8 overflow-y-auto">
          <div className="max-w-5xl">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-1">Bilet raqamini tanlang</h1>
              <p className="text-sm text-muted-foreground">
                62 ta ta'lim baza biletlaridan birini tanlang
              </p>
            </div>

            <div className="grid grid-cols-10 gap-2 mb-4">
              {tickets.map((t) => (
                <Button
                  key={t}
                  variant="outline"
                  className={`h-12 text-base font-semibold transition-all ${getTicketClass(t)}`}
                  onClick={() => setSelectedTicket(t)}
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
