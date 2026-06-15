"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Toast } from "@/components/ui/toast";

interface ManualEntryFormValues {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  jobtitle: string;
  name: string;
  domain: string;
  company_size: string;
  website: string;
}

const companySizeOptions = [
  { label: "1-10", value: "1-10" },
  { label: "11-50", value: "11-50" },
  { label: "51-200", value: "51-200" },
  { label: "201-500", value: "201-500" },
  { label: "501-1000", value: "501-1000" },
];

export default function ManualEntryPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<ManualEntryFormValues>({
    mode: "onChange",
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      jobtitle: "",
      name: "",
      domain: "",
      company_size: "",
      website: "",
    },
  });

  useEffect(() => {
    if (toast) {
      const timeout = window.setTimeout(() => setToast(null), 3000);
      return () => window.clearTimeout(timeout);
    }
  }, [toast]);

  async function onSubmit() {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      setToast({ type: "success", message: "Contact and company details saved successfully." });
    } catch {
      setToast({ type: "error", message: "Unable to save the manual entry right now." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 py-14 px-6 sm:px-10 lg:px-16">
      <div className="mx-auto w-full max-w-6xl space-y-10">
        <section className="rounded-[2rem] border border-slate-200/80 bg-white p-10 shadow-xl shadow-slate-900/5 sm:p-14">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Manual Entry
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Create a contact and company in one streamlined form.
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-600">
              Enter the core HubSpot fields with validation that instantly highlights required values.
            </p>
          </div>
        </section>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="space-y-6">
            <CardHeader>
              <CardTitle>Contact details</CardTitle>
              <CardDescription>
                Use HubSpot contact fields such as firstname, lastname, and email.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-800">First name</span>
                  <Input
                    {...register("firstname", {
                      required: "First name is required.",
                      minLength: { value: 2, message: "Enter at least 2 characters." },
                    })}
                    placeholder="Jane"
                  />
                  {errors.firstname ? <p className="text-sm text-rose-600">{errors.firstname.message}</p> : null}
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-800">Last name</span>
                  <Input
                    {...register("lastname", {
                      required: "Last name is required.",
                      minLength: { value: 2, message: "Enter at least 2 characters." },
                    })}
                    placeholder="Doe"
                  />
                  {errors.lastname ? <p className="text-sm text-rose-600">{errors.lastname.message}</p> : null}
                </label>
              </div>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-800">Email</span>
                <Input
                  type="email"
                  {...register("email", {
                    required: "Email is required.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address.",
                    },
                  })}
                  placeholder="jane.doe@example.com"
                />
                {errors.email ? <p className="text-sm text-rose-600">{errors.email.message}</p> : null}
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-800">Phone</span>
                  <Input {...register("phone")} placeholder="(555) 123-4567" />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-800">Job title</span>
                  <Input {...register("jobtitle")} placeholder="Marketing Director" />
                </label>
              </div>
            </CardContent>
          </Card>

          <Card className="space-y-6">
            <CardHeader>
              <CardTitle>Company details</CardTitle>
              <CardDescription>
                Provide the HubSpot company fields for name and domain.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-800">Company name</span>
                <Input
                  {...register("name", {
                    validate: (value) =>
                      value.trim().length > 0 || getValues("domain").trim().length > 0 ||
                      "Company name or domain is required.",
                  })}
                  placeholder="Acme Co."
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-800">Company domain</span>
                <Input
                  {...register("domain", {
                    validate: (value) =>
                      value.trim().length > 0 || getValues("name").trim().length > 0 ||
                      "Company name or domain is required.",
                  })}
                  placeholder="acme.com"
                />
              </label>
              {errors.name || errors.domain ? (
                <p className="text-sm text-rose-600">
                  {(errors.name ?? errors.domain)?.message}
                </p>
              ) : null}

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-800">Company size</span>
                  <select
                    {...register("company_size")}
                    className="flex h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-950 shadow-sm transition duration-200 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  >
                    <option value="">Select size</option>
                    {companySizeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-800">Website</span>
                  <Input type="url" {...register("website")} placeholder="https://acme.com" />
                </label>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-full">
            <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-900/5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Ready to submit?</p>
                <p className="text-sm text-slate-600">
                  All required fields validate instantly as you type.
                </p>
              </div>
              <Button
                type="submit"
                variant="default"
                size="lg"
                isLoading={isLoading}
                disabled={!isValid || isLoading}
              >
                Save manual entry
              </Button>
            </div>
          </div>
        </form>
      </div>

      {toast ? <Toast type={toast.type} message={toast.message} visible /> : null}
    </main>
  );
}
