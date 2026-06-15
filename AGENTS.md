# AGENTS.md

## Project Overview

Build a production-ready Next.js application that allows users to create and update HubSpot Contacts and Companies.

The application will be deployed on Vercel.

Use TypeScript throughout the project.

The application must support:

1. Manual Contact/Company creation
2. CSV upload
3. XLSX upload
4. Preview imported data before submission
5. HubSpot property mapping
6. Data correction in browser before import
7. Contact + Company creation and update
8. Contact ↔ Company association
9. Friendly error handling
10. Responsive UI

---

# Tech Stack

Use:

* Next.js (App Router)
* TypeScript
* React
* React Hook Form
* Axios
* XLSX
* Tailwind CSS
* shadcn/ui

Do NOT add:

* Prisma
* MongoDB
* PostgreSQL
* Drizzle
* Redux
* Zustand
* Zod unless absolutely necessary

Keep the application lightweight.

---

# UX Flow

Homepage must first ask:

"How would you like to add data?"

Display two large cards:

## Option 1

Manual Entry

Description:

Create a contact/company manually.

Button:

"Manual Entry"

---

## Option 2

Upload File

Description:

Upload CSV or XLSX file.

Button:

"Upload File"

---

# Manual Entry Flow

Use React Hook Form.

Display validation immediately.

Show clear error messages.

Required fields:

For Contact:

* Email

For Company:

* Company Name OR Domain

Do not allow submission until required fields are valid.

Show loading state during submission.

Show success toast.

Show error toast.

---

# Upload Flow

Accepted files:

* .csv
* .xlsx

Read file using XLSX library.

Convert file to JSON.

Show preview table.

Never submit immediately.

User must review data first.

---

# Mapping Screen

After file upload:

Display:

Source Column → HubSpot Property

Example:

Email → email

First Name → firstname

Company → company

Allow user to change mappings.

All mappings must be editable.

Provide dropdown selector.

---

# Validation Before Import

Validate:

Required fields exist.

Example:

Contact requires:

email

Company requires:

name OR domain

If missing:

Highlight row.

Display reason.

Allow user to edit directly inside browser.

Do NOT force user to re-upload file.

---

# Editable Preview

Preview table must allow:

* edit cell
* delete row
* add row

before import.

Changes must update local state.

---

# Import Summary Screen

Before import show:

Total Rows

Valid Rows

Invalid Rows

Contacts To Create

Companies To Create

---

# Import Result Screen

Display:

Total Processed

Success Count

Failure Count

Error Rows

Provide downloadable error report JSON.

---

# HubSpot API

Use Axios.

Create a shared HubSpot client.

Environment variable:

HUBSPOT_ACCESS_TOKEN

Never expose token to frontend.

All HubSpot requests must occur in server routes.

---

# HubSpot Contact Mapping

Label -> Internal Name

First Name -> firstname

Last Name -> lastname

Email -> email

Phone Number -> phone

Mobile Phone Number -> mobilephone

Job Title -> jobtitle

Company Name -> company

City -> city

State/Region -> state

Country/Region -> country

Website URL -> website

LinkedIn URL -> hs_linkedin_url

Facebook -> facebook

Industry -> industry

Lead Status -> hs_lead_status

Lifecycle Stage -> lifecyclestage

Contact Owner -> hubspot_owner_id

Record ID -> hs_object_id

---

# HubSpot Company Mapping

Company Name -> name

Company Domain Name -> domain

Phone Number -> phone

Website URL -> website

City -> city

State/Region -> state

Country/Region -> country

Description -> description

Industry -> industry

Type -> type

Annual Revenue -> annualrevenue

LinkedIn -> linkedin_company_page

Logo URL -> hs_logo_url

Lead Status -> hs_lead_status

Lifecycle Stage -> lifecyclestage

Company Owner -> hubspot_owner_id

Record ID -> hs_object_id

---

# Contact Lead Status Values

Display Label -> Internal Value

New -> NEW

Open -> OPEN

In Progress -> IN_PROGRESS

Open Deal -> OPEN_DEAL

Unqualified -> UNQUALIFIED

Attempted to Contact -> ATTEMPTED_TO_CONTACT

Connected -> CONNECTED

Bad Timing -> BAD_TIMING

Always send internal values.

---

# Lifecycle Stage Values

Subscriber -> subscriber

Lead -> lead

Marketing Qualified Lead -> marketingqualifiedlead

Sales Qualified Lead -> salesqualifiedlead

Opportunity -> opportunity

Customer -> customer

Evangelist -> evangelist

Other -> other

Always send internal values.

---

# Contact Owners

Niloy Islam -> 87038163

Md Nurnabi Rana -> 164323797

Never send owner names.

Always send owner IDs.

---

# Company Type Values

Prospect -> PROSPECT

Partner -> PARTNER

Reseller -> RESELLER

Vendor -> VENDOR

Other -> OTHER

Always send internal values.

---

# Contact Rules

Primary identifier:

email

When importing:

1. Search contact by email.
2. If found:
   update contact.
3. If not found:
   create contact.

---

# Company Rules

Primary identifier:

domain

Fallback:

name

When importing:

1. Search company by domain.
2. If found:
   update company.
3. If not found:
   create company.

---

# Contact Company Association

After both records exist:

Associate contact with company.

Do not create duplicate associations.

---

# Error Handling

Never show raw HubSpot API errors to users.

Convert errors into friendly messages.

Examples:

INVALID_OPTION

Show:

"Selected value is not allowed."

INVALID_INTEGER

Show:

"Invalid owner selected."

Missing email:

"Email is required."

Missing company name:

"Company name is required."

---

# UI Requirements

Professional SaaS appearance.

Use:

* shadcn/ui
* Tailwind

Requirements:

* Responsive
* Clean spacing
* Card layouts
* Loading states
* Empty states
* Success states
* Error states

No ugly browser alerts.

Use toasts.

---

# Code Quality

Prefer:

* reusable components
* clean TypeScript
* readable code

Avoid unnecessary abstraction.

Do not over-engineer.

Keep files reasonably small.

---

# Git Rules

After every meaningful completed task:

Run:

git add .

Create a commit.

Example:

git commit -m "Add manual contact entry form"

git commit -m "Add CSV upload and preview"

git commit -m "Add HubSpot contact mapping"

Do NOT push.

Never run:

git push

Commits are authored as the repository user, not the agent.

The agent may commit changes but must never push changes.

# Additional Instructions

## HubSpot Property Definitions Source of Truth

The file:

hubspot_integration/HUBSPOT.md

is the single source of truth for HubSpot properties.

Do not duplicate property definitions elsewhere unless necessary.

Whenever implementing:

* forms
* field mapping
* validation
* import logic
* dropdown options
* enum conversion
* API payloads

always read and follow:

hubspot_integration/HUBSPOT.md

Use:

* Property Label
* Internal Name
* Property Type
* Enumeration Values
* Owner IDs
* Lifecycle Stages
* Lead Status Values

from that document.

If there is any conflict between generated code and HUBSPOT.md:

HUBSPOT.md wins.

---

## Development Workflow

After every meaningful feature:

1. Run lint.
2. Run TypeScript checks.
3. Run production build.
4. Fix all build errors.
5. Fix all type errors.
6. Verify the feature manually.

Commands:

npm run lint

npm run build

---

## Browser Verification

Before creating a commit:

Run the application locally.

Verify the implemented flow in a browser.

Examples:

Manual Entry Flow

* Open homepage
* Select Manual Entry
* Submit valid data
* Submit invalid data
* Verify validation messages
* Verify loading state
* Verify success state

Upload Flow

* Upload valid CSV
* Upload valid XLSX
* Verify preview screen
* Verify mapping screen
* Verify editing cells
* Verify import summary
* Verify error handling

Do not assume functionality works.

Verify manually.

---

## Commit Policy

After a feature is completed and verified:

Run:

git add .

Create a commit.

Examples:

git commit -m "Add homepage entry selection"

git commit -m "Add manual contact form"

git commit -m "Add CSV upload preview"

git commit -m "Add HubSpot mapping editor"

git commit -m "Add import validation"

Commits should be small and focused.

---

## Push Policy

Never run:

git push

Never publish code.

Never deploy automatically.

The repository owner controls pushing and deployment.

---

## Commit Author

Commits are made as the repository user.

Do not create commits using:

* GitHub Copilot
* AI Agent
* Bot identities

Use the existing repository git identity.

Do not modify git author configuration.

---

## Architecture Principle

Prefer simple implementation.

Avoid over-engineering.

This application is:

Next.js
TypeScript
React Hook Form
Axios
XLSX
Tailwind
shadcn/ui

Keep architecture understandable by a single developer.

Do not introduce:

* Prisma
* Redux
* Zustand
* CQRS
* Repository Pattern
* Event Bus
* Microservices

unless explicitly requested.

Simple code is preferred over abstract code.

---

## User Experience Requirements

The application should feel like a professional SaaS product.

Priorities:

1. Clarity
2. Reliability
3. Validation
4. Error Handling
5. Import Accuracy

More important than advanced architecture.

The user must always understand:

* what is happening
* what failed
* how to fix it
* what will be imported

before data reaches HubSpot.