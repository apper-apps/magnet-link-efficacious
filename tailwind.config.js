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
          50: '#F3F0FF',
          100: '#E9E2FF',
          200: '#D6CAFF',
          300: '#B8A3FF',
          400: '#9575FF',
          500: '#6750A4',
          600: '#5A42A0',
          700: '#4D3694',
          800: '#3F2B87',
          900: '#33227A',
        },
        secondary: {
          50: '#F7F2FF',
          100: '#EDE1FF',
          200: '#DBC4FF',
          300: '#C299FF',
          400: '#A06EFF',
          500: '#7F67BE',
          600: '#6F57A8',
          700: '#5E4792',
          800: '#4E377C',
          900: '#3E2766',
        },
        surface: {
          50: '#FEF7FF',
          100: '#FCF0FF',
          200: '#F8E1FF',
          300: '#F2D2FF',
          400: '#EBC3FF',
          500: '#E3B4FF',
          600: '#DAA5FF',
          700: '#D196FF',
          800: '#C887FF',
          900: '#BF78FF',
        },
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
      },
      fontFamily: {
        'display': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-large': ['57px', { lineHeight: '64px', fontWeight: '400' }],
        'display-medium': ['45px', { lineHeight: '52px', fontWeight: '400' }],
        'display-small': ['36px', { lineHeight: '44px', fontWeight: '400' }],
        'headline-large': ['32px', { lineHeight: '40px', fontWeight: '600' }],
        'headline-medium': ['28px', { lineHeight: '36px', fontWeight: '600' }],
        'headline-small': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'title-large': ['22px', { lineHeight: '28px', fontWeight: '500' }],
        'title-medium': ['16px', { lineHeight: '24px', fontWeight: '500' }],
        'title-small': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'body-large': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-medium': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-small': ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'label-large': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'label-medium': ['12px', { lineHeight: '16px', fontWeight: '500' }],
        'label-small': ['11px', { lineHeight: '16px', fontWeight: '500' }],
      },
      backdropBlur: {
        'glass': '12px',
        'glass-lg': '20px',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        }
      },
    },
  },
  plugins: [],
}