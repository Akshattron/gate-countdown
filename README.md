# GATE//COUNTDOWN

A focused, responsive countdown landing page for the next big chapter. Built with React and Vite, with a premium peach light theme and a warm dark mode.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with `npm run build`, then preview it with `npm run preview`.

## Features

- Live days, hours, minutes, and seconds countdown
- Editable target date and time, persisted in `localStorage`
- Light and dark themes, persisted between visits
- Progress indicator, pause/resume, reset, and motivational reminder
- Responsive layout with accessible labels and live countdown announcements
- Vercel SPA rewrite configuration included in `vercel.json`

## Deployment

Import the repository into Vercel (or another static host), use `npm run build` as the build command, and `dist` as the output directory. No environment variables are required.
