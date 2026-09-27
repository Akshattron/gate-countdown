import React from 'react';
import { Moon, Sun } from 'lucide-react';

export function Brand() {
  return (
    <a className="brand" href="/" aria-label="GATE Countdown home">
      <span className="brand-mark">G</span>
      <span>GATE<span className="slash">//</span>COUNTDOWN</span>
    </a>
  );
}

export function ThemeToggle({ darkMode, onToggle }) {
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {darkMode ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
