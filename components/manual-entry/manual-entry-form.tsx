"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Toast } from "@/components/ui/toast";
import { HubspotAccessGate, type HubspotAccessState } from "@/components/hubspot-access-gate";
import type { HubSpotPropertyDefinition } from "@/lib/hubspotProperties";

interface ManualEntryFormProps {
  contactProperties: HubSpotPropertyDefinition[];
  companyProperties: HubSpotPropertyDefinition[];
}

type ManualEntryFormValues = Record<string, string>;

type SaveMode = "contact" | "company";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const urlPattern = /^(https?:\/\/)?[\w\-]+(\.[\w\-]+)+[\w\-\._~:/?#[\]@!$&'()*+,;=.]+$/i;
const numberPattern = /^\d+(\.\d+)?$/;

function getDefaultValues(contactProperties: HubSpotPropertyDefinition[], companyProperties: HubSpotPropertyDefinition[]) {
  const contactValues = contactProperties.reduce<Record<string, string>>((acc, property) => {
    acc[property.name] = "";
    return acc;
  }, {});

  const companyValues = companyProperties.reduce<Record<string, string>>((acc, property) => {
    acc[`company_${property.name}`] = "";
    return acc;
  }, {});

  return { ...contactValues, ...companyValues };
}

function buildFieldDefinition(property: HubSpotPropertyDefinition, prefix = "") {
  return {
    key: prefix ? `${prefix}_${property.name}` : property.name,
    propertyName: property.name,
    label: property.label,
    format: property.format,
    type: property.type,
    options: property.options,
  };
}

function getValidationRules(property: HubSpotPropertyDefinition, objectType: "contact" | "company", saveMode: SaveMode) {
  const rules: Record<string, unknown> = {};

  if (objectType === "contact") {
    if (property.name === "email" && saveMode === "contact") {
      rules.required = `${property.label} is required.`;
    }
  }

  if (property.format === "email") {
    rules.pattern = {
      value: emailPattern,
      message: "Enter a valid email address.",
    };
  }

  if (property.format === "url") {
    rules.pattern = {
      value: urlPattern,
      message: "Enter a valid URL.",
    };
  }

  if (property.format === "number") {
    rules.pattern = {
      value: numberPattern,
      message: "Enter a numeric value.",
    };
  }

  if (property.name === "hubspot_owner_id") {
    rules.pattern = {
      value: /^[0-9]+$/,
      message: "Owner ID must contain only numbers.",
    };
  }

  return rules;
}

function getFieldType(property: HubSpotPropertyDefinition) {
  if (property.format === "datetime") {
    return "datetime-local" as const;
  }

  if (property.format === "email") {
    return "email" as const;
  }

  if (property.format === "url") {
    return "url" as const;
  }

  if (property.format === "tel") {
    return "tel" as const;
  }

  return "text" as const;
}

export function ManualEntryForm({ contactProperties, companyProperties }: ManualEntryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [saveMode, setSaveMode] = useState<SaveMode>("contact");
  const [access, setAccess] = useState<HubspotAccessState>({
    accessToken: "",
    validated: false,
    scopes: [],
    missingRecommendedScopes: [],
  });

  const defaultValues = useMemo(
    () => getDefaultValues(contactProperties, companyProperties),
    [contactProperties, companyProperties],
  );

  const {
    register,
    control,
    handleSubmit,
    setValue,
    trigger,
    getValues,
    formState: { errors, isValid },
  } = useForm<ManualEntryFormValues>({
    mode: "onChange",
    defaultValues,
  });

  const watchedValues = useWatch({ control }) as ManualEntryFormValues;

  useEffect(() => {
    if (toast) {
      const timeout = window.setTimeout(() => setToast(null), 3000);
      return () => window.clearTimeout(timeout);
    }
  }, [toast]);

  const contactMap = useMemo(
    () => Object.fromEntries(contactProperties.map((property) => [property.name, property])) as Record<string, HubSpotPropertyDefinition>,
    [contactProperties],
  );

  const companyMap = useMemo(
    () => Object.fromEntries(companyProperties.map((property) => [property.name, property])) as Record<string, HubSpotPropertyDefinition>,
    [companyProperties],
  );

  const contactSections = [
    {
      title: "Contact Information",
      description: "Core contact fields for HubSpot contact creation.",
      fields: ["firstname", "lastname", "email", "phone", "mobilephone", "jobtitle", "company"],
    },
    {
      title: "Location",
      description: "Contact location details.",
      fields: ["city", "state", "country", "hs_state_code", "hs_country_region_code"],
    },
    {
      title: "Social",
      description: "Contact social profile links.",
      fields: ["hs_linkedin_url", "facebook", "website"],
    },
    {
      title: "CRM",
      description: "Contact CRM fields such as status and owner.",
      fields: ["hs_lead_status", "lifecyclestage", "hubspot_owner_id"],
    },
  ];

  const companySections = [
    {
      title: "Company Information",
      description: "Core company fields for HubSpot company creation.",
      fields: [
        "name",
        "domain",
        "website",
        "phone",
        "city",
        "state",
        "country",
        "industry",
        "company_size",
        "type",
      ],
    },
    {
      title: "Additional Company Details",
      description: "Supplemental company fields for richer company records.",
      fields: [
        "annualrevenue",
        "description",
        "linkedin_company_page",
        "hs_logo_url",
        "hs_lead_status",
        "lifecyclestage",
        "hubspot_owner_id",
        "about_us",
      ],
    },
  ];

  const fieldDefinition = (fieldName: string, objectType: "contact" | "company") => {
    const propertyName = objectType === "company" ? fieldName.replace(/^company_/, "") : fieldName;
    const property = objectType === "contact" ? contactMap[propertyName] : companyMap[propertyName];
    return property ? buildFieldDefinition(property, objectType === "company" ? "company" : "") : null;
  };

  const onSubmit = async (values: ManualEntryFormValues) => {
    if (!access.validated) {
      setToast({ type: "error", message: "Connect your HubSpot account via OAuth first." });
      return;
    }

    setIsLoading(true);

    const contactPayload = Object.keys(contactMap).reduce<Record<string, string>>((acc, propertyName) => {
      const value = values[propertyName]?.trim();
      if (value) {
        acc[propertyName] = value;
      }
      return acc;
    }, {});

    const companyPayload = Object.keys(companyMap).reduce<Record<string, string>>((acc, propertyName) => {
      const value = values[`company_${propertyName}`]?.trim();
      if (value) {
        acc[propertyName] = value;
      }
      return acc;
    }, {});

    try {
      const payload = {
        contact: saveMode === "contact" ? contactPayload : undefined,
        company: saveMode === "company" ? companyPayload : undefined,
        associate: false,
        saveMode,
      };

      const response = await fetch("/api/hubspot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to submit HubSpot data.");
      }

      setToast({ type: "success", message: "HubSpot record saved successfully." });
    } catch (error: unknown) {
      const err = error as { message?: string };
      setToast({ type: "error", message: err.message ?? "Unable to submit HubSpot data." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 py-14 px-6 sm:px-10 lg:px-16">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm sm:p-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-4 py-1.5 text-sm font-semibold text-indigo-700 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            Manual Entry
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Create a contact or company with rich HubSpot metadata.</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-500">
            Use all supported HubSpot fields. Required fields validate immediately and payloads are sent to HubSpot.
          </p>
        </section>

        <HubspotAccessGate compact onAccessChange={setAccess} />

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 mb-1">Step 1</p>
          <p className="text-lg font-bold text-slate-900 mb-5">Select Object Type</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                id: "contact" as SaveMode,
                title: "Contacts Form",
                description: "Create or update an individual contact in HubSpot.",
                icon: "👤",
              },
              {
                id: "company" as SaveMode,
                title: "Companies Form",
                description: "Create or update an organization/business in HubSpot.",
                icon: "🏢",
              },
            ].map((option) => {
              const selected = saveMode === option.id;
              return (
                <div
                  key={option.id}
                  onClick={() => {
                    setSaveMode(option.id);
                    window.setTimeout(() => trigger(), 0);
                  }}
                  className={`group cursor-pointer rounded-2xl border-2 p-5 transition-all duration-200 ${
                    selected
                      ? "border-indigo-500 bg-indigo-50 shadow-md"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${selected ? "bg-indigo-100" : "bg-white border border-slate-200"}`}>{option.icon}</span>
                    <div>
                      <h3 className={`font-bold ${selected ? "text-indigo-900" : "text-slate-900"}`}>{option.title}</h3>
                      <p className={`text-xs mt-0.5 ${selected ? "text-indigo-600" : "text-slate-500"}`}>{option.description}</p>
                    </div>
                    {selected && <div className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-white text-xs">✓</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {saveMode === "contact" && (
            <div className="space-y-6">
              {contactSections.map((section, sectionIdx) => (
                <Card key={`contact-section-${sectionIdx}`} className="space-y-4">
                  <CardHeader>
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      {section.fields.map((fieldName) => {
                        const field = fieldDefinition(fieldName, "contact");
                        if (!field) return null;
                        const rules = getValidationRules(contactMap[field.propertyName], "contact", saveMode);
                        const value = watchedValues[field.key] ?? "";

                        if (contactMap[field.propertyName]?.type === "enumeration" && contactMap[field.propertyName]?.options?.length) {
                          return (
                            <div key={field.key} className="space-y-2">
                              <label className="block text-sm font-semibold text-slate-700">{field.label}</label>
                              <Select
                                options={contactMap[field.propertyName]!.options!}
                                label=""
                                value={String(value)}
                                onValueChange={(next) => setValue(field.key, next, { shouldDirty: true, shouldValidate: true })}
                              />
                              {errors[field.key] ? <p className="text-sm text-rose-600">{errors[field.key]?.message}</p> : null}
                            </div>
                          );
                        }

                        return (
                          <label key={field.key} className="space-y-2 block">
                            <span className="text-sm font-semibold text-slate-700">{field.label}</span>
                            <Input
                              type={getFieldType(contactMap[field.propertyName])}
                              {...register(field.key, rules)}
                              placeholder={field.label}
                            />
                            {errors[field.key] ? <p className="text-sm text-rose-600">{errors[field.key]?.message}</p> : null}
                          </label>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {saveMode === "company" && (
            <div className="space-y-6">
              {companySections.map((section, sectionIdx) => (
                <Card key={`company-section-${sectionIdx}`} className="space-y-4">
                  <CardHeader>
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      {section.fields.map((fieldName) => {
                        const rawName = fieldName.replace(/^company_/, "");
                        const field = fieldDefinition(fieldName, "company");
                        if (!field) return null;
                        const property = companyMap[rawName];
                        const rules = getValidationRules(property, "company", saveMode);
                        const value = watchedValues[field.key] ?? "";

                        if (rawName === "name") {
                          rules.validate = (value: string) =>
                            value.trim().length > 0 || getValues("company_domain").trim().length > 0 ||
                            "Company name or domain is required.";
                        }

                        if (rawName === "domain") {
                          rules.validate = (value: string) =>
                            value.trim().length > 0 || getValues("company_name").trim().length > 0 ||
                            "Company name or domain is required.";
                        }

                        if (property?.type === "enumeration" && property.options?.length) {
                          return (
                            <div key={field.key} className="space-y-2">
                              <label className="block text-sm font-semibold text-slate-700">{field.label}</label>
                              <Select
                                options={property.options}
                                label=""
                                value={String(value)}
                                onValueChange={(next) => setValue(field.key, next, { shouldDirty: true, shouldValidate: true })}
                              />
                              {errors[field.key] ? <p className="text-sm text-rose-600">{errors[field.key]?.message}</p> : null}
                            </div>
                          );
                        }

                        if (field.propertyName === "description" || field.propertyName === "about_us") {
                          return (
                            <label key={field.key} className="space-y-2 sm:col-span-2 block">
                              <span className="text-sm font-semibold text-slate-700">{field.label}</span>
                              <textarea
                                {...register(field.key, rules)}
                                rows={4}
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition duration-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                              />
                              {errors[field.key] ? <p className="text-sm text-rose-600">{errors[field.key]?.message}</p> : null}
                            </label>
                          );
                        }

                        return (
                          <label key={field.key} className="space-y-2 block">
                            <span className="text-sm font-semibold text-slate-700">{field.label}</span>
                            <Input
                              type={getFieldType(property)}
                              {...register(field.key, rules)}
                              placeholder={field.label}
                            />
                            {errors[field.key] ? <p className="text-sm text-rose-600">{errors[field.key]?.message}</p> : null}
                          </label>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="col-span-full">
            <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">Submit your import data</p>
                <p className="text-sm text-slate-500">The form sends the payload to HubSpot.</p>
              </div>
              <Button type="submit" variant="default" size="lg" isLoading={isLoading} disabled={!access.validated || !isValid || isLoading}>
                Save to HubSpot →
              </Button>
            </div>
          </div>
        </form>
      </div>

      {toast ? <Toast type={toast.type} message={toast.message} visible /> : null}
    </main>
  );
}
