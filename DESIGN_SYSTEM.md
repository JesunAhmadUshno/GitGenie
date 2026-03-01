# 🎨 GitGenie - Design System & Visual Specifications

**Version:** 1.0  
**Status:** For Implementation  
**Last Updated:** March 1, 2026

---

## 📐 Color System

### Primary Palette (Dark Mode - Default)

```
Brand Colors:
├── Primary Blue
│   └── #00D9FF (Electric Cyan)
│       └── RGB: 0, 217, 255
│       └── HSL: 186°, 100%, 50%
│
├── Primary Purple
│   └── #A855F7 (Vibrant Purple)
│       └── RGB: 168, 85, 247
│       └── HSL: 280°, 97%, 65%
│
├── Secondary Pink
│   └── #EC4899 (Hot Pink)
│       └── RGB: 236, 72, 153
│       └── HSL: 334°, 94%, 60%
│
├── Accent Green
│   └── #10B981 (Emerald)
│       └── RGB: 16, 185, 129
│       └── HSL: 160°, 84%, 39%
│
└── Accent Orange
    └── #F97316 (Vibrant Orange)
        └── RGB: 249, 115, 22
        └── HSL: 24°, 97%, 53%
```

### Neutral Palette

```
Dark Mode:
├── Background
│   ├── Deep: #0F172A (Almost black)
│   ├── Primary: #1E293B (Dark slate)
│   ├── Secondary: #334155 (Slate)
│   └── Tertiary: #475569 (Light slate)
│
├── Surface
│   ├── Elevated: #1E293B
│   ├── Standard: #0F172A
│   └── Sunken: #050B14 (Almost pure black)
│
├── Text
│   ├── Primary: #F1F5F9 (Off-white)
│   ├── Secondary: #CBD5E1 (Muted gray)
│   ├── Tertiary: #94A3B8 (Dark gray)
│   └── Disabled: #64748B (Very muted)
│
└── Borders
    ├── Prominent: #475569
    ├── Standard: #334155
    └── Subtle: #1E293B

Light Mode (Inverted):
├── Background: #F8FAFC
├── Surface: #FFFFFF
├── Text Primary: #0F172A
├── Text Secondary: #475569
└── Borders: #CBD5E1
```

### State Colors

```
Success: #10B981 (Emerald)
├── Background: #D1FAE5 (Light)
├── Foreground: #047857 (Dark)
└── Border: #6EE7B7

Warning: #F59E0B (Amber)
├── Background: #FEF3C7 (Light)
├── Foreground: #92400E (Dark)
└── Border: #FCD34D

Error: #EF4444 (Red)
├── Background: #FEE2E2 (Light)
├── Foreground: #7F1D1D (Dark)
└── Border: #FECACA

Info: #00D9FF (Cyan)
├── Background: #CFFAFE (Light)
├── Foreground: #0E7490 (Dark)
└── Border: #A5F3FC
```

### Gradient Patterns

```
Achievement Unlock Gradient:
├── Direction: 135deg (top-left to bottom-right)
├── Colors: A855F7 → EC4899 → 00D9FF
└── Animation: Rotate 60s infinite

Dashboard Background Gradient:
├── Direction: 45deg
├── Colors: 0F172A (0%) → 1E293B (100%)
└── Overlay: Radial gradient emphasis

Badge Glow Layer:
├── Inner: A855F7 @ 20% opacity
├── Middle: EC4899 @ 15% opacity
└── Outer: 00D9FF @ 10% opacity
```

---

## 🔤 Typography System

### Font Stack

```css
/* Headings & Display */
font-family: 'Space Mono', 'SF Mono', monospace;
font-weight: 700;
letter-spacing: -0.02em;

/* Body & UI */
font-family: 'Inter', '-apple-system', 'BlinkMacSystemFont', sans-serif;
font-weight: 400;
letter-spacing: 0;

/* Code & Snippets */
font-family: 'JetBrains Mono', 'Anonymous Pro', monospace;
font-weight: 500;
letter-spacing: 0.01em;
```

### Type Scale

```
Display L: 48px / 56px line-height (H1 equivalent)
Display M: 40px / 48px line-height
Display S: 32px / 40px line-height

Heading L: 28px / 36px line-height (h2)
Heading M: 24px / 32px line-height (h3)
Heading S: 20px / 28px line-height (h4)

Body L: 18px / 28px line-height (larger body text)
Body M: 16px / 24px line-height (default body)
Body S: 14px / 20px line-height (secondary text)

Label L: 16px / 24px line-height (prominent labels)
Label M: 14px / 20px line-height (standard labels)
Label S: 12px / 16px line-height (small labels)

Code: 13px / 20px line-height (monospace)
```

### Variables (CSS)

```css
--text-xl: 18px;
--text-lg: 16px;
--text-base: 14px;
--text-sm: 12px;

--leading-loose: 1.75;
--leading-relaxed: 1.625;
--leading-normal: 1.5;
--leading-tight: 1.375;
--leading-snug: 1.25;

--font-mono: 'JetBrains Mono', monospace;
--font-sans: 'Inter', sans-serif;
--font-display: 'Space Mono', monospace;
```

---

## 📦 Spacing System

### Scale (8px base unit)

```
0:  0px
1:  4px
2:  8px
3:  12px
4:  16px
5:  20px
6:  24px
7:  28px
8:  32px
9:  36px
10: 40px
11: 44px
12: 48px
14: 56px
16: 64px
18: 72px
20: 80px
24: 96px
```

### Application

```
Components:
├── Button padding: 8px 16px (py-2 px-4)
├── Card padding: 24px (p-6)
├── Input padding: 12px 16px (py-3 px-4)
└── Dialog padding: 28px (p-7)

Layout:
├── Container max-width: 1280px
├── Section gap: 32px (gap-8)
├── Column gap: 24px (gap-6)
└── Grid gap: 20px (gap-5)

Sections:
├── Header height: 60px
├── Sidebar width: 280px
├── Footer height: 80px
└── Modal margin: 24px
```

---

## 🎭 Component Library

### Achievement Badge

```
Structure:
├── Container (120x120px default, responsive)
├── Background (gradient + glow)
├── Icon/Illustration (animated)
├── Label (achievement name)
├── Metadata (progress or status)
└── Interactive layer (hover, click)

States:
1. Locked
   ├── Background: Grayscale gradient
   ├── Opacity: 0.4
   ├── Icon: Lock overlay
   ├── Label: Dimmed
   └── Metadata: "Locked"

2. Progress
   ├── Background: Color gradient
   ├── Opacity: 1.0
   ├── Icon: Progress animation (rotating)
   ├── Progress ring: Animated stroke
   └── Metadata: "2/4"

3. Unlocked
   ├── Background: Vibrant gradient + glow
   ├── Opacity: 1.0
   ├── Icon: Achievement illustration
   ├── Animation: Idle float (subtle bobbing)
   ├── Metadata: Unlock date
   └── Metadata: "Unlocked on Mar 1"

4. Celebrating (unlock moment)
   ├── Scale: 1.0 → 1.3 → 1.0
   ├── Rotation: 0 → 360° (continuous)
   ├── Glow: Pulsing effect
   ├── Particles: Burst outward
   ├── Sound: Achievement chime
   └── Duration: 2s total

Hover Effects:
├── Scale: 1.0 → 1.1
├── Elevation: Shadow increase
├── Glow: Increase intensity
├── Label: Slight lift animation
└── Tooltip: Info popup
```

### Progress Component

```
Circular Progress:
├── Outer ring: Thin separator
├── Progress arc: Gradient stroke
├── Background: Subtle gray ring
├── Center: Number "2/4" or percentage
├── Size variants: 80px, 120px, 160px
├── Animation: Smooth transition on value change
└── Glow: Optional halo on high progress

Linear Progress:
├── Container: 100% width
├── Track: Subtle background
├── Progress bar: Gradient fill
├── Label: Left-aligned "Pull Shark"
├── Percentage: Right-aligned "50%"
├── Checkmark: Right-aligned if complete
├── Animation: Spring-like fill animation
└── Variants: Compact (8px), Normal (12px), Large (16px)
```

### Button Component

```
Base Styles:
├── Border radius: 8px
├── Font weight: 600
├── Transition: 150ms all ease
├── Border: None (by default)
└── Cursor: Pointer

Primary Button:
├── Background: Gradient (Purple → Pink)
├── Text: White
├── Shadow: Glow (A855F7 @ 30%)
├── Hover: Brightness +10%, scale 1.02
├── Active: Brightness -5%, scale 0.98
└── Focus: Cyan ring (2px)

Secondary Button:
├── Background: Surface (1E293B)
├── Border: Bright (1px, 00D9FF)
├── Text: Cyan
├── Hover: Background lightens
├── Active: Border brightens
└── Focus: Border color ring

Danger Button:
├── Background: EF4444 (Red)
├── Text: White
├── Hover: Brightness +10%
├── Active: Brightness -10%
└── Focus: Red ring

Disabled State:
├── Opacity: 0.5
├── Cursor: Not-allowed
├── No hover effects
└── No glow shadow
```

### Input Component

```
Text Input:
├── Height: 44px (12px padding)
├── Border: 2px solid (borders-subtle)
├── Border radius: 8px
├── Font size: 16px
├── Transition: 150ms all
│
├── Focus:
│   ├── Border: 2px solid (00D9FF)
│   ├── Box shadow: Glow effect
│   └── Background: Slight lightening
│
├── Placeholder:
│   └── Color: Secondary text
│   └── Opacity: 0.6
│
├── Disabled:
│   ├── Background: Tertiary
│   ├── Cursor: Not-allowed
│   └── Opacity: 0.5
│
└── Error:
    ├── Border: 2px solid (EF4444)
    ├── Background: Error surface (FEE2E2)
    └── Message: Below input, red text
```

### Card Component

```
Structure:
├── Outer container: 100% width, responsive
├── Background: Surface (1E293B)
├── Border: 1px solid (borders-standard)
├── Border radius: 12px
├── Padding: 24px (p-6)
├── Shadow: 0 4px 12px rgba(0,0,0,0.15)
└── Transition: 150ms all

Hover Effects:
├── Border: Change to primary color
├── Shadow: Increase (0 8px 24px)
├── Background: Slight lift
└── Duration: 150ms

Variants:

Interactive Card:
├── Cursor: Pointer
├── Upper state: Hover effect
└── Clickable area: Full card

Elevated Card:
├── Shadow: Larger (0 20px 40px)
├── Border: More prominent
└── Usage: Modal, popovers

Compact Card:
├── Padding: 16px (p-4)
├── Border radius: 8px
└── Shadow: Smaller
```

### Modal / Dialog

```
Overlay:
├── Background: Black
├── Opacity: 0.5
├── Backdrop filter: Blur(4px) optional
└── Z-index: 1000

Dialog Box:
├── Max width: 500px (SM), 700px (MD), 900px (LG)
├── Margin: 24px auto
├── Background: Surface (1E293B)
├── Border radius: 12px
├── Shadow: 0 25px 50px rgba(0,0,0,0.25)
├── Animation: Scale + fade (from 0.95)
└── Loading animation: 200ms ease-out

Content Areas:
├── Header: 28px min-height, 24px padding
│   ├── Title: 24px font
│   ├── Close button: Top-right
│   └── Border-bottom: Subtle divider
│
├── Body: 24px padding, max-height with scroll
│   └── Scrollbar: Minimal styling (Tailwind)
│
└── Footer: 16px padding-top, flex end
    ├── Cancel button: Secondary
    ├── Confirm button: Primary
    └── spacing between: 12px

Close Animation:
├── Scale: 1.0 → 0.95
├── Opacity: 1.0 → 0.0
└── Duration: 150ms ease-in
```

### Notification / Toast

```
Container:
├── Position: Fixed bottom-right
├── Margin: 20px from edges
├── Max width: 400px
├── Z-index: 5000
└── Animation: Slide in from right

Toast Styles:
├── Padding: 16px 20px
├── Border radius: 8px
├── Border: 1px left indicator (4px wide)
├── Shadow: 0 10px 25px rgba(0,0,0,0.2)
├── Display: Flex between icon + content + close

Type Variants:

Success:
├── Background: Green surface (#D1FAE5 dark-adapted)
├── Border-left: Green (#10B981)
├── Icon: Checkmark circle
└── Text: Green

Error:
├── Background: Red surface
├── Border-left: Red (#EF4444)
├── Icon: X circle
└── Text: Red

Warning:
├── Background: Amber surface
├── Border-left: Amber (#F59E0B)
├── Icon: Alert triangle
└── Text: Amber

Info:
├── Background: Cyan surface
├── Border-left: Cyan (#00D9FF)
├── Icon: Info circle
└── Text: Cyan

Animations:
├── Enter: SlideInRight + FadeIn (200ms)
├── Exit: SlideOutRight + FadeOut (200ms)
├── Auto-dismiss: 5000ms default
└── Manual dismiss: X button or swipe

Multiple Toasts:
├── Stack vertically
├── Space between: 12px
├── Max simultaneous: 3
└── Overflow: Scroll or FIFO
```

### Skeleton Loader

```
Shape Variants:
├── Rectangle: 12px border radius
├── Circle: 100% border radius
├── Line: 8px border radius
└── Text block: Multiple lines

Animation:
├── Background: Gradient animation
├── Direction: Left to right
├── Speed: 2s duration
├── Easing: Linear infinite
├── Color: Gradient from surface to lighter

Pulses:
├── Opacity: 0.6 → 1.0 → 0.6
├── Duration: 1.5s
└── Easing: Ease-in-out

Implementation:
├── Responsive widths
├── Maintain layout (prevents CLS)
└── Match final component dimensions
```

---

## 🎬 Motion & Animation Specifications

### Timing Functions

```css
--ease-in-out:    cubic-bezier(0.4, 0, 0.2, 1);
--ease-out:       cubic-bezier(0, 0, 0.2, 1);
--ease-in:        cubic-bezier(0.4, 0, 1, 1);
--spring:         cubic-bezier(0.34, 1.56, 0.64, 1);
--bounce:         cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Duration Scale

```
Micro:     150ms (hover, small interactions)
Short:     300ms (component transitions)
Standard:  500ms (page transitions)
Long:      800ms (complex animations)
Extended:  1200ms (entrance animations)
```

### Entrance Animations

```
Fade In:
├── From: opacity 0
├── To: opacity 1
├── Duration: 300ms
└── Timing: ease-out

Slide In (from top):
├── From: translateY(-20px), opacity 0
├── To: translateY(0), opacity 1
├── Duration: 300ms
└── Timing: ease-out

Scale In:
├── From: scale(0.95), opacity 0
├── To: scale(1), opacity 1
├── Duration: 300ms
└── Timing: ease-out

Bounce In:
├── From: scale(0.3), opacity 0
├── To: scale(1), opacity 1
├── Duration: 500ms
└── Timing: spring effect
```

### Hover Effects

```
Button Hover:
├── Scale: scale(1.02)
├── Duration: 150ms
└── Timing: ease-out

Card Hover:
├── TranslateY: -4px
├── Shadow increase
├── Duration: 200ms
└── Timing: ease-out

Badge Hover:
├── Scale: scale(1.1)
├── Glow intensity up
├── Duration: 200ms
└── Timing: ease-out

Text Link Hover:
├── Underline expand
├── Color brighten
├── Duration: 150ms
└── Timing: ease-out
```

### Loading States

```
Spinner:
├── Rotation: 360deg
├── Duration: 1.5s
├── Repeat: Infinite
├── Timing: Linear

Pulse:
├── Opacity: 1 → 0.4 → 1
├── Duration: 2s
├── Repeat: Infinite
├── Timing: Ease-in-out

Shimmer:
├── Gradient position: -1000px → 1000px
├── Duration: 2s
├── Repeat: Infinite
└── Timing: Linear
```

### Celebration Animations

```
Confetti Burst:
├── Particle count: 50-100
├── Spread angle: 360°
├── Velocity: 300-600px/s
├── Gravity: 0.5
├── Lifetime: 3000ms
├── Colors: Pink, Purple, Cyan, Orange

Badge Unlock:
├── Pop: scale(1.0 → 1.3 → 1.0)
├── Duration: 600ms
├── Repeat: Once
├── Follow-up: Float animation (continuous)

Achievement Toast:
├── Slide in: Right to left
├── Scale: 0.8 → 1.0
├── Duration: 400ms
├── Glow: Pulsing background
└── Auto-dismiss: 5000ms
```

---

## 🖼️ Responsive Design Specifications

### Breakpoints

```typescript
const breakpoints = {
  xs: 320,    // Mobile extra small
  sm: 640,    // Mobile small
  md: 768,    // Tablet
  lg: 1024,   // Desktop small
  xl: 1280,   // Desktop
  '2xl': 1536 // Desktop large
}
```

### Layout Grids

```
Mobile (< 640px):
├── Columns: 1
├── Padding: 16px
├── Gap: 16px
└── Full-width stacking

Small Tablet (640px - 768px):
├── Columns: 2
├── Padding: 20px
├── Gap: 20px
└── Sidebar: Collapsible

Tablet (768px - 1024px):
├── Columns: 3
├── Padding: 24px
├── Gap: 24px
├── Sidebar: 240px width

Desktop (1024px - 1280px):
├── Columns: 4
├── Padding: 32px
├── Gap: 24px
└── Sidebar: 280px width

Large Desktop (1280px+):
├── Columns: 5+
├── Max-width: 1280px container
├── Padding: 40px
└── Gap: 28px
```

### Achievement Grid Responsive

```
Mobile (2 columns):
├── Badge size: 140px
├── Font size: Body S
└── Grid gap: 16px

Tablet (3 columns):
├── Badge size: 140px
├── Font size: Body M
└── Grid gap: 20px

Desktop (4 columns):
├── Badge size: 140px
├── Font size: Body M
└── Grid gap: 24px

Large (5 columns):
├── Badge size: 150px
├── Font size: Body L
└── Grid gap: 28px
```

---

## ♿ Accessibility Specifications

### WCAG 2.1 Level AA Compliance

```
Color Contrast:
├── Normal text: 4.5:1 minimum
├── Large text (18pt+): 3:1 minimum
├── UI components: 3:1 minimum
└── Color alone: Never convey information

Focus Management:
├── All interactive elements: Keyboard focusable
├── Focus order: Logical and intuitive
├── Focus indicator: Visible (2px outline minimum)
├── Focus trap: Modal dialogs only
└── Skip links: Present on all pages

Motion:
├── Respect prefers-reduced-motion
├── Disable animations: !important
├── Falls back to instant transitions
└── No auto-playing videos (muted auto-play OK)

Text Sizing:
├── Minimum: 14px
├── Line height: 1.5 minimum
├── Letter spacing: 0.12em for body text
└── Avoid justified text alignment

Interactive Elements:
├── Minimum size: 44x44px (touch target)
├── Spacing: 8px minimum between targets
├── Descriptive labels: All inputs and buttons
├── Error messages: Clear, associated with input
└── Help text: Always provided

Images:
├── All images: Descriptive alt text
├── Decorative images: Empty alt="" or aria-hidden
├── Complex images: Long description
└── Charts/graphs: Data table alternative

Keyboard Navigation:
├── Tab: Move forward through elements
├── Shift+Tab: Move backward
├── Enter: Activate buttons/links
├── Space: Toggle checkboxes, activate buttons
├── Arrow keys: Select options
└── Escape: Close modals/menus

Screen Reader:
├── Semantic HTML: <button>, <a>, <form>
├── ARIA labels: As needed
├── Landmarks: Proper <main>, <nav>, <aside>
├── Live regions: aria-live for updates
└── Hidden content: aria-hidden when appropriate
```

---

## 🎨 Theme Variables Export

```typescript
export const theme = {
  colors: {
    primary: '#A855F7',
    primaryLight: '#D8B4FE',
    secondary: '#EC4899',
    accent: '#00D9FF',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F1F5F9',
    textSecondary: '#CBD5E1',
    border: '#334155'
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px'
  },
  
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px'
  },
  
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px'
  },
  
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 15px rgba(0,0,0,0.1)',
    xl: '0 20px 25px rgba(0,0,0,0.1)',
    glow: '0 0 20px rgba(168,85,247,0.3)'
  },
  
  transitions: {
    micro: '150ms ease-in-out',
    short: '300ms ease-in-out',
    base: '500ms ease-in-out',
    long: '800ms ease-in-out'
  }
}
```

---

**End of Design System**

*All specifications should be implemented using Tailwind CSS with custom theme configuration.*
