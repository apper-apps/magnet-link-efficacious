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
        primary: {
          50: '#F8F7FF',
          100: '#F1EFFF',
          200: '#E4E0FF',
          300: '#CFC8FF',
          400: '#B4A7FF',
          500: '#9580FF',
          600: '#7C63F7',
          700: '#6B4EE8',
          800: '#5A3FD4',
          900: '#4C33B8',
          950: '#2E1F6B',
        },
        secondary: {
          50: '#FFF8F7',
          100: '#FFF1EF',
          200: '#FFE1DC',
          300: '#FFC7BE',
          400: '#FFA08F',
          500: '#FF7959',
          600: '#F05A35',
          700: '#E04824',
          800: '#B93D1F',
          900: '#983621',
          950: '#53190D',
        },
        accent: {
          50: '#F0FDF9',
          100: '#DDFBF1',
          200: '#BCF5E4',
          300: '#86EBCF',
          400: '#4ADAB6',
          500: '#22C997',
          600: '#16A57D',
          700: '#158566',
          800: '#166A53',
          900: '#155845',
          950: '#083228',
        },
        neutral: {
          50: '#FAFBFB',
          100: '#F4F6F8',
          200: '#E5E9ED',
          300: '#CFD6DD',
          400: '#B2BCC7',
          500: '#8E9AAA',
          600: '#6B7A8F',
          700: '#576375',
          800: '#4A5563',
          900: '#3E4954',
          950: '#262C35',
        },
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        danger: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
      },
      fontFamily: {
        'display': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
        'xs': ['0.75rem', { lineHeight: '1.125rem' }],
        'sm': ['0.875rem', { lineHeight: '1.375rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.875rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.375rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.75rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'glass': '0 4px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-lg': '0 8px 64px 0 rgba(31, 38, 135, 0.37)',
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'glow': '0 0 20px rgba(149, 128, 255, 0.3)',
        'glow-lg': '0 0 40px rgba(149, 128, 255, 0.4)',
      },
      backdropBlur: {
        'glass': '12px',
        'glass-lg': '20px',
        'glass-xl': '40px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(149, 128, 255, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(149, 128, 255, 0.5)' }
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      },
    },
  },
  plugins: [],
}