import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserValidation } from "@/hooks/useUserValidation";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEO } from "@/components/SEO";
import { AuthGate } from "@/components/AuthGate";
import { TestStartPage } from "@/components/TestStartPage";
import { TestInterface } from "@/components/TestInterface";

export default function Variant() {
  const [testStarted, setTestStarted] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);

  useUserValidation('/auth');

  if (testStarted && selectedVariant !== null) {
    return (
      <TestInterface
        onExit={() => { setTestStarted(false); setSelectedVariant(null); }}
        variant={selectedVariant}
      />
    );
  }

  return (
    <AuthGate returnTo="/variant" warningMessage="Variant testlari avtomaktab o'quvchilari uchun. Iltimos, avval tizimga kiring.">
      <SEO title="Test variantlari - 61 variant" description="Haydovchilik guvohnomasi uchun 61 test varianti." path="/variant" keywords="test varianti, prava test" />
      <TestStartPage
        onStartTest={(variant: number) => { setSelectedVariant(variant); setTestStarted(true); }}
      />
    </AuthGate>
  );
}
