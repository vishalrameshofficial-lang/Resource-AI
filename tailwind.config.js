/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        enterprise: {
          bg: '#F7FAFC',
          surface: '#FFFFFF',
          sidebar: '#0B1F3A',
          sidebarDark: '#081B33',
          sidebarBorder: '#102A43',
          navy: '#102A43',
          muted: '#64748B',
          border: '#E5EAF0',
          tableHeader: '#F4F7FA',
          tableHover: '#F8FBFF',
        },
        brand: {
          primary: '#1677E8',  // Professional Enterprise Blue
          cyan: '#08A8C8',     // Professional Cyan
          teal: '#16B8A6',
          green: '#16A974',
          purple: '#7257E8',
        },
        status: {
          critical: '#EF4444',
          warning: '#F59E0B',
          healthy: '#16A974',
          info: '#1677E8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'title': ['34px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'section': ['24px', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        'kpi': ['32px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      },
      borderRadius: {
        'btn': '9px',
        'card': '14px',
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'card': '0 4px 18px rgba(15, 23, 42, 0.05)',
        'card-hover': '0 8px 24px rgba(15, 23, 42, 0.08)',
        'subtle': '0 1px 3px 0 rgba(16, 42, 67, 0.04)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
