import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Phone, MessageCircle, Send, User, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

type ContactMethod = "phone" | "telegram";

export function ContactForm() {
  const [name, setName] = useState("");
  const [contactMethod, setContactMethod] = useState<ContactMethod>("phone");
  const [phone, setPhone] = useState("");
  const [telegram, setTelegram] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useLanguage();

  const formatPhone = (v: string) => setPhone(v.replace(/\D/g, "").substring(0, 9));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const contactValue = contactMethod === "phone" ? `+998${phone}` : `@${telegram.replace(/^@/, '')}`;
      const { error } = await supabase.from('contact_messages').insert({
        name: name.trim(), phone: contactValue, subject: `Aloqa: ${contactMethod.toUpperCase()}`, message: message.trim(), user_id: user?.id || null
      });
      if (error) throw error;
      toast({ title: t("contact.toastSuccess"), description: t("contact.toastSuccessDesc") });
      setName(""); setPhone(""); setTelegram(""); setMessage("");
    } catch (err) {
      toast({ title: t("contact.toastError"), description: t("contact.toastErrorDesc"), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Ismingiz</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ismingiz" className="pl-10 h-11" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Aloqa Usuli</Label>
        <div className="flex p-1 bg-accent/50 rounded-lg h-11">
          <button type="button" onClick={() => setContactMethod("phone")} className={`flex-1 flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all ${contactMethod === "phone" ? "bg-background shadow-sm text-primary" : "text-muted-foreground"}`}>
            <Phone className="w-4 h-4" /> Telefon
          </button>
          <button type="button" onClick={() => setContactMethod("telegram")} className={`flex-1 flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all ${contactMethod === "telegram" ? "bg-background shadow-sm text-primary" : "text-muted-foreground"}`}>
            <MessageCircle className="w-4 h-4" /> Telegram
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{contactMethod === "phone" ? "Telefon Raqamingiz" : "Telegram Username"}</Label>
        <div className="flex">
          <div className="flex items-center justify-center px-4 bg-accent/50 border border-r-0 border-input rounded-l-lg text-sm font-bold text-muted-foreground">{contactMethod === "phone" ? "+998" : "@"}</div>
          <Input type={contactMethod === "phone" ? "tel" : "text"} value={contactMethod === "phone" ? phone : telegram} onChange={(e) => contactMethod === "phone" ? formatPhone(e.target.value) : setTelegram(e.target.value)} placeholder={contactMethod === "phone" ? "90 123 45 67" : "username"} className="rounded-l-none h-11" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Xabar Matni</Label>
        <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Savolingizni bu yerga yozing..." className="min-h-[100px] resize-none" required />
      </div>

      <Button type="submit" disabled={loading} className="w-full h-11 font-semibold">
        {loading ? (
          <div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Yuborilmoqda...</div>
        ) : (
          <div className="flex items-center gap-2"><Send className="w-4 h-4" />Xabarni yuborish</div>
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground mt-3"><CheckCircle2 className="w-3 h-3 inline mr-1 text-green-500" />Ma'lumotlaringiz xavfsiz saqlanadi</p>
    </form>
  );
}