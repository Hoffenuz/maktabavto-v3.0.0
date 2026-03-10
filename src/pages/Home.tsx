import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Play, MonitorSmartphone, ShieldCheck, Trophy, BookOpen, FileText,
  MapPin, Phone, Clock, GraduationCap, Users, CheckCircle, Lock, Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import heroBg from "@/assets/hero-bg.jpg";
import schoolBuilding from "@/assets/school-building.png";

export default function Home() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const features = [
    { icon: MonitorSmartphone, titleKey: "home.feature1Title", descKey: "home.feature1Desc" },
    { icon: ShieldCheck, titleKey: "home.feature2Title", descKey: "home.feature2Desc" },
    { icon: Trophy, titleKey: "home.feature3Title", descKey: "home.feature3Desc" },
  ];

  const quickLinks = [
    { icon: Play, label: t("home.btnTest"), to: "/test-ishlash", desc: "Tasodifiy savollar bilan mashq qiling" },
    { icon: FileText, label: t("home.btnVariantlar"), to: "/variant", desc: "61 ta variant test savollari", requireAuth: true },
    { icon: Database, label: "Ta'lim Baza", to: "/talim-baza", desc: "62 ta ta'lim baza biletlari", requireAuth: true },
    { icon: BookOpen, label: "Darslik", to: "/darslik", desc: "Video darsliklar va o'quv materiallari", requireAuth: true },
    { icon: FileText, label: "Mavzuli testlar", to: "/mavzuli", desc: "Mavzu bo'yicha testlar", requireAuth: true },
  ];

  const stats = [
    { value: "1200+", label: "Savollar", icon: FileText },
    { value: "61", label: "Variantlar", icon: Trophy },
    { value: "500+", label: "O'quvchilar", icon: Users },
    { value: "95%", label: "Muvaffaqiyat", icon: CheckCircle },
  ];

  return (
    <MainLayout>
      <SEO
        title={t("home.seoTitle")}
        description={t("home.seoDescription")}
        path="/"
        keywords="avtotest, onlayn test, prava test, prava olish, YHQ testlari, yo'l belgilari, avtomaktab"
      />

      {/* Hero with blurred background */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-32">
          <div className="max-w-2xl animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 text-primary text-sm font-medium mb-6">
              <GraduationCap className="w-4 h-4" />
              Avtoexclusive Avtomaktab
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-5 leading-[1.1] tracking-tight">
              Avtoexclusive - Avtomaktab Urganch shahri
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
              Professional haydovchilik ko'nikmalarini o'rganing. Nazariy bilim va amaliy mashg'ulotlar orqali haydovchilik guvohnomasini oling
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link to="/test-ishlash">
                <Button size="lg" className="w-full gap-2 h-12 text-sm font-bold shadow-lg bg-blue-600 hover:bg-blue-700 text-white">
                  <Play className="w-4 h-4" />
                  Test ishlash
                </Button>
              </Link>
              <Link to={user ? "/talim-baza" : "/auth"}>
                <Button size="lg" className="w-full gap-2 h-12 text-sm font-bold shadow-lg bg-teal-600 hover:bg-teal-700 text-white">
                  {user ? <Database className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  Ta'lim Baza
                </Button>
              </Link>
              <Link to={user ? "/variant" : "/auth"}>
                <Button size="lg" className="w-full gap-2 h-12 text-sm font-bold shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white">
                  {user ? <FileText className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  Variantlar
                </Button>
              </Link>
              <Link to={user ? "/darslik" : "/auth"}>
                <Button size="lg" className="w-full gap-2 h-12 text-sm font-bold shadow-lg bg-purple-600 hover:bg-purple-700 text-white">
                  {user ? <BookOpen className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  Darsliklar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative -mt-6 z-10 px-4">
        <div className="max-w-6xl mx-auto">
          <Link to="/test-ishlash" className="block mb-4 text-center group">
            <h3 className="text-lg font-bold text-primary group-hover:underline">Test boshlash →</h3>
          </Link>
          <Card className="border-0 shadow-xl bg-card/95 backdrop-blur-md">
            <CardContent className="p-0">
              <div className="grid grid-cols-2 md:grid-cols-4">
                {stats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className={`flex flex-col items-center py-6 px-4 ${i < stats.length - 1 ? "border-r border-border" : ""}`}>
                      <Icon className="w-5 h-5 text-primary mb-2" />
                      <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                      <span className="text-xs text-muted-foreground mt-0.5">{stat.label}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Links Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {quickLinks.map((item, i) => {
              const Icon = item.icon;
              const isLocked = item.requireAuth && !user;
              return (
                <Link key={i} to={isLocked ? "/auth" : item.to}>
                  <Card className="hover:shadow-lg transition-all hover:border-primary/30 hover:-translate-y-1 cursor-pointer group h-full border-0 shadow-md">
                    <CardContent className="p-5 text-center">
                      <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-accent flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                        {isLocked ? <Lock className="w-7 h-7 text-primary" /> : <Icon className="w-7 h-7 text-primary" />}
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{item.label}</h3>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* School Building Photo */}
      <section className="py-16 bg-accent/30">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <MapPin className="w-4 h-4" />
                Bizning avtomaktab
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Avtoexclusive Avtomaktab
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Urganch shahrida joylashgan zamonaviy avtomaktabimiz tajribali o'qituvchilar jamoasi bilan sizga xizmat ko'rsatadi. Nazariy bilim, amaliy ko'nikmalar va professional yondashuv - haydovchilik guvohnomasini olishning eng ishonchli yo'li.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">Urganch sh., AL Xorazmiy ko'chasi 111/2-uy</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">+998 99 065 62 00 · +998 97 516 62 00</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">Dushanba - Shanba: 09:00 - 18:00</span>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-border">
                <img
                  src={schoolBuilding}
                  alt="Avtoexclusive Avtomaktab binosi"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
            Platformaning Afzalliklari
          </h2>
          <p className="text-muted-foreground text-center mb-8">Nima uchun aynan Avtoexclusive?</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 pb-5 text-center">
                    <div className="w-14 h-14 mx-auto mb-4 bg-accent rounded-2xl flex items-center justify-center">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{t(feature.titleKey)}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{t(feature.descKey)}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

     
    </MainLayout>
  );
}
