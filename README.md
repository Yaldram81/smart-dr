<p align="center">
  <img src="public/logo.svg" alt="Smart.Dr Logo" width="100" height="100" />
</p>

<h1 align="center">🩺 Smart.Dr — AI-Powered Disease Prediction System</h1>

<p align="center">
  <strong>Dual-Engine Clinical Decision Support & Comprehensive Health Intelligence Platform</strong>
</p>

<p align="center">
  <a href="#key-features"><img src="https://img.shields.io/badge/Dual--Engine-Local%20ML%20%2B%20Gemini%20AI-blue.svg?style=for-the-badge&logo=openai" alt="Dual Engine" /></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/Next.js-16.1%20(App%20Router)-black.svg?style=for-the-badge&logo=next.js" alt="Next.js 16" /></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/React-19.0-61DAFB.svg?style=for-the-badge&logo=react" alt="React 19" /></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/TypeScript-5.0-3178C6.svg?style=for-the-badge&logo=typescript" alt="TypeScript" /></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/TailwindCSS-v4.0-38B2AC.svg?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS 4" /></a>
  <a href="#database-schema"><img src="https://img.shields.io/badge/Prisma%20ORM-PostgreSQL-336791.svg?style=for-the-badge&logo=postgresql" alt="Prisma PostgreSQL" /></a>
  <a href="#multilingual-support"><img src="https://img.shields.io/badge/Language-English%20%7C%20اردو-success.svg?style=for-the-badge" alt="Urdu Support" /></a>
</p>

---

## 📖 Executive Summary

**Smart.Dr** is a state-of-the-art medical decision-support and disease prediction platform designed to bridge the accessibility gap in modern healthcare. Developed as a **Final Year Project (BS IT 8th Semester)** at the **Department of Computer Science & Information Technology, University of Malakand (UOM)**, Smart.Dr couples a high-speed **Local Machine Learning & Statistical Knowledge Engine** with an advanced **Online Generative AI Engine (Google Gemini 2.5 Flash)**.

The system evaluates user-reported symptoms across 187+ clinical manifestations, categorizing risk profiles against 42+ diseases, delivering multi-tiered recommendations (precautions, medications, nutritional guidance, and physical therapy/workout regimens), while guaranteeing zero PHI (Protected Health Information) retention when operating in Privacy Mode.

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Dual-Engine Prediction Mechanism](#-dual-engine-prediction-mechanism)
- [Module Breakdown](#-module-breakdown)
  - [1. Symptom Checker & Anatomical Body Map](#1-symptom-checker--anatomical-body-map)
  - [2. Clinical Prediction Results & PDF Rx Generation](#2-clinical-prediction-results--pdf-rx-generation)
  - [3. Comprehensive Health Dashboard](#3-comprehensive-health-dashboard)
  - [4. AI Health Chatbot (24/7 Assistant)](#4-ai-health-chatbot-247-assistant)
  - [5. Disease Knowledge Browser & Emergency Triage](#5-disease-knowledge-browser--emergency-triage)
- [Multilingual & Urdu Nastaleeq Support](#-multilingual--urdu-nastaleeq-support)
- [Technology Stack](#-technology-stack)
- [Database Schema (Prisma ORM)](#-database-schema-prisma-orm)
- [API Reference](#-api-reference)
- [Installation & Getting Started](#-installation--getting-started)
- [Environment Configuration](#-environment-configuration)
- [Deployment & Reverse Proxy Setup](#-deployment--reverse-proxy-setup)
- [Project Directory Structure](#-project-directory-structure)
- [Academic & Development Credits](#-academic--development-credits)
- [Medical & Legal Disclaimer](#-medical--legal-disclaimer)

---

## 🌟 Key Features

### 🩺 Diagnostic & Clinical Decision Support
- **Dual-Engine Prediction**:
  - **Local ML / Dataset Engine**: Real-time weighted symptom matching across 42+ diseases and 187+ symptoms, with optional Support Vector Classifier (SVC) integration.
  - **Online AI Engine (Google Gemini 2.5 Flash)**: Generative clinical analysis delivering 6-dimensional structured outputs (Disease, Description, Precautions, Medications, Diet, Workout).
- **3D & 2D Interactive Human Anatomy Model**: Real-time 3D WebGL anatomical mannequin built with Three.js featuring 360° orbit rotation, cardiac pulsation, pulmonary breathing kinetics, layer toggles (Organs, Skeletal, Skin), and raycast selection mapping directly to symptom categories. Seamlessly toggleable with the 2D diagram.
- **Drug Interaction Checker**: Clinical pharmacology cross-referencing engine detecting high-risk contraindications and polypharmacy risks across up to 6 concurrent medications.
- **Voice-Assisted Symptom Logging**: Hands-free voice recognition powered by Web Speech API with adaptive `ur-PK` (Pakistani Urdu) and `en-US` speech recognition.
- **Emergency Triage & Red-Flag Detection**: Automatic warning alerts for high-risk cardiac, neurological (FAST stroke signs), and respiratory emergencies with direct emergency helpline access.
- **Clinical Prescription Sheets**: One-click generation of browser-printable and PDF prescriptions formatted with physician-grade disclaimers and dosage warnings.

### 📊 Holistic Health Tracking & Dashboard
- **BMI (Body Mass Index) Calculator**: Dual metric/imperial calculation with real-time WHO classification and target weight advice.
- **Health Assessment & Vitality Scoring**: Proprietary wellness scoring algorithm tracking lifestyle habits, symptom frequency, and recovery velocity.
- **Medication Scheduler & Alarms**: Persistent dosage reminders with audible notification triggers.
- **Hydration Tracker**: Interactive daily water intake logging with cup-by-cup visual progress.
- **Symptom Duration Tracking**: Timeline monitoring of symptom onset, intensity spikes, and persistence.
- **Recharts Visualizations**: Interactive graphical breakdowns of disease severity distributions and symptom trends.

### 🌐 Inclusivity, Privacy & Accessibility
- **Trilingual Interface**: Seamless switching between **English**, **Urdu (اردو)**, and **Bilingual (Urdu + English)** modes with custom Jameel Noori Nastaleeq typography.
- **Zero-PHI Privacy Mode**: Client-configurable toggle ensuring zero retention of symptoms or medical queries in persistent storage.
- **Adaptive UI**: Dark and Light theme modes powered by `next-themes`, glassmorphism aesthetics, responsive mobile-first layouts, and smooth `framer-motion` page transitions.

---

## 🏗 System Architecture

```
                          ┌───────────────────────────────────────────────┐
                          │                User Client                    │
                          │   (Desktop / Tablet / Mobile Web Browser)     │
                          └──────────────────────┬────────────────────────┘
                                                 │
                                                 ▼
                          ┌───────────────────────────────────────────────┐
                          │             Next.js 16 Frontend               │
                          │   • Zustand State Store  • App Router (v16)   │
                          │   • Body Map Selector    • Voice Recognition  │
                          │   • Framer Motion UI     • Nastaleeq Fonts    │
                          └──────────────────────┬────────────────────────┘
                                                 │ HTTP / JSON API
                                                 ▼
                          ┌───────────────────────────────────────────────┐
                          │             Next.js API Layer                 │
                          │   • /api/predict         • /api/chat          │
                          │   • /api/symptoms        • /api/history       │
                          │   • /api/stats           • /api/auth/*        │
                          └───────┬───────────────────────────────┬───────┘
                                  │                               │
            ┌─────────────────────┴────────────┐   ┌──────────────┴────────────────────┐
            ▼                                  ▼   ▼                                   ▼
┌───────────────────────────┐      ┌─────────────────────────┐     ┌─────────────────────────┐
│     Engine 1: Local ML    │      │    Engine 2: Online AI  │     │   Database & Storage    │
│  • Weighted Symptom Matrix│      │  • Google Gemini 2.5    │     │  • SQLite via Prisma ORM│
│  • SVC Classifier (3031)  │      │  • 6-Key JSON Schema    │     │  • User Profiles        │
│  • 8 Curated Medical CSVs │      │  • Differential Analysis│     │  • Prediction History   │
│  • Sub-10ms Offline Exec  │      │  • Z-AI Web SDK Pipeline│     │  • 187 Symptoms/42 Cond │
└───────────────────────────┘      └─────────────────────────┘     └─────────────────────────┘
```

---

## ⚡ Dual-Engine Prediction Mechanism

Smart.Dr provides a unique hybrid architectural paradigm that guarantees diagnostic assistance regardless of internet connectivity:

```mermaid
flowchart TD
    A[User Selects Symptoms] --> B{Engine Selection}
    B -->|Local ML Engine| C[Query Prisma SQLite Weighted Matrix]
    C --> D[Attempt Python SVC Model @ localhost:3031]
    D -->|SVC Available| E[Blend SVC Score 40% + Dataset Matrix 60%]
    D -->|SVC Offline| F[Deterministic Weighted Dataset Scoring]
    E --> G[Extract Curated Precaution/Med/Diet/Workout]
    F --> G
    B -->|Online AI Engine| H[Invoke Google Gemini 2.5 Flash]
    H --> I[Parse Structured 6-Key Clinical JSON Schema]
    I --> J[Enrich with Database Specialist & Severity Records]
    J --> K[Generate Detailed LLM Differential Consultation]
    G --> L[Rank Top 5 Conditions by Confidence %]
    K --> L
    L --> M[Render Clinical Output Screen]
```

### 1. Local ML Engine (SVC & Weighted Dataset)
- Evaluates the overlap and mathematical weights of chosen symptoms against disease profiles:
  $$\text{Score}(D) = \frac{\sum_{s \in S_{\text{selected}} \cap S_D} W(s, D)}{\sum_{s \in S_D} W(s, D)}$$
- If the companion Python Support Vector Machine (SVC) microservice is running, predictions are blended using a **60/40 weighted heuristic** between dataset confidence and SVC hyper-plane probability.
- Operates entirely offline with near-zero latency.

### 2. Online AI Engine (Google Gemini 2.5 Flash)
- Sends prompt directives enforcing strict JSON output compliance with 6 clinical parameters:
  1. `disease`: Clinical name of the predicted condition.
  2. `description`: Pathophysiological summary.
  3. `precautions`: Preventative, hygiene, and emergency containment measures.
  4. `medications`: Evidence-supported pharmacological guidance with clinical cautions.
  5. `diets`: Nutritional regimens (e.g. DASH, BRAT, anti-inflammatory).
  6. `workouts`: Physical therapy, low-impact exercise, or bed-rest directives.
- Provides fallback to the Local Engine automatically should API quotas or internet connections fail.

---

## 🧩 Module Breakdown

### 1. Symptom Checker & Anatomical Body Map
- **Anatomical Body Map**: Interactive SVG/Canvas selector allowing users to click human body regions (Head, Chest, Abdomen, Upper Limbs, Lower Limbs, Systemic) to automatically isolate relevant symptoms.
- **Categorical Accordions**: 187+ symptoms grouped across 10 distinct organ systems:
  - *Cardiovascular, Respiratory, Digestive, Neurological, Musculoskeletal, Skin, Eyes, ENT, Endocrine, Psychological/General*.
- **Live Search & Multilingual Matching**: Instant search across English symptom names and authentic Urdu terminology (e.g. typing "سینے میں درد" or "Chest Pain" simultaneously isolates the exact vector).
- **Voice Recognition**: Web Speech API integration with microphone capture, speech-to-text decoding, and instant symptom auto-tagging.

### 2. Clinical Prediction Results & PDF Rx Generation
- **Dynamic Confidence Meter**: Visual probability score calibrated between 15% and 98%.
- **Severity Classification**: Color-coded badges indicating `Mild` (Green), `Moderate` (Amber), `Severe` (Red), and `Critical` (Rose).
- **Specialist Referral Engine**: Maps predicted diagnoses to appropriate medical specialists (e.g. *Pulmonologist, Neurologist, Cardiologist, Gastroenterologist, Dermatologist, Rheumatologist*).
- **Comprehensive 4-Pillar Action Plan**:
  1. 🛡️ **Precautions**: Infection control, posture, environmental precautions.
  2. 💊 **Medications**: Pharmacotherapy reference with dosage warnings.
  3. 🥗 **Dietary Advice**: Foods to consume, foods to strictly avoid.
  4. 🏃 **Exercise & Rest**: Safe physical activity levels and convalescent rest periods.
- **Physician-Grade Prescription Sheet**: Built-in HTML print formatter and integration with ReportLab for downloadable, official PDF prescriptions.

### 3. Comprehensive Health Dashboard
- **User Authentication**: Secure multi-user login and registration powered by `bcryptjs` password hashing.
- **Profile Card**: Displays age, gender, and blood group for clinical context.
- **BMI Calculator**: Interactive height (cm/ft) and weight (kg/lbs) calculator calculating Body Mass Index and displaying healthy weight ranges.
- **Health Assessment & Score Timeline**: Calculates composite vitality scores based on health behaviors and visualizes historical health progression.
- **Medication Reminders**: Dosage scheduler with interactive checklists, interval timers, and desktop notifications.
- **Hydration Tracker**: Target water consumption counter (glasses/milliliters) with visual water level animation.
- **Symptom Duration Tracker**: Logs how many days/weeks a symptom has persisted to help healthcare providers gauge chronicity.
- **Prediction History Management**: Inspect past consultations, review AI analyses, or delete historical records.

### 4. AI Health Chatbot (24/7 Assistant)
- Persistent floating chatbot widget available across the entire platform.
- Powered by Google Gemini with a healthcare-tuned system prompt emphasizing triage, symptom explanation, first-aid measures, and clinical disclaimers.
- Retains multi-turn conversational context during active sessions.

### 5. Disease Knowledge Browser & Emergency Triage
- **Medical Encyclopedia**: Searchable and filterable reference library detailing all 42+ preloaded conditions.
- **Emergency Quick Actions**: Rapid reference cards for critical medical events:
  - Acute Chest Pain / Myocardial Infarction
  - Stroke (FAST Protocol: Face, Arms, Speech, Time)
  - Severe Anaphylaxis & Respiratory Arrest
  - Uncontrolled Hemorrhage & Traumatic Injury
- Direct emergency contact buttons for quick helpline access.

---

## 🌐 Multilingual & Urdu Nastaleeq Support

Smart.Dr is specifically optimized for healthcare delivery in Pakistan and South Asian regions. The application includes deep localization:

- **Urdu Medical Dictionary (`urdu-translations.ts`)**: 187+ medically verified Urdu symptom translations, 42+ disease translations, category headers, and complete UI strings.
- **Typography Excellence**: Bundles the authentic **Jameel Noori Nastaleeq** font (`/public/fonts/JameelNooriNastaleeq.ttf`) via CSS `@font-face` rules, complemented with Google's **Noto Nastaliq Urdu** web font fallback.
- **3 Dynamic Display Modes**:
  1. **English Mode (`en`)**: Standard international medical nomenclature.
  2. **Urdu Mode (`ur`)**: Full Nastaleeq typography with RTL-compatible formatting.
  3. **Bilingual Mode (`both`)**: Displays English terms accompanied by parenthetical Urdu translations (e.g. `High Fever (تیز بخار)`).

---

## 💻 Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | [Next.js 16.1.1](https://nextjs.org/) (App Router, Server Components & Client Components) |
| **Language & Runtime** | [TypeScript 5](https://www.typescriptlang.org/), [React 19](https://react.dev/), [Bun](https://bun.sh/) / [Node.js](https://nodejs.org/) |
| **Styling & Design** | [Tailwind CSS 4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Radix UI Primitives](https://www.radix-ui.com/) |
| **Animations & UI** | [Framer Motion 12](https://www.framer.com/motion/), [Lucide React Icons](https://lucide.dev/) |
| **Data Visualization** | [Recharts 2.15](https://recharts.org/) |
| **State Management** | [Zustand 5](https://github.com/pmndrs/zustand) (with LocalStorage hydration) |
| **Database & ORM** | [SQLite](https://www.sqlite.org/), [Prisma ORM 6.11](https://www.prisma.io/) |
| **Artificial Intelligence** | [Google Gemini 2.5 Flash](https://deepmind.google/technologies/gemini/) via `z-ai-web-dev-sdk` |
| **Machine Learning** | Python 3 Support Vector Classifier (SVC) Microservice (Optional, Port 3031) |
| **Security & Auth** | [bcryptjs](https://www.npmjs.com/package/bcryptjs), Custom API Session Guard |
| **PDF Generation** | HTML5 Print API + ReportLab Python Microservice Integration |
| **Web Server & Proxy** | [Caddy 2](https://caddyserver.com/) Reverse Proxy (Port 81) |

---

## 🗄 Database Schema (Prisma ORM)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String       @id @default(cuid())
  email        String       @unique
  name         String
  password     String
  age          Int?
  gender       String?
  bloodGroup   String?
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
  predictions  Prediction[]
}

model Disease {
  id           String           @id @default(cuid())
  name         String           @unique
  description  String
  specialist   String
  severity     String
  precautions  String           // JSON stringified array
  medications  String           // JSON stringified array
  diet         String           // JSON stringified array
  workout      String?          // JSON stringified array
  symptoms     DiseaseSymptom[]
  createdAt    DateTime         @default(now())
}

model Symptom {
  id           String           @id @default(cuid())
  name         String           @unique
  category     String
  description  String?
  diseases     DiseaseSymptom[]
  createdAt    DateTime         @default(now())
}

model DiseaseSymptom {
  id         String  @id @default(cuid())
  diseaseId  String
  symptomId  String
  weight     Float   @default(1.0)
  disease    Disease @relation(fields: [diseaseId], references: [id], onDelete: Cascade)
  symptom    Symptom @relation(fields: [symptomId], references: [id], onDelete: Cascade)

  @@unique([diseaseId, symptomId])
}

model Prediction {
  id               String    @id @default(cuid())
  userId           String
  selectedSymptoms String    // JSON stringified array of symptom IDs
  results          String    // JSON stringified array of PredictionResults
  llmAnalysis      String?
  createdAt        DateTime  @default(now())
  user             User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## 📡 API Reference

### 1. Disease Prediction
- **Endpoint**: `POST /api/predict`
- **Payload**:
  ```json
  {
    "symptomIds": ["cuid-symptom-1", "cuid-symptom-2"],
    "userId": "cuid-user-id", // optional
    "engine": "local-ml",     // "local-ml" | "online-ai"
    "privacyMode": false,     // if true, skips database history logging
    "includeLLMAnalysis": true
  }
  ```
- **Response**:
  ```json
  {
    "predictions": [
      {
        "disease": "Dengue Fever",
        "confidence": 88,
        "description": "A mosquito-borne viral disease...",
        "specialist": "Infectious Disease Specialist",
        "severity": "severe",
        "precautions": ["Use mosquito repellent", "Eliminate standing water"],
        "medications": ["Paracetamol", "Oral rehydration salts"],
        "diet": ["Papaya leaf juice", "Coconut water"],
        "workout": ["Complete rest during acute phase"],
        "matchedSymptoms": ["High Fever", "Joint Pain", "Skin Rash"],
        "totalSymptoms": 12
      }
    ],
    "llmAnalysis": "### Summary\nSymptoms strongly correlate with acute febrile illness...",
    "predictionId": "cuid-prediction-record"
  }
  ```

### 2. AI Health Chatbot
- **Endpoint**: `POST /api/chat`
- **Payload**:
  ```json
  {
    "message": "What should I do if I have a mild fever and throat pain?",
    "history": [
      { "role": "user", "content": "Hello" },
      { "role": "assistant", "content": "Hello! How can I assist you with health questions today?" }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "response": "For mild fever and throat discomfort, consider staying well-hydrated, resting, and..."
  }
  ```

### 3. Symptoms Listing
- **Endpoint**: `GET /api/symptoms`
- **Response**: List of all 187+ symptoms and category-grouped dictionaries.

### 4. Statistical Metrics
- **Endpoint**: `GET /api/stats`
- **Response**: Global counts of diseases, symptoms, total predictions run, and category distributions.

### 5. Prediction History
- **Endpoint**: `GET /api/history?userId=<USER_ID>&limit=10`
- **Endpoint**: `DELETE /api/history?id=<PREDICTION_ID>`

### 6. Authentication
- **Endpoint**: `POST /api/auth/register` (name, email, password, age, gender, bloodGroup)
- **Endpoint**: `POST /api/auth/login` (email, password)

---

## 🚀 Installation & Getting Started

### Prerequisites
- **Node.js**: Version `18.18.0` or higher (Node 20+ recommended) OR **Bun**: Version `1.0.0`+
- **Git**
- **SQLite3**

### Step-by-Step Setup

```bash
# 1. Clone the repository
git clone https://github.com/Yaldram81/smart-dr.git
cd smart-dr

# 2. Install dependencies (using Bun or npm)
bun install
# or: npm install

# 3. Configure environment variables
# Copy or create your .env file
cp .env.example .env
```

Ensure `.env` contains:
```env
DATABASE_URL="file:./db/custom.db"
GEMINI_API_KEY="your_gemini_api_key_here"
```

```bash
# 4. Generate Prisma Client and initialize the database
bun run db:push
# or: npx prisma db push

# 5. Seed the database with 42+ diseases and 187+ clinical symptoms
bun run db:seed
# or: npx prisma db seed

# 6. Launch the development server
bun run dev
# or: npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

## ⚙️ Environment Configuration

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:12345678@localhost:5432/smart_dr?schema=public` |
| `GEMINI_API_KEY` | Google Gemini API key for Online AI predictions and chat | `AIzaSy...` |
| `SESSION_SECRET` | HMAC-SHA256 session token encryption secret | `your_secure_random_key_32_chars` |
| `NEXTAUTH_SECRET` | Secret key for session encryption (if using NextAuth) | `super_secret_key_32_chars` |
| `NEXTAUTH_URL` | Canonical root URL of the deployment | `http://localhost:3000` |

---

## 🌐 Deployment & Reverse Proxy Setup

Smart.Dr includes a pre-configured `Caddyfile` for instant deployment behind **Caddy Web Server**, enabling automatic SSL/TLS and port redirection:

```caddy
:81 {
    @transform_port_query {
        query XTransformPort=*
    }

    handle @transform_port_query {
        reverse_proxy localhost:{query.XTransformPort} {
            header_up Host {host}
            header_up X-Forwarded-For {remote_host}
            header_up X-Forwarded-Proto {scheme}
            header_up X-Real-IP {remote_host}
        }
    }

    handle {
        reverse_proxy localhost:3000 {
            header_up Host {host}
            header_up X-Forwarded-For {remote_host}
            header_up X-Forwarded-Proto {scheme}
            header_up X-Real-IP {remote_host}
        }
    }
}
```

### Production Build
```bash
# Build the optimized standalone Next.js bundle
bun run build
# or: npm run build

# Start the production server
bun run start
# or: npm run start
```

---

## 📂 Project Directory Structure

```text
smart-dr/
├── Caddyfile                   # Caddy reverse proxy configuration
├── package.json                # Project dependencies, scripts & metadata
├── tsconfig.json               # TypeScript compiler options
├── tailwind.config.ts          # Tailwind CSS design system tokens
├── next.config.ts              # Next.js standalone and compiler config
├── prisma/
│   ├── schema.prisma           # Prisma ORM database models
│   └── seed.ts                 # Database seeding script (42+ conditions, 187+ symptoms)
├── db/
│   └── custom.db               # SQLite database storage file
├── public/
│   ├── fonts/
│   │   └── JameelNooriNastaleeq.ttf # Authentic Urdu Nastaleeq font
│   ├── logo.svg                # Smart.Dr brand emblem
│   └── robots.txt              # Search engine crawler policies
└── src/
    ├── instrumentation.ts      # Node.js process & memory telemetry
    ├── app/
    │   ├── layout.tsx          # Root layout, theme provider, Google font imports
    │   ├── page.tsx            # Single-Page dynamic tab routing (Home, Checker, Results, Dash)
    │   ├── globals.css         # Glassmorphism utilities & theme tokens
    │   └── api/
    │       ├── auth/           # Login & registration endpoints (bcryptjs)
    │       ├── chat/           # Gemini AI 24/7 health chat assistant
    │       ├── history/        # Consultation history CRUD
    │       ├── predict/        # Dual-engine disease prediction endpoint
    │       ├── stats/          # Global health statistics & metric counters
    │       └── symptoms/       # Symptom taxonomy & category query route
    ├── components/
    │   ├── chat/               # Health chatbot floating widget
    │   ├── dashboard/          # BMI, Water Tracker, Med Reminders, Health Score, Analytics
    │   ├── home/               # Hero, Disease Browser, Emergency Actions, Team, FAQ
    │   ├── layout/             # Navigation header, language toggles, footer
    │   ├── prediction-results/ # Confidence meter, severity badges, PDF/print generator
    │   ├── symptom-checker/    # Body map, voice input, search, category accordions
    │   └── ui/                 # Accessible shadcn/ui components (Radix primitives)
    ├── hooks/                  # Toast & responsive device hooks
    └── lib/
        ├── auth.ts             # Password hashing & user validation
        ├── db.ts               # Prisma singleton client instance
        ├── store.ts            # Zustand global application state
        ├── urdu-translations.ts# Authentic Urdu medical terminology dictionary
        └── utils.ts            # ClassName merging utilities (clsx & twMerge)
```

---

## 🎓 Academic & Development Credits

**Smart.Dr** was conceptualized, designed, and engineered as an undergraduate **Final Year Project** for the degree of **Bachelor of Science in Information Technology (BS IT - 8th Semester)**.

### 🏛 Academic Institution
- **Department**: Department of Computer Science & Information Technology
- **University**: [University of Malakand (UOM)](https://uom.edu.pk/)
- **Location**: Chakdara, Lower Dir, Khyber Pakhtunkhwa, Pakistan

### 👨‍💻 Project Developers
- **Bilal Hassan** — *Roll No: 1610* (Full-Stack Architecture & AI Integration)
- **Haris Khan** — *Roll No: 1609* (Frontend Engineering & Database Design)

### 👨‍🏫 Project Supervisors
- **Dr. Pervez Khan** — *Associate Professor / Project Supervisor*
- **Dr. Fakhre Alam** — *Assistant Professor / Co-Supervisor*

---

## ⚠️ Medical & Legal Disclaimer

> **IMPORTANT MEDICAL NOTICE**:
> 
> **Smart.Dr** is an academic research and educational decision-support project. It is **NOT** a certified medical diagnostic device and does not establish a doctor-patient relationship.
>
> - The predictions, risk evaluations, and treatment suggestions generated by both the Local ML and Gemini AI engines are strictly for informational and triage guidance.
> - **Never ignore professional clinical advice** or delay seeking medical attention because of information provided by this system.
> - In the event of a medical emergency (such as severe chest pain, sudden numbness/paralysis, difficulty breathing, or severe trauma), immediately dial your local emergency services (e.g., **1122** in Pakistan or **911** in the USA) or proceed to the nearest emergency room.

---

<p align="center">
  <sub>© 2026 Smart.Dr Development Team. All rights reserved. University of Malakand.</sub>
</p>
