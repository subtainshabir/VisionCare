# VisionCare - Digital Vision Screening Platform & AI Assistant

[![Next.js](https://img.shields.io/badge/Next.js-16.4.3-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Neon Database](https://img.shields.io/badge/Database-Neon%20Postgres-00E599?style=flat&logo=postgresql)](https://neon.tech/)
[![Groq AI](https://img.shields.io/badge/AI%20Engine-Groq%20Cloud-F55036?style=flat)](https://groq.com/)
[![Android](https://img.shields.io/badge/Android-APK%20Ready-3DDC84?style=flat&logo=android)](https://developer.android.com/)

VisionCare is a modern, accessible web and mobile vision screening platform designed to offer preliminary vision assessments, track screening history, generate clinical-inspired PDF reports, and provide educational vision health guidance via an AI assistant.

---

## ⚠️ Important Medical Disclaimer

> **VisionCare is an educational vision-screening tool and is NOT a substitute for professional optometric or ophthalmic medical examinations, clinical diagnosis, or treatment.**  
>
> Automated and remote screenings cannot detect retinal diseases, glaucoma, cataracts, neurological conditions, or general ocular pathologies. If you experience sudden vision changes, eye pain, floaters, flashes, or headaches, consult a qualified optometrist or ophthalmologist immediately.

---

## 📑 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
  - [Implemented Modules](#implemented-modules)
  - [Screening Capabilities](#screening-capabilities)
  - [AI Vision Assistant](#ai-vision-assistant)
  - [Reports & Exporting](#reports--exporting)
  - [Unavailable / Out-of-Scope Features](#unavailable--out-of-scope-features)
- [Technology Stack](#-technology-stack)
- [Project Architecture](#-project-architecture)
- [Prerequisites](#-prerequisites)
- [Installation & Local Setup](#-installation--local-setup)
- [Environment Configuration](#-environment-configuration)
- [Database Setup & Schema](#-database-setup--schema)
- [AI Assistant Configuration](#-ai-assistant-configuration)
- [Android APK Wrapper](#-android-apk-wrapper)
- [Testing & Quality Assurance](#-testing--quality-assurance)
- [Deployment](#-deployment)
- [Future Roadmap](#-future-roadmap)

---

## 🔍 Project Overview

### Purpose
Access to basic vision screening is often delayed due to geographical, financial, or awareness barriers. VisionCare bridges this gap by offering:
- Fast, accessible self-administered preliminary vision screenings from standard consumer devices.
- Visual acuity and color discrimination assessment using standardized clinical methods (Snellen, Rosenbaum, and Ishihara-inspired plates).
- Precise on-screen millimeter calibration for accurate physical optotype sizing across screens of varying pixel densities.
- Instant, structured A4 PDF screening summaries to take to clinical eye exams.
- Interactive, multi-lingual vision wellness guidance powered by Groq high-speed AI inference.

### Intended Audience
- **Individuals & Families:** Checking routine vision wellness or monitoring visual changes between annual doctor visits.
- **Screen & Remote Workers:** Checking near-vision fatigue and contrast comfort during prolonged computer use.
- **Educators & Community Health Workers:** Conducting preliminary classroom or community screening days before professional referrals.

---

## ✨ Key Features

### Implemented Modules

| Feature | Status | Description |
| :--- | :--- | :--- |
| **Color Vision Test** | `Production Ready` | 108 high-contrast pseudo-isochromatic plates, 5-plate randomized sessions, Fisher-Yates shuffled multiple-choice options, and classification into normal vs. deficiency indicators. |
| **Distance Visual Acuity** | `Production Ready` | 50+ randomized Snellen chart configurations, on-screen card/coin pixel calibration, tested at 3 meters (10 feet), calculates Snellen denominator (20/20 to 20/200) and LogMAR. |
| **Near Visual Acuity** | `Production Ready` | 50+ randomized Rosenbaum reading chart samples, calibrated for 14-inch (35 cm) reading distance, scores Jaeger (J1+ to J16) and Snellen equivalent. |
| **Physical Screen Calibration** | `Production Ready` | Interactive on-screen credit card / standard coin slider to calculate exact device pixels-per-millimeter (PPM), guaranteeing millimeter-accurate optotype rendering. |
| **PDF Report Generation** | `Production Ready` | Serverless A4 report generation (`pdfkit`) containing participant data, scores, clinical interpretation, recommendations, and disclaimer. |
| **AI Vision Assistant** | `Production Ready` | Powered by Groq API (`openai/gpt-oss-120b`, `qwen/qwen3.8-27b`, `llama-3.3-70b-versatile`). Supports English & Urdu, Markdown rendering, context injection from active tests, rate limiting, and local fallback mode. |
| **Authentication & Profile** | `Production Ready` | Secure registration and login, password hashing (`bcryptjs`), cookie-based sessions, and password management. |
| **Screening History** | `Production Ready` | Persistent cloud test logs in Neon PostgreSQL (`test_results` table) with instant PDF re-download. |
| **Dark & Light Mode** | `Production Ready` | High-contrast accessible themes with persistent preference storage. |
| **Responsive UI** | `Production Ready` | Mobile, tablet, and desktop adaptive layouts built with Tailwind CSS v4. |
| **Android APK** | `Production Ready` | Native Android WebView application wrapper (`com.visioncare.app`, signed release APK) with offline detection, PDF downloads to device storage, and back navigation. |

### Screening Capabilities

#### 1. Color Vision Test
- **Asset Bank:** 108 custom SVG plates generated with dense hexagonal dot grids and clinically validated color-confusion pairs (protan, deutan, and tritan axes).
- **Recognizable Patterns:** Clear numerals (e.g., 12, 8, 6, 29, 74), uppercase letters (e.g., A, B, C, E), and geometric shapes (circle, square, triangle, star).
- **Session Engine:** Exactly 5 plates randomly sampled per session; answer options shuffled using Fisher-Yates algorithm; restart creates a fresh set.
- **Scoring:** Calculates score percentage, categorizes color discrimination (Normal, Mild Deficiency, Moderate/Severe Deficiency).

#### 2. Distance Vision Test (Snellen Optotypes)
- **Asset Bank:** 50+ randomized Snellen optotype combinations (lines 20/200 down to 20/20).
- **Distance Calibration:** Calibrated for standard 3-meter (10-foot) viewing distance.
- **Interactive Controls:** Interactive virtual keypad for directional letter selection with an "Unclear / Cannot Read" option.
- **Acuity Calculation:** Determines the smallest line read with at least 50% accuracy.

#### 3. Near Vision Test (Rosenbaum Chart)
- **Asset Bank:** 50+ randomized reading chart configurations.
- **Viewing Calibration:** Calibrated for standard near-reading distance of 14 inches (35 cm).
- **Graded Optotypes:** Evaluates reading clarity from line 1 (20/800, Jaeger 16) down to line 10 (20/20, Jaeger 1+).

### AI Vision Assistant
- **Engine:** Groq Cloud Chat Completions API with dynamic model fallback (`openai/gpt-oss-120b` → `qwen/qwen3.8-27b` → `llama-3.3-70b-versatile`).
- **Formatting:** Full Markdown parsing via `react-markdown` and `remark-gfm` (bold, italic, numbered/bulleted lists, code, tables, and blockquotes).
- **Context Awareness:** Automatically ingests the user's active screening result to answer specific questions regarding their scores.
- **Security & Rate Limiting:** Server-side sliding-window rate limit (20 requests/minute/IP) to prevent abuse.
- **Local Fallback Mode:** If no `GROQ_API_KEY` is provided, the assistant continues to guide users using an offline intelligent response engine.

### Reports & Exporting
- **Format:** Vector-rendered A4 PDF report generated via Node.js serverless functions.
- **Security:** Owner-verified authorization (`user_id` check) preventing Insecure Direct Object References (IDOR).
- **Delivery:** Direct authenticated download via `/api/results/[id]/pdf` or client-side blob download in the browser.

### Unavailable / Out-of-Scope Features
To maintain scientific and medical integrity, the following are intentionally **not** implemented:
- Automated refractive error prescriptions (glasses/contact lens prescriptions require a phoropter and dilated exam).
- Glaucoma or intraocular pressure measurement (tonometry requires physical contact or air-puff sensors).
- Retinal or fundus imaging (requires ophthalmoscopes/fundus photography).

---

## 🛠️ Technology Stack

| Layer | Technologies | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 16.4.3 (App Router)** | High-performance server-rendered and client components with Turbopack |
| **UI Library** | **React 19.3.0** | Modern component architecture, state machines, and hooks |
| **Language** | **TypeScript 5.x** | End-to-end static typing across models, scoring algorithms, and API payloads |
| **Styling** | **Tailwind CSS 4.x** | Modern utility-first responsive styling with custom teal/dark healthcare palette |
| **Database** | **Neon Serverless PostgreSQL** | Cloud-native serverless SQL with connection pooling (`@neondatabase/serverless`) |
| **Authentication** | **HTTP-Only Cookies & Bcrypt** | Secure password hashing (`bcryptjs`) and session tokens (`crypto`) |
| **AI Inference** | **Groq Cloud API** | Fast LLM inference with dynamic fallback cascade |
| **Markdown** | **react-markdown + remark-gfm** | Safe rendering of AI formatting (tables, lists, bold, links) |
| **PDF Generation** | **PDFKit 0.20.2** | Serverless vector PDF generation of medical-style screening reports |
| **Testing** | **Node Test Runner (`tsx --test`)** | Fast unit and security test suites covering all business logic |
| **Mobile Wrapper** | **Android Native WebView (Java / API 34)** | Lightweight wrapper providing an installable Android APK |

---

## 📂 Project Architecture

```
VisionCare/
├── VisionCare.apk                     # Pre-built signed release Android APK (~4.4 MB)
├── README.md                          # Project documentation
└── visioncare/                        # Git repository root
    ├── .env.example                   # Root environment configuration template
    ├── .gitignore                     # Git ignore rules (protecting secrets and builds)
    └── frontend/                      # Full-stack Next.js web application
        ├── .env.example               # Frontend environment configuration template
        ├── package.json               # Application dependencies & npm scripts
        ├── tsconfig.json              # TypeScript compiler configuration
        ├── next.config.ts             # Next.js framework configuration
        ├── eslint.config.mjs          # Linting rules
        ├── app/                       # Next.js App Router (Pages & API endpoints)
        │   ├── page.tsx               # Landing page & feature showcase
        │   ├── layout.tsx             # Root layout with theme & auth providers
        │   ├── globals.css            # Tailwind theme colors and global CSS
        │   ├── login/                 # User login page
        │   ├── register/              # User account registration page
        │   ├── history/               # Saved screening history page
        │   ├── settings/              # User profile & password management
        │   ├── tests/                 # Screening module routes
        │   │   ├── page.tsx           # Test selector dashboard
        │   │   ├── color-vision/      # Color Vision Screening
        │   │   ├── distance-vision/   # Distance Vision Screening (Snellen)
        │   │   └── near-vision/       # Near Vision Screening (Rosenbaum)
        │   └── api/                   # Serverless API Route Handlers
        │       ├── auth/              # Login, Register, Logout, Me endpoints
        │       ├── users/             # Profile & Change-password endpoints
        │       ├── results/           # Save results, fetch history, & PDF route
        │       ├── ai/chat/           # Groq AI Assistant proxy with rate limiting
        │       └── health/            # System & Neon DB health checks
        ├── components/                # Reusable React UI Components
        │   ├── ai-assistant/          # AI chat modal, markdown renderer, language toggle
        │   ├── layout/                # Header, navigation, footer
        │   ├── screening/             # Session controllers, stimuli, calibrations, results
        │   ├── test-engine/           # Reusable state machine shell, navigation, cancel dialog
        │   ├── theme/                 # Dark/light mode switcher
        │   └── ui/                    # Buttons, cards, badges, icons, page containers
        ├── lib/                       # Core Business Logic & Services
        │   ├── ai/                    # Prompt builders, translation dicts, AI unit tests
        │   ├── auth/                  # Auth context, user services, password hashing
        │   ├── db/                    # Neon connection client, auto-migration schema
        │   ├── reports/               # PDFKit A4 report generator
        │   ├── results/               # Results persistence & retrieval service
        │   ├── security/              # Sliding-window rate limiter & input sanitizers
        │   ├── test-engine/           # Reducer state machine for screening flows
        │   ├── tests/                 # Test banks, scoring logic, randomization
        │   └── theme/                 # Theme context provider
        ├── public/                    # Static assets
        │   └── assets/color-vision/   # 108 high-contrast color vision SVG plates
        ├── scripts/                   # Plate generation & validation scripts
        └── types/                     # Shared TypeScript interfaces
```

---

## 📋 Prerequisites

Before setting up VisionCare locally, ensure you have:

- **Node.js:** `v18.18.0` or higher (tested with `v20.x` and `v24.x`)
- **Package Manager:** `npm` (v9 or higher)
- **Git:** Installed on your path
- **(Optional) Neon PostgreSQL Account:** For saving accounts and test history in the cloud ([neon.tech](https://neon.tech))
- **(Optional) Groq API Key:** For live AI assistant features ([console.groq.com](https://console.groq.com))
- **(Optional for Android Building):** OpenJDK 17, Android SDK Command-line Tools (API 34), Gradle 8.7

---

## 🚀 Installation & Local Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/subtainshabir/VisionCare.git
cd VisionCare/visioncare/frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Copy the provided template to create your local environment file:

```bash
cp .env.example .env.local
```

Open `.env.local` in your editor and configure your variables (see [Environment Configuration](#-environment-configuration)).

> **Note:** The application will run without a database or Groq key:
> - If `DATABASE_URL` is omitted, the app runs in guest/demo mode (screening tests function fully; history is stored locally in the session).
> - If `GROQ_API_KEY` is omitted, the AI assistant runs in local educational guide mode.

### Step 4: Run Automated Tests

Verify that your environment and dependencies are functioning properly:

```bash
npm test
```

You should see all 12 test suites pass.

### Step 5: Start Development Server

```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

### Step 6: Build for Production

To create an optimized production build:

```bash
npm run build
npm start
```

---

## 🔐 Environment Configuration

Create a file named `.env.local` inside the `frontend/` directory.

| Variable Name | Required | Default / Fallback | Description |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | Optional | None (Demo Mode) | Neon Serverless PostgreSQL connection string with SSL required. |
| `GROQ_API_KEY` | Optional | Offline Guide Mode | Groq Cloud API key for live AI Vision Assistant responses. |
| `GROQ_MODEL` | Optional | `openai/gpt-oss-120b` | Target Groq model (cascades to `qwen/qwen3.8-27b`, `llama-3.3-70b-versatile`). |
| `NEXT_PUBLIC_API_URL` | Optional | `http://localhost:3000` | Base URL used for client-side API requests. |

### Safe Example Template (`frontend/.env.example`)

```ini
# Neon PostgreSQL Database Connection URL
DATABASE_URL=postgresql://USER:PASSWORD@ep-sample-123.us-east-2.aws.neon.tech/neondb?sslmode=require

# Groq API Configuration (for AI Vision Assistant)
# Obtain from https://console.groq.com/keys
GROQ_API_KEY=gsk_your_groq_api_key_here

# Optional model override
# GROQ_MODEL=openai/gpt-oss-120b
```

> **Security Rule:** Never commit `.env.local` or any file containing real passwords or API keys to Git. `.env.local` is excluded by `.gitignore`.

---

## 🗄️ Database Setup & Schema

VisionCare uses **Neon Serverless PostgreSQL**. The application features an **automated schema initialization** system (`frontend/lib/db/schema.ts`).

### How It Works
When the application connects to a configured database, `initAuthSchema()` executes automatically and initializes the following tables and indexes if they do not already exist:

1. **`users` Table:**
   - `id VARCHAR(64) PRIMARY KEY`
   - `display_name VARCHAR(100) NOT NULL`
   - `email VARCHAR(255) UNIQUE NOT NULL`
   - `password_hash VARCHAR(255) NOT NULL`
   - `created_at TIMESTAMPTZ DEFAULT NOW()`
   - `status VARCHAR(20) DEFAULT 'active'`

2. **`sessions` Table:**
   - `id VARCHAR(128) PRIMARY KEY`
   - `user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE`
   - `created_at TIMESTAMPTZ DEFAULT NOW()`
   - `expires_at TIMESTAMPTZ NOT NULL`
   - `revoked_at TIMESTAMPTZ`

3. **`test_results` Table:**
   - `id VARCHAR(64) PRIMARY KEY`
   - `user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE`
   - `test_type VARCHAR(32) NOT NULL` (`color-vision` | `distance-vision` | `near-vision`)
   - `test_title VARCHAR(128) NOT NULL`
   - `summary_note TEXT NOT NULL`
   - `total_items INT NOT NULL`, `answered_count INT`, `matched_count INT`, `match_percentage INT`
   - `unclear_count INT DEFAULT 0`
   - `metrics_json JSONB`
   - `completed_at TIMESTAMPTZ DEFAULT NOW()`

4. **Performance Indexes:**
   - `idx_sessions_user_id`, `idx_sessions_expires_at`, `idx_users_email`, `idx_test_results_user_id`, `idx_test_results_completed_at`.

### Verifying Database Connectivity
Visit the built-in health endpoint:
```
GET /api/health/db
```
This performs a ping (`SELECT 1`) with masked credentials and returns connection status.

---

## 🤖 AI Assistant Configuration

The VisionCare AI Assistant acts as an educational vision-screening guide.

### Setup Instructions
1. Create a free account at [console.groq.com](https://console.groq.com).
2. Generate an API Key under **API Keys**.
3. In `frontend/.env.local`, set:
   ```ini
   GROQ_API_KEY=gsk_your_actual_key_here
   ```
4. Restart your development server (`npm run dev`).

### Dynamic Model Cascade
To guarantee high availability even during model deprecations or peak load, the backend automatically cascades through active Groq models:
1. User-specified `GROQ_MODEL`
2. `openai/gpt-oss-120b`
3. `qwen/qwen3.8-27b`
4. `openai/gpt-oss-20b`
5. `llama-3.3-70b-versatile`
6. `llama-3.1-8b-instant`

---

## 📱 Android APK Wrapper

VisionCare includes an official native Android WebView wrapper application that allows users to install and run VisionCare as a standalone Android app.

### Pre-built APK
A pre-built, signed release APK is available directly in the project root:
- **File:** [`VisionCare.apk`](file:///d:/VisionCare/VisionCare.apk)
- **Size:** ~4.4 MB
- **Package ID:** `com.visioncare.app`
- **Minimum OS:** Android 7.0 (API 24)
- **Target OS:** Android 14+ (API 34)
- **Signature:** Signed and verified with APK Signature Scheme v2

### Native Capabilities
- **Session Continuity:** Syncs cookies and `localStorage` so users remain authenticated.
- **Direct PDF Downloads:** PDF screening reports trigger Android's `DownloadManager` and automatically prompt to open with installed PDF viewers.
- **Offline Error Screen:** Displays an offline state with a **"Retry Connection"** button when internet access drops.
- **Hardware Integration:** Supports file upload selectors (`<input type="file">`) and camera permissions for optional vision assessments.
- **Back-Button Handling:** Uses AndroidX `OnBackPressedCallback` to navigate WebView history before exiting.

### Installing on Android
1. Transfer `VisionCare.apk` to your Android device via USB, Google Drive, or messaging.
2. In your device file manager, tap `VisionCare.apk`.
3. If prompted, allow "Install unknown apps" for the file manager.
4. Tap **Install** and launch **VisionCare**.

---

## 🧪 Testing & Quality Assurance

VisionCare includes a test suite covering logic, scoring algorithms, security, and rendering:

```bash
# Run all unit and integration tests
npm test

# Run TypeScript type validation
npm run type-check

# Run Next.js and ESLint code checks
npm run lint
```

### Test Coverage Highlights
- **`lib/ai/ai-service.test.ts`:** AI prompt generation, translation fallbacks, and message sanitation.
- **`lib/auth/auth-service.test.ts`:** Registration, password validation, session tokens, and logout.
- **`lib/security/security.test.ts`:** IDOR prevention, password boundaries, URL masking, and rate limiting.
- **`lib/reports/pdf-service.test.ts`:** Vector PDF buffer creation for all screening types.
- **`lib/tests/*-scoring.test.ts`:** Acuity formulas, Ishihara scoring, and Fisher-Yates randomization.

---

## 🌐 Deployment

### Recommended: Vercel
Because VisionCare is built with Next.js 16 App Router, it deploys seamlessly to Vercel:

1. Push your repository to GitHub.
2. Import the project into the [Vercel Dashboard](https://vercel.com).
3. Set the **Root Directory** to `visioncare/frontend`.
4. In **Environment Variables**, add:
   - `DATABASE_URL`: Your production Neon PostgreSQL connection string.
   - `GROQ_API_KEY`: Your production Groq API key.
5. Click **Deploy**.

---

## 🗺️ Future Roadmap

- [ ] **Astigmatism Screening:** Dial / Sunburst test module with axis detection.
- [ ] **Dual-Screen Remote Mode:** Pair a smartphone as a wireless remote while displaying optotypes on a large screen or TV at 6 meters.
- [ ] **Contrast Sensitivity Assessment:** Pelli-Robson-style letter chart with diminishing contrast levels.
- [ ] **WebRTC Voice Input:** Voice-directed optotype recognition for hands-free screening.

---

## 📄 License & Attribution

This project is released under the **MIT License**.

Developed for accessible, preliminary digital eye screening and health education. All clinical optotypes and color-confusion plates are modeled on standardized optometric screening principles.

