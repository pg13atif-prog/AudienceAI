# AudienceAI — *"See Your Story Through Their Eyes."*

> An AI-powered live audience simulator and creative story platform that analyzes screenplay scenes from diverse simulated audience viewpoints, detects narrative craft bottlenecks, remixes scenes with surgical precision, and benchmarks before-and-after improvements.

---

## 🎬 Creative Workflow

```
1. Create Scene ➔ 2. Select Personas ➔ 3. Simulate Audience ➔ 4. Live Reactions ➔ 5. Insights & Problem Detection ➔ 6. AI Scene Remix ➔ 7. Before vs After Comparison
```

---

## ✨ Key Features

- **⚡ One-Click Demo Mode (*"The Betrayal"*)**: Instant walkthrough with a preloaded Sci-Fi thriller scene featuring Alex, Sarah, and Marcus.
- **👥 4 Core Simulated Personas**:
  - **Casual Viewer**: Entertainment value, narrative clarity, engagement momentum.
  - **Story Critic**: Structure, dramatic pacing, character motivation, and setup/payoff logic.
  - **Lore Enthusiast**: Worldbuilding rules, historical continuity, and backstory consistency.
  - **Emotional Viewer**: Empathetic stakes, vulnerability, and character chemistry.
- **🎯 AI Problem Detection & Audience Insight**: Evaluates feedback across 9 narrative craft categories (`Pacing`, `Logic`, `Character Motivation`, `Continuity`, `Clarity`, `Emotional Payoff`, `Tone`, `Humor`, `Consistency`) and isolates the primary bottleneck with "Why it matters" rationale.
- **🎨 AI Scene Remix Suite**: Fixes identified problems while strictly preserving the core story climax, characters, setting, and creator's voice.
- **📈 Before vs After Comparative Analytics**: Visual dual-progress gauges, real 6-dimension metric lifts, persona quote transformations, and automated "Did the scene improve?" verdicts.
- **🗄️ Cloud Firestore & Multi-Version History**: Full session logging and 3-generation version comparisons (Original vs Previous Remix vs Latest Version).
- **🤖 Dual Provider Support**: Seamlessly works with Google Gemini 2.5 Flash and OpenRouter.

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/pg13atif-prog/AudienceAI.git
cd AudienceAI
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Copy `.env.example` to `.env` and supply your OpenRouter / Gemini API Key and Firebase configuration:
```bash
cp .env.example .env
```

### 4. Run development server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Vanilla CSS Design System with Glassmorphism
- **AI Models**: Google Gemini 2.5 Flash / OpenRouter API
- **Backend & Database**: Firebase Cloud Firestore
- **Typography**: Plus Jakarta Sans, Cinzel, JetBrains Mono

---

## 📄 License

MIT License © 2026 AudienceAI Team
