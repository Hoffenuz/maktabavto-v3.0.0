import { useState } from "react";
import { Clock, ChevronDown, Shield, Send, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function QuickContactLinks() {
  const [showTerms, setShowTerms] = useState(false);
  const { t } = useLanguage();

  const contactLinks = [
    { icon: Send, label: "Telegram", value: "@exclusiveavto", href: "https://t.me/exclusiveavto" },
    { icon: Phone, label: "Telefon 1", value: "+998 99 065 62 00", href: "tel:+998990656200" },
    { icon: Phone, label: "Telefon 2", value: "+998 97 516 62 00", href: "tel:+998975166200" },
  ];

  return (
    <div className="flex flex-col h-full space-y-6">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
          <Shield className="w-5 h-5 text-primary" />
          {t("contact.quickTitle")}
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          {t("contact.quickSubtitle")}
        </p>
      </div>

      <div className="space-y-4 flex-1">
        {contactLinks.map((item, index) => {
          const Icon = item.icon;
          return (
            <a
              key={index}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 group p-3 -mx-3 rounded-xl hover:bg-accent/50 transition-colors"
            >
              <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  {item.label}
                </p>
                <p className="font-semibold text-foreground text-sm group-hover:text-primary mt-0.5">
                  {item.value}
                </p>
              </div>
            </a>
          );
        })}

        {/* Address */}
        <div className="flex items-center gap-4 p-3 -mx-3 border-t border-border pt-5">
          <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Manzil</p>
            <p className="font-semibold text-foreground text-sm mt-0.5">Urganch sh., AL Xorazmiy ko'chasi 111/2-uy</p>
          </div>
        </div>

        {/* Working Hours */}
        <div className="flex items-center gap-4 p-3 -mx-3">
          <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{t("contact.workingHours")}</p>
            <p className="font-semibold text-foreground text-sm mt-0.5">Dush - Shan: 09:00 - 18:00</p>
          </div>
        </div>
      </div>

      {/* Collapsible Terms */}
      <div className="border border-border rounded-xl bg-accent/20 overflow-hidden">
        <button
          onClick={() => setShowTerms(!showTerms)}
          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-accent/40 transition-colors"
        >
          <span className="text-sm font-semibold text-foreground flex items-center gap-2">
            {t("contact.termsTitle")}
          </span>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showTerms ? "rotate-180" : ""}`} />
        </button>
        {showTerms && (
          <div className="px-5 pb-5 space-y-3 text-muted-foreground text-sm border-t border-border pt-4">
            <p className="font-medium text-foreground">{t("contact.termsIntro")}</p>
            <ul className="space-y-2 text-xs">
              {["terms1", "terms2", "terms3"].map((key) => (
                <li key={key} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>{t(`contact.${key}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
