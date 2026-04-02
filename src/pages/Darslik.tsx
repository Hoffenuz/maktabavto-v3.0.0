import { MainLayout } from "@/components/layout/MainLayout";
import { SEO } from "@/components/SEO";
import { BookOpen, Video } from "lucide-react";
import { getOrderedChapters } from "@/data/videoDarslar";
import { ChapterAccordion } from "@/components/darslik/ChapterAccordion";
import { AuthGate } from "@/components/AuthGate";

export default function Darslik() {
  const chapters = getOrderedChapters();

  return (
    <MainLayout>
      <AuthGate returnTo="/darslik" warningMessage="Video darsliklar avtomaktab o'quvchilari uchun. Iltimos, avval tizimga kiring.">
        <SEO title="Video Darslik" description="YHQ bo'yicha video darsliklar" path="/darslik" keywords="YHQ darslik, video darslar" />

        <section className="py-8 md:py-12 bg-accent/30">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center shadow-sm">
                <Video className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Video Darslik</h1>
                <p className="text-sm text-muted-foreground hidden md:block">YHQ bo'yicha video darsliklar</p>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-accent px-4 py-2 rounded-full">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-xs text-primary font-semibold">
                {chapters.length} bo'lim · {chapters.reduce((sum, c) => sum + c.data.length, 0)} video
              </span>
            </div>
          </div>
        </section>

        <section className="py-6 md:py-8">
          <div className="max-w-6xl mx-auto px-4">
            <ChapterAccordion chapters={chapters} />
          </div>
        </section>
      </AuthGate>
    </MainLayout>
  );
}
