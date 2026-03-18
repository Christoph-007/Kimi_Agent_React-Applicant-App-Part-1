/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // ── Design tokens extracted from reference screenshots ──────────────
        // Deep forest green: navbar, dark sections, primary buttons
        forest: {
          50:  '#eaf3ed',
          100: '#c7e2ce',
          200: '#9ecbad',
          300: '#75b48c',
          400: '#55a373',
          500: '#35925a',
          600: '#2c7a4c',
          700: '#22623d',
          800: '#184a2e',
          900: '#0D2B1A',  // ← exact dark bg from screenshots
          950: '#081810',
        },
        // Lime/yellow-green: CTA buttons, active tags, search icon, accents
        lime: {
          DEFAULT: '#C8F435',
          50:  '#f7ffe0',
          100: '#eeffc0',
          200: '#deff87',
          300: '#C8F435',  // ← exact lime from screenshots
          400: '#b0e020',
          500: '#8fc410',
          600: '#6ea008',
          700: '#507c06',
          800: '#3a5c08',
          900: '#283f08',
        },
        // Warm cream: light section backgrounds
        cream: {
          DEFAULT: '#F5F5ED',
          50: '#FAFAF5',
          100: '#F5F5ED',  // ← exact cream bg from screenshots
          200: '#EAEADF',
          300: '#DEDED0',
        },
        // Hot pink/coral: floating decorative badge accent
        pink: {
          accent: '#E84B6C',
        },
        gray: {
          50:  '#f8f9fa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      borderRadius: {
        xl:  "calc(var(--radius) + 4px)",
        lg:  "var(--radius)",
        md:  "calc(var(--radius) - 2px)",
        sm:  "calc(var(--radius) - 4px)",
        xs:  "calc(var(--radius) - 6px)",
        '2xl': '1rem',     // cards
        '3xl': '1.25rem',  // dark panels
        '4xl': '1.5rem',   // hero image
        full: '9999px',    // buttons, inputs, badges (pill)
      },
      boxShadow: {
        xs:           "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        card:         "0 2px 12px rgba(0,0,0,0.06)",
        'card-hover': "0 8px 32px rgba(0,0,0,0.12)",
        'btn':        "0 2px 8px rgba(13,43,26,0.15)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'display': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        'h1':      ['3rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '800' }],
        'h2':      ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h3':      ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],
      },
      letterSpacing: {
        tightest: '-0.02em',
        tighter:  '-0.01em',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "accordion-down":  "accordion-down 0.2s ease-out",
        "accordion-up":    "accordion-up 0.2s ease-out",
        "caret-blink":     "caret-blink 1.25s ease-out infinite",
        "fade-up":         "fade-up 0.3s ease-out",
        "fade-in":         "fade-in 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
