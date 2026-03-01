# 🎨 GitGenie - Visual Reference Guide & Quick Lookup

**Purpose:** Visual specifications and quick reference for designers and developers  
**Version:** 1.0  
**Last Updated:** March 1, 2026

---

## 📐 Visual Component Guide

### Achievement Badge - States & Animations

```
LOCKED STATE:
┌─────────────────┐
│  🔒  Lock Icon  │  ← Ghosted/Grayscale
│                 │  ← 40% Opacity
│  Achievement    │  ← Dimmed Text
│  Name           │
└─────────────────┘
   "Requirements"

PROGRESS STATE:
┌─────────────────┐
│   ⊙ Spinner     │  ← Rotating animation
│  ⊡ Progress Bar │  ← Circular, 60° filled
│  Achievement    │  ← Bold Text
│  Name: 2/4      │  ← Progress indicator
└─────────────────┘
   "In Progress"

UNLOCKED STATE:
┌─────────────────┐
│ ✨ Badge Icon   │  ← Glowing, floating
│ ✓ Achievement   │  ← Bold colored text
│  Name           │  ← Date below
│ Mar 1, 2026     │
└─────────────────┘
   "Unlocked!"

UNLOCK ANIMATION (2s sequence):
┌─────────────────────────────────────────┐
│ 0ms:   100% opacity, Scale 1.0          │
│ 200ms: Glow effect fades in             │
│ 300ms: Particles burst outward          │
│ 500ms: Scale peaks (1.3x)               │
│ 700ms: Floating rotation starts         │
│ 1000ms: Scale back to 1.0               │
│ 1500ms: Glow pulsing stabilizes         │
│ 2000ms: Animation complete              │
└─────────────────────────────────────────┘

HOVER STATE:
└─────────────────┐
  Scale: 1.0→1.1 │ ← Smooth scale
  Shadow: ↑↑    │ ← Elevation increase
  Glow: → → →   │ ← Glow intensity up
  Tooltip: ↓    │ ← Info popup appears
  Duration: 150ms│
```

### Dashboard Layout - Full Page View

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER (60px)                                                   │
│  [GitGenie Logo] [Nav Items] [Search] [Notifications] [Profile]  │
└─────────────────────────────────────────────────────────────────┘

┌────────────────┬───────────────────────────────────────────┐
│                │  MAIN DASHBOARD CONTENT                   │
│  SIDEBAR       │  ┌─────────────────────────────────────┐ │
│  (280px)       │  │  ACHIEVEMENT OVERVIEW (4x2 Grid)     │ │
│  [Home]        │  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │ │
│  [Dashboard]   │  │  │Badge1│ │Badge2│ │Badge3│ │Badge4│ │ │
│  [Profile]     │  │  └──────┘ └──────┘ └──────┘ └──────┘ │ │
│  [Leaderboard] │  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │ │
│  [Guides]      │  │  │Badge5│ │Badge6│ │Badge7│ │Badge8│ │ │
│  [Settings]    │  │  └──────┘ └──────┘ └──────┘ └──────┘ │ │
│                │  └─────────────────────────────────────┘ │
│  [Dark/Light]  │  ┌──────────┬──────────┬────────────┐    │
│  Toggle        │  │ STATS    │ QUICK    │ ACTIVITY   │    │
│                │  │ 4/8      │ ACTIONS  │ FEED       │    │
│                │  │ 50%      │ • Start  │ • You:     │    │
│                │  │ Streak: 3│ • View   │   Pull     │    │
│                │  │          │ • Share  │   Shark    │    │
│                │  └──────────┴──────────┴────────────┘    │
│                └───────────────────────────────────────────┘
└────────────────┴───────────────────────────────────────────┘
```

### Modal / Achievement Details Popup

```
┌─────────────────────────────────────────────┐
│  X                                          │  ← Close button
│  ┌──────────────────────────────────────┐  │
│  │        [LARGE BADGE ICON]            │  │  ← Centered, glowing
│  │        Pull Shark                    │  │
│  │                                      │  │
│  │  Description:                        │  │
│  │  Merge 2 pull requests to your       │  │
│  │  repository                          │  │
│  │                                      │  │
│  │  Progress: [████████░░] 2/2 (100%)  │  │  ← Progress bar
│  │                                      │  │
│  │  ├─ Create branch               ✓   │  │
│  │  ├─ Make changes                ✓   │  │
│  │  ├─ Create PR                   ✓   │  │
│  │  └─ Merge PR                    ✓   │  │
│  │                                      │  │
│  │  How to unlock guide                │  │
│  │  [View Step-by-Step Guide] [Watch]  │  │  ← CTAs
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │ [← Back] [Share Achievement] [Close] │  │  ← Footer actions
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### Leaderboard Card Layout

```
DESKTOP VIEW:
┌──────────────────────────────────────────────────────┐
│ Rank │ User Profile  │ Achievements │ Completion │ Status │
├──────┼───────────────┼──────────────┼────────────┼────────┤
│ 🥇 1 │ [👤] JesunOne│   8/8 🏆     │ 100%       │ ↑ NEW  │
│ 🥈 2 │ [👤] DevMaster│  6/8         │ 75%        │ ↓      │
│ 🥉 3 │ [👤] CodeWizard│ 5/8         │ 62.5%      │ —      │
│    4 │ [👤] GitGuru  │   4/8        │ 50%        │ ↑      │
│    5 │ [👤] ProDev   │   3/8        │ 37.5%      │ ↓ ↓    │
└──────┴───────────────┴──────────────┴────────────┴────────┘

MOBILE VIEW (Card-based):
┌───────────────────────────┐
│ 🥇 #1 JesunOne            │
│ ┌─────────────────────┐   │
│ │ [Profile Picture]   │   │
│ │ 8/8 Achievements    │   │
│ │ 100% Complete       │   │
│ │ ✨ Just unlocked    │   │
│ └─────────────────────┘   │
│ [Follow] [View Profile]   │
└───────────────────────────┘
```

### Progress Ring Component

```
CIRCULAR PROGRESS (120px):
        ┌─────────────────┐
        │                 │
        │      ⊙◔◔◔       │  ← Stroke path with gradient
        │    ◔     ◔ 75%  │  ← Percentage in center
        │   ◔       ◔     │
        │  ◔ ◄─ Glow ◔    │
        │   ◔       ◔     │
        │    ◔     ◔      │
        │      ◔◔◔⊙       │
        │                 │
        └─────────────────┘

ATTRIBUTES:
├── Stroke width: 8px
├── Gradient: Purple → Pink → Cyan
├── Glow: A855F7 @ 30% opacity
├── Animation: Smooth on value change (300ms)
└── Label: "2/4" or "75%"

LINEAR PROGRESS (100% width):
┌────────────────────────────────────────────────┐
│ Pull Shark: [███████░░░░░░░░░░░░░░░░░░░░░░]  50%│
│           [■ Completed  ◇ Pending]              │
└────────────────────────────────────────────────┘
```

---

## 🎨 Color Reference Card

### Primary Gradient (Backgrounds & Highlights)
```
From Purple → Pink → Cyan
#A855F7    #EC4899    #00D9FF

Visual:
████ (Purple) → ████ (Pink) → ████ (Cyan)
```

### Dark Mode Palette (Default)
```
Layer 1 (Deepest):  #0F172A   ███████████ Background
Layer 2 (Deep):     #1E293B   ███████████ Surface
Layer 3 (Standard): #334155   ███████████ Secondary
Layer 4 (Light):    #475569   ███████████ Tertiary
Text (Primary):     #F1F5F9   ███████████ On surface
Text (Secondary):   #CBD5E1   ███████████ Muted
```

### State Colors
```
Success: #10B981   ███████████ Emerald
Warning: #F59E0B   ███████████ Amber
Error:   #EF4444   ███████████ Red
Info:    #00D9FF   ███████████ Cyan
```

---

## 📱 Responsive Breakpoints Cheat Sheet

```
Mobile (< 640px):
├── Badge grid: 2 columns
├── Sidebar: Hidden (collapse menu)
├── Font size: Smaller
└── Touch targets: 44x44px minimum

Tablet (640 - 1024px):
├── Badge grid: 3 columns
├── Sidebar: Collapsible
├── Font size: Normal
└── Layout: 2-column (sidebar + content)

Desktop (1024 - 1280px):
├── Badge grid: 4 columns
├── Sidebar: Always visible (280px)
├── Font size: Normal
└── Layout: Full screen

Large Desktop (1280px+):
├── Badge grid: 4-5 columns
├── Sidebar: 280px width
├── Max content width: 1280px
└── Generous spacing throughout
```

---

## 🎬 Animation Timing Reference

```
Micro (150ms):          Use for: Hover effects, button presses
├── ease-out           └─────────────────────────────────────
├ ─ ─ ─ 150ms
│

Short (300ms):          Use for: Component transitions
├── ease-in-out        └─────────────────────────────────────
┄ ┄ ┄ ┄ ┄ 300ms


Base (500ms):           Use for: Page transitions
├── ease-out           └─────────────────────────────────────
═ ═ ═ ═ ═ ═ ═ ═ 500ms


Long (800ms):           Use for: Complex animations
├── custom spring      └─────────────────────────────────────
╱ ╱ ╱ ╱ ╱ ╱ ╱ ╱ ╱ 800ms


Extended (1200ms):     Use for: Entrance animations
├── bounce/spring      └─────────────────────────────────────
╱ ╲ ╱ ╲ ╱ ╲ ╱ ╲ ╱ ╲ 1200ms
```

---

## 🔤 Typography Scale Quick Reference

```
Display Large (H1)         48px ████████
Display Medium (H2)        40px ██████
Display Small (H3)         32px ████

Heading Large (Title)      28px ███
Heading Medium (Section)   24px ██
Heading Small (Subsection) 20px ██

Body Large (Big text)      18px █
Body Medium (Default)      16px █ ← Most common
Body Small (Secondary)     14px

Label Large (Labels)       16px █
Label Medium (Standard)    14px
Label Small (Tiny)         12px

Code/Monospace             13px
```

---

## 🎯 Component Usage Quick Guide

### Buttons

```
PRIMARY (Main Actions):    SECONDARY (Alternative):
┌──────────────────────┐  ┌──────────────────────┐
│ Unlock Achievement   │  │ Learn More           │
└──────────────────────┘  └──────────────────────┘
Purple gradient          Outlined cyan border

DANGER (Destructive):      SMALL/COMPACT:
┌──────────────────────┐  ┌───────────┐
│ Delete Profile       │  │ Copy Link │
└──────────────────────┘  └───────────┘
Red background           Minimal style
```

### Input Fields

```
NORMAL STATE:          FOCUS STATE:           ERROR STATE:
┌────────────────┐    ┌────────────────┐    ┌────────────────┐
│ Username...    │    │ Username...    │    │ Username...    │
│ Type here      │    │ Cursor blinking│    │ Invalid format │
└────────────────┘    └════════════════┘    └┐───────────────┘
Border: Gray         Border: Cyan glow      Red border + msg

PREFIX/SUFFIX:         DISABLED STATE:
┌─────────────────┐   ┌────────────────┐
│ 🔍 Search...    │   │ Username...    │
└─────────────────┘   └────────────────┘
Icon on left side      Grayed out, can't type
```

### Notification Toast

```
SUCCESS:               ERROR:                 WARNING:
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│✓ Saved!          │  │✗ Error saving    │  │⚠ Check settings  │
│Achievement       │  │  Profile data.   │  │ Incomplete data   │
│unlocked!         │  │  Try again       │  │ Please review     │
└──────────────────┘  └──────────────────┘  └──────────────────┘
Green theme          Red theme             Amber theme
Auto-dismiss: 5s     Sticky by default     Auto-dismiss: 5s
```

---

## 🌙 Dark vs Light Mode

### Color Mapping

```
DARK MODE (Default):        LIGHT MODE (Alternative):
Background:  #0F172A        Background: #F8FAFC
Surface:     #1E293B        Surface:    #FFFFFF  
Text:        #F1F5F9        Text:       #0F172A
Borders:     #334155        Borders:    #CBD5E1
Accent:      #00D9FF        Accent:     #0E7490

Badges:      Bright glow    Badges:     Subtle shadow
Shadows:     Dark (higher)  Shadows:    Light (lower)
```

### Implementation

```css
/* Dark (default) */
.component {
  @apply bg-slate-950 text-white;
}

/* Light (with dark: prefix) */
.dark .component {
  @apply bg-white text-slate-950;
}

/* Or using CSS variables */
:root {
  --bg-primary: #0F172A;
  --text-primary: #F1F5F9;
}

[data-theme="light"] {
  --bg-primary: #F8FAFC;
  --text-primary: #0F172A;
}
```

---

## ♿ Accessibility Quick Checklist

```
VISUAL:
☐ 4.5:1 contrast ratio (normal text)
☐ 3:1 contrast ratio (large text)
☐ Color not sole indicator
☐ 44x44px minimum touch targets

INTERACTION:
☐ Keyboard-navigable (Tab, Enter, Esc)
☐ Focus indicator visible (2px ring minimum)
☐ Proper semantic HTML
☐ ARIA labels where needed

MOTION:
☐ Respect prefers-reduced-motion
☐ No auto-playing videos (unless muted)
☐ Animations under 3 seconds
☐ No flashing more than 3x/second

CONTENT:
☐ Alt text on all images
☐ Form labels associated
☐ Error messages clear
☐ Help text available
```

---

## 📏 Spacing Grid

```
0px   ← None
4px   ← xs (tight)
8px   ← sm (snug)
12px  ← xs-md
16px  ← md (default gap)
20px  ← md-lg
24px  ← lg (spacious)
28px  ← lg-xl
32px  ← xl (very spacious)
40px  ← 2xl
48px  ← 3xl (massive)

Usage:
- Component padding: 16px-24px
- Section gap: 24px-32px
- Page margins: 16px-40px (responsive)
```

---

## 🎬 Common Animation Patterns

### Fade In
```
From: opacity 0
To:   opacity 1
Duration: 300ms
Easing: ease-out
```

### Slide + Fade In
```
From: translateY(-20px), opacity 0
To:   translateY(0), opacity 1
Duration: 300ms
Easing: ease-out
```

### Scale In
```
From: scale(0.95), opacity 0
To:   scale(1), opacity 1
Duration: 300ms
Easing: ease-out
```

### Bounce In
```
From: scale(0.3), opacity 0
To:   scale(1), opacity 1
Duration: 600ms
Easing: cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

---

## 🚀 Performance Targets

```
Metric              Target      Current  Status
─────────────────────────────────────────────────
First Contentful Paint    < 1.5s      ?        To measure
Largest Contentful Paint  < 2.5s      ?        To measure
Cumulative Layout Shift   < 0.1       ?        To measure
Time to Interactive       < 3s        ?        To measure
Lighthouse Score          > 90        ?        To measure

Image Optimization:
├── Max image size: 500KB
├── Responsive widths: 320px, 640px, 1024px
├── Format: WebP with PNG fallback
└── Lazy loading on non-critical images

Code Splitting:
├── Route-based code splitting: ✓
├── Component lazy loading: ✓
├── Bundle analysis: ✓
└── Target bundle size: < 100KB (gzipped)
```

---

## 🎯 Feature Checklist by Achievement

### QuickDraw ✓
─────────────────────────
│ Create issue        ✓
│ Close within 5 min  ✓
│ Detect & celebrate  ✓
└─────────────────────────

### Pull Shark ✓
─────────────────────────
│ Create PR           ✓
│ Merge PR            ✓
│ Repeat 2x           ✓
│ Count & track       ✓
└─────────────────────────

### YOLO ✓
─────────────────────────
│ Merge without review✓
│ Detect event        ✓
│ Show warning icon   ✓
└─────────────────────────

### Pair Extraordinaire ✓
─────────────────────────
│ Co-author commit    ✓
│ Parse co-author     ✓
│ Track both users    ✓
│ Celebrate both      ✓
└─────────────────────────

### Galaxy Brain ✓
─────────────────────────
│ Monitor discussions ✓
│ Track answers       ✓
│ Count marked ones   ✓
│ Need 2 accepted     ✓
└─────────────────────────

### StarStruck ✓
─────────────────────────
│ Monitor repo stars  ✓
│ Count total stars   ✓
│ Track per user      ✓
│ Need 16 stars       ✓
└─────────────────────────

### Public Sponsor ✓
─────────────────────────
│ Check sponsorships  ✓
│ Monitor donations   ✓
│ Verify payment      ✓
│ Show sponsor icon   ✓
└─────────────────────────

### Heart on Your Sleeve ✓
─────────────────────────
│ Profile star count  ✓
│ Automatic trigger   ✓
│ No action required  ✓
│ Celebrate unlock    ✓
└─────────────────────────

---

**End of Visual Reference Guide**

*Print or bookmark this for quick reference during development!*
