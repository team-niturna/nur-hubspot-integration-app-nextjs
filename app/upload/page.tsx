"use client";

import React, { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";

type PreviewRow = {
  id: string;
  [key: string]: string | number | null;
};

function getFieldName(columns: string[], key: "email" | "name" | "domain") {
  const normalized = key === "email" ? /email/i : key === "name" ? /name|company\s*name/i : /domain/i;
  return columns.find((column) => normalized.test(column));
}

function inferColumnType(column: string) {
  const normalized = column.toLowerCase();

  if (/email/.test(normalized)) {
    return "email";
  }

  if (/website|url|linkedin|facebook|logo/.test(normalized)) {
    return "url";
  }

  if (/phone|mobile/.test(normalized)) {
    return "phone";
  }

  if (/revenue|annual.*revenue|amount|number|count|size/.test(normalized)) {
    return "number";
  }

  if (/date|createdate|created/.test(normalized)) {
    return "datetime";
  }

  return "text";
}

function validateValue(value: string, columnType: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (columnType === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(trimmed) ? null : "Invalid email format.";
  }

  if (columnType === "url") {
    const urlRegex = /^(https?:\/\/)?[\w\-]+(\.[\w\-]+)+[\w\-\._~:/?#[\]@!$&'()*+,;=.]+$/i;
    return urlRegex.test(trimmed) ? null : "Invalid URL format.";
  }

  if (columnType === "number") {
    const numberRegex = /^\d+(\.\d+)?$/;
    return numberRegex.test(trimmed) ? null : "Value must be numeric.";
  }

  return null;
}

function validateRow(row: PreviewRow, columns: string[]) {
  const emailField = getFieldName(columns, "email");
  const nameField = getFieldName(columns, "name");
  const domainField = getFieldName(columns, "domain");

  const emailValue = emailField ? String(row[emailField] ?? "").trim() : "";
  const nameValue = nameField ? String(row[nameField] ?? "").trim() : "";
  const domainValue = domainField ? String(row[domainField] ?? "").trim() : "";

  const errors: string[] = [];

  if (!emailValue && !nameValue && !domainValue) {
    errors.push("Missing required email or company name/domain.");
  }

  for (const column of columns) {
    const value = String(row[column] ?? "");
    const type = inferColumnType(column);
    const validationError = validateValue(value, type);
    if (validationError) {
      errors.push(`${column}: ${validationError}`);
    }
  }

  return errors;
}

function buildEmptyRow(columns: string[]) {
  return columns.reduce<PreviewRow>((acc, column) => {
    acc[column] = "";
    return acc;
  }, { id: typeof crypto !== "undefined" ? crypto.randomUUID() : Math.random().toString(36).slice(2) });
}

export default function UploadPage() {
  const [fileName, setFileName] = useState("");
  const [previewColumns, setPreviewColumns] = useState<string[]>([]);
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const rowValidation = useMemo(() => {
    return previewRows.reduce<Record<string, string[]>>((acc, row) => {
      acc[row.id] = validateRow(row, previewColumns);
      return acc;
    }, {});
  }, [previewRows, previewColumns]);

  const invalidRowCount = useMemo(
    () => Object.values(rowValidation).filter((errors) => errors.length > 0).length,
    [rowValidation],
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const contactCount = useMemo(() => {
    const emailField = getFieldName(previewColumns, "email");
    if (!emailField) return 0;
    return previewRows.filter((row) => String(row[emailField] ?? "").trim()).length;
  }, [previewColumns, previewRows]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const companyCount = useMemo(() => {
    const emailField = getFieldName(previewColumns, "email");
    const nameField = getFieldName(previewColumns, "name");
    const domainField = getFieldName(previewColumns, "domain");
    return previewRows.filter((row) => {
      const hasEmail = emailField && String(row[emailField] ?? "").trim();
      const hasName = nameField && String(row[nameField] ?? "").trim();
      const hasDomain = domainField && String(row[domainField] ?? "").trim();
      return !hasEmail && (hasName || hasDomain);
    }).length;
  }, [previewColumns, previewRows]);

  const rowCount = previewRows.length;

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || (extension !== "csv" && extension !== "xlsx")) {
      setErrorMessage("Unsupported file type. Please upload a CSV or XLSX file.");
      setPreviewColumns([]);
      setPreviewRows([]);
      setFileName("");
      setToast(null);
      return;
    }

    setErrorMessage(null);
    setIsParsing(true);
    setFileName(file.name);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      if (!worksheet) {
        throw new Error("No worksheet found in the uploaded file.");
      }

      const rows = XLSX.utils.sheet_to_json<(string | number | null)[]>(worksheet, { header: 1, defval: null });
      if (!rows.length) {
        throw new Error("The uploaded file is empty.");
      }

      const headerRow = rows[0].map((value) => String(value || "").trim());
      const columns = headerRow.map((label, index) => label || `Column ${index + 1}`);
      const parsedRows = rows.slice(1).map((row) => {
        const rowData: PreviewRow = { id: typeof crypto !== "undefined" ? crypto.randomUUID() : Math.random().toString(36).slice(2) };
        columns.forEach((column, index) => {
          rowData[column] = row[index] ?? "";
        });
        return rowData;
      });

      setPreviewColumns(columns);
      setPreviewRows(parsedRows);
      setToast({ type: "success", message: `${parsedRows.length} rows parsed successfully.` });
    } catch {
      setErrorMessage("Unable to parse the uploaded file. Please verify it is a valid CSV or XLSX file.");
      setPreviewColumns([]);
      setPreviewRows([]);
      setFileName("");
      setToast({ type: "error", message: "File parsing failed." });
    } finally {
      setIsParsing(false);
    }
  }

  const updateRowValue = (rowId: string, column: string, value: string) => {
    setPreviewRows((current) =>
      current.map((row) => (row.id === rowId ? { ...row, [column]: value } : row)),
    );
  };

  const addRow = () => {
    if (!previewColumns.length) return;
    setPreviewRows((current) => [...current, buildEmptyRow(previewColumns)]);
  };

  const deleteRow = (rowId: string) => {
    setPreviewRows((current) => current.filter((row) => row.id !== rowId));
  };

  const handleSubmit = async () => {
    if (invalidRowCount > 0) {
      setToast({ type: "error", message: "Cannot submit: there are invalid rows." });
      return;
    }

    if (previewRows.length === 0) {
      setToast({ type: "error", message: "No valid rows to submit." });
      return;
    }

    setIsSubmitting(true);

    try {
      // Map CSV columns to HubSpot properties
      const emailField = getFieldName(previewColumns, "email");
      const nameField = getFieldName(previewColumns, "name");
      const domainField = getFieldName(previewColumns, "domain");

      const rows = previewRows.map((row) => {
        const contact: Record<string, string | number | null> = {};
        const company: Record<string, string | number | null> = {};

        // Map email field
        if (emailField && row[emailField]) {
          contact.email = String(row[emailField]);
        }

        // Map name and domain fields
        if (nameField && row[nameField]) {
          company.name = String(row[nameField]);
        }
        if (domainField && row[domainField]) {
          company.domain = String(row[domainField]);
        }

        // Map other columns intelligently
        for (const column of previewColumns) {
          if (column === emailField || column === nameField || column === domainField) continue;

          const value = row[column];
          if (!value) continue;

          const normalized = column.toLowerCase();
          
          // Contact fields
          if (/firstname|first.?name/.test(normalized)) {
            contact.firstname = String(value);
          } else if (/lastname|last.?name|surname/.test(normalized)) {
            contact.lastname = String(value);
          } else if (/phone|telephone/.test(normalized)) {
            contact.phone = String(value);
          } else if (/mobile|cell/.test(normalized)) {
            contact.mobilephone = String(value);
          } else if (/job.?title|title/.test(normalized)) {
            contact.jobtitle = String(value);
          } else if (/company|employer/.test(normalized) && !company.name) {
            contact.company = String(value);
          } else if (/website|web/.test(normalized) && !company.website) {
            contact.website = String(value);
          } else if (/linkedin|social/.test(normalized)) {
            contact.hs_linkedin_url = String(value);
          } else if (/facebook/.test(normalized)) {
            contact.facebook = String(value);
          }
          
          // Company fields
          if (/website|web/.test(normalized) && !contact.website) {
            company.website = String(value);
          } else if (/phone/.test(normalized) && !contact.phone) {
            company.phone = String(value);
          } else if (/industry/.test(normalized)) {
            company.industry = String(value);
          } else if (/description|about/.test(normalized)) {
            company.description = String(value);
          }

          // Location fields (apply to both)
          if (/city/.test(normalized)) {
            contact.city = String(value);
            company.city = String(value);
          } else if (/state|region|province/.test(normalized)) {
            contact.state = String(value);
            company.state = String(value);
          } else if (/country/.test(normalized)) {
            contact.country = String(value);
            company.country = String(value);
          }
        }

        return {
          contact: Object.keys(contact).length > 0 ? contact : undefined,
          company: Object.keys(company).length > 0 ? company : undefined,
        };
      });

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to submit data");
      }

      setToast({ type: "success", message: result.message });
      setPreviewRows([]);
      setPreviewColumns([]);
      setFileName("");
    } catch (error: unknown) {
      const err = error as { message?: string };
      setToast({ type: "error", message: err.message ?? "Failed to submit data" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-14 px-6 sm:px-10 lg:px-16">
      <div className="mx-auto w-full max-w-7xl space-y-10">
        <section className="rounded-[2rem] border border-slate-200/80 bg-white p-10 shadow-xl shadow-slate-900/5 sm:p-14">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Upload CSV/XLSX
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Import your spreadsheet and preview the data first.
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-600">
              Upload a CSV or XLSX file to convert it to JSON, edit records, and resolve invalid rows before import.
            </p>
          </div>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Choose a file</CardTitle>
            <CardDescription>
              Supported formats: <span className="font-semibold">.csv</span> and <span className="font-semibold">.xlsx</span>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-[1fr_auto] items-end">
              <label className="block w-full rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-700 shadow-sm">
                <span className="block text-sm font-medium text-slate-900">Upload file</span>
                <span className="mt-2 block text-sm text-slate-600">Select a CSV or XLSX file to preview before import.</span>
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={handleFileChange}
                  className="mt-4 w-full cursor-pointer bg-transparent"
                />
              </label>
              <div className="rounded-3xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                <p className="font-semibold">File details</p>
                <p className="mt-2">{fileName || "No file selected"}</p>
                <p className="mt-1 text-slate-500">{rowCount ? `Rows parsed: ${rowCount}` : "Rows will appear after parsing."}</p>
              </div>
            </div>

            {errorMessage ? (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {errorMessage}
              </div>
            ) : null}

            {previewRows.length ? (
              <div className="space-y-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900">Preview table</p>
                    <p className="text-sm text-slate-600">Showing the first {Math.min(10, previewRows.length)} rows.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-700">
                      Total rows: {rowCount}
                    </div>
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">
                      Valid rows: {rowCount - invalidRowCount}
                    </div>
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-900">
                      Invalid rows: {invalidRowCount}
                    </div>
                    <Button variant="secondary" size="md" type="button" onClick={addRow}>
                      Add row
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                    <thead className="bg-slate-950 text-white">
                      <tr>
                        {previewColumns.map((column, idx) => (
                          <th key={`header-${idx}-${column}`} className="border-b border-slate-200 px-4 py-3 font-semibold">
                            {column}
                          </th>
                        ))}
                        <th className="border-b border-slate-200 px-4 py-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewRows.map((row, rowIndex) => {
                        const errors = rowValidation[row.id] ?? [];
                        const isInvalid = errors.length > 0;
                        return (
                          <React.Fragment key={row.id}>
                            <tr
                              className={isInvalid ? "bg-rose-50" : rowIndex % 2 === 0 ? "bg-slate-50" : "bg-white"}
                            >
                              {previewColumns.map((column, colIdx) => (
                                <td key={`cell-${row.id}-${colIdx}-${column}`} className="border-b border-slate-200 px-4 py-3 align-top text-slate-700">
                                  <input
                                    value={String(row[column] ?? "")}
                                    onChange={(event) => updateRowValue(row.id, column, event.target.value)}
                                    className={`w-full rounded-2xl border px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 ${
                                      isInvalid ? "border-rose-300 bg-rose-50 focus:ring-rose-200" : "border-slate-200 bg-white"
                                    }`}
                                  />
                                </td>
                              ))}
                              <td className="border-b border-slate-200 px-4 py-3 align-top">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  type="button"
                                  onClick={() => deleteRow(row.id)}
                                >
                                  Delete
                                </Button>
                              </td>
                            </tr>
                            {isInvalid ? (
                              <tr className="bg-rose-50">
                                <td colSpan={previewColumns.length + 1} className="px-4 py-3 text-sm text-rose-700">
                                  {errors.map((error, index) => (
                                    <p key={`error-${row.id}-${index}`}>{error}</p>
                                  ))}
                                </td>
                              </tr>
                            ) : null}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center text-sm text-slate-500">
                {isParsing ? "Parsing file..." : "No preview available yet. Upload a file to see live JSON conversion."}
              </div>
            )}

            {previewRows.length > 0 && (
              <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200/80 bg-gradient-to-r from-emerald-50 to-white p-6 shadow-sm shadow-emerald-900/5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Ready to import?</p>
                  <p className="text-sm text-slate-600">{rowCount - invalidRowCount} valid rows ready to send to HubSpot.</p>
                </div>
                <Button
                  type="button"
                  variant="default"
                  size="lg"
                  isLoading={isSubmitting}
                  disabled={invalidRowCount > 0 || isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? "Submitting..." : "Submit to HubSpot"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {toast ? <Toast type={toast.type} message={toast.message} visible /> : null}
    </main>
  );
}
