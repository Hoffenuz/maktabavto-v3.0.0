import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserValidation } from "@/hooks/useUserValidation";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEO } from "@/components/SEO";
import { AuthGate } from "@/components/AuthGate";
import { MavzuliTestInterface } from "@/components/MavzuliTestInterface";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, BookOpen, Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const topics = [
  { id: '31', name: { uz_lat: 'Barcha savollar', uz_cyr: 'Барча саволлар', ru: 'Все вопросы' } },
  { id: '35a', name: { uz_lat: "Yangi savollar1", uz_cyr: "Янги саволлар1", ru: "Новые вопросы1" } },
  { id: '35b', name: { uz_lat: "Yangi savollar2", uz_cyr: "Янги саволлар2", ru: "Новые вопросы2" } },
  { id: '1', name: { uz_lat: "Umumiy qoidalar", uz_cyr: "Умумий қоидалар", ru: "Общие правила" } },
  { id: '3', name: { uz_lat: "Ogohlantiruvchi belgilar", uz_cyr: "Огоҳлантирувчи белгилар", ru: "Предупреждающие знаки" } },
  { id: '4', name: { uz_lat: "Imtiyoz belgilar", uz_cyr: "Имтиёз белгилар", ru: "Знаки приоритета" } },
  { id: '5', name: { uz_lat: "Taqiqlovchi belgilar", uz_cyr: "Тақиқловчи белгилар", ru: "Запрещающие знаки" } },
  { id: '6', name: { uz_lat: "Buyuruvchi belgilar", uz_cyr: "Буюрувчи белгилар", ru: "Предписывающие знаки" } },
  { id: '7', name: { uz_lat: "Axborot ishora belgilari", uz_cyr: "Ахборот ишора белгилари", ru: "Информационные знаки" } },
  { id: '8', name: { uz_lat: "Qo'shimcha axborot belgilari", uz_cyr: "Қўшимча ахборот белгилари", ru: "Дополнительные информационные знаки" } },
  { id: '20', name: { uz_lat: "Chorrahalarda harakatlanish", uz_cyr: "Чорраҳаларда ҳаракатланиш", ru: "Движение на перекрестках" } },
  { id: '34', name: { uz_lat: "Teng ahamiyatli chorrahalar", uz_cyr: "Тенг аҳамиятли чорраҳалар", ru: "Равнозначные перекрестки" } },
  { id: '9', name: { uz_lat: "Yotiq chiziqlar 1", uz_cyr: "Ётиқ чизиқлар 1", ru: "Горизонтальная разметка 1" } },
  { id: '10', name: { uz_lat: "Yotiq va tik chiziqlar 2", uz_cyr: "Ётиқ ва тик чизиқлар 2", ru: "Горизонтальная и вертикальная разметка 2" } },
  { id: '11', name: { uz_lat: "Svetafor ishoralari", uz_cyr: "Светафор ишоралари", ru: "Сигналы светофора" } },
  { id: '12', name: { uz_lat: "Tartibga soluvchining ishoralari", uz_cyr: "Тартибга солувчининг ишоралари", ru: "Сигналы регулировщика" } },
  { id: '13', name: { uz_lat: "Ogohlantiruvchi va avariya ishoralari", uz_cyr: "Огоҳлантирувчи ва авария ишоралари", ru: "Предупредительные и аварийные сигналы" } },
  { id: '14', name: { uz_lat: "Yo'llarda harakatlanish", uz_cyr: "", ru: "Начало движения (Маневр)" } },
  { id: '15', name: { uz_lat: "Transport vositalarining joylashuvi", uz_cyr: "Йўлнинг қатнов қисмида транспорт воситаларининг жойлашуви", ru: "Расположение транспортных средств на проезжей части" } },
  { id: '16', name: { uz_lat: "Harakatlanish tezligi", uz_cyr: "Ҳаракатланиш тезлиги", ru: "Скорость движения" } },
  { id: '17', name: { uz_lat: "Quvib o'tish", uz_cyr: "Қувиб ўтиш", ru: "Обгон" } },
  { id: '18', name: { uz_lat: "To'xtash va to'xtab turish qoidalari 1", uz_cyr: "Тўхташ ва тўхтаб туриш қоидалари 1", ru: "Правила остановки и стоянки 1" } },
  { id: '19', name: { uz_lat: "To'xtash va to'xtab turish qoidalari 2", uz_cyr: "Тўхташ ва тўхтаб туриш қоидалари 2", ru: "Правила остановки и стоянки 2" } },
  { id: '33', name: { uz_lat: "Tartibga solinmagan chorrahada asosiy yo'l", uz_cyr: "Тартибга солинмаган чорраҳада асосий йўл", ru: "Главная дорога на нерегулируемом перекрестке" } },
  { id: '2', name: { uz_lat: "Haydovchining umumiy vazifalari", uz_cyr: "Ҳайдовчининг умумий вазифалари ва пиёдалар", ru: "Общие обязанности водителя и пешеходы" } },
  { id: '21', name: { uz_lat: "Piyodalar o'tish joylari va turar joylar", uz_cyr: "Пиёдалар ўтиш жойлари ва турар жой даҳаларида ҳаракатланиш", ru: "Пешеходные переходы и движение в жилых зонах" } },
  { id: '22', name: { uz_lat: "Temir yo'l kesishmalari va Avtomagistrallarda harakat", uz_cyr: "Темир йўл кесишмалари ва Автомагистралларда ҳаракат", ru: "Железнодорожные переезды и движение по автомагистралям" } },
  { id: '23', name: { uz_lat: "Yo'nalishli transport vositalarining imtiyozlari", uz_cyr: "Йўналишли транспорт воситаларининг имтиёзлари ва ташқи ёритиш", ru: "Преимущества маршрутных транспортных средств и внешнее освещение" } },
  { id: '24', name: { uz_lat: "Shatakka olish", uz_cyr: "Транспорт воситаларини шатакка олиш", ru: "Буксировка транспортных средств" } },
  { id: '25', name: { uz_lat: "Transport boshqarishni o'rganish", uz_cyr: "Транспорт бошқаришни ўрганиш ва Йўл ҳаракати хавфсизлигини таъминлаш", ru: "Обучение вождению и обеспечение безопасности" } },
  { id: '26', name: { uz_lat: "Odam va yuk tashish", uz_cyr: "Одам ва юк ташиш", ru: "Перевозка людей и грузов" } },
  { id: '27', name: { uz_lat: "Harakatlanish taqiqlanadigan vaziyatlar", uz_cyr: "Транспорт воситаларида ҳаракатланиш тақиқланадиган вазиятлар", ru: "Ситуации, когда запрещено движение" } },
  { id: '28', name: { uz_lat: "Harakat xavfsizligini ta'minlash 1", uz_cyr: "Ҳаракат хавфсизлигини таъминлаш 1", ru: "Обеспечение безопасности движения 1" } },
  { id: '29', name: { uz_lat: "Harakat xavfsizligini ta'minlash 2", uz_cyr: "Ҳаракат хавфсизлигини таъминлаш 2", ru: "Обеспечение безопасности движения 2" } },
  { id: '30', name: { uz_lat: "Birinchi tibbiy yordam", uz_cyr: "Биринчи тиббий ёрдам", ru: "Первая медицинская помощь" } },
];

const languages = [
  { id: "uz-lat" as const, label: "O'zbekcha" },
  { id: "uz" as const, label: "Ўзбекча" },
  { id: "ru" as const, label: "Русский" },
];

export default function MavzuliTestlar() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [testStarted, setTestStarted] = useState(false);
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  useUserValidation('/auth');

  const getTopicName = (topic: typeof topics[0]) => {
    const langKey = language === 'uz-lat' ? 'uz_lat' : language === 'uz' ? 'uz_cyr' : 'ru';
    return topic.name[langKey];
  };

  const handleStartTest = () => {
    if (selectedTopic !== null) setTestStarted(true);
  };

  if (testStarted && selectedTopic) {
    const topic = topics.find(t => t.id === selectedTopic)!;
    return (
      <MavzuliTestInterface
        onExit={() => { setTestStarted(false); setSelectedTopic(null); }}
        topicId={selectedTopic}
        topicName={getTopicName(topic)}
      />
    );
  }

  return (
    <MainLayout>
      <AuthGate returnTo="/mavzuli" warningMessage="Mavzuli testlar avtomaktab o'quvchilari uchun. Iltimos, avval tizimga kiring.">
        <SEO title="Mavzuli testlar" description="YHQ bo'yicha mavzuli testlar" path="/mavzuli" keywords="mavzuli test" />

        <section className="py-8 md:py-12 bg-accent/30">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/')}
                  className="gap-2 h-9"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Bosh sahifa</span>
                </Button>
                <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center shadow-sm">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Mavzuli testlar</h1>
              </div>
              <div className="flex gap-1">
                {languages.map((lang) => (
                  <Button
                    key={lang.id}
                    variant={language === lang.id ? "default" : "outline"}
                    size="sm"
                    className="text-xs h-8 rounded-lg"
                    onClick={() => setLanguage(lang.id)}
                  >
                    {lang.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Selected topic + start */}
          <Card className="mb-6 p-5 border-0 shadow-md">
            {selectedTopic ? (
              <div className="text-center mb-3">
                <p className="text-sm font-semibold text-primary">{getTopicName(topics.find(t => t.id === selectedTopic)!)}</p>
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground mb-3">Quyidan mavzu tanlang</p>
            )}
            <Button className="w-full gap-2 h-11 rounded-xl shadow-md shadow-primary/20" onClick={handleStartTest} disabled={!selectedTopic}>
              <Play className="w-4 h-4" />
              {selectedTopic ? "Testni boshlash" : "Mavzuni tanlang"}
            </Button>
          </Card>

          {/* Topics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {topics.map((topic) => (
              <Button
                key={topic.id}
                variant="outline"
                className={`w-full justify-start text-left h-auto py-4 px-5 text-sm rounded-xl transition-all ${
                  selectedTopic === topic.id
                    ? 'bg-primary text-primary-foreground border-primary shadow-md font-semibold'
                    : 'bg-card text-foreground border-border hover:border-primary/50 hover:bg-accent shadow-sm'
                }`}
                onClick={() => setSelectedTopic(topic.id)}
              >
                {getTopicName(topic)}
              </Button>
            ))}
          </div>
        </div>
      </AuthGate>
    </MainLayout>
  );
}
