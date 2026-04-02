import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ListChecks, Target, Lightbulb, Play, FileText, Info } from "lucide-react";

const cards = [
  { icon: FileText, title: "Test tuzilishi", description: "Test savollari mavzular bo'yicha guruhlangan: belgilar, qoidalar, harakatlanish holatlari va birinchi yordamga oid savollar." },
  { icon: Target, title: "O'rganish strategiyalari", description: "Belgilarni vizual tarzda yodlash, testlarni mashaqqat bilan yechish va noto'g'ri javoblarni alohida qayta ko'rib chiqish." },
  { icon: ListChecks, title: "Amaliy mashqlar", description: "20 va 50 savollik mashqlar mavjud — boshlanish uchun 20 savol rejimidan boshlash tavsiya etiladi." },
  { icon: Lightbulb, title: "Resurslar", description: "Grafik materiallar, rasmlar va video qo'llanmalar yordamida murakkab vaziyatlarni tushunish." },
];

const tips = [
  "Kuzatuvchi belgilarni diqqat bilan o'qing.",
  "Har bir savolga 30-45 soniya ajrating.",
  "Amaliy savollarni qayta ko'rib, xatolarni tahlil qiling.",
  "Kuniga kamida 1-2 ta variant yechib boring.",
  "Yo'l belgilarini tasvirlar bilan birga yodlang.",
];

export default function Qoshimcha() {
  return (
    <MainLayout>
      <SEO title="Qo'shimcha ma'lumotlar" description="Test tayyorgarlik yo'riqnomasi" path="/qoshimcha" keywords="test tayyorgarlik" />

      <section className="py-12 md:py-16 bg-accent/30">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 text-primary text-sm font-medium mb-4">
            <Info className="w-4 h-4" />
            Qo'shimcha ma'lumotlar
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Testga tayyorgarlik</h1>
          <p className="text-muted-foreground mb-6">Maslahatlar va qo'llanmalar</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/darslik">
              <Button variant="outline" className="gap-2 rounded-xl bg-card/80"><BookOpen className="w-4 h-4" />Darslik</Button>
            </Link>
            <Link to="/test-ishlash">
              <Button className="gap-2 rounded-xl shadow-md shadow-primary/20"><Play className="w-4 h-4" />Testlarni boshlash</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <Card key={i} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 pb-5">
                    <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">{card.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{card.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 bg-accent/20">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-xl font-bold text-foreground mb-6 text-center">Tez maslahatlar</h2>
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="space-y-4">
                {tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">
                      {i + 1}
                    </div>
                    <p className="text-sm text-foreground pt-1">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </MainLayout>
  );
}
