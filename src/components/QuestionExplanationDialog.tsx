import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatExplanation } from "@/lib/parseTestQuestions";
import { BookOpen, CheckCircle2 } from "lucide-react";

interface QuestionExplanationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  explanation: string;
  correctAnswerText?: string;
}

export function QuestionExplanationDialog({
  open,
  onOpenChange,
  title,
  explanation,
  correctAnswerText,
}: QuestionExplanationDialogProps) {
  const { t } = useLanguage();
  const paragraphs = formatExplanation(explanation);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col gap-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60 bg-muted/30">
          <DialogTitle className="flex items-center gap-2.5 text-lg">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <BookOpen className="h-4 w-4" />
            </span>
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto px-6 py-5 space-y-4">
          {correctAnswerText && (
            <div className="flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-green-700 dark:text-green-400">
                  {t("test.correctAnswer")}
                </p>
                <p className="mt-1 text-sm font-medium text-foreground leading-relaxed">
                  {correctAnswerText}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-sm md:text-base text-foreground/90 leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
