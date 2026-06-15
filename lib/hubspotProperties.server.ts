import fs from "fs";
import path from "path";
import type { HubSpotPropertyOption } from "@/lib/hubspotProperties";

export function getHubspotPropertyOptions(): HubSpotPropertyOption[] {
  const filePath = path.join(process.cwd(), "HUBSPOT.md");
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  const options: HubSpotPropertyOption[] = [];
  const seen = new Set<string>();

  for (const line of lines) {
    const match = line.match(/^\|\s*([^|]+?)\s*\|\s*`([^`]+)`\s*\|/);
    if (match) {
      const label = match[1].trim();
      const value = match[2].trim();
      if (!seen.has(value)) {
        seen.add(value);
        options.push({ label, value });
      }
    }
  }

  return options;
}
