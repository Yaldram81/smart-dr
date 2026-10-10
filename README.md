<p align="center">
  <img src="public/logo.svg" alt="Smart.Dr Logo" width="110" height="110" />
</p>

<h1 align="center">🩺 Smart.Dr — Clinical Decision Support & Health Intelligence Platform</h1>

<p align="center">
  <strong>An advanced dual-engine clinical reasoning system, explainable symptom pattern matching, and bilingual healthcare intelligence platform engineered for web and clinical triage.</strong>
</p>

<p align="center">
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-16.2.4%20(App%20Router)-000000.svg?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js 16" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19.0-61DAFB.svg?style=for-the-badge&logo=react&logoColor=black" alt="React 19" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.0-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5" /></a>
  <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-16.0-4169E1.svg?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" /></a>
  <a href="https://www.prisma.io/"><img src="https://img.shields.io/badge/Prisma%20ORM-6.19-2D3748.svg?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma ORM" /></a>
  <a href="https://deepmind.google/technologies/gemini/"><img src="https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-4285F4.svg?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind%20CSS-v4.0-38B2AC.svg?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" /></a>
  <a href="#-multilingual--urdu-nastaleeq-engine"><img src="https://img.shields.io/badge/Language-English%20%7C%20اردو%20نستعلیق-10B981.svg?style=for-the-badge" alt="Bilingual Support" /></a>
</p>

---

## 📖 Executive Summary

**Smart.Dr** is a state-of-the-art medical decision-support and disease prediction platform designed to bridge the accessibility and linguistic divide in healthcare triage. Developed as an undergraduate **Final Year Project (Bachelor of Computer Science — BCS 8th Semester)** at the **Department of Computer Science & Information Technology, University of Malakand (UOM)**, Smart.Dr synthesizes classical clinical taxonomy with modern artificial intelligence.

Rather than relying on uninterpretable black-box predictions, Smart.Dr couples a deterministic, mathematically grounded **Local Similarity Inference Engine** with an **Online Generative AI Engine (Google Gemini 2.5 Flash)**. It features an **Explainability Layer** that breaks down reported hallmark indicators versus expected absent symptoms, providing auditable and scientifically defensible health intelligence in both **English** and **Urdu (Jameel Noori Nastaleeq)**.

---

## 📑 Table of Contents

- [Key Architecture Highlights](#-key-architecture-highlights)
- [System Architecture & Data Flow](#-system-architecture--data-flow)
- [Dual-Engine Inference Mechanism](#-dual-engine-inference-mechanism)
  - [1. Engine A: Local Clinical Similarity Inference Engine](#1-engine-a-local-clinical-similarity-inference-engine)
  - [2. Engine B: Online Generative AI Engine (Gemini 2.5 Flash)](#2-engine-b-online-generative-ai-engine-gemini-25-flash)
- [Explainability & Diagnostic Transparency Layer](#-explainability--diagnostic-transparency-layer)
- [Core Application Modules](#-core-application-modules)
  - [1. Multi-Tab Educational Homepage](#1-multi-tab-educational-homepage)
  - [2. 187+ Visual & Anatomical Symptom Checker](#2-187-visual--anatomical-symptom-checker)
  - [3. Clinical Results & Rx Report Generator](#3-clinical-results--rx-report-generator)
  - [4. Personal Health Analytics Dashboard](#4-personal-health-analytics-dashboard)
  - [5. 24/7 Context-Aware AI Health Assistant](#5-247-context-aware-ai-health-assistant)
- [Educational Pharmacotherapy & Clinical Safety](#-educational-pharmacotherapy--clinical-safety)
- [Multilingual & Urdu Nastaleeq Engine](#-multilingual--urdu-nastaleeq-engine)
- [Technology Stack](#-technology-stack)
- [Database Schema (Prisma & PostgreSQL)](#-database-schema-prisma--postgresql)
- [REST API Reference](#-rest-api-reference)
- [Installation & Getting Started](#-installation--getting-started)
- [Environment Configuration](#-environment-configuration)
- [Production Deployment & Caddy Reverse Proxy](#-production-deployment--caddy-reverse-proxy)
- [Project Directory Layout](#-project-directory-layout)
- [Academic & Developer Credits](#-academic--developer-credits)
- [Medical & Ethical Disclaimer](#-medical--ethical-disclaimer)

---

## 🌟 Key Architecture Highlights

### 🔬 Scientific & Clinical Defensibility
- **Symptom Pattern Similarity Index**: Replaces scientifically misleading "ML certainty" percentages with a weighted pattern similarity metric calibrated between reported symptoms and established clinical profiles.
- **Diagnostic Explainability**: Breaks down each prediction into:
  - **Contributing Diagnostic Indicators**: Highlights reported symptoms with explicit importance badges (`HALLMARK`, `COMMON`, `OCCASIONAL`) and mathematical contribution percentages.
  - **Negative Evidence (Absent Hallmarks)**: Discloses pathognomonic symptoms expected for the disease that were *not* reported by the user, providing critical conversational context for doctors.
- **Controlled Clinical Enums**: Strong typing via Prisma enums (`Severity`: `MILD`, `MODERATE`, `SEVERE`, `CRITICAL`; `SymptomImportance`: `HALLMARK`, `COMMON`, `OCCASIONAL`).
- **Pharmacotherapy Reframing**: Replaces unvetted prescription directives with evidence-based educational references, complete with contraindication warnings (e.g., NSAID prohibition in Dengue).

### ⚡ Technical Highlights
- **Modern Next.js 16 App Router**: Server and Client Components built with Next.js 16 and Turbopack for sub-second hot reloading.
- **187+ Visual Symptoms Across Organ Systems**: Categorized across 10 physiological body systems (Cardiovascular, Respiratory, Digestive, Integumentary, Renal & Urinary, Neurological, Musculoskeletal, Endocrine, Sensory, and General).
- **Educational Hover/Click Popups**: Each symptom card features a rich popup explaining medical definitions in English and Urdu, backed by native PostgreSQL aliases (`alternateNames`).
- **Real-Time Docked Consultation Tray**: Dedicated sticky tray tracking selected symptoms, intensity, and duration with instant clearing and submission.
- **Zero-PHI Privacy Mode**: Allows patients to execute ephemeral predictions without logging queries or demographic information to persistent storage.

---

## 🏗 System Architecture & Data Flow

```mermaid
flowchart TD
    subgraph Client ["Client Presentation Tier (Browser)"]
        UI[Next.js 16 Multi-Page Interface]
        Tab1[Tab 1: Overview & Triage]
        Tab2[Tab 2: Disease Directory]
        Tab3[Tab 3: Insights & FAQ]
        Tab4[Tab 4: About & Developer]
        SC[Symptom Checker & Consultation Tray]
        Lang[Urdu Nastaleeq / English Engine]
    end

    subgraph API ["Next.js Server API Routes"]
        P_API["/api/predict"]
        C_API["/api/chat"]
        S_API["/api/symptoms"]
        H_API["/api/history"]
        A_API["/api/auth/*"]
    end

    subgraph Engines ["Dual-Engine Clinical Processing"]
        direction TB
        subgraph LocalEngine ["Engine A: Local Similarity Inference"]
            Weights["Weighted Association Matrix"]
            Mult["Importance Multipliers (Hallmark 1.5x / Common 1.0x / Occasional 0.6x)"]
            ExpCalc["Explainability & Absent Hallmark Evaluator"]
        end
        subgraph OnlineEngine ["Engine B: Online Generative AI"]
            Gemini["Google Gemini 2.5 Flash"]
            SchemaPrompt["6-Dimension Clinical JSON Schema"]
            DiffGen["Bilingual Differential Consultation"]
        end
    end

    subgraph DB ["Data Persistence Tier (PostgreSQL)"]
        Prisma["Prisma ORM 6.19"]
        T_Sym["Symptom (Aliases, Slug, Body System)"]
        T_Dis["Disease (Severity Enum, Treatment, Warnings)"]
        T_DS["DiseaseSymptom (AssociationScore, Importance Enum)"]
        T_Pred["Prediction (Audit: EngineType, Version, Model)"]
        T_User["User (Auth, Profile, Demographics)"]
    end

    UI --> SC
    SC --> P_API
    P_API -->|Engine Selection: local-ml| LocalEngine
    P_API -->|Engine Selection: online-ai| OnlineEngine
    LocalEngine --> Prisma
    OnlineEngine --> Gemini
    Gemini -.->|Fallback on Quota/Network| LocalEngine
    Prisma --> DB
    P_API --> UI
```

---

## ⚡ Dual-Engine Inference Mechanism

Smart.Dr provides a hybrid architecture guaranteeing diagnostic triage support regardless of server load or internet connectivity.

### 1. Engine A: Local Clinical Similarity Inference Engine
Operates completely in-process within the PostgreSQL database layer, executing in **< 15 milliseconds**:
- **Weighted Profile Evaluation**: Each disease profile comprises associated symptoms linked through `DiseaseSymptom`, carrying an `associationScore` (0.0 to 1.0) and clinical importance level (`HALLMARK`, `COMMON`, `OCCASIONAL`).
- **Mathematical Formula**:
  $$\text{Similarity Score} = \left(\frac{\sum_{s \in S_{\text{selected}} \cap S_D} \text{associationScore}(s, D) \times M(s)}{\sum_{s \in S_D} \text{associationScore}(s, D) \times M(s)}\right) \times 100$$
  Where multiplier $M(s)$ is:
  - $\mathbf{1.5 \times}$ for **HALLMARK** (pathognomonic/defining indicators)
  - $\mathbf{1.0 \times}$ for **COMMON** (frequently presenting manifestations)
  - $\mathbf{0.6 \times}$ for **OCCASIONAL** (secondary or variable indicators)
- **Zero Latency & Offline Integrity**: Requires no external API calls, making it resilient for rural clinic environments.

### 2. Engine B: Online Generative AI Engine (Gemini 2.5 Flash)
Leverages Google's latest multimodal LLM tuned with a specialized healthcare triage prompt:
- **Demographic Contextualization**: Integrates patient age, biological sex, pregnancy status, and symptom duration to fine-tune differentials.
- **Structured 6-Dimension Output**: Enforces strict JSON schema generation across 6 clinical dimensions:
  1. `disease`: Standard medical taxonomy.
  2. `description`: Pathophysiological explanation in patient-friendly terms.
  3. `precautions`: Hygiene, containment, and home recovery measures.
  4. `medications`: Educational pharmacotherapy with physician-approval safeguards.
  5. `diet`: Evidence-based nutritional protocols (e.g., DASH, hydration electrolytes, anti-inflammatory).
  6. `workout`: Convalescent rest guidelines, physical therapy, and respiratory exercises.
- **Graceful Automatic Fallback**: If network limits or API quotas are reached, the system automatically falls back to Engine A without interrupting user flow.

---

## 🔍 Explainability & Diagnostic Transparency Layer

Standard symptom checkers output a single percentage without explaining the underlying reasoning. Smart.Dr introduces a **two-way explainability breakdown**:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ Bronchitis — 82% Symptom Pattern Similarity                           │
│ Severity: MODERATE | Specialist: Pulmonologist                         │
├────────────────────────────────────────────────────────────────────────┤
│ 🩺 CONTRIBUTING DIAGNOSTIC INDICATORS (Reported):                      │
│   • Persistent Cough       [HALLMARK]    +38% Contribution             │
│   • Chest Discomfort       [COMMON]      +24% Contribution             │
│   • Fatigue                [COMMON]      +20% Contribution             │
├────────────────────────────────────────────────────────────────────────┤
│ ⚠️ EXPECTED HALLMARK SYMPTOMS NOT REPORTED (Negative Evidence):         │
│   • Mucus / Sputum Production  [HALLMARK - Expected in typical Bronchitis]│
│   • Low-grade Wheezing         [COMMON - Often accompanies acute cases] │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Diagnostic Indicators**: Reassures the clinician and patient regarding *why* this disease ranked high by exposing exact feature contributions.
2. **Negative Evidence**: Discloses what expected classic hallmarks were *absent*, preventing hypochondria and alerting the clinician to investigate alternative diagnoses.

---

## 🧩 Core Application Modules

### 1. Multi-Tab Educational Homepage
Built as a modern tabbed multi-view interface:
- **Tab 1: Overview & Triage**: Hero presentation, emergency quick actions (Chest Pain, FAST Stroke signs, Anaphylaxis), workflow steps, core feature breakdown, and daily health tips.
- **Tab 2: Disease Directory**: Interactive accordion library of all **42+ clinical conditions**, organized by medical categories with bilingual Urdu disease summaries.
- **Tab 3: Health Insights & FAQ**: Evidence-based medical articles, preventive health guides, and comprehensive patient triage FAQs.
- **Tab 4: About & Developer**: Dedicated academic showcase for the University of Malakand, departmental supervisors, and the lead developer.

### 2. 187+ Visual & Anatomical Symptom Checker
- **Collapsible Organ Systems**: 187+ symptoms grouped into physiological categories (Integumentary, Respiratory, Cardiovascular, Upper Aerodigestive, Renal & Urinary, Neurological, etc.).
- **Educational Hover/Click Popups**: Hovering or tapping any symptom reveals an educational card with clinical definitions, alternative names (aliases), and Urdu terminology.
- **Search & Synonyms**: Full-text search across English names, Urdu names, and medical aliases (e.g., searching *"Cephalalgia"* isolates *"Headache"*).
- **Docked Consultation Tray**: A fixed, scrollable right-hand tray allowing users to inspect their selected symptoms, set severity/duration, and choose their inference engine.

### 3. Clinical Results & Rx Report Generator
- **Radial Similarity Gauge**: Displays calculated similarity with transparent explanation tags.
- **Contraindications Panel**: Real-time cross-referencing against high-risk pharmacological pairs (e.g., Dengue + Aspirin warning).
- **One-Click Clinical PDF**: Generates a clean, browser-printable prescription report formatted with institutional headers, disclaimer stamps, and physician sign-off boxes.

### 4. Personal Health Analytics Dashboard
- **BMI Calculator**: Real-time metric/imperial Body Mass Index with WHO categorization.
- **Vitality Score Tracker**: Composite health score tracking lifestyle inputs and recovery trajectory.
- **Medication Reminders**: Interactive dosage checklists with audio notifications and interval timers.
- **Daily Hydration Tracker**: Cup-by-cup visual water intake tracker.
- **Symptom Duration Timeline**: Chronicity monitor tracking days and weeks of persistent symptoms.

### 5. 24/7 Context-Aware AI Health Assistant
- Floating persistent health assistant powered by Google Gemini 2.5 Flash.
- Adheres to clinical safety boundaries: clarifies symptoms, explains terminology, advises on first-aid, and guides users to emergency care when red flags arise.

---

## 💊 Educational Pharmacotherapy & Clinical Safety

To ensure patient safety and ethical compliance, Smart.Dr adheres to strict pharmacological guidelines:

| Feature | Clinical Implementation |
| :--- | :--- |
| **Prescription Guard** | All medications are labeled as **"Educational Reference (Physician Verification Required)"**. No dosage is issued without professional clinical evaluation. |
| **Contraindications Matrix** | High-risk disease-medication contraindications are automatically flagged (e.g., *Dengue Fever*: NSAIDs such as Ibuprofen and Aspirin are strictly flagged due to hemorrhage risk; *Peptic Ulcer*: Corticosteroids and NSAIDs are prohibited). |
| **Emergency Red Flags** | Immediate emergency alerts display for life-threatening conditions (e.g., Acute Myocardial Infarction, Stroke, Anaphylaxis) alongside direct emergency contact options. |
| **Prediction Auditability** | Each record stores `engineType` (e.g., `similarity-inference`), `algorithmVersion` (e.g., `v2.1-weighted-profile`), and `modelVersion` (e.g., `gemini-2.5-flash`) for scientific auditability. |

---

## 🌐 Multilingual & Urdu Nastaleeq Engine

Smart.Dr is specifically optimized for bilingual healthcare delivery across Pakistan and South Asia:

```text
               ┌─────────────────────────────────────┐
               │         Language Selector           │
               │   [English]  |  [اردو]  |  [Both]   │
               └──────────────────┬──────────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   English Mode   │    │    Urdu Mode     │    │  Bilingual Mode  │
│ International    │    │ Full Nastaleeq   │    │ High Fever       │
│ Medical Terms    │    │ Jameel Noori Font│    │ (تیز بخار)       │
└──────────────────┘    └──────────────────┘    └──────────────────┘
```

- **Urdu Medical Dictionary (`urdu-translations.ts`)**: 187+ clinically verified symptom translations, 42+ disease descriptions, organ categories, and full UI strings.
- **Jameel Noori Nastaleeq**: Loaded locally via CSS `@font-face` (`/public/fonts/JameelNooriNastaleeq.ttf`) with Google's **Noto Nastaliq Urdu** web font fallback.
- **Directional Support**: Automatically sets RTL/LTR alignment based on active language selection.

---

## 💻 Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 16.2.4](https://nextjs.org/) (App Router, Turbopack, Server Actions) |
| **UI Library** | [React 19](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling & Design** | [Tailwind CSS 4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Radix UI Primitives](https://www.radix-ui.com/) |
| **Animations & Motion** | [Framer Motion 12](https://www.framer.com/motion/), [Lucide React Icons](https://lucide.dev/) |
| **State Management** | [Zustand 5](https://github.com/pmndrs/zustand) (Client-side persistence with LocalStorage hydration) |
| **Data Visualization** | [Recharts 2.15](https://recharts.org/) |
| **Database & ORM** | [PostgreSQL 16](https://www.postgresql.org/), [Prisma ORM 6.19](https://www.prisma.io/) |
| **Artificial Intelligence** | [Google Gemini 2.5 Flash](https://deepmind.google/technologies/gemini/) via `z-ai-web-dev-sdk` |
| **Security & Auth** | [bcryptjs](https://www.npmjs.com/package/bcryptjs), HTTP-Only Cookies, Session Guards |
| **Reverse Proxy** | [Caddy 2](https://caddyserver.com/) (Automated SSL/TLS, port redirection) |

---

## 🗄 Database Schema (Prisma & PostgreSQL)

Smart.Dr uses a PostgreSQL schema designed for clinical explainability, reproducible inferences, and rich symptom metadata:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Severity {
  MILD
  MODERATE
  SEVERE
  CRITICAL
}

enum SymptomImportance {
  HALLMARK
  COMMON
  OCCASIONAL
}

model Symptom {
  id              String           @id @default(cuid())
  name            String           @unique
  slug            String           @unique
  category        String
  description     String?
  imageUrl        String?
  alternateNames  String[]         // Clinical aliases & synonyms (PostgreSQL array)
  bodySystem      String?          // e.g. "Cardiovascular", "Renal & Urinary"
  isActive        Boolean          @default(true)

  diseaseLinks    DiseaseSymptom[]

  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt

  @@index([category])
  @@index([bodySystem])
}

model Disease {
  id                String           @id @default(cuid())
  name              String           @unique
  slug              String           @unique
  description       String
  category          String           @default("General")
  specialist        String
  severity          Severity         @default(MODERATE)
  treatmentOverview String?          // Educational management overview
  emergencyWarnings String?          // JSON array of red-flag symptoms
  precautions       String           // JSON stringified array
  medications       String           // JSON stringified array (educational reference)
  diet              String           // JSON stringified array
  workout           String?          // JSON stringified array

  symptoms          DiseaseSymptom[]
  createdAt         DateTime         @default(now())
  updatedAt         DateTime         @updatedAt

  @@index([category])
  @@index([severity])
}

model DiseaseSymptom {
  id                String            @id @default(cuid())
  diseaseId         String
  symptomId         String

  associationScore  Float             @default(0.5) // Clinical similarity weight (0.0 - 1.0)
  importance        SymptomImportance @default(COMMON)
  evidenceLevel     String?           // e.g. "Clinical Guideline", "ICD-11 Literature"
  clinicalNotes     String?

  disease           Disease           @relation(fields: [diseaseId], references: [id], onDelete: Cascade)
  symptom           Symptom           @relation(fields: [symptomId], references: [id], onDelete: Cascade)

  @@unique([diseaseId, symptomId])
  @@index([diseaseId])
  @@index([symptomId])
}

model Prediction {
  id                String   @id @default(cuid())
  userId            String?

  selectedSymptoms  String   // JSON stringified array of symptom IDs
  results           String   // Full differential inference output
  llmAnalysis       String?

  engineType        String?  // "similarity-inference" | "llm-augmented"
  algorithmVersion  String?  // e.g. "v2.1-weighted-profile"
  modelVersion      String?  // e.g. "gemini-2.5-flash"
  createdAt         DateTime @default(now())

  user              User?    @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([userId])
  @@index([createdAt])
}
```

---

## 📡 REST API Reference

### 1. Execute Clinical Prediction
- **Endpoint**: `POST /api/predict`
- **Request Body**:
  ```json
  {
    "symptomIds": ["cmutusx340000qgp8397a6857", "cmutusx3d0002qgp821s131z1"],
    "engine": "local-ml", // "local-ml" | "online-ai"
    "privacyMode": false,
    "includeLLMAnalysis": true,
    "patientAge": 28,
    "patientGender": "male"
  }
  ```
- **Response**:
  ```json
  {
    "predictions": [
      {
        "disease": "Bronchitis",
        "similarityScore": 75,
        "confidence": 75,
        "description": "Inflammation of the bronchial tube lining...",
        "specialist": "Pulmonologist",
        "severity": "MODERATE",
        "treatmentOverview": "Supportive care, hydration, rest, and airway monitoring.",
        "precautions": ["Avoid smoke exposure", "Use air humidifier"],
        "medications": ["Cough suppressant", "Albuterol inhaler (if prescribed)"],
        "diet": ["Warm ginger tea", "Adequate fluid intake"],
        "workout": ["Gentle respiratory exercises", "Rest during acute fever"],
        "emergencyWarnings": ["Shortness of breath at rest", "Hemoptysis"],
        "matchedSymptoms": ["Persistent Cough", "Chest Discomfort"],
        "totalSymptoms": 8,
        "contributingSymptoms": [
          { "name": "Persistent Cough", "importance": "HALLMARK", "score": 85 },
          { "name": "Chest Discomfort", "importance": "COMMON", "score": 65 }
        ],
        "absentHallmarks": [
          { "name": "Sputum Production", "importance": "HALLMARK" }
        ],
        "algorithmVersion": "v2.1-weighted-profile"
      }
    ],
    "llmAnalysis": "### Clinical Summary\nReported presentation aligns with acute lower airway irritation...",
    "predictionId": "pred_cmux89218392",
    "engine": "similarity-inference",
    "algorithmVersion": "v2.1-weighted-profile"
  }
  ```

### 2. Conversational Health Assistant
- **Endpoint**: `POST /api/chat`
- **Request Body**:
  ```json
  {
    "message": "I have sudden severe chest tightness and left arm numbness.",
    "history": []
  }
  ```
- **Response**:
  ```json
  {
    "response": "⚠️ **URGENT MEDICAL WARNING**: Your symptoms indicate possible cardiac ischemia (heart attack). Immediately call 1122 (Pakistan) or 911 (USA) or proceed to the nearest emergency department. Do not drive yourself."
  }
  ```

### 3. Retrieve Symptom Taxonomy
- **Endpoint**: `GET /api/symptoms`
- **Response**: Returns all 187+ symptoms with `slug`, `category`, `bodySystem`, `alternateNames`, and descriptions.

### 4. Global Health Statistics
- **Endpoint**: `GET /api/stats`
- **Response**: Total diseases, total symptoms, cumulative predictions, and category breakdowns.

---

## 🚀 Installation & Getting Started

### Prerequisites
- **Node.js**: `v20.0.0` or higher (or **Bun** `v1.0.0`+)
- **PostgreSQL**: `v15` or higher running on `localhost:5432`
- **Git**

### Step-by-Step Setup

```bash
# 1. Clone the repository
git clone https://github.com/Yaldram81/smart-dr.git
cd smart-dr

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Create .env based on the template below
```

Create `.env` in the root directory:
```env
# PostgreSQL connection string
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/smart_dr?schema=public"

# Google Gemini API Key for Online AI engine & health chat
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"

# Next.js Port (Default: 3001 or 3000)
PORT=3001
```

```bash
# 4. Push database schema to PostgreSQL
npx prisma db push

# 5. Seed the database (42+ conditions, 187+ symptoms, weights, and Urdu data)
npx tsx prisma/seed.ts

# 6. Start the development server
npm run dev
```

Navigate to:
```
http://localhost:3001
```

---

## ⚙️ Environment Configuration

| Variable | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection URI | `postgresql://postgres:password@localhost:5432/smart_dr?schema=public` |
| `GEMINI_API_KEY` | Google Gemini API Key for online generative reasoning | `AIzaSyD...` |
| `SESSION_SECRET` | Secret key for HTTP-Only cookie session authentication | `super_secure_random_string_32_chars` |

---

## 🌐 Production Deployment & Caddy Reverse Proxy

Smart.Dr includes a battle-tested `Caddyfile` for instant automated SSL/TLS provisioning and reverse proxying:

```caddy
:81 {
    handle {
        reverse_proxy localhost:3001 {
            header_up Host {host}
            header_up X-Forwarded-For {remote_host}
            header_up X-Forwarded-Proto {scheme}
            header_up X-Real-IP {remote_host}
        }
    }
}
```

### Production Build Command
```bash
# Create optimized production build with Turbopack
npm run build

# Start production server
npm run start
```

---

## 📂 Project Directory Layout

```text
smart-dr/
├── Caddyfile                   # Caddy reverse proxy configuration
├── package.json                # Project dependencies, scripts & metadata
├── tsconfig.json               # TypeScript strict configuration
├── tailwind.config.ts          # Tailwind CSS design system tokens
├── next.config.ts              # Next.js standalone and compiler config
├── prisma/
│   ├── schema.prisma           # Prisma ORM schema (PostgreSQL)
│   └── seed.ts                 # Database seeder (42+ diseases, 187+ symptoms)
├── public/
│   ├── fonts/
│   │   └── JameelNooriNastaleeq.ttf # Authentic Urdu Nastaleeq font
│   ├── logo.svg                # Smart.Dr brand icon
│   └── manifest.json           # Progressive Web App manifest
└── src/
    ├── app/
    │   ├── layout.tsx          # Root layout, Nastaleeq font imports, metadata
    │   ├── page.tsx            # Main tabbed interface (Overview, Diseases, Insights, About)
    │   ├── checker/            # Dedicated Symptom Checker route
    │   ├── results/            # Clinical Differential Results & PDF route
    │   ├── dashboard/          # Personal Health Analytics route
    │   ├── globals.css         # Glassmorphism utilities & CSS variables
    │   └── api/
    │       ├── auth/           # Login, registration & me endpoints
    │       ├── chat/           # Gemini AI 24/7 health chat assistant
    │       ├── history/        # Consultation history CRUD
    │       ├── predict/        # Dual-engine prediction & explainability route
    │       ├── stats/          # Health metric statistics
    │       └── symptoms/       # Symptom query endpoint
    ├── components/
    │   ├── chat/               # Persistent floating health chatbot
    │   ├── dashboard/          # BMI, Water Tracker, Med Reminders, Vitality Score
    │   ├── home/               # Hero, Disease Browser, Emergency Actions, Developer Spotlight
    │   ├── layout/             # Navigation bar, language picker, footer
    │   ├── prediction-results/ # Radial similarity meter, explainability cards, PDF generator
    │   ├── symptom-checker/    # 187+ symptoms, body systems, Consultation Tray
    │   └── ui/                 # Accessible shadcn/ui components (Radix primitives)
    └── lib/
        ├── auth.ts             # Password hashing & JWT session management
        ├── db.ts               # Prisma singleton client instance
        ├── store.ts            # Zustand global application state
        ├── urdu-translations.ts# Comprehensive Urdu medical dictionary
        └── utils.ts            # ClassName merging utilities (clsx & twMerge)
```

---

## 🎓 Academic & Developer Credits

**Smart.Dr** was conceptualized, designed, and engineered as an undergraduate **Final Year Project** for the degree of **Bachelor of Computer Science (BCS — 8th Semester)**.

### 🏛 Academic Institution
- **Department**: Department of Computer Science & Information Technology
- **University**: [University of Malakand (UOM)](https://uom.edu.pk/)
- **Location**: Chakdara, Lower Dir, Khyber Pakhtunkhwa, Pakistan

### 👨‍💻 Project Developer
<p align="left">
  <strong>Tanzeel Ur Rahman</strong><br />
  <em>Lead Developer & Full-Stack AI Systems Architect</em><br />
  Degree: Bachelor of Computer Science (BCS — 8th Semester)<br />
  Department of Computer Science & IT, University of Malakand<br />
  🐙 <strong>GitHub</strong>: <a href="https://github.com/Yaldram81">@Yaldram81</a><br />
  💼 <strong>LinkedIn</strong>: <a href="https://www.linkedin.com/in/tanzeel-ur-rahman-71b7b2225/">Tanzeel Ur Rahman</a><br />
  ✉️ <strong>Email</strong>: <a href="mailto:tanzeelyaldram3@gmail.com">tanzeelyaldram3@gmail.com</a>
</p>

### 👨‍🏫 Project Supervisors
- **Dr. Pervez Khan** — *Associate Professor / Project Supervisor*
- **Dr. Fakhre Alam** — *Assistant Professor / Co-Supervisor*

---

## ⚠️ Medical & Ethical Disclaimer

> [!IMPORTANT]
> **SMART.DR IS AN EDUCATIONAL DECISION-SUPPORT SYSTEM, NOT A REPLACEMENT FOR PROFESSIONAL MEDICAL DIAGNOSIS.**
>
> - The similarity indices, risk classifications, and differential guidance generated by both the **Local Similarity Engine** and the **Google Gemini AI Engine** are strictly for educational triage and preliminary consultation reference.
> - **Never ignore professional medical advice** or delay seeking clinical attention due to information provided by this system.
> - In the event of a medical emergency (such as acute chest pain, sudden unilateral weakness/facial droop, severe respiratory distress, or profuse bleeding), immediately call your local emergency services (**1122** in Pakistan, **911** in the USA, **999** in the UK) or proceed directly to the nearest emergency department.

---

<p align="center">
  <sub>© 2026 Smart.Dr. Engineered with ❤️ by Tanzeel Ur Rahman. University of Malakand.</sub>
</p>
