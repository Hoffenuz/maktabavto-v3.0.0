import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { X, Search, Car } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SignItem { src: string; title: string; }
interface SignGroup { title: string; items: SignItem[]; }

export default function Belgilar() {
  const [groups, setGroups] = useState<SignGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; src: string; title: string }>({ open: false, src: "", title: "" });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadFromHtml() {
      try {
        const res = await fetch("/belgilar/belgilar.html");
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, "text/html");
        const sequence = Array.from(doc.querySelectorAll(".categories-header, .dez-box"));
        const results: SignGroup[] = [];
        let current: SignGroup | null = null;
        const seen = new Set<string>();
        sequence.forEach((node) => {
          if (node.classList.contains("categories-header")) {
            current = { title: (node.textContent || "").replace(/\s+/g, " ").trim(), items: [] };
            results.push(current);
          } else if (node.classList.contains("dez-box")) {
            const img = node.querySelector("img");
            const nameEl = node.querySelector("#prodname");
            if (!img) return;
            const src = img.getAttribute("src") || "";
            const file = src.split("/").pop();
            if (!file || seen.has(file)) return;
            seen.add(file);
            const title = (nameEl && nameEl.textContent?.trim()) || img.getAttribute("title") || img.getAttribute("alt") || file;
            if (!current) { current = { title: "Barcha belgilar", items: [] }; results.push(current); }
            current.items.push({ src: "/belgilar/" + file, title });
          }
        });
        if (!cancelled) setGroups(results);
      } catch { if (!cancelled) setGroups([]); }
      finally { if (!cancelled) setLoading(false); }
    }
    loadFromHtml();
    return () => { cancelled = true; };
  }, []);

  const filteredGroups = groups.map(g => ({ ...g, items: g.items.filter(i => i.title.toLowerCase().includes(searchQuery.toLowerCase())) })).filter(g => g.items.length > 0);
  const totalSigns = groups.reduce((acc, g) => acc + g.items.length, 0);

  return (
    <MainLayout>
      <SEO title="Yo'l belgilari 2026" description="O'zbekiston yo'l belgilari 2026 yil uchun" path="/belgilar" keywords="yo'l belgilari" />

      <section className="py-10 md:py-14 bg-accent/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 text-primary text-sm font-medium mb-4">
              <Car className="w-4 h-4" />
              Yo'l belgilari katalogi
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Yo'l belgilari</h1>
            <p className="text-muted-foreground">{totalSigns} ta belgi</p>
          </div>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Belgilarni qidirish..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-11 rounded-xl shadow-md border-0" />
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-10">
              {filteredGroups.map((group, idx) => (
                <div key={idx}>
                  <div className="flex items-center gap-3 mb-5">
                    <h2 className="text-lg font-bold text-foreground">{group.title}</h2>
                    <span className="px-2.5 py-1 bg-accent text-primary rounded-full text-xs font-semibold">{group.items.length}</span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
                    {group.items.map((item, i) => (
                      <Card key={i} className="cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all border-0 shadow-sm" onClick={() => setModal({ open: true, src: item.src, title: item.title })}>
                        <CardContent className="p-0">
                          <div className="aspect-square bg-accent/30 flex items-center justify-center p-2 rounded-t-xl">
                            <img src={item.src} alt={item.title} className="max-w-full max-h-full object-contain" loading="lazy" />
                          </div>
                          <div className="p-1.5 text-center">
                            <p className="text-[10px] text-foreground line-clamp-2 font-medium">{item.title}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
              {filteredGroups.length === 0 && !loading && (
                <div className="text-center py-20 text-muted-foreground">"{searchQuery}" bo'yicha hech narsa topilmadi</div>
              )}
            </div>
          )}
        </div>
      </section>

      {modal.open && (
        <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setModal({ open: false, src: "", title: "" }); }}>
          <div className="bg-card rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-scale-in">
            <div className="relative bg-accent/30 p-8 flex items-center justify-center">
              <button onClick={() => setModal({ open: false, src: "", title: "" })} className="absolute top-3 right-3 w-9 h-9 bg-card rounded-xl flex items-center justify-center shadow-md hover:bg-destructive hover:text-destructive-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
              <img src={modal.src} alt={modal.title} className="max-h-[50vh] object-contain" />
            </div>
            <div className="p-5 text-center">
              <h3 className="font-bold text-foreground">{modal.title}</h3>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
