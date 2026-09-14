# GATE//COUNTDOWN

> **Your preparation. One deadline.**

**GATE//COUNTDOWN** is a focused, premium countdown experience designed
for GATE aspirants. It turns the examination deadline into a calm,
persistent visual anchor while keeping the interface intentionally
simple, fast, responsive, and distraction-free.

```{=html}
<p align="center">
```
`<img src="assets/gate-countdown-demo.gif" alt="GATE//COUNTDOWN animated product demo" width="900">`{=html}
```{=html}
</p>
```
```{=html}
<p align="center">
```
`<strong>`{=html}A beautiful countdown for the journey to
GATE.`</strong>`{=html}
```{=html}
</p>
```

------------------------------------------------------------------------

## ✨ Overview

GATE//COUNTDOWN focuses on one idea: **make the remaining time visible
without making preparation feel overwhelming.**

The interface combines a live timestamp-based countdown with a warm
peach light theme, a polished dark mode, configurable exam settings,
preparation progress, and small motivational touches.

It is intentionally built as a lightweight client-side application with
no backend, authentication, or database.

------------------------------------------------------------------------

## 🎯 Why I Built This

Preparing for a competitive examination is a long journey, and it is
easy to lose sight of the deadline inside everyday study sessions.

I wanted to create something much simpler than a full study-management
platform:

> **Open it. See the deadline. Remember what you're working toward. Keep
> going.**

GATE//COUNTDOWN turns the examination date into a daily visual reminder
while keeping the experience calm and focused.

------------------------------------------------------------------------

## 🚀 Features

### ⏳ Live Countdown

-   Timestamp-based countdown to the configured examination date and
    time
-   Live updates every second
-   Days, hours, minutes, and seconds presented as the primary visual
    focus
-   Handles the countdown reaching zero gracefully

### 🎨 Premium Theme System

-   Sophisticated peach-inspired light theme
-   Purpose-built dark mode with charcoal surfaces and peach accents
-   Smooth theme transitions
-   System preference used on first visit
-   Theme preference persisted locally

### ⚙️ Configurable Examination Target

-   Set the examination date
-   Set the examination time
-   Update the target whenever required
-   Configuration is stored locally in the browser

> **Note:** The application does not present an unverified GATE 2027
> examination date as official. The target is configurable and can be
> updated when the official schedule is available.

### 📈 Preparation Journey

-   Visual preparation progress indicator
-   Adjustable progress percentage
-   Simple journey framing: Preparation → Revision → Final Push → GATE
-   Progress is persisted locally

These labels are product/motivational phases and are **not official GATE
phases**.

### 💭 Motivational Microcopy

Short rotating reminders designed to encourage consistency without
overwhelming the interface.

### 📱 Responsive Design

Designed for: - Desktop - Tablet - Mobile - Narrow mobile screens

The countdown, controls, typography, and cards adapt to smaller displays
without horizontal scrolling.

### ♿ Accessibility

-   Semantic HTML
-   Keyboard-friendly controls
-   Visible focus states
-   Accessible labels where appropriate
-   Reduced-motion support
-   Accessible settings interface

### ⚡ Lightweight & Client-Side

-   No backend
-   No database
-   No authentication
-   No external data service required
-   Browser `localStorage` for user preferences
-   Static deployment friendly

### 🔎 SEO & Social Metadata

-   Descriptive page title
-   Meta description
-   Open Graph metadata
-   Twitter/X metadata
-   Theme color
-   Custom favicon

------------------------------------------------------------------------

## 🛠️ Tech Stack

-   **React** --- UI architecture
-   **Vite** --- development and production tooling
-   **CSS** --- custom responsive styling and theme system
-   **Web Storage API (`localStorage`)** --- client-side persistence

The project deliberately avoids a heavy dependency stack because the
product does not need a backend or complex application infrastructure.

------------------------------------------------------------------------

## 📂 Project Structure

``` text
gate-countdown/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx
│   └── styles.css
├── index.html
├── package.json
├── vercel.json
├── README.md
└── ...
```

------------------------------------------------------------------------

## 💻 Getting Started

### Prerequisites

Make sure you have a current version of **Node.js** and **npm**
installed.

### 1. Clone the repository

``` bash
git clone https://github.com/Akshattron/gate-countdown.git
cd gate-countdown
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Start the development server

``` bash
npm run dev
```

Vite will provide a local development URL in the terminal.

------------------------------------------------------------------------

## 🏗️ Production Build

Create an optimized production build with:

``` bash
npm run build
```

The generated production files are placed in:

``` text
dist/
```

To preview the production build locally, use the appropriate Vite
preview command configured by the project.

------------------------------------------------------------------------

## ☁️ Deployment

GATE//COUNTDOWN is designed for static hosting.

### Vercel

The project includes deployment configuration suitable for Vercel.

Recommended settings:

``` text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Root Directory: ./
```

No environment variables are required.

The application can also be deployed to other static hosts that support
Vite's production output.

------------------------------------------------------------------------

## 🔐 Data & Privacy

GATE//COUNTDOWN is intentionally client-side.

User-configurable preferences such as:

-   examination date
-   examination time
-   preparation progress
-   theme preference

are stored locally in the browser using `localStorage`.

There is:

-   no user account
-   no backend
-   no database
-   no required personal-data submission
-   no required analytics service

Clearing the site's browser storage resets locally saved preferences.

------------------------------------------------------------------------

## 🎨 Design Philosophy

The visual system is built around contrast between two complementary
experiences.

### Light Mode

A warm, editorial-inspired interface using:

-   ivory/cream surfaces
-   peach accents
-   deep charcoal typography
-   subtle borders
-   soft atmospheric shapes

### Dark Mode

A deeper interface using:

-   near-black charcoal backgrounds
-   graphite surfaces
-   warm-white typography
-   peach/coral highlights
-   restrained glow

The goal is not to make the interface flashy. The goal is to make the
countdown feel **important, calm, and memorable**.

------------------------------------------------------------------------

## 🧪 Validation

The implementation was validated with:

``` text
npm install
npm run build
git diff --check
local Vite server HTTP 200 verification
```

The production build completed successfully during development.

------------------------------------------------------------------------

## 🔮 Future Scope

GATE//COUNTDOWN intentionally keeps its current scope small. Potential
future additions include:

-   Pomodoro study sessions
-   Study streaks
-   Daily study goals
-   Subject-wise progress
-   GATE syllabus checklist
-   Revision tracking
-   Previous-year-question (PYQ) tracking
-   Mock-test tracking
-   Performance analytics
-   PWA/offline support
-   Installable mobile experience
-   Optional cloud synchronization
-   Notification support

These are **future ideas, not currently implemented features**.

------------------------------------------------------------------------

## 🤝 Contributing

Ideas, improvements, accessibility feedback, and UI suggestions are
welcome.

A typical contribution workflow:

``` bash
git checkout -b feature/your-feature
# make your changes
git add .
git commit -m "feat: describe your change"
git push origin feature/your-feature
```

Then open a pull request.

------------------------------------------------------------------------

## 📜 License

If you intend to publish this project under an open-source license, add
the license that matches your intended usage before distributing the
repository.

------------------------------------------------------------------------

## 👤 Author

**Akshat Sahu**

GitHub: **[@Akshattron](https://github.com/Akshattron)**

Project repository:
**[Akshattron/gate-countdown](https://github.com/Akshattron/gate-countdown)**

------------------------------------------------------------------------

## 🏆 GitHub Copilot Day

This project was created as a GitHub Copilot Day project using the
**GitHub Copilot app**.

The project demonstrates how an idea can be taken from a concise product
concept to a working, tested, GitHub-hosted web application through an
agent-assisted development workflow.

------------------------------------------------------------------------

```{=html}
<p align="center">
```
`<em>`{=html}Your preparation. One deadline.`</em>`{=html}
```{=html}
</p>
```
