// Aberkane Principles Visual Component Library
// Ready for implementation in React/Next.js
// All designs use NKOM brand colors and typography

import React from 'react';
import { Key, Mountain, Gamepad2, Sparkles, Sun, Home, Users } from 'lucide-react';

// ========== PRINCIPLE VISUAL COMPONENTS ==========

/**
 * PRINCIPLE 1: NEUROERGONOMICS
 * Visual: Key fitting into a lock (custom fit, not forced)
 * Color: Deep Blue (#1E3A5F) + Gold (#D4AF37)
 * Metaphor: Personalization
 */
export const NeuroergonomicsVisual = () => (
  <svg viewBox="0 0 400 300" className="w-full h-auto">
    {/* Background */}
    <defs>
      <linearGradient id="neo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#E8EEF5', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#FBF5E0', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#neo-grad)" />

    {/* Multiple locks in background (showing uniqueness) */}
    <g opacity="0.1">
      <rect x="20" y="80" width="40" height="50" rx="4" fill="#1E3A5F" />
      <circle cx="60" cy="85" r="8" fill="none" stroke="#1E3A5F" strokeWidth="3" />

      <rect x="320" y="150" width="40" height="50" rx="4" fill="#1E3A5F" />
      <circle cx="360" cy="155" r="8" fill="none" stroke="#1E3A5F" strokeWidth="3" />

      <rect x="50" y="200" width="40" height="50" rx="4" fill="#1E3A5F" />
      <circle cx="90" cy="205" r="8" fill="none" stroke="#1E3A5F" strokeWidth="3" />
    </g>

    {/* Hand holding the key */}
    <g>
      {/* Wrist */}
      <ellipse cx="150" cy="220" rx="25" ry="15" fill="#D4B896" stroke="#1E3A5F" strokeWidth="2" />

      {/* Palm */}
      <path d="M 130 210 Q 120 200 130 180 Q 145 175 160 185 Q 165 205 150 220" fill="#E8D4B8" stroke="#1E3A5F" strokeWidth="2" />

      {/* Fingers holding key */}
      <g fill="#D4B896" stroke="#1E3A5F" strokeWidth="1.5">
        <rect x="155" y="160" width="8" height="35" rx="4" />
        <rect x="168" y="165" width="7" height="30" rx="3" />
        <rect x="179" y="170" width="7" height="25" rx="3" />
      </g>
    </g>

    {/* Key (central focus) */}
    <g stroke="#D4AF37" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Key shaft */}
      <line x1="200" y1="100" x2="280" y2="100" />

      {/* Key head (circle) */}
      <circle cx="185" cy="100" r="18" />

      {/* Key teeth/notches (custom pattern) */}
      <path d="M 270 95 L 275 95 L 275 105 L 280 105" />
      <path d="M 280 95 L 285 95 L 285 105" />
    </g>

    {/* Text below */}
    <text x="200" y="270" textAnchor="middle" className="font-heading text-2xl font-bold" fill="#1E3A5F">
      Works With Your Brain
    </text>
    <text x="200" y="290" textAnchor="middle" className="text-sm" fill="#1E3A5F" opacity="0.7">
      Not one-size-fits-all • Personalized to you
    </text>
  </svg>
);

/**
 * PRINCIPLE 2: MENTAL HANDLES
 * Visual: Mountain climber with rope/handholds
 * Color: Terracotta (#C75B39) + Gold (#D4AF37)
 * Metaphor: Grip on complex concepts
 */
export const MentalHandlesVisual = () => (
  <svg viewBox="0 0 400 300" className="w-full h-auto">
    <defs>
      <linearGradient id="handle-grad" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#FAEEE9', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#FBF5E0', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#handle-grad)" />

    {/* Mountain */}
    <path d="M 50 200 L 150 80 L 200 120 L 280 40 L 380 200" fill="#C75B39" opacity="0.2" stroke="#C75B39" strokeWidth="2" />

    {/* Glowing handholds */}
    <g>
      {[
        { x: 120, y: 150 },
        { x: 160, y: 120 },
        { x: 200, y: 90 },
        { x: 250, y: 60 },
      ].map((pos, i) => (
        <g key={i}>
          <circle cx={pos.x} cy={pos.y} r="12" fill="#D4AF37" opacity="0.3" />
          <circle cx={pos.x} cy={pos.y} r="8" fill="none" stroke="#D4AF37" strokeWidth="2" />
        </g>
      ))}
    </g>

    {/* Rope connecting handholds */}
    <path
      d="M 130 145 Q 160 110 200 80 Q 230 50 260 50"
      stroke="#D4AF37"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
      opacity="0.7"
    />

    {/* Climber */}
    <g>
      {/* Body */}
      <circle cx="210" cy="85" r="6" fill="#1E3A5F" />
      {/* Legs */}
      <line x1="210" y1="91" x2="208" y2="100" stroke="#1E3A5F" strokeWidth="2" />
      <line x1="210" y1="91" x2="212" y2="100" stroke="#1E3A5F" strokeWidth="2" />
      {/* Arms reaching */}
      <line x1="206" y1="87" x2="195" y2="75" stroke="#1E3A5F" strokeWidth="2" />
      <line x1="214" y1="87" x2="230" y2="70" stroke="#1E3A5F" strokeWidth="2" />
    </g>

    {/* Summit flag */}
    <g>
      <line x1="260" y1="50" x2="260" y2="25" stroke="#1E3A5F" strokeWidth="2" />
      <path d="M 265 30 L 260 25 L 265 35 Z" fill="#C75B39" />
      <text x="260" y="20" textAnchor="middle" className="text-xs font-bold" fill="#C75B39">✓</text>
    </g>

    {/* Text */}
    <text x="200" y="270" textAnchor="middle" className="font-heading text-2xl font-bold" fill="#1E3A5F">
      Concepts With Handles
    </text>
    <text x="200" y="290" textAnchor="middle" className="text-sm" fill="#1E3A5F" opacity="0.7">
      Analogies • Stories • Mnemonics
    </text>
  </svg>
);

/**
 * PRINCIPLE 3: PLAY AS LEARNING
 * Visual: Game controller → brain → lightbulb (transformation)
 * Color: Energy Yellow (#FFC107) + Orange (#FF9800)
 * Metaphor: Learning through play
 */
export const PlayAsLearningVisual = () => (
  <svg viewBox="0 0 400 300" className="w-full h-auto">
    <defs>
      <linearGradient id="play-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#FBF5E0', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#FFE8CC', stopOpacity: 1 }} />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <rect width="400" height="300" fill="url(#play-grad)" />

    {/* Game Controller */}
    <g>
      {/* Main body */}
      <rect x="40" y="100" width="80" height="60" rx="15" fill="#1E3A5F" stroke="#FF9800" strokeWidth="2" />

      {/* D-pad */}
      <g fill="#FF9800">
        <rect x="55" y="110" width="6" height="20" rx="2" />
        <rect x="50" y="120" width="20" height="6" rx="2" />
        <circle cx="60" cy="120" r="8" fill="none" stroke="#FF9800" strokeWidth="1" />
      </g>

      {/* Buttons (right side) */}
      <g fill="#FFC107">
        <circle cx="115" cy="110" r="4" />
        <circle cx="125" cy="115" r="4" />
        <circle cx="120" cy="125" r="4" />
        <circle cx="110" cy="120" r="4" />
      </g>
    </g>

    {/* Arrow from controller */}
    <path d="M 130 130 L 170 130" stroke="#FF9800" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />

    {/* Brain in center */}
    <g filter="url(#glow)">
      <ellipse cx="200" cy="130" rx="25" ry="30" fill="#FFC107" opacity="0.2" stroke="#FFC107" strokeWidth="2" />
      {/* Brain wrinkles */}
      <path d="M 185 110 Q 190 105 200 105 Q 210 105 215 110" stroke="#FFC107" strokeWidth="1.5" fill="none" />
      <path d="M 183 125 Q 190 120 200 120 Q 210 120 217 125" stroke="#FFC107" strokeWidth="1.5" fill="none" />
      <path d="M 185 140 Q 190 145 200 145 Q 210 145 215 140" stroke="#FFC107" strokeWidth="1.5" fill="none" />
    </g>

    {/* Arrow from brain */}
    <path d="M 230 130 L 270 130" stroke="#FFC107" strokeWidth="2" fill="none" />

    {/* Lightbulb */}
    <g filter="url(#glow)">
      {/* Bulb */}
      <circle cx="300" cy="115" r="15" fill="#FFC107" opacity="0.3" stroke="#FFC107" strokeWidth="2" />
      {/* Filament */}
      <path d="M 295 120 Q 300 110 305 120" stroke="#FFC107" strokeWidth="2" fill="none" />
      {/* Base */}
      <rect x="295" y="132" width="10" height="8" fill="#1E3A5F" stroke="#FFC107" strokeWidth="1" />
      <rect x="293" y="140" width="14" height="4" fill="#1E3A5F" />
      {/* Rays */}
      <g stroke="#FFC107" strokeWidth="2" opacity="0.6">
        <line x1="300" y1="95" x2="300" y2="85" />
        <line x1="320" y1="105" x2="328" y2="100" />
        <line x1="325" y1="125" x2="335" y2="130" />
      </g>
    </g>

    {/* XP particles */}
    {[...Array(5)].map((_, i) => (
      <g key={i} opacity={0.6} transform={`translate(${250 + i * 15} ${80 + Math.random() * 40})`}>
        <text className="text-lg font-bold" fill="#FF9800">+XP</text>
      </g>
    ))}

    {/* Text */}
    <text x="200" y="270" textAnchor="middle" className="font-heading text-2xl font-bold" fill="#1E3A5F">
      Learning Through Play
    </text>
    <text x="200" y="290" textAnchor="middle" className="text-sm" fill="#1E3A5F" opacity="0.7">
      XP • Streaks • Achievements • Rewards
    </text>
  </svg>
);

/**
 * PRINCIPLE 4: WONDER OVER CONFORMITY
 * Visual: Person discovering with amazement
 * Color: Curiosity Orange (#FF9800) + Gold (#D4AF37)
 * Metaphor: Awe & discovery
 */
export const WonderVisual = () => (
  <svg viewBox="0 0 400 300" className="w-full h-auto">
    <defs>
      <linearGradient id="wonder-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#FBF5E0', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#FAEEE9', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#wonder-grad)" />

    {/* Floating stars and sparkles */}
    {[...Array(8)].map((_, i) => {
      const x = 80 + Math.random() * 240;
      const y = 60 + Math.random() * 120;
      return (
        <g key={i} opacity="0.4">
          <circle cx={x} cy={y} r="3" fill="#D4AF37" />
          <circle cx={x} cy={y} r="6" fill="none" stroke="#D4AF37" strokeWidth="1" />
        </g>
      );
    })}

    {/* Person (side view, amazed expression) */}
    <g>
      {/* Head */}
      <circle cx="150" cy="100" r="20" fill="#D4B896" stroke="#1E3A5F" strokeWidth="2" />

      {/* Wide eyes (amazement) */}
      <circle cx="140" cy="95" r="4" fill="#1E3A5F" />
      <circle cx="160" cy="95" r="4" fill="#1E3A5F" />
      {/* Highlights in eyes */}
      <circle cx="141" cy="93" r="1.5" fill="white" />
      <circle cx="161" cy="93" r="1.5" fill="white" />

      {/* Open mouth (o shape) */}
      <circle cx="150" cy="110" r="5" fill="none" stroke="#1E3A5F" strokeWidth="2" />

      {/* Body */}
      <ellipse cx="150" cy="140" rx="15" ry="25" fill="#E8D4B8" stroke="#1E3A5F" strokeWidth="2" />

      {/* Arms up in wonder */}
      <path d="M 140 125 L 120 100 M 160 125 L 180 100" stroke="#D4B896" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Legs */}
      <line x1="145" y1="165" x2="140" y2="190" stroke="#1E3A5F" strokeWidth="2" />
      <line x1="155" y1="165" x2="160" y2="190" stroke="#1E3A5F" strokeWidth="2" />
    </g>

    {/* Question marks floating around */}
    {[
      { x: 250, y: 90, rotate: -15 },
      { x: 280, y: 140, rotate: 20 },
      { x: 240, y: 180, rotate: -25 },
    ].map((pos, i) => (
      <text
        key={i}
        x={pos.x}
        y={pos.y}
        fontSize="40"
        fill="#FF9800"
        opacity="0.3"
        transform={`rotate(${pos.rotate} ${pos.x} ${pos.y})`}
      >
        ?
      </text>
    ))}

    {/* Lightbulb ideas */}
    <g opacity="0.5">
      <text x="100" y="220" fontSize="24">💡</text>
      <text x="300" y="180" fontSize="20">✨</text>
    </g>

    {/* Text */}
    <text x="200" y="270" textAnchor="middle" className="font-heading text-2xl font-bold" fill="#1E3A5F">
      Curiosity Over Compliance
    </text>
    <text x="200" y="290" textAnchor="middle" className="text-sm" fill="#1E3A5F" opacity="0.7">
      Ask questions • Discover deeper • Explore freely
    </text>
  </svg>
);

/**
 * PRINCIPLE 5: JOY NOT SUFFERING
 * Visual: Person celebrating with joy
 * Color: Growth Green (#4CAF50) + Energy Yellow (#FFC107)
 * Metaphor: Positive, celebratory learning
 */
export const JoyVisual = () => (
  <svg viewBox="0 0 400 300" className="w-full h-auto">
    <defs>
      <linearGradient id="joy-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#E8F5E9', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#FBF5E0', stopOpacity: 1 }} />
      </linearGradient>
      <radialGradient id="sunGrad">
        <stop offset="0%" style={{ stopColor: '#FFC107', stopOpacity: 0.8 }} />
        <stop offset="100%" style={{ stopColor: '#FF9800', stopOpacity: 0 }} />
      </radialGradient>
    </defs>
    <rect width="400" height="300" fill="url(#joy-grad)" />

    {/* Sun in background */}
    <g>
      <circle cx="300" cy="60" r="40" fill="#FFC107" opacity="0.2" />
      <circle cx="300" cy="60" r="30" fill="#FFC107" opacity="0.3" />
      {/* Sun rays */}
      {[...Array(8)].map((_, i) => {
        const angle = (i * 360) / 8;
        const rad = (angle * Math.PI) / 180;
        const x1 = 300 + 35 * Math.cos(rad);
        const y1 = 60 + 35 * Math.sin(rad);
        const x2 = 300 + 50 * Math.cos(rad);
        const y2 = 60 + 50 * Math.sin(rad);
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFC107" strokeWidth="2" opacity="0.3" />
        );
      })}
    </g>

    {/* Person celebrating (arms and legs raised) */}
    <g>
      {/* Head with big smile */}
      <circle cx="180" cy="80" r="18" fill="#D4B896" stroke="#1E3A5F" strokeWidth="2" />

      {/* Happy eyes */}
      <circle cx="173" cy="75" r="2.5" fill="#1E3A5F" />
      <circle cx="187" cy="75" r="2.5" fill="#1E3A5F" />

      {/* Big smile */}
      <path d="M 173 85 Q 180 90 187 85" stroke="#1E3A5F" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Body */}
      <ellipse cx="180" cy="120" rx="13" ry="22" fill="#E8D4B8" stroke="#1E3A5F" strokeWidth="2" />

      {/* Arms raised in celebration */}
      <path d="M 171 105 L 140 70 M 189 105 L 220 70" stroke="#D4B896" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Legs in celebration pose */}
      <path d="M 175 142 L 165 175 M 185 142 L 195 175" stroke="#1E3A5F" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>

    {/* Celebration particles */}
    {[...Array(12)].map((_, i) => {
      const x = 80 + Math.random() * 240;
      const y = 50 + Math.random() * 150;
      const emoji = ['✨', '🎉', '⭐', '💫'][Math.floor(Math.random() * 4)];
      return (
        <text key={i} x={x} y={y} fontSize="18" opacity={0.4}>
          {emoji}
        </text>
      );
    })}

    {/* Thumbs up floating */}
    <text x="100" y="200" fontSize="40" opacity="0.3">👍</text>
    <text x="320" y="220" fontSize="32" opacity="0.3">✓</text>

    {/* Text */}
    <text x="200" y="270" textAnchor="middle" className="font-heading text-2xl font-bold" fill="#1E3A5F">
      Learning Feels Good
    </text>
    <text x="200" y="290" textAnchor="middle" className="text-sm" fill="#1E3A5F" opacity="0.7">
      Celebrate wins • Progress over perfection • Feel capable
    </text>
  </svg>
);

/**
 * PRINCIPLE 6: MEMORY PALACE
 * Visual: Isometric palace/rooms with concepts
 * Color: Memory Purple (#9C27B0) + Gold (#D4AF37)
 * Metaphor: Spatial memory architecture
 */
export const MemoryPalaceVisual = () => (
  <svg viewBox="0 0 400 300" className="w-full h-auto">
    <defs>
      <linearGradient id="palace-grad" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#F3E5F5', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#FBF5E0', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#palace-grad)" />

    {/* Isometric palace - simplified 3D view */}
    <g stroke="#9C27B0" strokeWidth="2" fill="none">
      {/* Front room (left) */}
      <polygon points="50,150 100,120 100,200 50,230" fill="#9C27B0" opacity="0.1" />
      <text x="75" y="175" textAnchor="middle" className="text-xs font-bold" fill="#9C27B0">
        Room 1
      </text>

      {/* Middle room (center) */}
      <polygon points="120,130 180,100 180,180 120,210" fill="#9C27B0" opacity="0.15" />
      <text x="150" y="155" textAnchor="middle" className="text-xs font-bold" fill="#9C27B0">
        Room 2
      </text>

      {/* Right room */}
      <polygon points="190,140 250,110 250,190 190,220" fill="#9C27B0" opacity="0.1" />
      <text x="220" y="165" textAnchor="middle" className="text-xs font-bold" fill="#9C27B0">
        Room 3
      </text>

      {/* Upper room (back) */}
      <polygon points="100,50 160,25 160,80 100,105" fill="#9C27B0" opacity="0.2" />
      <text x="130" y="65" textAnchor="middle" className="text-xs font-bold" fill="#9C27B0">
        Hall
      </text>
    </g>

    {/* Corridors connecting rooms */}
    <path d="M 100 150 L 120 140 M 150 150 L 180 150 M 190 150 L 220 150" stroke="#D4AF37" strokeWidth="2" opacity="0.5" strokeDasharray="5,5" />

    {/* Person walking through palace */}
    <g transform="translate(160, 155)">
      <circle cx="0" cy="-5" r="3" fill="#1E3A5F" />
      <line x1="0" y1="0" x2="0" y2="8" stroke="#1E3A5F" strokeWidth="2" />
      <line x1="-3" y1="2" x2="3" y2="2" stroke="#1E3A5F" strokeWidth="2" />
      <line x1="-2" y1="8" x2="2" y2="12" stroke="#1E3A5F" strokeWidth="2" />
      {/* Direction arrow */}
      <path d="M 8 -2 L 12 2 L 10 4" fill="none" stroke="#1E3A5F" strokeWidth="1" />
    </g>

    {/* Glowing concept locations */}
    {[
      { x: 75, y: 130 },
      { x: 130, y: 80 },
      { x: 220, y: 130 },
    ].map((pos, i) => (
      <g key={i}>
        <circle cx={pos.x} cy={pos.y} r="6" fill="#D4AF37" opacity="0.4" />
        <circle cx={pos.x} cy={pos.y} r="10" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.3" />
      </g>
    ))}

    {/* Text */}
    <text x="200" y="270" textAnchor="middle" className="font-heading text-2xl font-bold" fill="#1E3A5F">
      Build Mental Architecture
    </text>
    <text x="200" y="290" textAnchor="middle" className="text-sm" fill="#1E3A5F" opacity="0.7">
      Spatial memory • Vivid concepts • Permanent recall
    </text>
  </svg>
);

/**
 * PRINCIPLE 7: KNOWLEDGE ECONOMY
 * Visual: People connected, sharing knowledge
 * Color: Connection Pink (#E91E63) + Growth Green (#4CAF50)
 * Metaphor: Community & connection
 */
export const KnowledgeEconomyVisual = () => (
  <svg viewBox="0 0 400 300" className="w-full h-auto">
    <defs>
      <linearGradient id="community-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#FCE4EC', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#E8F5E9', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#community-grad)" />

    {/* Network connections (lines) */}
    <g stroke="#E91E63" strokeWidth="2" opacity="0.3">
      <line x1="100" y1="120" x2="200" y2="150" />
      <line x1="300" y1="120" x2="200" y2="150" />
      <line x1="200" y1="50" x2="200" y2="150" />
      <line x1="100" y1="200" x2="200" y2="150" />
      <line x1="300" y1="200" x2="200" y2="150" />
    </g>

    {/* People nodes */}
    {[
      { x: 100, y: 120, color: '#E91E63' },   // Left
      { x: 300, y: 120, color: '#00BCD4' },   // Right
      { x: 200, y: 50, color: '#4CAF50' },    // Top
      { x: 100, y: 200, color: '#FF9800' },   // Bottom left
      { x: 300, y: 200, color: '#9C27B0' },   // Bottom right
    ].map((person, i) => (
      <g key={i}>
        {/* Head */}
        <circle cx={person.x} cy={person.y} r="12" fill={person.color} opacity="0.3" stroke={person.color} strokeWidth="2" />
        {/* Center hub (knowledge flowing) */}
        <circle cx={person.x} cy={person.y} r="8" fill="none" stroke={person.color} strokeWidth="1" opacity="0.5" />
      </g>
    ))}

    {/* Central hub (brighter) */}
    <g>
      <circle cx="200" cy="150" r="18" fill="#4CAF50" opacity="0.2" stroke="#4CAF50" strokeWidth="2" />
      <circle cx="200" cy="150" r="14" fill="none" stroke="#4CAF50" strokeWidth="1.5" />
      {/* Light arrows showing knowledge flow */}
      {[...Array(5)].map((_, i) => {
        const angle = (i * 360) / 5;
        const rad = (angle * Math.PI) / 180;
        const r = 20;
        const x = 200 + r * Math.cos(rad);
        const y = 150 + r * Math.sin(rad);
        return (
          <line key={i} x1="200" y1="150" x2={x} y2={y} stroke="#4CAF50" strokeWidth="1" opacity="0.2" markerEnd="url(#arrowGreen)" />
        );
      })}
    </g>

    {/* Floating knowledge symbols */}
    <text x="70" y="90" fontSize="16" opacity="0.3">📚</text>
    <text x="330" y="90" fontSize="16" opacity="0.3">💡</text>
    <text x="200" y="20" fontSize="16" opacity="0.3">🎓</text>
    <text x="70" y="240" fontSize="16" opacity="0.3">📖</text>
    <text x="330" y="240" fontSize="16" opacity="0.3">✨</text>

    {/* Text */}
    <text x="200" y="270" textAnchor="middle" className="font-heading text-2xl font-bold" fill="#1E3A5F">
      Learning Together
    </text>
    <text x="200" y="290" textAnchor="middle" className="text-sm" fill="#1E3A5F" opacity="0.7">
      Teaching deepens understanding • Community grows • Wisdom multiplies
    </text>
  </svg>
);

// ========== PRINCIPLE CARD COMPONENT ==========

export interface PrincipleCardProps {
  number: number;
  title: string;
  subtitle: string;
  description: string;
  Visual: React.ComponentType;
  color: 'primary' | 'terracotta' | 'gold' | 'purple' | 'green';
}

export const PrincipleCard: React.FC<PrincipleCardProps> = ({
  number,
  title,
  subtitle,
  description,
  Visual,
  color,
}) => {
  const colorClasses = {
    primary: 'bg-primary/5 border-primary/20',
    terracotta: 'bg-terracotta/5 border-terracotta/20',
    gold: 'bg-gold/5 border-gold/20',
    purple: 'bg-purple-500/5 border-purple-500/20',
    green: 'bg-green-500/5 border-green-500/20',
  };

  const titleColorClasses = {
    primary: 'text-primary',
    terracotta: 'text-terracotta',
    gold: 'text-gold',
    purple: 'text-purple-600',
    green: 'text-green-600',
  };

  return (
    <div className={`rounded-2xl border p-6 transition hover:shadow-lg ${colorClasses[color]}`}>
      {/* Number badge */}
      <div className={`mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full ${titleColorClasses[color]} bg-white font-heading text-sm font-bold`}>
        {number}
      </div>

      {/* Visual */}
      <div className="mb-6 h-48 rounded-xl bg-white p-4">
        <Visual />
      </div>

      {/* Title */}
      <h3 className={`font-heading text-xl font-bold ${titleColorClasses[color]}`}>{title}</h3>

      {/* Subtitle */}
      <p className="mt-1 text-sm font-semibold text-charcoal/70">{subtitle}</p>

      {/* Description */}
      <p className="mt-3 text-sm leading-relaxed text-charcoal/60">{description}</p>

      {/* Call-to-action */}
      <button className={`mt-4 text-sm font-semibold ${titleColorClasses[color]} transition hover:opacity-80`}>
        Learn more →
      </button>
    </div>
  );
};
