import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CalendarDays, Check, ChevronDown, Clock3, Moon, Pause, Play, RotateCcw, Sun, Target } from 'lucide-react';
import './styles.css';

const STORAGE_KEY = 'gate-countdown-settings';
const DEFAULT_DATE = '2027-02-06';
const PREVIOUS_DEFAULT_DATE = '2027-06-15';
const DEFAULT_TIME = '09:00';

const pad = (value) => String(value).padStart(2, '0');
const getTarget = (date, time) => new Date(`${date}T${time}:00`);
const formatDate = (date) =>
  new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(date);

function getRemaining(target) {
  const total = Math.max(0, target.getTime() - Date.now());
  return {
    total,
    days: Math.floor(total / 86400000),
    hours: Math.floor((total / 3600000) % 24),
    minutes: Math.floor((total / 60000) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}

function App() {
  const saved = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }, []);
  const [date, setDate] = useState(
    saved.date === PREVIOUS_DEFAULT_DATE ? DEFAULT_DATE : saved.date || DEFAULT_DATE
  );
  const [time, setTime] = useState(saved.time || DEFAULT_TIME);
  const [now, setNow] = useState(Date.now());
  const [darkMode, setDarkMode] = useState(saved.darkMode || false);
  const [paused, setPaused] = useState(false);
  const [pausedRemaining, setPausedRemaining] = useState(null);
  const [editing, setEditing] = useState(false);

  const target = getTarget(date, time);
  const remaining = paused && pausedRemaining ? pausedRemaining : getRemaining(target);
  const hasStarted = remaining.total === 0;
  const startTarget = new Date('2026-01-01T00:00:00');
  const totalDuration = Math.max(target.getTime() - startTarget.getTime(), 1);
  const progress = Math.min(100, Math.max(0, ((Date.now() - startTarget.getTime()) / totalDuration) * 100));

  useEffect(() => {
    if (paused) return undefined;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [paused]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date, time, darkMode }));
  }, [date, time, darkMode]);

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  const units = [
    ['days', remaining.days, 'Days'],
    ['hours', remaining.hours, 'Hours'],
    ['minutes', remaining.minutes, 'Minutes'],
    ['seconds', remaining.seconds, 'Seconds'],
  ];

  const reset = () => {
    setDate(DEFAULT_DATE);
    setTime(DEFAULT_TIME);
    setPaused(false);
    setPausedRemaining(null);
  };

  const togglePaused = () => {
    if (paused) {
      setPaused(false);
      setPausedRemaining(null);
      setNow(Date.now());
    } else {
      setPausedRemaining(getRemaining(target));
      setPaused(true);
    }
  };

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <nav className="topbar" aria-label="Main navigation">
        <a className="brand" href="/" aria-label="GATE Countdown home">
          <span className="brand-mark">G</span>
          <span>GATE<span className="slash">//</span>COUNTDOWN</span>
        </a>
        <div className="nav-actions">
          <span className="status-pill"><span className="status-dot" /> Personal countdown</span>
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)} aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}>
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </nav>

      <section className="hero">
        <div className="eyebrow"><span>THE GATE IS OPENING</span><i /></div>
        <h1>Your next chapter<br /><em>starts soon.</em></h1>
        <p className="hero-copy">A little reminder that every day counts.<br />Stay focused. Keep moving.</p>

        <div className="countdown-card">
          <div className="card-topline">
            <div>
              <span className="label">COUNTING DOWN TO</span>
              <strong>{formatDate(target)}</strong>
            </div>
            <button className="edit-button" onClick={() => setEditing(!editing)}>
              <CalendarDays size={15} /> {editing ? 'Close' : 'Edit date'}
            </button>
          </div>
          {editing && (
            <div className="edit-panel">
              <label>Target date<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
              <label>Time<input type="time" value={time} onChange={(event) => setTime(event.target.value)} /></label>
              <button className="reset-button" onClick={reset}><RotateCcw size={14} /> Reset</button>
            </div>
          )}
          <div className="time-grid" aria-live="polite" aria-label={`${remaining.days} days, ${remaining.hours} hours, ${remaining.minutes} minutes, ${remaining.seconds} seconds remaining`}>
            {units.map(([key, value, label]) => (
              <React.Fragment key={key}>
                <div className="time-unit"><span className="time-value">{pad(value)}</span><span className="time-label">{label}</span></div>
                {key !== 'seconds' && <span className="colon">:</span>}
              </React.Fragment>
            ))}
          </div>
          <div className="card-footer">
            <div className="progress-wrap">
              <div className="progress-meta"><span>THE JOURNEY SO FAR</span><span>{Math.round(progress)}%</span></div>
              <div className="progress-track"><div className="progress-bar" style={{ width: `${progress}%` }} /></div>
            </div>
            <button className="pause-button" onClick={togglePaused} aria-label={paused ? 'Resume countdown' : 'Pause countdown'}>
              {paused ? <Play size={15} fill="currentColor" /> : <Pause size={15} fill="currentColor" />} {paused ? 'Resume' : 'Pause'}
            </button>
          </div>
        </div>

        <div className="motivation">
          <div className="motivation-icon"><Target size={19} /></div>
          <div><span className="label">TODAY'S REMINDER</span><p>Small steps still move you forward.</p></div>
          <div className="sparkle">✦</div>
        </div>

        <div className="feature-row">
          <div><Clock3 size={18} /><span><b>Always in sync</b><small>Your countdown updates every second.</small></span></div>
          <div><Check size={18} /><span><b>Made for momentum</b><small>Save this page and keep it close.</small></span></div>
        </div>
      </section>
      <footer><span>GATE<span className="slash">//</span>COUNTDOWN</span><span>ONE DAY AT A TIME <b>·</b> {new Date().getFullYear()}</span></footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
