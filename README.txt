================================================================================
                     Smart.Dr — Disease Prediction System
                        Source Code Package
================================================================================

Generated: May 2, 2026 at 03:16 PM

ABOUT
-----
Smart.Dr is an AI-powered symptoms-based disease prediction system built as a 
final year project. It uses dual-engine prediction (Local ML + Online AI) to 
analyze symptoms and predict possible diseases with recommendations.

TECH STACK
----------
- Framework:    Next.js 16 (App Router) + TypeScript
- Styling:      Tailwind CSS 4 + shadcn/ui
- Database:     Prisma ORM + SQLite
- AI:           Gemini API (Online Engine)
- ML:           Support Vector Classifier (Local Engine)
- Animations:   Framer Motion
- Charts:       Recharts
- Language:     English + Urdu (اردو) support

FEATURES
--------
✓ Symptom-based disease prediction (42+ diseases, 187+ symptoms)
✓ Dual prediction engine: Local ML + Online AI (Gemini)
✓ Disease browser with detailed information
✓ Medication, diet & workout recommendations
✓ BMI Calculator & Health Score tracking
✓ Water intake tracker
✓ Medication reminders with notifications
✓ Voice input (Web Speech API)
✓ Urdu/English/Bilingual language support
✓ Dark/Light theme support
✓ Privacy mode (zero PHI storage)
✓ PDF prescription generation (ReportLab)
✓ Interactive body map for symptom selection
✓ Health chat with AI assistant
✓ Download project source code

PROJECT STRUCTURE
-----------------
smart-dr-project/
├── src/
│   ├── app/
│   │   ├── page.tsx              Main application (single-page)
│   │   ├── layout.tsx            Root layout with fonts & providers
│   │   ├── globals.css           Global styles + glassmorphism
│   │   └── api/
│   │       ├── predict/          Prediction API endpoint
│   │       ├── download/         Download source code endpoint
│   │       └── report/           PDF report generation endpoint
│   ├── components/ui/            shadcn/ui component library
│   ├── hooks/                    Custom React hooks
│   └── lib/
│       ├── store.ts              Zustand state management
│       ├── db.ts                 Prisma database client
│       └── urdu-translations.ts  Urdu language support
├── prisma/
│   ├── schema.prisma             Database schema
│   └── seed.ts                   Database seed data
├── public/                       Static assets
├── package.json                  Dependencies & scripts
├── tsconfig.json                 TypeScript configuration
├── tailwind.config.ts            Tailwind CSS configuration
└── next.config.ts                Next.js configuration

GETTING STARTED
---------------
1. Install dependencies:
   bun install

2. Set up the database:
   bun run db:push
   bun run db:seed

3. Configure environment:
   Copy .env.example to .env and add your Gemini API key

4. Start the development server:
   bun run dev

5. Open http://localhost:3000 in your browser

ENVIRONMENT VARIABLES
---------------------
GEMINI_API_KEY=your_gemini_api_key_here

NOTES
-----
- This is an educational project for academic purposes only.
- Always consult a healthcare professional for medical advice.
- The ML model is trained on curated symptom-disease datasets.
- Privacy mode ensures zero Personally Identifiable Information storage.

================================================================================
  © 2026 Smart.Dr — Final Year Project | All Rights Reserved
================================================================================