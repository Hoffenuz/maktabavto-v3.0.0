import { useState } from "react";
import { useUserValidation } from "@/hooks/useUserValidation";
import { SEO } from "@/components/SEO";
import { AuthGate } from "@/components/AuthGate";
import { TalimBazaStartPage } from "@/components/TalimBazaStartPage";
import { TestInterfaceBase } from "@/components/TestInterfaceBase";

export default function TalimBaza() {
  const [testStarted, setTestStarted] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);

  useUserValidation("/auth");

  if (testStarted && selectedTicket !== null) {
    return (
      <TestInterfaceBase
        onExit={() => {
          setTestStarted(false);
          setSelectedTicket(null);
        }}
        dataSource={`/data/n${selectedTicket}.json`}
        testName={`Ta'lim Baza — Bilet ${selectedTicket}`}
        questionCount={20}
        timeLimit={25 * 60}
        imagePrefix="/rasm3/"
      />
    );
  }

  return (
    <AuthGate
      returnTo="/talim-baza"
      warningMessage="Ta'lim baza avtomaktab o'quvchilari uchun. Iltimos, avval tizimga kiring."
    >
      <SEO
        title="Ta'lim Baza — 62 bilet"
        description="Haydovchilik guvohnomasi uchun 62 ta ta'lim baza biletlari."
        path="/talim-baza"
        keywords="talim baza, prava bilet, talim test"
      />
      <TalimBazaStartPage
        onStartTest={(ticket: number) => {
          setSelectedTicket(ticket);
          setTestStarted(true);
        }}
      />
    </AuthGate>
  );
}
