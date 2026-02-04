# Global College Database Strategy

**Project:** CollegeDost Data Pipeline
**Architect:** Senior Data Engineer
**Version:** 1.0.0

---

## 1. Executive Summary

Building a legitimate, large-scale education database requires shifting focus from "web scraping" to "open data integration". While scraping competitors (Career360, Shiksha) is illegal and unreliable, Governments worldwide _mandate_ universities to report data for accreditation and funding.

**Our Core Strategy:**
Integrate **Government Open Data Interchanges (GODI)**. This data is:

1.  **Legal:** Public domain or open licenses.
2.  **Authoritative:** Comes directly from the Ministry of Education.
3.  **Structured:** Often CSV or XML, avoiding messy HTML parsing.

---

## 2. Country-Wise Data Intelligence

### A. INDIA (Primary Market)

_Source Status: Fragmented but Available_

1.  **AISHE (All India Survey on Higher Education)**
    - **Source:** Ministry of Education (MoE).
    - **Data:** Final Reports (PDF/Excel). The "Directory of Institutions" is often released as a large Excel file.
    - **Fields:** College Name, University Affiliation, Management Type (Govt/Private), Address, Year of Est.
    - **URL:** [aishe.gov.in](https://aishe.gov.in) -> "Reports" -> "Lists".
2.  **NIRF (National Institutional Ranking Framework)**
    - **Source:** MoE.
    - **Data:** Ranking lists (HTML tables).
    - **Value:** Verified "Top 100" lists for Engineering, Medical, MBA. High credibility.
3.  **NMC (National Medical Commission) & AICTE**
    - **Data:** Dashboards showing approved colleges. Requires some "smart" fetching (avoiding heavy scraping, using their dashboard APIs).

### B. USA (The Gold Standard)

_Source Status: excellent_

1.  **IPEDS (Integrated Postsecondary Education Data System)**
    - **Source:** National Center for Education Statistics (NCES).
    - **Data:** Massive CSV files updated yearly.
    - **Completeness:** 100%. Every college receiving federal aid MUST report.
    - **Fields:** Tuition, enrollment, graduation rates, address, website, sector.
    - **Access:** `https://nces.ed.gov/ipeds/use-the-data` -> "Complete Data Files".

### C. UK

_Source Status: Very Good_

1.  **HESA (Higher Education Statistics Agency) / Jisc**
    - **Data:** Open data on students and qualifiers.
2.  **Discover Uni (Unistats)**
    - **Source:** Office for Students (OfS).
    - **Data:** Comprehensive dataset API and CSVs regarding courses and student satisfaction.
    - **URL:** [discoveruni.gov.uk/about/use-our-data/](https://discoveruni.gov.uk/about/use-our-data/)

### D. AUTOMATED GLOBAL LISTS

1.  **OpenStreetMap (OSM)**
    - **Data:** Geolocation of universities globally.
    - **Method:** Query Overpass Turbo for `amentity=university`.
    - **Value:** Precise Latitude/Longitude for maps.
2.  **ROR (Research Organization Registry)**
    - **Source:** ror.org
    - **Data:** CC0 data dump (JSON) of research organizations and universities globally. Contains IDs, websites, and variations of names.

---

## 3. Data Ingestion Architecture

We will follow an **ETL (Extract, Transform, Load)** pipeline.

### Phase 1: Ingestion (The "Harvesters")

We write independent scripts for each source.

- `ingest_ipeds_usa.js`: Downloads US CSVs, parses headers.
- `ingest_aishe_india.js`: Parses uploaded AISHE Excel files.
- `ingest_ror_global.js`: Processes the massive ROR JSON dump.

### Phase 2: Normalization (The "Refinery")

Raw data is messy. "IIT Bombay" might appear as "Indian Inst. of Tech, Mumbai".

- **Normalization Rules:**
  - Trim whitespace.
  - Standardize separators (replace `|` with `,`).
  - Resolve City/State names (e.g., "Bangalore" -> "Bengaluru").

### Phase 3: The "Golden Record" (De-Duplication)

- **Challenge:** Merging IPEDS data with OSM map data.
- **Solution:** Use **Fuzzy Matching** on names within the same country/state.
  - If `Name Similarity > 90%` AND `City Match`: Auto-merge.
  - Else: Create new entry.

---

## 4. MongoDB Schema Design

We need a flexible schema that allows specific fields for specific countries while keeping a global core.

```javascript
const CollegeSchema = new mongoose.Schema(
  {
    // --- CORE IDENTITY ---
    name: { type: String, required: true, index: true },
    aliases: [String], // e.g. ["IITB", "IIT Bombay"]
    slug: { type: String, unique: true, index: true }, // generated-from-name

    // --- LOCATION ---
    location: {
      country: { type: String, required: true, index: true }, // ISO Code: "IN", "US"
      state: { type: String, index: true },
      city: { type: String, index: true },
      address: String,
      coordinates: {
        lat: Number,
        lng: Number,
      }, // Sourced from OSM/Google
    },

    // --- META ---
    type: { type: String, enum: ["Public", "Private", "Deemed", "Consortium"] },
    website: String,
    establishedYear: Number,

    // --- ACADEMIC ---
    streams: [String], // ["Engineering", "Arts"] - derived from parsing courses if avail
    accreditation: {
      body: String, // "NAAC", "ABET"
      grade: String, // "A++"
      cycle: String,
    },

    // --- SOURCE TRACKING (CRITICAL) ---
    dataSources: [
      {
        sourceName: String, // "AISHE_2024", "IPEDS_2023"
        sourceId: String, // ID in their system
        fetchedAt: Date,
      },
    ],
    lastUpdated: { type: Date, default: Date.now },

    // --- METRICS (Flexible Mixin) ---
    ranking: {
      nirf: Number,
      qs: Number,
    },
    stats: {
      studentCount: Number,
      facultyCount: Number,
    },
  },
  { timestamps: true },
);
```

---

## 5. Automation & Scaling

1.  **Updates:** Do not run cron jobs daily. Education data changes **yearly**.
    - Schedule: Run harvesters **quarterly**.
2.  **Manual Overrides:**
    - Build a simple "Admin Admin" interface where you can manually fix a college if user reports an error. Trusted human edits > automated data.
3.  **Versioning:**
    - Keep raw CSVs in an S3 bucket or local `/data/raw` folder. Never delete the source file until processed.

---

## 6. Where to Start (Practical Steps)

1.  **USA:** Download the "HD (Institutional Characteristics)" table from IPEDS. This gets you 6,000+ US colleges instantly with zero legal risk.
2.  **India:** Search for "AISHE Final Report 2021-22 Directory of Institutions". Convert that PDF/Excel to CSV. This gets you ~40,000 Indian colleges.
3.  **Global:** Use ROR.org data dump for the top ~100k global research institutions.

This strategy ensures you own the data, you aren't reliant on a competitor who might sue/block you, and you provide genuine value to your users.
