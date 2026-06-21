## Contact and Company property reference

This reference is based on the current property definitions in your portal. For each field, I’ve included the property label, internal name, data type, accepted values, and whether I would treat it as a **primary/core field**.

**How to read the “Primary or Not” column**
- **Primary** = the main identifying or core business field for that object in HubSpot.
- **Not primary** = still valid and usable, but not the object’s main identifying field.
- HubSpot’s metadata here does **not** expose a universal “required on create” flag for every property, so this column is the safest practical interpretation for setup and mapping work.

**Value format notes**
- **String** = free text.
- **Number** = numeric value only.
- **Date** = date only.
- **Datetime** = date and time; use ISO-style values such as `2026-06-15T00:00:00Z` when importing or writing via API.
- **Enumeration** = dropdown/select field. I’ve listed both the visible label and the internal value.
- None of the specific fields you asked for are configured as true multi-checkbox / multi-select fields in the metadata returned here. The dropdown fields below accept **one** value unless noted otherwise.

---

## Contacts

| Property Label | Internal Name | Type | Accepted Values & Internal Name | Primary or Not |
|---|---|---|---|---|
| First Name | `firstname` | string | Free text | Primary |
| Last Name | `lastname` | string | Free text | Primary |
| Email | `email` | string | Free text email address | Primary |
| Phone Number | `phone` | string | Free text / phone number | Not primary |
| Job Title | `jobtitle` | string | Free text | Not primary |
| Lead Status | `hs_lead_status` | enumeration | New=`NEW`; Open=`OPEN`; In Progress=`IN_PROGRESS`; Open Deal=`OPEN_DEAL`; Unqualified=`UNQUALIFIED`; Attempted to Contact=`ATTEMPTED_TO_CONTACT`; Connected=`CONNECTED`; Bad Timing=`BAD_TIMING` | Not primary |
| City | `city` | string | Free text | Not primary |
| Country/Region | `country` | string | Free text | Not primary |
| Country/Region Code | `hs_country_region_code` | string | Free text country/region code | Not primary |
| Create Date | `createdate` | datetime | System-managed datetime; use ISO format like `2026-06-15T19:34:00Z` when writing/importing comparable datetime values | Not primary |
| Facebook | `facebook` | string | Free text / URL / handle | Not primary |
| Gender | `gender` | string | Free text | Not primary |
| hs_lead_status | `hs_lead_status` | enumeration | Same as Lead Status: New=`NEW`; Open=`OPEN`; In Progress=`IN_PROGRESS`; Open Deal=`OPEN_DEAL`; Unqualified=`UNQUALIFIED`; Attempted to Contact=`ATTEMPTED_TO_CONTACT`; Connected=`CONNECTED`; Bad Timing=`BAD_TIMING` | Not primary |
| Industry | `industry` | string | Free text | Not primary |
| Lifecycle Stage | `lifecyclestage` | enumeration | Subscriber=`subscriber`; Lead=`lead`; Marketing Qualified Lead=`marketingqualifiedlead`; Sales Qualified Lead=`salesqualifiedlead`; Opportunity=`opportunity`; Customer=`customer`; Evangelist=`evangelist`; Other=`other` | Not primary |
| State/Region | `state` | string | Free text | Not primary |
| Website URL | `website` | string | Free text / URL | Not primary |
| LinkedIn URL | `hs_linkedin_url` | string | Free text / URL | Not primary |
| Mobile Phone Number | `mobilephone` | string | Free text / phone number | Not primary |
| Company Name | `company` | string | Free text | Not primary |
| Contact owner | `hubspot_owner_id` | enumeration | Niloy Islam=`87038163`; Md Nurnabi Rana=`164323797` | Not primary |
| State/Region Code | `hs_state_code` | string | Free text code | Not primary |
| Record ID | `hs_object_id` | number | System numeric ID | Primary |

### Contact notes
- The main identifying contact fields are typically **Email**, **First Name**, and **Last Name**.
- In most CRM/API mapping work, **`email`** is the most important contact identifier.
- Your portal also contains a second custom lead-status-like field labeled **`hs_lead_status`** with internal name **`hs`** and values Open=`Open`, New=`New`, Customer=`Customer`, In Progress=`In Progress`. Since it appears custom and overlaps with the standard Lead Status field, use it carefully.

---

## Companies

| Property Label | Internal Name | Type | Accepted Values & Internal Name | Primary or Not |
|---|---|---|---|---|
| About Us | `about_us` | string | Free text | Not primary |
| Annual Revenue | `annualrevenue` | number | Numeric value only | Not primary |
| City | `city` | string | Free text | Not primary |
| Company Domain Name | `domain` | string | Free text domain, e.g. `example.com` | Primary |
| Company name | `name` | string | Free text | Primary |
| Company Size | `company_size` | enumeration | 1-10=`1-10`; 11-50=`11-50`; 51-200=`51-200`; 201-500=`201-500`; 501-1000=`501-1000` | Not primary |
| Country/Region | `country` | string | Free text | Not primary |
| Description | `description` | string | Free text | Not primary |
| Industry | `industry` | enumeration | Accounting=`ACCOUNTING`; Airlines/Aviation=`AIRLINES_AVIATION`; Alternative Dispute Resolution=`ALTERNATIVE_DISPUTE_RESOLUTION`; Alternative Medicine=`ALTERNATIVE_MEDICINE`; Animation=`ANIMATION`; Apparel & Fashion=`APPAREL_FASHION`; Architecture & Planning=`ARCHITECTURE_PLANNING`; Arts and Crafts=`ARTS_AND_CRAFTS`; Automotive=`AUTOMOTIVE`; Aviation & Aerospace=`AVIATION_AEROSPACE`; Banking=`BANKING`; Biotechnology=`BIOTECHNOLOGY`; Broadcast Media=`BROADCAST_MEDIA`; Building Materials=`BUILDING_MATERIALS`; Business Supplies and Equipment=`BUSINESS_SUPPLIES_AND_EQUIPMENT`; Capital Markets=`CAPITAL_MARKETS`; Chemicals=`CHEMICALS`; Civic & Social Organization=`CIVIC_SOCIAL_ORGANIZATION`; Civil Engineering=`CIVIL_ENGINEERING`; Commercial Real Estate=`COMMERCIAL_REAL_ESTATE`; Computer & Network Security=`COMPUTER_NETWORK_SECURITY`; Computer Games=`COMPUTER_GAMES`; Computer Hardware=`COMPUTER_HARDWARE`; Computer Networking=`COMPUTER_NETWORKING`; Computer Software=`COMPUTER_SOFTWARE`; Internet=`INTERNET`; Construction=`CONSTRUCTION`; Consumer Electronics=`CONSUMER_ELECTRONICS`; Consumer Goods=`CONSUMER_GOODS`; Consumer Services=`CONSUMER_SERVICES`; Cosmetics=`COSMETICS`; Dairy=`DAIRY`; Defense & Space=`DEFENSE_SPACE`; Design=`DESIGN`; Education Management=`EDUCATION_MANAGEMENT`; E-Learning=`E_LEARNING`; Electrical/Electronic Manufacturing=`ELECTRICAL_ELECTRONIC_MANUFACTURING`; Entertainment=`ENTERTAINMENT`; Environmental Services=`ENVIRONMENTAL_SERVICES`; Events Services=`EVENTS_SERVICES`; Executive Office=`EXECUTIVE_OFFICE`; Facilities Services=`FACILITIES_SERVICES`; Farming=`FARMING`; Financial Services=`FINANCIAL_SERVICES`; Fine Art=`FINE_ART`; Fishery=`FISHERY`; Food & Beverages=`FOOD_BEVERAGES`; Food Production=`FOOD_PRODUCTION`; Fund-Raising=`FUND_RAISING`; Furniture=`FURNITURE`; Gambling & Casinos=`GAMBLING_CASINOS`; Glass, Ceramics & Concrete=`GLASS_CERAMICS_CONCRETE`; Government Administration=`GOVERNMENT_ADMINISTRATION`; Government Relations=`GOVERNMENT_RELATIONS`; Graphic Design=`GRAPHIC_DESIGN`; Health, Wellness and Fitness=`HEALTH_WELLNESS_AND_FITNESS`; Higher Education=`HIGHER_EDUCATION`; Hospital & Health Care=`HOSPITAL_HEALTH_CARE`; Hospitality=`HOSPITALITY`; Human Resources=`HUMAN_RESOURCES`; Import and Export=`IMPORT_AND_EXPORT`; Individual & Family Services=`INDIVIDUAL_FAMILY_SERVICES`; Industrial Automation=`INDUSTRIAL_AUTOMATION`; Information Services=`INFORMATION_SERVICES`; Information Technology and Services=`INFORMATION_TECHNOLOGY_AND_SERVICES`; Insurance=`INSURANCE`; International Affairs=`INTERNATIONAL_AFFAIRS`; International Trade and Development=`INTERNATIONAL_TRADE_AND_DEVELOPMENT`; Investment Banking=`INVESTMENT_BANKING`; Investment Management=`INVESTMENT_MANAGEMENT`; Judiciary=`JUDICIARY`; Law Enforcement=`LAW_ENFORCEMENT`; Law Practice=`LAW_PRACTICE`; Legal Services=`LEGAL_SERVICES`; Legislative Office=`LEGISLATIVE_OFFICE`; Leisure, Travel & Tourism=`LEISURE_TRAVEL_TOURISM`; Libraries=`LIBRARIES`; Logistics and Supply Chain=`LOGISTICS_AND_SUPPLY_CHAIN`; Luxury Goods & Jewelry=`LUXURY_GOODS_JEWELRY`; Machinery=`MACHINERY`; Management Consulting=`MANAGEMENT_CONSULTING`; Maritime=`MARITIME`; Market Research=`MARKET_RESEARCH`; Marketing and Advertising=`MARKETING_AND_ADVERTISING`; Mechanical or Industrial Engineering=`MECHANICAL_OR_INDUSTRIAL_ENGINEERING`; Media Production=`MEDIA_PRODUCTION`; Medical Devices=`MEDICAL_DEVICES`; Medical Practice=`MEDICAL_PRACTICE`; Mental Health Care=`MENTAL_HEALTH_CARE`; Military=`MILITARY`; Mining & Metals=`MINING_METALS`; Motion Pictures and Film=`MOTION_PICTURES_AND_FILM`; Museums and Institutions=`MUSEUMS_AND_INSTITUTIONS`; Music=`MUSIC`; Nanotechnology=`NANOTECHNOLOGY`; Newspapers=`NEWSPAPERS`; Non-Profit Organization Management=`NON_PROFIT_ORGANIZATION_MANAGEMENT`; Oil & Energy=`OIL_ENERGY`; Online Media=`ONLINE_MEDIA`; Outsourcing/Offshoring=`OUTSOURCING_OFFSHORING`; Package/Freight Delivery=`PACKAGE_FREIGHT_DELIVERY`; Packaging and Containers=`PACKAGING_AND_CONTAINERS`; Paper & Forest Products=`PAPER_FOREST_PRODUCTS`; Performing Arts=`PERFORMING_ARTS`; Pharmaceuticals=`PHARMACEUTICALS`; Philanthropy=`PHILANTHROPY`; Photography=`PHOTOGRAPHY`; Plastics=`PLASTICS`; Political Organization=`POLITICAL_ORGANIZATION`; Primary/Secondary Education=`PRIMARY_SECONDARY_EDUCATION`; Printing=`PRINTING`; Professional Training & Coaching=`PROFESSIONAL_TRAINING_COACHING`; Program Development=`PROGRAM_DEVELOPMENT`; Public Policy=`PUBLIC_POLICY`; Public Relations and Communications=`PUBLIC_RELATIONS_AND_COMMUNICATIONS`; Public Safety=`PUBLIC_SAFETY`; Publishing=`PUBLISHING`; Railroad Manufacture=`RAILROAD_MANUFACTURE`; Ranching=`RANCHING`; Real Estate=`REAL_ESTATE`; Recreational Facilities and Services=`RECREATIONAL_FACILITIES_AND_SERVICES`; Religious Institutions=`RELIGIOUS_INSTITUTIONS`; Renewables & Environment=`RENEWABLES_ENVIRONMENT`; Research=`RESEARCH`; Restaurants=`RESTAURANTS`; Retail=`RETAIL`; Security and Investigations=`SECURITY_AND_INVESTIGATIONS`; Semiconductors=`SEMICONDUCTORS`; Shipbuilding=`SHIPBUILDING`; Sporting Goods=`SPORTING_GOODS`; Sports=`SPORTS`; Staffing and Recruiting=`STAFFING_AND_RECRUITING`; Supermarkets=`SUPERMARKETS`; Telecommunications=`TELECOMMUNICATIONS`; Textiles=`TEXTILES`; Think Tanks=`THINK_TANKS`; Tobacco=`TOBACCO`; Translation and Localization=`TRANSLATION_AND_LOCALIZATION`; Transportation/Trucking/Railroad=`TRANSPORTATION_TRUCKING_RAILROAD`; Utilities=`UTILITIES`; Venture Capital & Private Equity=`VENTURE_CAPITAL_PRIVATE_EQUITY`; Veterinary=`VETERINARY`; Warehousing=`WAREHOUSING`; Wholesale=`WHOLESALE`; Wine and Spirits=`WINE_AND_SPIRITS`; Wireless=`WIRELESS`; Writing and Editing=`WRITING_AND_EDITING`; Mobile Games=`MOBILE_GAMES` | Not primary |
| Lead Status | `hs_lead_status` | enumeration | New=`NEW`; Open=`OPEN`; In Progress=`IN_PROGRESS`; Open Deal=`OPEN_DEAL`; Unqualified=`UNQUALIFIED`; Attempted to Contact=`ATTEMPTED_TO_CONTACT`; Connected=`CONNECTED`; Bad Timing=`BAD_TIMING` | Not primary |
| Lifecycle Stage | `lifecyclestage` | enumeration | Subscriber=`subscriber`; Lead=`lead`; Marketing Qualified Lead=`marketingqualifiedlead`; Sales Qualified Lead=`salesqualifiedlead`; Opportunity=`opportunity`; Customer=`customer`; Evangelist=`evangelist`; Other=`other` | Not primary |
| Logo URL | `hs_logo_url` | string | Free text / URL | Not primary |
| LinkedIn | `linkedin_company_page` | string | Free text / URL | Not primary |
| Website URL | `website` | string | Free text / URL | Not primary |
| Phone Number | `phone` | string | Free text / phone number | Not primary |
| Type | `type` | enumeration | Prospect=`PROSPECT`; Partner=`PARTNER`; Reseller=`RESELLER`; Vendor=`VENDOR`; Other=`OTHER` | Not primary |
| Company owner | `hubspot_owner_id` | enumeration | Niloy Islam=`87038163`; Md Nurnabi Rana=`164323797` | Not primary |
| State/Region | `state` | string | Free text | Not primary |
| State/Region Code | `hs_state_code` | string | Free text code | Not primary |
| Record ID | `hs_object_id` | number | System numeric ID | Primary |

### Company notes
- The main identifying company properties are typically **Company name** and **Company Domain Name**.
- For deduplication, imports, and integrations, **`domain`** is often the most practical company identifier besides the system record ID.
- You also have a second company name-like custom field: **`company_name`**. The standard primary company name field is **`name`**.

---

## Quick shortlist of the most important “primary/core” fields by object

### Contacts
- First Name → `firstname`
- Last Name → `lastname`
- Email → `email`
- Record ID → `hs_object_id`

### Companies
- Company name → `name`
- Company Domain Name → `domain`
- Record ID → `hs_object_id`

---

## Implementation guidance for imports / API / integrations

1. Use **internal names**, not labels, when mapping data.
2. For dropdowns, write the **internal value**, not just the visible label.
3. Treat contact **`email`** and company **`domain`** or **`name`** as the most important mapping fields.
4. Use ISO datetime formatting for datetime properties when importing or writing via API.
5. Be careful with lookalike custom fields such as custom owner/name/lead-status fields that overlap with HubSpot defaults.

If you want, I can next make this cleaner by turning Contacts and Companies into two separate tables optimized for copy/paste into Excel or Google Sheets.