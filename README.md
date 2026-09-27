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
and a personalized, account-synced GATE 2027 CS/IT syllabus tracker.

Countdown and theme preferences remain local to the browser. Syllabus
completion is stored per authenticated account in Supabase.

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

### 📈 GATE Syllabus Tracker

-   Tracks the supplied 10-section, 134-topic GATE 2027 CS/IT syllabus
-   Opens as coordinated section and topic drawers
-   Calculates section and cumulative progress from the centralized
    syllabus catalog
-   Saves topic completion to the signed-in user's Supabase account
-   Uses Google OAuth and database row-level security for account-scoped
    progress

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

### ⚡ Lightweight Frontend with Secure Sync

-   React and Vite frontend with Supabase Auth and Postgres persistence
-   Browser `localStorage` is limited to countdown and theme preferences
-   Row-level security policies isolate each user's syllabus progress
-   No service-role credential is used in the browser

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
-   **Supabase Auth and Postgres** --- Google sign-in and account-scoped
    topic completion
-   **Web Storage API (`localStorage`)** --- countdown and theme
    preferences only

The frontend stays lightweight while Supabase handles identity and
secure progress persistence.

------------------------------------------------------------------------

## 📂 Project Structure

``` text
gate-countdown/
├── public/
│   └── favicon.svg
├── src/
│   ├── ErrorBoundary.jsx
│   ├── SyllabusTracker.jsx
│   ├── main.jsx
│   ├── supabase.js
│   ├── syllabus.js
│   ├── syllabus.test.js
│   ├── styles.css
│   └── topbar.jsx
├── supabase/
│   └── migrations/
│       └── 20260927000000_create_topic_completions.sql
├── .env.example
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

### 1. Configure Supabase

Create a Supabase project, enable Google under **Authentication →
Providers** with the Google OAuth client credentials, and add Supabase's
callback URL (`https://<project-ref>.supabase.co/auth/v1/callback`) to
the allowed redirect URIs in Google Cloud. Configure the site's local
and deployed URLs under **Authentication → URL Configuration**. Apply the migration in
`supabase/migrations/20260927000000_create_topic_completions.sql` using
the Supabase SQL editor or Supabase CLI. The migration enables RLS and
allows authenticated users to access only their own completion rows.

Create a local `.env` file from `.env.example` and set the public project
URL and anon/publishable key:

``` text
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

These frontend values are public by design; database access is protected
by Supabase Auth and RLS. Never put a Supabase service-role key in a
`VITE_` variable or commit real credentials.

### 2. Clone the repository

``` bash
git clone https://github.com/Akshattron/gate-countdown.git
cd gate-countdown
```

### 3. Install dependencies

``` bash
npm install
```

### 4. Start the development server

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

GATE//COUNTDOWN is designed for static hosting with Supabase providing
authentication and database access.

### Vercel

The project includes deployment configuration suitable for Vercel.

Recommended settings:

``` text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Root Directory: ./
```

Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the hosting
provider before building. Add the deployed site's URL to Supabase's
authentication redirect allow list.

The application can also be deployed to other static hosts that support
Vite's production output.

------------------------------------------------------------------------

## 🔐 Data & Privacy

Countdown date/time and theme settings are kept in browser `localStorage`.
Syllabus progress is stored in Supabase and associated with the signed-in
user.

User-configurable preferences such as:

-   examination date
-   examination time
-   theme preference

are stored locally in the browser using `localStorage`.

Clearing browser storage resets those preferences but does not delete
account progress. Topic completion is read and written through
authenticated Supabase requests protected by row-level security. Signing
out clears progress from the active interface; another account receives
only its own rows.

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

Run the catalog and progress unit tests and production build with:

``` text
npm test
npm run build
```

Because the project uses esbuild's classic JSX transform, every `.jsx`
file must `import React from 'react'`. A missing import builds cleanly
but fails at runtime, so always load the app in a browser after adding a
component.

The syllabus tracker is wrapped in an error boundary, and the Supabase
client is created defensively. If Supabase environment variables are
absent or the client cannot be created, the countdown still renders and
the tracker shows a "Setup needed" state instead of a blank page.

OAuth and database flows require a configured Supabase project and Google
provider credentials.

------------------------------------------------------------------------

## 🔮 Future Scope

GATE//COUNTDOWN intentionally keeps its current scope small. Potential
future additions include:

-   Pomodoro study sessions
-   Study streaks
-   Daily study goals
-   Revision tracking
-   Previous-year-question (PYQ) tracking
-   Mock-test tracking
-   Performance analytics
-   PWA/offline support
-   Installable mobile experience
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
