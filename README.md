<div align="center">

# WishPilot — Universal Stealth Interview Copilot

**An ultra-low latency, multi-industry interview copilot and real-time speech intelligence engine.**

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)
[![Website](https://img.shields.io/badge/Website-wishpilot.vercel.app-000000.svg?logo=vercel)](https://wishpilot.vercel.app/)
[![Release](https://img.shields.io/badge/Release-v1.0.0-success.svg)](https://github.com/vishwjeet27/wishpilot/releases)
[![Docs Wiki](https://img.shields.io/badge/Docs-Wiki-blueviolet.svg)](https://github.com/vishwjeet27/wishpilot/wiki)
[![CI](https://github.com/vishwjeet27/wishpilot/actions/workflows/ci.yml/badge.svg)](https://github.com/vishwjeet27/wishpilot/actions)
[![Sponsor](https://img.shields.io/badge/Sponsor-GitHub%20Sponsors-ea4aaa.svg?logo=github-sponsors)](https://github.com/sponsors/vishwjeet27)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Donate-FFDD00.svg?logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/vishwjeet)
[![Author](https://img.shields.io/badge/Author-Vishwjeet%20Singh%20Vilkhu-orange.svg)](https://github.com/vishwjeet27)
[![Electron](https://img.shields.io/badge/Electron-v44-47848F.svg?logo=electron)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-v19-61DAFB.svg?logo=react)](https://react.dev/)
[![Groq Whisper](https://img.shields.io/badge/STT-Groq%20Whisper%20Large%20v3-F55036.svg)](https://groq.com/)
[![Local First](https://img.shields.io/badge/Privacy-Local%20First%20%7C%20BYOK-green.svg)](#privacy--local-first-guarantee)

Designed, architected, and engineered by **[Vishwjeet Singh Vilkhu](https://github.com/vishwjeet27)**.

[Official Website](https://wishpilot.vercel.app/) • [Download v1.0.0](https://github.com/vishwjeet27/wishpilot/releases) • [Documentation (Wiki)](https://github.com/vishwjeet27/wishpilot/wiki) • [Sponsor](https://github.com/sponsors/vishwjeet27) • [Features](#key-features) • [Quick Start](#getting-started) • [Shortcuts](#global-keyboard-shortcuts) • [Architecture](#architecture) • [License](#license--attribution)

---

</div>

## Overview

**WishPilot** is a desktop application designed for candidates preparing for and navigating high-stakes technical, operational, and leadership interviews. It combines sub-second speech-to-text transcription, adaptive multi-category AI answer generation, and stealth overlay modes into an ultra-low-profile desktop app that runs locally on Windows.

### Key Capabilities:
- **Instant Answer Refinement**: One-click pills to refine answers (*Make Shorter*, *More Technical*, *Give an Example*, *Simpler Language*).
- **Multi-Industry Category Engine**: Tailored prompts, frameworks, and roles across 9 distinct streams (IT & Software, BPO & Voice Ops, Finance & Banking, Sales & BD, HR & Talent, Product Management, Healthcare, Core Engineering, Custom).
- **9 Unified AI Inference Providers**: Native streaming support for **Groq, Cerebras, Together AI, Fireworks AI, NVIDIA NIM, Hugging Face, OpenRouter, OpenAI, and Google Gemini**.
- **Real-Time Voice Intelligence**: Ultra-low-latency Groq Whisper Large v3 Turbo transcription (~180ms - 350ms) with automated silence accumulation and voice activity detection (VAD).
- **Zero Emojis Guarantee**: 100% monochrome vector SVGs matching stealth professional aesthetics.
- **Display Protection**: Native Windows Display Affinity (`WDA_EXCLUDEFROMCAPTURE`) prevents the overlay from appearing in screen capture tools.

---

## Important Ethical Disclaimer

WishPilot is an advanced interview preparation and practice simulator designed for self-directed mock interviews, communication training, and live technical drills.

The developer assumes no responsibility for any misuse of this software. Users are entirely responsible for ensuring their usage complies with all applicable institutional policies, terms of service, and ethical guidelines.

---

## Key Features

### 1. Instant Answer Refinement Pills
Immediately after an answer finishes streaming, four contextual quick-action pills become available:
- **Make Shorter**: Compresses the answer into an ultra-punchy 15-20 second spoken elevator pitch.
- **More Technical**: Injects architectural trade-offs, algorithms, low-level metrics, and code.
- **Give an Example**: Weaves a concrete production case study with measurable quantitative outcomes.
- **Simpler Language**: Translates the solution into crystal-clear conversational English with an intuitive analogy.

### 2. Multi-Industry Category & Framework Engine
Interviews differ across domains. WishPilot dynamically adapts its 10-second TL;DR punchline, tone, and breakdown to match the active stream:
- **IT & Software**: System Architecture, Distributed Edge Cases & LeetCode Big-O.
- **BPO & Voice Ops**: LAST Framework (Listen, Apologize, Solve, Thank) + Empathy & SLAs.
- **Finance & Banking**: 3-Statement Modeling, DCF Valuation & Risk Mitigation.
- **Sales & BD**: BANT / SPIN Selling, Objection Handling & Closing Hooks.
- **HR & Talent**: STAR Behavioral, Employee Relations & Labor Compliance.
- **Product Management**: CIRCLES & RICE Prioritization with Product Sense.
- **Healthcare & Clinical**: Triage Protocols, SBAR Handoffs & Patient Safety.
- **Core Engineering**: Root Cause Analysis, Failure Mode & Six Sigma Safety.
- **Custom / Universal**: Adaptive first-person professional delivery.

### 3. Sub-Second Speech-to-Text (STT)
Captures microphone or system audio using the Web Audio API with a specialized AudioWorklet. Automatically buffers and dispatches PCM audio chunks to Groq's Whisper Large v3 Turbo engine, returning real-time transcripts within 180ms to 350ms.

### 4. Stealth HUD & Notch Modes
- **Studio Dashboard**: Full management console with tabbed controls for sessions, models, prompt tuning, and latency telemetry.
- **Floating HUD**: Minimal, always-on-top translucent heads-up display with live transcript and answer streaming. Supports adjustable opacity and click-through mode.
- **Stealth Notch**: Compact top-centered dock (230×34px) displaying voice waveforms and single-tap answer triggers.
- **Windows Display Affinity**: Excludes overlay windows from Windows Graphics Capture (`SetWindowDisplayAffinity(WDA_EXCLUDEFROMCAPTURE)`).

---

## Architecture

| Component | Technology | Description |
|---|---|---|
| **Shell & Lifecycle** | Electron 44 | Window management, IPC bridge, global shortcuts, native window protection |
| **Frontend UI** | React 19 + Vite 8 | Reactive state management, responsive dark studio UI, Tailwind CSS v4 |
| **Icons & Assets** | Custom Monochrome SVGs + Lucide | Zero Unicode emojis; pure vector geometries |
| **Speech-to-Text** | Groq Whisper Large v3 Turbo | High-speed technical vocabulary transcription |
| **AI LLM Engine** | Unified Multi-Provider | Groq, Cerebras, Together AI, Fireworks, NVIDIA, HuggingFace, OpenRouter, OpenAI, Gemini |
| **Screen Analysis** | Electron DesktopCapturer | Invisible screenshot capture for code problems & system diagrams |
| **Local Storage** | LocalStorage / SQLite | Zero telemetry; all data remains strictly on the user's local machine |

---

## Global Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + Shift + H` | Toggle Floating Stealth HUD / Studio Mode |
| `Ctrl + Shift + M` | Toggle Microphone listening on / off |
| `Ctrl + Shift + A` | Manually trigger AI answer generation |
| `Ctrl + Shift + S` | Capture screen & attach as visual context |
| `Ctrl + Shift + C` | Toggle Click-Through mode (clicks pass beneath HUD) |
| `Ctrl + Shift + X` | Quick Dismiss (minimizes window & pauses audio) |

---

## Getting Started

### Prerequisites
- Windows 10 or Windows 11 (64-bit)
- Node.js 22.x LTS (Recommended) or higher
- npm 9.x or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vishwjeet27/wishpilot.git
   cd wishpilot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the production bundle:**
   ```bash
   npm run build
   ```

4. **Launch WishPilot:**
   ```bash
   npm run start
   ```

*(Alternatively, run `start-wishpilot.bat` on Windows for automated building and launching).*

---

## Privacy & Local-First Guarantee

- **Bring Your Own Key (BYOK)**: Enter your own API keys in the Studio Dashboard.
- **No WishPilot Cloud Servers**: Voice audio and prompt data flow strictly between your local client and the official API provider endpoints via direct HTTPS.
- **Local Storage**: Profile information, resumes, job descriptions, and transcripts reside purely in local application storage.

---

## Support & Sponsor

WishPilot is 100% free and open-source under GPL-3.0. If WishPilot helped you ace an interview, save time, or sharpen your technical communication, consider supporting ongoing development:

- **GitHub Sponsors**: [github.com/sponsors/vishwjeet27](https://github.com/sponsors/vishwjeet27) *(Zero platform fees, recurring or one-time)*
- **Buy Me a Coffee**: [buymeacoffee.com/vishwjeet](https://buymeacoffee.com/vishwjeet) *(Instant one-click tip)*

<br/>

<a href="https://buymeacoffee.com/vishwjeet" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="48" style="height: 48px !important;" /></a>
<a href="https://alternativeto.net/software/wishpilot/about/?utm_source=badge&utm_medium=referral" target="_blank"><img src="https://alternativeto.net/static/badges/badge-compact-dark.svg" alt="WishPilot | AlternativeTo" height="48" style="height: 48px !important;" /></a>

---

## Author & Maintainer

**Vishwjeet Singh Vilkhu**  
Software Engineer & Builder  
- **GitHub**: [@vishwjeet27](https://github.com/vishwjeet27)  
- **LinkedIn**: [linkedin.com/in/vishwjeet27](https://www.linkedin.com/in/vishwjeet27)  
- **Repository**: [github.com/vishwjeet27/wishpilot](https://github.com/vishwjeet27/wishpilot)

---

## License & Attribution

This project is licensed under the **GNU General Public License v3.0 (GPL-3.0-or-later)**. See the [LICENSE](LICENSE) file for complete details.

### Conditions & Attribution:
- Anyone who forks, clones, or distributes this software (or derivative works) **must preserve the original copyright notice and give prominent attribution to Vishwjeet Singh Vilkhu**.
- Derivative projects **must remain open-source under GPL-3.0**. Proprietary closing or unauthorized commercial repackaging is strictly prohibited.
- For academic or professional citations, please refer to the [`CITATION.cff`](CITATION.cff) file.

Copyright © 2026 **Vishwjeet Singh Vilkhu**. All rights reserved.
