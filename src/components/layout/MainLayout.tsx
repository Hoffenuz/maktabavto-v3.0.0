import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  LogIn,
  Globe,
  ChevronDown,
  Home,
  Phone,
  BookOpen,
  Info,
  MapPin,
  Clock,
  TrafficCone,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuClosing, setMobileMenuClosing] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const closeMobileMenu = () => {
    setMobileMenuClosing(true);
    setTimeout(() => {
      setMobileMenuOpen(false);
      setMobileMenuClosing(false);
    }, 300);
  };

  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) closeMobileMenu();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileMenuOpen]);

  const navLinks = [
    { path: "/", label: t("nav.home"), icon: Home },
    { path: "/contact", label: t("nav.contact"), icon: Phone },
    { path: "/belgilar", label: t("Belgilar"), icon: TrafficCone },
    { path: "/darslik", label: t("nav.darslik"), icon: BookOpen },
    { path: "/variant", label: "Variantlar", icon: ClipboardList },
  ];

  const languages = [
    { code: "uz-lat" as const, display: "UZ", label: t("nav.langLatin") },
    { code: "uz" as const, display: "ЎЗ", label: t("nav.langCyrillic") },
    { code: "ru" as const, display: "RU", label: t("nav.langRussian") },
  ];

  const currentLangDisplay =
    languages.find((l) => l.code === language)?.display ?? "UZ";

  const isMavzuliSection =
    location.pathname === "/mavzuli" || location.pathname.startsWith("/mavzuli/");
  if (isMavzuliSection) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-card/90 backdrop-blur-xl border-b border-border/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/rasm1.webp"
                alt="Avtoexclusive"
                className="w-9 h-9 rounded-xl object-cover shadow-md"
              />
              <div className="hidden sm:block">
                <span className="font-bold text-foreground text-base">
                  Avtoexclusive
                </span>
                <span className="block text-[10px] text-muted-foreground -mt-0.5">
                  Avtomaktab
                </span>
              </div>
            </Link>

            {/* Center: Desktop nav */}
            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                    location.pathname === item.path
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {user && (
                <Link
                  to="/mavzuli"
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                    location.pathname === "/mavzuli"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  Mavzuli testlar
                </Link>
              )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5">
              {/* Language */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  onBlur={() => setTimeout(() => setLangMenuOpen(false), 200)}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm font-medium px-2.5 py-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-xs font-semibold">{currentLangDisplay}</span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${
                      langMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {langMenuOpen && (
                  <div className="absolute top-full right-0 mt-1.5 w-40 bg-card rounded-xl shadow-xl border border-border py-1.5 z-50">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors rounded-lg mx-0 ${
                          language === l.code
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-foreground hover:bg-accent"
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <ThemeToggle />

              {/* User / Login */}
              {user ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/profile")}
                  className="gap-2 h-9"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                      {getInitials(profile?.full_name || profile?.username)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden lg:block text-sm font-medium">
                    {profile?.full_name || profile?.username || t("nav.user")}
                  </span>
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => navigate("/auth")}
                  className="h-9 gap-1.5 shadow-sm shadow-primary/20"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{t("nav.login")}</span>
                </Button>
              )}

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-lg text-foreground hover:bg-accent transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[999] md:hidden">
          <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-[2px] ${mobileMenuClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          <div
            className={`absolute top-0 right-0 h-full w-80 max-w-[88vw] bg-background shadow-2xl border-l border-border ${mobileMenuClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'}`}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile menu"
          >
            <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/rasm1.webp"
                    alt="Avtoexclusive"
                    className="w-9 h-9 rounded-xl object-cover shadow-sm"
                  />
                  <span className="font-bold text-foreground text-lg">Menu</span>
                </div>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 rounded-xl hover:bg-accent transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <nav className="p-4 space-y-1.5">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-foreground hover:bg-accent active:scale-95"
                    }`}
                    onClick={closeMobileMenu}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {user && (
                <>
                  <div className="h-px bg-border my-3" />
                  <Link
                    to="/darslik"
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      location.pathname === "/darslik"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-foreground hover:bg-accent active:scale-95"
                    }`}
                    onClick={closeMobileMenu}
                  >
                    <BookOpen className="w-5 h-5 flex-shrink-0" />
                    <span>Darslik</span>
                  </Link>

                  <Link
                    to="/mavzuli"
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      location.pathname === "/mavzuli"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-foreground hover:bg-accent active:scale-95"
                    }`}
                    onClick={closeMobileMenu}
                  >
                    <Info className="w-5 h-5 flex-shrink-0" />
                    <span>Mavzuli testlar</span>
                  </Link>
                </>
              )}

              {!user && (
                <>
                  <div className="h-px bg-border my-3" />
                  <Button
                    onClick={() => {
                      closeMobileMenu();
                      setTimeout(() => navigate("/auth"), 300);
                    }}
                    className="w-full gap-2 h-12 shadow-md font-semibold transition-all duration-200 active:scale-95"
                    size="lg"
                  >
                    <LogIn className="w-4 h-4" />
                    {t("nav.login")}
                  </Button>
                </>
              )}

              <div className="h-px bg-border my-3" />
              <div className="px-4 py-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Til / Language</p>
                <div className="space-y-1.5">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                        language === l.code
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-foreground hover:bg-accent active:scale-95"
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <img
                  src="/rasm1.webp"
                  alt="Avtoexclusive"
                  className="w-8 h-8 rounded-lg object-cover shadow-sm"
                />
                <div>
                  <span className="font-bold text-foreground">Avtoexclusive</span>
                  <span className="block text-[10px] text-muted-foreground -mt-0.5">
                    Avtomaktab
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {t("footer.aboutText")}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-4">
                {t("footer.quickLinksTitle")}
              </h3>
              <div className="space-y-2">
                {navLinks.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="block text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-4">
                {t("footer.contactTitle")}
              </h3>
              <div className="space-y-3 text-muted-foreground">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Urganch sh., AL Xorazmiy ko'chasi 111/2-uy</span>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>
                    +998 99 065 62 00
                    <br />
                    +998 97 516 62 00
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Dush - Shan: 09:00 - 18:00</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-6 text-center text-muted-foreground text-xs">
            {t("footer.copyright")}
          </div>
        </div>
      </footer>
    </div>
  );
}
