import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  BookOpen,
  Boxes,
  Braces,
  Check,
  ChevronLeft,
  ChevronRight,
  CircuitBoard,
  Code2,
  Database,
  DoorOpen,
  GitBranch,
  Layers3,
  LockKeyhole,
  Network,
  Sigma,
  X,
} from 'lucide-react';
import { getOverallProgress, getSectionProgress, syllabus } from './syllabus.js';
import { supabase, supabaseConfigured, hasPendingSession } from './supabase.js';
import { Brand, ThemeToggle } from './topbar.jsx';

const sectionIcons = [
  Sigma,
  CircuitBoard,
  Boxes,
  Code2,
  GitBranch,  Braces,
  Layers3,
  LockKeyhole,
  Database,
  Network,
];

function getTrackerPortalHost() {
  if (typeof document === 'undefined') return null;
  let host = document.getElementById('tracker-portal-host');
  if (!host) {
    host = document.createElement('div');
    host.id = 'tracker-portal-host';
    document.body.insertBefore(host, document.body.firstChild);
  }
  return host;
}

const SECTION_SWAP_EXIT_MS = 170;

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;
}

function percentageLabel(value) {
  return `${value.toFixed(2).replace(/\.?0+$/, '')}%`;
}

function ProgressTrack({ percentage, label }) {
  return (
    <div
      className="syllabus-progress-track"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Number(percentage.toFixed(2))}
    >
      <span className="syllabus-progress-fill" style={{ width: `${percentage}%` }} />
    </div>
  );
}

export default function SyllabusTracker({ darkMode, onToggleTheme }) {
  const [user, setUser] = useState(null);
  const [authStatus, setAuthStatus] = useState(supabaseConfigured ? 'loading' : 'unconfigured');
  const [authBusy, setAuthBusy] = useState(false);
  const [sessionPending] = useState(() => hasPendingSession());
  const [completedTopicIds, setCompletedTopicIds] = useState(() => new Set());
  const [pendingTopicIds, setPendingTopicIds] = useState(() => new Set());
  const [progressLoading, setProgressLoading] = useState(false);
  const [trackerError, setTrackerError] = useState('');
  const [sectionsOpen, setSectionsOpen] = useState(false);
  const [topicsOpen, setTopicsOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [displayedSectionId, setDisplayedSectionId] = useState(null);
  const [contentPhase, setContentPhase] = useState('idle');
  const [slideDirection, setSlideDirection] = useState('down');
  const menuButtonRef = useRef(null);
  const menuSlotRef = useRef(null);
  const [menuAnchor, setMenuAnchor] = useState({ top: 29, left: 28 });
  const overlayRef = useRef(null);
  const topicsDrawerRef = useRef(null);
  const sectionButtonRefs = useRef(new Map());
  const userIdRef = useRef(null);
  const overlayWasOpenRef = useRef(false);
  const activeSectionIdRef = useRef(null);

  const displayedSection = syllabus.find((section) => section.id === displayedSectionId);
  const overallProgress = useMemo(() => getOverallProgress(completedTopicIds), [completedTopicIds]);
  const overlayOpen = sectionsOpen || topicsOpen;

  userIdRef.current = user?.id ?? null;

  useEffect(() => {
    if (!supabase) return undefined;

    let mounted = true;
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      const nextUser = session?.user ?? null;
      if (userIdRef.current !== (nextUser?.id ?? null)) {
        userIdRef.current = nextUser?.id ?? null;
        setCompletedTopicIds(new Set());
        setPendingTopicIds(new Set());
      }
      setUser(nextUser);
      setAuthStatus(nextUser ? 'signed-in' : 'signed-out');
      setTrackerError('');
    });

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;
      if (error) {
        setTrackerError(`Could not restore your session: ${error.message}`);
        setAuthStatus('signed-out');
        return;
      }
      const nextUser = data.session?.user ?? null;
      userIdRef.current = nextUser?.id ?? null;
      setCompletedTopicIds(new Set());
      setPendingTopicIds(new Set());
      setUser(nextUser);
      setAuthStatus(nextUser ? 'signed-in' : 'signed-out');
    }).catch((error) => {
      if (!mounted) return;
      setTrackerError(`Could not restore your session: ${error.message}`);
      setAuthStatus('signed-out');
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user || !supabase) {
      setCompletedTopicIds(new Set());
      setProgressLoading(false);
      return undefined;
    }

    let cancelled = false;
    const currentUserId = user.id;
    setProgressLoading(true);
    setTrackerError('');
    supabase
      .from('topic_completions')
      .select('topic_id')
      .then(({ data, error }) => {
        if (cancelled || userIdRef.current !== currentUserId) return;
        if (error) {
          setTrackerError(`Could not load your syllabus progress: ${error.message}`);
          return;
        }
        const knownTopicIds = new Set(syllabus.flatMap((section) => section.topics.map((topic) => topic.id)));
        setCompletedTopicIds(new Set((data ?? []).map((row) => row.topic_id).filter((id) => knownTopicIds.has(id))));
      })
      .catch((error) => {
        if (!cancelled && userIdRef.current === currentUserId) {
          setTrackerError(`Could not load your syllabus progress: ${error.message}`);
        }
      })
      .finally(() => {
        if (!cancelled && userIdRef.current === currentUserId) setProgressLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (!overlayOpen) {
      if (overlayWasOpenRef.current) menuButtonRef.current?.focus();
      overlayWasOpenRef.current = false;
      document.body.style.overflow = '';
      return undefined;
    }

    overlayWasOpenRef.current = true;
    document.body.style.overflow = 'hidden';
    const appRoot = document.getElementById('root');
    const wasInert = appRoot?.inert ?? false;
    if (appRoot) appRoot.inert = true;
    const focusTarget = topicsOpen
      ? overlayRef.current?.querySelector('.topics-drawer .drawer-close')
      : menuButtonRef.current;
    focusTarget?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (topicsOpen) setTopicsOpen(false);
        else setSectionsOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = [
        menuButtonRef.current,
        ...Array.from(
          overlayRef.current?.querySelectorAll(
            'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
          ) ?? []
        ),
      ].filter((element) => element && element.getClientRects().length > 0);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const withinTrap = focusable.includes(document.activeElement);
      if (event.shiftKey && (document.activeElement === first || !withinTrap)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !withinTrap)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      if (appRoot) appRoot.inert = wasInert;
    };
  }, [overlayOpen, sectionsOpen, topicsOpen]);

  useEffect(() => {
    if (!sectionsOpen || topicsOpen || !activeSectionId) return;
    requestAnimationFrame(() => sectionButtonRefs.current.get(activeSectionId)?.focus());
  }, [sectionsOpen, topicsOpen, activeSectionId]);

  activeSectionIdRef.current = activeSectionId;

  useEffect(() => {
    const slot = menuSlotRef.current;
    if (!slot) return undefined;
    const sync = () => {
      const rect = slot.getBoundingClientRect();
      setMenuAnchor((current) =>
        current.top === rect.top && current.left === rect.left ? current : { top: rect.top, left: rect.left },
      );
    };
    sync();
    window.addEventListener('resize', sync);
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(sync) : null;
    observer?.observe(document.documentElement);
    return () => {
      window.removeEventListener('resize', sync);
      observer?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (contentPhase !== 'exiting') return undefined;
    const timer = setTimeout(() => {
      setDisplayedSectionId(activeSectionIdRef.current);
      if (topicsDrawerRef.current) topicsDrawerRef.current.scrollTop = 0;
      setContentPhase('entering');
    }, SECTION_SWAP_EXIT_MS);
    return () => clearTimeout(timer);
  }, [contentPhase]);

  useEffect(() => {
    if (contentPhase !== 'entering') return undefined;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setContentPhase('idle'));
    });
    return () => {
      cancelAnimationFrame(outer);
      if (inner) cancelAnimationFrame(inner);
    };
  }, [contentPhase]);

  const signIn = async () => {
    if (!supabase) return;
    setAuthBusy(true);
    setTrackerError('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
      if (error) {
        setTrackerError(`Google sign-in could not start: ${error.message}`);
        setAuthBusy(false);
      }
    } catch (error) {
      setTrackerError(`Google sign-in could not start: ${error.message}`);
      setAuthBusy(false);
    }
  };

  const signOut = async () => {
    if (!supabase) return;
    setAuthBusy(true);
    setTrackerError('');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) setTrackerError(`Could not sign out: ${error.message}`);
    } catch (error) {
      setTrackerError(`Could not sign out: ${error.message}`);
    } finally {
      setAuthBusy(false);
    }
  };

  const toggleTopic = async (topicId) => {
    if (!user || !supabase || pendingTopicIds.has(topicId)) return;

    const currentUserId = user.id;
    const wasCompleted = completedTopicIds.has(topicId);
    setTrackerError('');
    setPendingTopicIds((pending) => new Set(pending).add(topicId));
    setCompletedTopicIds((current) => {
      const next = new Set(current);
      if (wasCompleted) next.delete(topicId);
      else next.add(topicId);
      return next;
    });

    let error;
    try {
      const result = wasCompleted
        ? await supabase.from('topic_completions').delete().eq('user_id', currentUserId).eq('topic_id', topicId)
        : await supabase.from('topic_completions').insert({ user_id: currentUserId, topic_id: topicId });
      error = result.error;
    } catch (requestError) {
      error = requestError;
    }

    if (userIdRef.current === currentUserId) {
      if (error) {
        setCompletedTopicIds((current) => {
          const next = new Set(current);
          if (wasCompleted) next.add(topicId);
          else next.delete(topicId);
          return next;
        });
        setTrackerError(`Could not save topic progress: ${error.message}`);
      }
      setPendingTopicIds((pending) => {
        const next = new Set(pending);
        next.delete(topicId);
        return next;
      });
    }
  };

  const openTopics = (sectionId) => {
    setTrackerError('');
    if (!topicsOpen || displayedSectionId === null || displayedSectionId === sectionId) {
      setActiveSectionId(sectionId);
      setDisplayedSectionId(sectionId);
      setContentPhase('idle');
      setTopicsOpen(true);
      return;
    }
    const fromIndex = syllabus.findIndex((section) => section.id === activeSectionId);
    const toIndex = syllabus.findIndex((section) => section.id === sectionId);
    setSlideDirection(toIndex > fromIndex ? 'down' : 'up');
    setActiveSectionId(sectionId);
    if (prefersReducedMotion()) {
      setDisplayedSectionId(sectionId);
      setContentPhase('idle');
      if (topicsDrawerRef.current) topicsDrawerRef.current.scrollTop = 0;
      return;
    }
    setContentPhase('exiting');
  };

  const closeTopics = () => {
    setTopicsOpen(false);
    if (sectionsOpen && activeSectionId) {
      requestAnimationFrame(() => sectionButtonRefs.current.get(activeSectionId)?.focus());
    }
  };

  return (
    <>
      <span className="tracker-menu-slot" ref={menuSlotRef} aria-hidden="true" />
      <Brand />
      <div className="nav-actions">
        <div className="tracker-nav">
          <button
            className="syllabus-summary"
            onClick={() => setSectionsOpen(true)}
            aria-label={`Syllabus progress ${percentageLabel(overallProgress.percentage)}. Open syllabus tracker.`}
          >
            <span className="summary-label">Syllabus Progress</span>
            <span className="summary-value">{percentageLabel(overallProgress.percentage)}</span>
          </button>
          {user ? (
            <button className="account-button" onClick={signOut} disabled={authBusy} aria-label="Sign out">
              <DoorOpen size={16} />
              <span>{authBusy ? 'Signing out' : 'Sign out'}</span>
            </button>
          ) : authStatus === 'loading' && sessionPending ? (
            <button className="account-button is-resolving" disabled aria-live="polite" aria-label="Restoring your session">
              <DoorOpen size={16} />
              <span>Restoring</span>
            </button>
          ) : (
            <button
              className="account-button"
              onClick={signIn}
              disabled={!supabaseConfigured || authBusy || authStatus === 'loading'}
              title={!supabaseConfigured ? 'Add Supabase environment variables to enable sign-in' : undefined}
            >
              <LockKeyhole size={15} />
              <span>
                {!supabaseConfigured ? 'Setup needed' : authBusy ? 'Connecting' : authStatus === 'loading' ? 'Checking' : 'Sign in'}
              </span>
            </button>
          )}
        </div>
        <ThemeToggle darkMode={darkMode} onToggle={onToggleTheme} />
      </div>

      {createPortal(
      <>
      <button
        ref={menuButtonRef}
        className={`tracker-menu-button${sectionsOpen ? ' is-active' : ''}`}
        style={{ top: `${menuAnchor.top}px`, left: `${menuAnchor.left}px`, '--menu-left': `${menuAnchor.left}px` }}
        onClick={() => setSectionsOpen((open) => !open)}
        aria-label={sectionsOpen ? 'Close syllabus sections' : 'Open syllabus sections'}
        aria-expanded={sectionsOpen}
        aria-controls="sections-drawer"
      >
        <span /><span />
      </button>
      <div className={`tracker-overlay${overlayOpen ? ' is-open' : ''}`} ref={overlayRef} aria-hidden={!overlayOpen}>
        <button
          className="tracker-backdrop"
          tabIndex={overlayOpen ? 0 : -1}
          onClick={() => {
            setTopicsOpen(false);
            setSectionsOpen(false);
          }}
          aria-label="Close syllabus tracker"
        />
        <aside
          id="sections-drawer"
          className={`tracker-drawer sections-drawer${sectionsOpen ? ' is-open' : ''}`}
          aria-label="GATE syllabus sections"
          aria-hidden={!sectionsOpen}
        >
          <div className="drawer-heading">
            <div>
              <span className="drawer-kicker">GATE 2027 · CS/IT</span>
              <h2>Your syllabus</h2>
            </div>
          </div>
          <p className="drawer-intro">A steady record of the ground you’ve covered.</p>
          {trackerError && <p className="tracker-error" role="alert">{trackerError}</p>}
          {!user && (
            <div className="tracker-auth-note">
              <LockKeyhole size={16} />
              <span>
                {supabaseConfigured
                  ? 'Sign in with Google to save progress to your account.'
                  : 'Add Supabase project settings to enable secure sign-in and saved progress.'}
              </span>
            </div>
          )}
          <div className="section-list" aria-label="Syllabus sections">
            {syllabus.map((section, index) => {
              const Icon = sectionIcons[index];
              const progress = getSectionProgress(section, completedTopicIds);
              return (
                <button
                  key={section.id}
                  ref={(element) => {
                    if (element) sectionButtonRefs.current.set(section.id, element);
                    else sectionButtonRefs.current.delete(section.id);
                  }}
                  className={`section-link${activeSectionId === section.id ? ' is-selected' : ''}`}
                  onClick={() => openTopics(section.id)}
                  tabIndex={sectionsOpen ? 0 : -1}
                  aria-label={`${section.name}, ${percentageLabel(progress.percentage)} complete`}
                >
                  <span className="section-icon"><Icon size={18} strokeWidth={1.7} /></span>
                  <span className="section-copy">
                    <span className="section-title">{section.name}</span>
                    <span className="section-progress-line">
                      <ProgressTrack percentage={progress.percentage} label={`${section.name} progress`} />
                      <span>{percentageLabel(progress.percentage)}</span>
                    </span>
                  </span>
                  <ChevronRight className="section-chevron" size={16} />
                </button>
              );
            })}
          </div>
          <div className="drawer-overall">
            <div className="overall-meta">
              <span>OVERALL PROGRESS</span>
              <strong>{percentageLabel(overallProgress.percentage)}</strong>
            </div>
            <ProgressTrack percentage={overallProgress.percentage} label="Overall syllabus progress" />
            <span className="overall-count">{overallProgress.completedCount} of {overallProgress.totalCount} topics</span>
          </div>
        </aside>

        <aside
          ref={topicsDrawerRef}
          className={`tracker-drawer topics-drawer${topicsOpen ? ' is-open' : ''}`}
          aria-labelledby="topics-heading"
          aria-hidden={!topicsOpen}
        >
          {displayedSection && (() => {
            const sectionProgress = getSectionProgress(displayedSection, completedTopicIds);
            const Icon = sectionIcons[syllabus.indexOf(displayedSection)];
            const phaseClass = contentPhase === 'idle' ? '' : ` is-${contentPhase} dir-${slideDirection}`;
            return (
              <>
                <div className="drawer-heading topic-heading">
                  <button className="drawer-back" onClick={closeTopics} aria-label="Back to sections">
                    <ChevronLeft size={17} /> Sections
                  </button>
                  <button className="drawer-close" onClick={closeTopics} aria-label="Close topics">
                    <X size={18} />
                  </button>
                </div>
                <div className={`topic-content${phaseClass}`}>
                  <div className="topic-title-line">
                    <span className="section-icon"><Icon size={18} strokeWidth={1.7} /></span>
                    <div>
                      <span className="drawer-kicker">SECTION PROGRESS</span>
                      <h2 id="topics-heading">{displayedSection.name}</h2>
                    </div>
                  </div>
                <div className="topic-progress-summary">
                  <div className="overall-meta">
                    <span>{sectionProgress.completedCount} OF {sectionProgress.totalCount} TOPICS</span>
                    <strong>{percentageLabel(sectionProgress.percentage)}</strong>
                  </div>
                  <ProgressTrack percentage={sectionProgress.percentage} label={`${displayedSection.name} progress`} />
                </div>
                {!user && (
                  <div className="tracker-auth-note topic-auth-note">
                    <LockKeyhole size={16} />
                    <span>Sign in with Google to mark topics complete and keep your progress synced.</span>
                  </div>
                )}
                {trackerError && <p className="tracker-error" role="alert">{trackerError}</p>}
                {progressLoading && <p className="progress-loading" role="status">Loading your saved progress…</p>}
                <div className="topic-list" aria-label={`${displayedSection.name} topics`}>
                  {displayedSection.topics.map((topic) => {
                    const checked = completedTopicIds.has(topic.id);
                    const pending = pendingTopicIds.has(topic.id);
                    return (
                      <button
                        key={topic.id}
                        className={`topic-item${checked ? ' is-complete' : ''}`}
                        role="checkbox"
                        aria-checked={checked}
                        aria-label={topic.name}
                        disabled={!user || progressLoading || pending}
                        onClick={() => toggleTopic(topic.id)}
                        tabIndex={topicsOpen ? 0 : -1}
                      >
                        <span className="topic-check" aria-hidden="true">{checked && <Check size={13} strokeWidth={2.5} />}</span>
                        <span className="topic-name">{topic.name}</span>
                        {pending && <span className="topic-saving" aria-label="Saving" />}
                      </button>
                    );
                  })}
                </div>
                <div className="topics-footer">
                  <BookOpen size={16} />
                  <span>One topic at a time. Keep moving.</span>
                </div>
                </div>
              </>
            );
          })()}
        </aside>
      </div>
      </>,
      getTrackerPortalHost()
      )}
    </>
  );
}
