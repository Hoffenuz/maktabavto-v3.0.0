import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserValidation } from '@/hooks/useUserValidation';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, LogOut, Trophy, CheckCircle, XCircle, ArrowLeft, Clock, Edit2, Save, X, Calendar, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useRegistrationAge } from '@/hooks/useRegistrationAge';
import { ThemeToggle } from '@/components/ThemeToggle';

interface TestResult {
  id: string; variant: number; correct_answers: number; total_questions: number; time_taken_seconds: number | null; completed_at: string;
}

const Profile = () => {
  const { user, profile, signOut, isLoading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const registrationDays = useRegistrationAge(user?.id);
  const [results, setResults] = useState<TestResult[]>([]);
  const [loadingResults, setLoadingResults] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editFullName, setEditFullName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [checkLink, setCheckLink] = useState<string | null>(null);

  useUserValidation('/auth');

  useEffect(() => { if (!isLoading && !user) navigate('/auth'); }, [user, isLoading, navigate]);
  useEffect(() => { if (profile) { setEditUsername(profile.username || ''); setEditFullName(profile.full_name || ''); } }, [profile]);

  useEffect(() => {
    const fetchCheck = async () => {
      if (!user?.email) return;
      try {
        const { data } = await supabase.from('chek' as any).select('link').eq('email', user.email).maybeSingle();
        if (data) setCheckLink(data.link);
      } catch {}
    };
    fetchCheck();
  }, [user]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!user) return;
      try {
        const { data } = await supabase.from('test_results').select('*').eq('user_id', user.id).order('completed_at', { ascending: false });
        setResults(data || []);
      } catch {} finally { setLoadingResults(false); }
    };
    fetchResults();
  }, [user]);

  const handleSignOut = async () => { await signOut(); navigate('/auth'); };

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.from('profiles').update({ username: editUsername.trim() || null, full_name: editFullName.trim() || null }).eq('id', user.id);
      if (error) { toast.error('Profil yangilanmadi: ' + error.message); } else { toast.success('Profil yangilandi'); await refreshProfile(); setIsEditing(false); }
    } catch { toast.error('Xatolik yuz berdi'); } finally { setIsSaving(false); }
  };

  const handleCancelEdit = () => { setEditUsername(profile?.username || ''); setEditFullName(profile?.full_name || ''); setIsEditing(false); };

  const formatTime = (s: number | null) => {
    if (!s) return '--:--';
    return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  };

  const bestResultsByVariant = results.reduce((acc, r) => {
    if (!acc[r.variant] || r.correct_answers > acc[r.variant].correct_answers) acc[r.variant] = r;
    return acc;
  }, {} as Record<number, TestResult>);
  const sortedVariants = Object.keys(bestResultsByVariant).map(Number).sort((a, b) => a - b);

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  if (!user) return null;

  const displayName = profile?.full_name || profile?.username || 'Foydalanuvchi';

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/90 backdrop-blur-xl px-4 py-4 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="gap-1.5">
            <ArrowLeft className="w-4 h-4" />Orqaga
          </Button>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-1.5">
              <LogOut className="w-4 h-4" />Chiqish
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* User info */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center shadow-md">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{displayName}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {/* Profile edit */}
        <Card className="p-6 mb-5 border-0 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />Profil ma'lumotlari
            </h2>
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="h-8 text-xs rounded-lg"><Edit2 className="w-3 h-3 mr-1" />Tahrirlash</Button>
            ) : (
              <div className="flex gap-1.5">
                <Button variant="outline" size="sm" onClick={handleCancelEdit} disabled={isSaving} className="h-8 text-xs rounded-lg"><X className="w-3 h-3 mr-1" />Bekor</Button>
                <Button size="sm" onClick={handleSaveProfile} disabled={isSaving} className="h-8 text-xs rounded-lg"><Save className="w-3 h-3 mr-1" />Saqlash</Button>
              </div>
            )}
          </div>
          {isEditing ? (
            <div className="space-y-3">
              <div><Label className="text-xs">To'liq ism</Label><Input placeholder="Ismingiz" value={editFullName} onChange={(e) => setEditFullName(e.target.value)} disabled={isSaving} className="h-10 mt-1 rounded-xl" /></div>
              <div><Label className="text-xs">Username</Label><Input placeholder="@username" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} disabled={isSaving} className="h-10 mt-1 rounded-xl" /></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 rounded-xl bg-accent/50"><p className="text-xs text-muted-foreground">Ism</p><p className="font-semibold mt-0.5">{profile?.full_name || '-'}</p></div>
              <div className="p-3 rounded-xl bg-accent/50"><p className="text-xs text-muted-foreground">Username</p><p className="font-semibold mt-0.5">{profile?.username ? `@${profile.username}` : '-'}</p></div>
              <div className="p-3 rounded-xl bg-accent/50"><p className="text-xs text-muted-foreground">Email</p><p className="font-semibold mt-0.5">{user.email || '-'}</p></div>
              <div className="p-3 rounded-xl bg-accent/50"><p className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />Ro'yxatdan</p><p className="font-semibold mt-0.5">{registrationDays !== null ? `${registrationDays} kun` : '-'}</p></div>
              {checkLink && checkLink !== 'yuklanmagan' && (
                <div className="p-3 rounded-xl bg-accent/50"><p className="text-xs text-muted-foreground flex items-center gap-1"><FileText className="w-3 h-3" />Chek</p><a href={checkLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold text-sm mt-0.5 block">Yuklab olish</a></div>
              )}
            </div>
          )}
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { icon: Trophy, label: "Testlar", value: results.length, color: "text-primary" },
            { icon: CheckCircle, label: "Variantlar", value: sortedVariants.length, color: "text-primary" },
            { icon: CheckCircle, label: "To'g'ri", value: results.reduce((s, r) => s + r.correct_answers, 0), color: "text-success" },
            { icon: XCircle, label: "Noto'g'ri", value: results.reduce((s, r) => s + (r.total_questions - r.correct_answers), 0), color: "text-destructive" },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <Card key={i} className="p-4 text-center border-0 shadow-md">
                <Icon className={`w-5 h-5 mx-auto mb-1.5 ${s.color}`} />
                <div className="text-xl font-bold text-foreground">{s.value}</div>
                <p className="text-[10px] text-muted-foreground font-medium">{s.label}</p>
              </Card>
            );
          })}
        </div>

        {/* Results */}
        <Card className="p-6 border-0 shadow-md">
          <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" />Eng yaxshi natijalar
          </h2>
          {loadingResults ? (
            <div className="text-center py-8"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" /></div>
          ) : sortedVariants.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Hali natijalar yo'q</p>
              <Button variant="outline" size="sm" className="mt-3 rounded-xl" onClick={() => navigate('/')}>Testni boshlash</Button>
            </div>
          ) : (
            <div className="space-y-2">
              {sortedVariants.map((v) => {
                const r = bestResultsByVariant[v];
                const score = Math.round((r.correct_answers / r.total_questions) * 100);
                const passed = score >= 80;
                return (
                  <div key={v} className="flex items-center justify-between p-3.5 rounded-xl bg-accent/40">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold ${passed ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive'}`}>{v}</div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Variant {v}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{formatTime(r.time_taken_seconds)}</span>
                          <span>{new Date(r.completed_at).toLocaleDateString('uz-UZ')}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${passed ? 'text-success' : 'text-destructive'}`}>{r.correct_answers}/{r.total_questions}</div>
                      <div className={`text-xs font-medium ${passed ? 'text-success' : 'text-destructive'}`}>{score}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default Profile;
