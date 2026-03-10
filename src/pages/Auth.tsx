import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { LogIn, Eye, EyeOff, AlertCircle, User, Lock, ArrowLeft, GraduationCap } from 'lucide-react';
import { z } from 'zod';
import heroBg from "@/assets/hero-bg.jpg";

const emailSchema = z.object({
  email: z.string().email("Login manzili noto'g'ri"),
  password: z.string().min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
});

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, isLoading, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as { returnTo?: string })?.returnTo || '/';
  const warningMessage = (location.state as { warning?: string })?.warning;

  useEffect(() => {
    if (!isLoading && user) {
      navigate(returnTo, { replace: true });
    }
  }, [user, isLoading, navigate, returnTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Auto-append @gmail.com if user only typed the prefix
    const fullEmail = email.trim().includes('@') ? email.trim() : `${email.trim()}@gmail.com`;

    try {
      emailSchema.parse({ email: fullEmail, password });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
        return;
      }
    }

    setIsSubmitting(true);

    const { error: signInError } = await signIn(fullEmail, password);
    if (signInError) {
      if (signInError.message.includes('Invalid login credentials')) {
        setError("Login yoki parol noto'g'ri");
      } else if (signInError.message.includes('Email not confirmed')) {
        setError("Akkaunt tasdiqlanmagan. Administrator bilan bog'laning");
      } else {
        setError(signInError.message);
      }
      setIsSubmitting(false);
      return;
    }
    setIsSubmitting(false);
  };

  if (isLoading || user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-primary/40" />
        <div className="relative z-10 flex flex-col justify-center p-12 text-primary-foreground">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <span className="font-bold text-xl">Avtoexclusive</span>
              <span className="block text-sm opacity-80">Avtomaktab</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4 leading-tight">
            Haydovchilik guvohnomasiga onlayn tayyorlaning
          </h2>
          <p className="text-lg opacity-90 leading-relaxed max-w-md">
            1200+ savollar bazasi, 61 ta variant, video darsliklar va yo'l belgilari katalogi bilan imtihonga tayyor bo'ling.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background">
        <div className="w-full max-w-sm">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Bosh sahifa
          </Link>

          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <img src="/rasm1.webp" alt="Avtoexclusive" className="w-9 h-9 rounded-xl object-cover shadow-md" />
            <span className="font-bold text-foreground">Avtoexclusive</span>
          </div>

          <Card className="p-6 md:p-8 border-0 shadow-lg">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-accent flex items-center justify-center">
                <LogIn className="w-7 h-7 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Kirish</h1>
              <p className="text-sm text-muted-foreground mt-1">Avtoexclusive test platformasi</p>
            </div>

            {/* Warning */}
            {warningMessage && (
              <div className="mb-4 p-3.5 rounded-xl bg-accent border border-primary/20 text-sm text-primary flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{warningMessage}</span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-4 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                <span className="text-sm text-destructive">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium">Foydalanuvchi nomi</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="text"
                    placeholder="avtomaktab"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    className="h-11 pl-10 rounded-xl"
                    autoComplete="username"
                    autoCapitalize="none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium">Parol</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Parolni kiriting"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    className="h-11 pl-10 pr-10 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-11 rounded-xl text-base shadow-md shadow-primary/20" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Tekshirilmoqda...
                  </span>
                ) : (
                  <span className="flex items-center gap-2"><LogIn className="w-4 h-4" />Kirish</span>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
