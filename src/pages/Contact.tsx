import { MainLayout } from "@/components/layout/MainLayout";
import { SEO } from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { ContactForm } from "@/components/contact/ContactForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Phone, Clock, Send, MessageCircle, Bot, User } from "lucide-react";

export default function Contact() {
  const { t } = useLanguage();

  return (
    <MainLayout>
      <SEO title={t("contact.seoTitle")} description={t("contact.seoDescription")} path="/contact" keywords="aloqa, bog'lanish, yordam" />

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left - Our Info */}
            <Card className="p-6 md:p-8 border-0 shadow-lg">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Bizning Ma'lumotlar</h2>
              </div>
              <p className="text-muted-foreground text-sm mb-6">Quyidagi havolalar orqali to'g'ridan-to'g'ri bog'lanishingiz mumkin.</p>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-accent/50">
                  <div className="flex items-center gap-3 mb-2">
                    <Phone className="w-5 h-5 text-primary" />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Telefon</span>
                  </div>
                  <a href="tel:+998990656200" className="text-sm font-semibold text-foreground hover:text-primary block">+998 99 065 62 00</a>
                  <a href="tel:+998975166200" className="text-sm font-semibold text-foreground hover:text-primary block">+998 97 516 62 00</a>
                </div>

                <div className="p-4 rounded-xl bg-accent/50">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Manzil</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">Urganch sh., AL Xorazmiy ko'chasi 111/2-uy</p>
                </div>

                <div className="p-4 rounded-xl bg-accent/50 hover:bg-accent transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <Send className="w-5 h-5 text-primary" />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Telegram</span>
                  </div>
                  <a href="https://t.me/exclusiveavto" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary hover:underline">@exclusiveavto</a>
                </div>


                <div className="p-4 rounded-xl bg-accent/50">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Ish Vaqti</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">24/7</p>
                </div>
              </div>
            </Card>

            {/* Right - Contact Form */}
            <Card className="p-6 md:p-8 border-0 shadow-lg">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Xabar qoldirish</h2>
              </div>
              <p className="text-muted-foreground text-sm mb-6">Savolingizni yoki taklifingizni quyida yozing...</p>
              <ContactForm />
            </Card>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
