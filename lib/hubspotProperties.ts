export interface HubSpotPropertyOption {
  label: string;
  value: string;
}

export const hubspotPropertyOptions: HubSpotPropertyOption[] = [
  { label: "First Name", value: "firstname" },
  { label: "Last Name", value: "lastname" },
  { label: "Email", value: "email" },
  { label: "Phone", value: "phone" },
  { label: "Job Title", value: "jobtitle" },
  { label: "Lead Status", value: "hs_lead_status" },
  { label: "Lifecycle Stage", value: "lifecyclestage" },
  { label: "City", value: "city" },
  { label: "Country/Region", value: "country" },
  { label: "Website URL", value: "website" },
  { label: "LinkedIn URL", value: "hs_linkedin_url" },
  { label: "Mobile Phone", value: "mobilephone" },
  { label: "Company Name", value: "company" },
  { label: "Company Name (Company)", value: "name" },
  { label: "Company Domain", value: "domain" },
  { label: "Company Size", value: "company_size" },
  { label: "Annual Revenue", value: "annualrevenue" },
  { label: "Description", value: "description" },
  { label: "Industry", value: "industry" },
  { label: "Company Phone", value: "phone" },
  { label: "Company Website", value: "website" },
  { label: "Company Type", value: "type" },
];
