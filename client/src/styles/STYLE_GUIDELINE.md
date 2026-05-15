# Infinite Analytics - Design System
## Modern Blue-Black Tech Theme

---

## Design Philosophy

Inspired by Vercel's refined minimalism, this design system embraces:
- **Elegant Darkness**: Deep blue-black backgrounds with subtle blue luminance
- **Precise Typography**: JetBrains Mono for code elements, Outfit for UI
- **Geometric Precision**: Sharp edges, consistent 8px grid, purposeful spacing
- **Electric Accents**: Cyan-blue gradients that pulse with energy
- **Glass Morphism**: Subtle transparency with backdrop blur

---

## Color Palette

### Background Colors
```css
--bg-primary: #020408       /* Deepest void - main background */
--bg-secondary: #0a0f1a     /* Elevated surfaces */
--bg-tertiary: #111827      /* Cards, panels */
--bg-elevated: #1a2332      /* Hover states, inputs */
```

### Border Colors
```css
--border-subtle: rgba(51, 65, 85, 0.5)    /* Invisible borders */
--border-default: #334155                 /* Visible borders */
--border-hover: #475569                   /* Interactive borders */
```

### Text Colors
```css
--text-primary: #f8fafc     /* Headlines, primary content */
--text-secondary: #94a3b8   /* Labels, descriptions */
--text-muted: #64748b       /* Placeholders, hints */
--text-inverse: #020408     /* Text on light surfaces */
```

### Accent Colors (Cyan-Blue Electric)
```css
--accent-50: #ecfeff
--accent-100: #cffafe
--accent-200: #a5f3fc
--accent-300: #67e8f9
--accent-400: #22d3ee      /* Primary accent */
--accent-500: #06b6d4      /* Buttons, links */
--accent-600: #0891b2      /* Hover states */
--accent-700: #0e7490
--accent-800: #155e75
--accent-900: #164e63
```

### Semantic Colors
```css
--success: #10b981
--success-dark: #059669
--warning: #f59e0b
--error: #ef4444
--error-dark: #dc2626
--info: #3b82f6
```

### Gradients
```css
--gradient-primary: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #6366f1 100%);
--gradient-glow: linear-gradient(135deg, rgba(6, 182, 212, 0.3) 0%, rgba(59, 130, 246, 0.1) 100%);
--gradient-dark: linear-gradient(180deg, #0a0f1a 0%, #020408 100%);
```

---

## Typography

### Font Families
```css
--font-display: 'Outfit', system-ui, sans-serif;      /* Headlines, UI */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace; /* Code, data */
```

### Type Scale
```
Display:   48px / 700 / -0.02em    /* Hero headlines */
H1:        36px / 600 / -0.02em    /* Page titles */
H2:        28px / 600 / -0.01em    /* Section headers */
H3:        22px / 600 / -0.01em    /* Card titles */
H4:        18px / 600 / 0          /* Subsection titles */
Body:      16px / 400 / 0          /* Paragraphs */
Body-sm:   14px / 400 / 0          /* Descriptions */
Caption:   12px / 500 / 0.02em     /* Labels, badges */
Code:      14px / 400 / 0          /* Monospace data */
```

### Typography Patterns
- **Headlines**: Tight letter-spacing (-0.02em), font-weight 600-700
- **Body**: Normal letter-spacing, font-weight 400
- **Labels**: Uppercase with 0.02em tracking, font-weight 500
- **Monospace**: Used for all data display, timestamps, metrics

---

## Spacing System (8px Grid)

```
0:   0px
1:   4px   (0.25rem)
2:   8px   (0.5rem)
3:   12px  (0.75rem)
4:   16px  (1rem)
5:   20px  (1.25rem)
6:   24px  (1.5rem)
8:   32px  (2rem)
10:  40px  (2.5rem)
12:  48px  (3rem)
16:  64px  (4rem)
20:  80px  (5rem)
24:  96px  (6rem)
```

---

## Border Radius

```
none:   0px
sm:     4px
md:     8px
lg:     12px
xl:     16px
2xl:    20px
full:   9999px
```

---

## Shadows & Effects

### Box Shadows
```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.2);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.2);
--shadow-glow: 0 0 20px rgba(6, 182, 212, 0.3);
--shadow-glow-lg: 0 0 40px rgba(6, 182, 212, 0.4);
```

### Backdrop Blur
```css
--blur-sm: blur(4px);
--blur-md: blur(8px);
--blur-lg: blur(16px);
```

---

## Components

### Buttons

**Primary Button**
- Background: gradient-primary
- Text: text-primary (white)
- Border-radius: md (8px)
- Padding: 12px 24px
- Font: 14px, weight 600
- Hover: Brighten gradient, add shadow-glow
- Active: Scale 0.98

**Secondary Button**
- Background: transparent
- Border: 1px solid border-default
- Text: text-secondary
- Hover: bg-tertiary, border-hover

**Ghost Button**
- Background: transparent
- Text: text-secondary
- Hover: bg-elevated

### Cards

**Default Card**
- Background: bg-tertiary
- Border: 1px solid border-subtle
- Border-radius: lg (12px)
- Padding: 24px
- Hover: border-default, subtle shadow

**Interactive Card**
- All above + cursor: pointer
- Hover: Transform translateY(-2px), shadow-md

### Inputs

**Text Input**
- Background: bg-secondary
- Border: 1px solid border-subtle
- Border-radius: md (8px)
- Padding: 12px 16px
- Text: text-primary
- Placeholder: text-muted
- Focus: border-accent-500, shadow-glow (subtle)

### Sidebar Navigation

- Width: 260px (expanded), 72px (collapsed)
- Background: bg-secondary with backdrop blur
- Border-right: 1px solid border-subtle
- Nav item height: 44px
- Icon size: 20px
- Active state: accent-500 left border, bg-elevated

### Icons

**ALL icons MUST use Lucide React**
- Never use custom SVG icons
- Never use React Icons
- Icon sizes: sm (16px), md (20px), lg (24px), xl (32px)
- Stroke width: 1.5px (default), 2px (emphasis)

---

## Layout

### App Shell
- Background: bg-primary
- Sidebar: Fixed left, 260px width
- Header: Fixed top, 64px height
- Main content: margin-left 260px, padding-top 64px
- Content max-width: 1400px, centered

### Responsive Breakpoints
```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

---

## Animation

### Transitions
```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
```

### Keyframe Animations
```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Pulse Glow */
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.3); }
  50% { box-shadow: 0 0 30px rgba(6, 182, 212, 0.5); }
}

/* Typewriter Cursor */
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
```

---

## Accessibility

- Minimum contrast ratio: 4.5:1 for text
- Focus indicators: 2px solid accent-400 with 2px offset
- Reduced motion: Respect prefers-reduced-motion
- Screen reader: Semantic HTML, proper ARIA labels

---

## Usage Guidelines

1. **Always use Lucide icons** - no custom SVGs
2. **Follow the spacing system** - never use arbitrary pixel values
3. **Use CSS variables** - never hardcode colors
4. **Maintain contrast** - ensure text is readable on all backgrounds
5. **Animate purposefully** - motion should guide, not distract
6. **Keep it minimal** - less is more in this aesthetic
