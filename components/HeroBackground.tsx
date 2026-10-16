'use client';

// ==============================================================================
// ASCEND - HERO BACKGROUND
// Premium futuristic RPG-inspired animated background
// Mobile-first (360-430px), fully responsive, no horizontal overflow
// ==============================================================================

import React, { useEffect, useRef, useMemo } from 'react';
import '@/app/hero-background.css';

// ─── Deterministic pseudo-random for SSR-safe particle generation ────────────
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ─── Types ───────────────────────────────────────────────────────────────────
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  drift: number;
}

interface Crystal {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  hue: number;
  duration: number;
  delay: number;
}

interface Orb {
  id: number;
  cx: number;
  cy: number;
  r: number;
  color: string;
  duration: number;
  delay: number;
}

// ─── Quest Path (SVG energy trail) ──────────────────────────────────────────
function QuestPath() {
  return (
    <svg
      className="hero-bg__quest-path"
      viewBox="0 0 430 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* Main flowing energy path */}
      <path
        d="M -20 200 Q 120 180, 200 280 T 380 350 Q 450 400, 350 500 T 100 650 Q 30 700, 150 780 T 450 850"
        stroke="url(#questGradient)"
        strokeWidth="1.5"
        strokeDasharray="8 12"
        fill="none"
        className="hero-bg__quest-stroke"
      />
      {/* Secondary wisp */}
      <path
        d="M 430 100 Q 300 150, 250 220 T 50 350 Q -20 400, 80 480"
        stroke="url(#questGradient2)"
        strokeWidth="1"
        strokeDasharray="6 16"
        fill="none"
        className="hero-bg__quest-stroke hero-bg__quest-stroke--secondary"
      />
      {/* Diamond waypoint markers */}
      <g className="hero-bg__waypoints">
        <rect x="195" y="275" width="10" height="10" rx="2" transform="rotate(45 200 280)" fill="#7C3AED" fillOpacity="0.25" />
        <rect x="345" y="345" width="8" height="8" rx="2" transform="rotate(45 349 349)" fill="#38BDF8" fillOpacity="0.2" />
        <rect x="95" y="645" width="10" height="10" rx="2" transform="rotate(45 100 650)" fill="#7C3AED" fillOpacity="0.2" />
        <rect x="145" y="775" width="8" height="8" rx="2" transform="rotate(45 149 779)" fill="#38BDF8" fillOpacity="0.15" />
      </g>
      <defs>
        <linearGradient id="questGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#C084FC" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="questGradient2" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── Floating Island (SVG decoration) ────────────────────────────────────────
function FloatingIsland({ className, flip }: { className?: string; flip?: boolean }) {
  return (
    <svg
      className={`hero-bg__island ${className || ''}`}
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      {/* Rock base */}
      <path
        d="M20 45 Q30 30, 60 28 Q90 26, 100 45 Q95 65, 70 70 Q40 72, 25 60 Z"
        fill="url(#islandGrad)"
        fillOpacity="0.6"
      />
      {/* Grass top */}
      <path
        d="M25 45 Q35 35, 60 33 Q85 31, 95 45"
        stroke="#86EFAC"
        strokeWidth="2"
        strokeOpacity="0.3"
        fill="none"
      />
      {/* Crystal tower */}
      <path d="M55 28 L60 8 L65 28" fill="#C084FC" fillOpacity="0.5" />
      <path d="M58 28 L60 14 L62 28" fill="#E9D5FF" fillOpacity="0.6" />
      {/* Small tree */}
      <circle cx="40" cy="35" r="6" fill="#86EFAC" fillOpacity="0.3" />
      <line x1="40" y1="41" x2="40" y2="47" stroke="#86EFAC" strokeWidth="1.5" strokeOpacity="0.3" />
      <defs>
        <linearGradient id="islandGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#DDD6FE" />
          <stop offset="100%" stopColor="#C4B5FD" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function HeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate particles, crystals, and orbs with deterministic seeded random
  const { particles, crystals, orbs } = useMemo(() => {
    const rand = seededRandom(42);

    const _particles: Particle[] = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: rand() * 100,
      y: rand() * 100,
      size: 2 + rand() * 3,
      opacity: 0.15 + rand() * 0.35,
      duration: 12 + rand() * 18,
      delay: rand() * 10,
      drift: -15 + rand() * 30,
    }));

    const _crystals: Crystal[] = [
      // Top-left cluster
      { id: 0, x: 3, y: 8, size: 18, rotation: 20, hue: 270, duration: 16, delay: 0 },
      { id: 1, x: 8, y: 3, size: 12, rotation: -15, hue: 280, duration: 20, delay: 2 },
      // Top-right cluster
      { id: 2, x: 88, y: 5, size: 16, rotation: -25, hue: 200, duration: 18, delay: 1 },
      { id: 3, x: 94, y: 12, size: 10, rotation: 30, hue: 260, duration: 22, delay: 3 },
      // Bottom-left
      { id: 4, x: 5, y: 70, size: 14, rotation: 10, hue: 290, duration: 17, delay: 4 },
      // Bottom-right
      { id: 5, x: 92, y: 65, size: 12, rotation: -20, hue: 210, duration: 19, delay: 2.5 },
    ];

    const _orbs: Orb[] = [
      { id: 0, cx: 10, cy: 15, r: 28, color: 'rgba(192, 132, 252, 0.12)', duration: 20, delay: 0 },
      { id: 1, cx: 90, cy: 8, r: 35, color: 'rgba(56, 189, 248, 0.10)', duration: 25, delay: 3 },
      { id: 2, cx: 85, cy: 55, r: 22, color: 'rgba(249, 168, 212, 0.10)', duration: 18, delay: 5 },
      { id: 3, cx: 15, cy: 75, r: 30, color: 'rgba(124, 58, 237, 0.08)', duration: 22, delay: 1 },
      { id: 4, cx: 50, cy: 90, r: 40, color: 'rgba(192, 132, 252, 0.06)', duration: 28, delay: 7 },
    ];

    return { particles: _particles, crystals: _crystals, orbs: _orbs };
  }, []);

  // Pause animations if reduced motion preferred
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const el = containerRef.current;
    if (!el) return;

    const applyPref = (reduced: boolean) => {
      el.style.setProperty('--hero-bg-play', reduced ? 'paused' : 'running');
    };
    applyPref(mq.matches);

    const handler = (e: MediaQueryListEvent) => applyPref(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div
      ref={containerRef}
      className="hero-bg"
      aria-hidden="true"
      style={{ '--hero-bg-play': 'running' } as React.CSSProperties}
    >
      {/* ── Gradient backdrop ──────────────────────────────────────────── */}
      <div className="hero-bg__gradient" />

      {/* ── Soft glow orbs ─────────────────────────────────────────────── */}
      {orbs.map((orb) => (
        <div
          key={`orb-${orb.id}`}
          className="hero-bg__orb"
          style={{
            left: `${orb.cx}%`,
            top: `${orb.cy}%`,
            width: `${orb.r * 2}px`,
            height: `${orb.r * 2}px`,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            animationDuration: `${orb.duration}s`,
            animationDelay: `${orb.delay}s`,
          }}
        />
      ))}

      {/* ── Quest energy path ──────────────────────────────────────────── */}
      <QuestPath />

      {/* ── Floating islands ───────────────────────────────────────────── */}
      <FloatingIsland className="hero-bg__island--tl" />
      <FloatingIsland className="hero-bg__island--tr" flip />
      <FloatingIsland className="hero-bg__island--bl" />

      {/* ── Glowing crystals ───────────────────────────────────────────── */}
      {crystals.map((c) => (
        <div
          key={`crystal-${c.id}`}
          className="hero-bg__crystal"
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            width: `${c.size}px`,
            height: `${c.size * 1.6}px`,
            '--crystal-hue': `${c.hue}`,
            '--crystal-rotate': `${c.rotation}deg`,
            animationDuration: `${c.duration}s`,
            animationDelay: `${c.delay}s`,
          } as React.CSSProperties}
        >
          <svg viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6 0 L12 12 L6 20 L0 12 Z"
              fill={`hsla(${c.hue}, 70%, 70%, 0.55)`}
            />
            <path
              d="M6 0 L9 10 L6 20"
              fill={`hsla(${c.hue}, 80%, 85%, 0.4)`}
            />
          </svg>
        </div>
      ))}

      {/* ── Floating particles / stars ─────────────────────────────────── */}
      {particles.map((p) => (
        <div
          key={`particle-${p.id}`}
          className="hero-bg__particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            '--particle-drift': `${p.drift}px`,
          } as React.CSSProperties}
        />
      ))}

      {/* ── Star sparkles (4-point) ────────────────────────────────────── */}
      {[
        { x: 18, y: 22, s: 10, d: 6 },
        { x: 78, y: 10, s: 12, d: 8 },
        { x: 90, y: 40, s: 8, d: 5 },
        { x: 12, y: 55, s: 9, d: 7 },
        { x: 65, y: 80, s: 7, d: 9 },
      ].map((star, i) => (
        <svg
          key={`star-${i}`}
          className="hero-bg__star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.s}px`,
            height: `${star.s}px`,
            animationDelay: `${star.d}s`,
          }}
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z"
            fill="#C084FC"
            fillOpacity="0.4"
          />
        </svg>
      ))}
    </div>
  );
}
