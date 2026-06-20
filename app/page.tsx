"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChoiceCard } from "@/components/home/choice-card";
import { HubspotAccessGate, type HubspotAccessState } from "@/components/hubspot-access-gate";

const options = [
  {
    id: "manual",
    title: "Manual Entry",
    description: "Create a contact or company manually with guided form fields.",
    actionLabel: "Manual Entry",
    icon: "✍️",
  },
  {
    id: "upload",
    title: "Upload CSV",
    description: "Import contacts and companies from a single CSV file.",
    actionLabel: "Upload File",
    icon: "📁",
  },
];

export default function Home() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [accessWarning, setAccessWarning] = useState("");
  const [access, setAccess] = useState<HubspotAccessState>({
    accessToken: "",
    validated: false,
    scopes: [],
    missingRecommendedScopes: [],
  });

  const selectedLabel = useMemo(
    () => options.find((item) => item.id === selectedOption)?.title,
    [selectedOption],
  );

  function handleSelect(optionId: string) {
    if (!access.validated) {
      setAccessWarning("Validate your HubSpot private app access token first.");
      return;
    }

    setAccessWarning("");
    setLoading(true);
    setTimeout(() => {
      setSelectedOption(optionId);
      setLoading(false);
      router.push(optionId === "manual" ? "/manual-entry" : "/upload");
    }, 300);
  }

  return (
    <main className="min-h-screen bg-slate-100 py-14 px-6 sm:px-10 lg:px-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">

        {/* Hero section */}
        <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm sm:p-14">
          <div className="max-w-3xl space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-4 py-1.5 text-sm font-semibold text-indigo-700">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
              HubSpot Data Manager
            </span>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                How would you like to<br className="hidden sm:block" /> add data?
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-500">
                Choose the best option for your workflow. Enter data manually or upload a file to preview and map records into HubSpot.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600">
                ✅ Contacts &amp; Companies
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600">
                📋 CSV Upload Support
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600">
                🔗 HubSpot Integration
              </span>
            </div>
          </div>
        </section>

        {/* Access Gate */}
        <HubspotAccessGate onAccessChange={setAccess} />

        {accessWarning ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-700">
            ⚠️ {accessWarning}
          </div>
        ) : null}

        {/* Option Cards */}
        <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="space-y-4 mb-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                Step 2 — Choose Workflow
              </p>
              <h2 className="text-2xl font-bold text-slate-900">
                Pick how you want to add new HubSpot contacts and companies.
              </h2>
              <p className="text-slate-500 leading-7">
                Select one of the options below. Manual entry is best for a few records, while upload is ideal for bulk imports.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {options.map((option) => (
                <ChoiceCard
                  key={option.id}
                  title={option.title}
                  description={option.description}
                  actionLabel={option.actionLabel}
                  icon={option.icon}
                  selected={selectedOption === option.id}
                  isLoading={loading && selectedOption === option.id}
                  onSelect={() => handleSelect(option.id)}
                />
              ))}
            </div>
          </div>

          {/* Info / Preview Panel */}
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-slate-700">
            {!selectedOption ? (
              <div className="flex h-full flex-col justify-center gap-6">
                <div className="space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-2xl">
                    💡
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    No option selected yet
                  </h3>
                  <p className="text-slate-500">
                    Select a card on the left to begin. Validate your HubSpot token first using Step 1 above.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">Quick Tips</p>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2"><span className="text-indigo-500 mt-0.5">•</span> Manual Entry — best for 1–10 records</li>
                    <li className="flex items-start gap-2"><span className="text-indigo-500 mt-0.5">•</span> CSV Upload — best for bulk imports</li>
                    <li className="flex items-start gap-2"><span className="text-indigo-500 mt-0.5">•</span> Preview and edit before HubSpot submission</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                  Selected option
                </p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {selectedLabel}
                </h3>
                <p className="text-slate-500 leading-7">
                  You can continue with this workflow and configure fields or upload settings for the selected path.
                </p>
                {!access.validated ? (
                  <Button variant="default" size="lg" type="button" disabled>
                    Validate HubSpot key first
                  </Button>
                ) : selectedOption === "manual" ? (
                  <Link href="/manual-entry" className="w-full sm:w-auto">
                    <Button variant="default" size="lg" type="button" disabled={loading}>
                      Continue to Manual Entry →
                    </Button>
                  </Link>
                ) : selectedOption === "upload" ? (
                  <Link href="/upload" className="w-full sm:w-auto">
                    <Button variant="default" size="lg" type="button" disabled={loading}>
                      Continue to Upload →
                    </Button>
                  </Link>
                ) : (
                  <Button variant="default" size="lg" type="button" disabled={loading}>
                    Continue
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
