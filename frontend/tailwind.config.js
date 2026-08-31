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
        brand: {
          yellow: '#FBBF24',
          amber: '#F59E0B',
          sunset: '#F97316',
          coral: '#EA580C',
          darkCoral: '#C2410C',
          peach: '#FFF7ED',
          peachLight: '#FFEDD5',
          peachBorder: '#FED7AA',
        },
        obsidian: {
          base: '#0A0A0C',
          card: '#121214',
          elevated: '#18181B',
          hover: '#27272A',
          border: '#27272A',
          borderLight: '#3F3F46',
        },
        status: {
          hold: '#EA580C',
          sold: '#EF4444',
          verified: '#10B981',
        }
      },
      fontFamily: {
        heading: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Space Mono"', 'monospace'],
      },
      boxShadow: {
        'cyber-sm': '0 1px 3px rgba(0, 0, 0, 0.6)',
        'cyber-md': '0 4px 20px -2px rgba(0, 0, 0, 0.8)',
        'amber-glow': '0 0 25px rgba(249, 115, 22, 0.3)',
        'sunset-glow': '0 4px 20px rgba(249, 115, 22, 0.25)',
        'dock': '0 -4px 30px rgba(0, 0, 0, 0.9)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #FBBF24 0%, #F97316 50%, #EA580C 100%)',
        'sunset-gradient': 'linear-gradient(135deg, #FBBF24 0%, #F97316 50%, #EA580C 100%)',
        'sunset-soft': 'linear-gradient(135deg, #FEF3C7 0%, #FFEDD5 50%, #FFF7ED 100%)',
        'glass-gradient': 'linear-gradient(180deg, rgba(24, 24, 27, 0.7) 0%, rgba(18, 18, 20, 0.95) 100%)',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.03)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      animation: {
        shimmer: 'shimmer 3s infinite',
        pulseGlow: 'pulseGlow 2s infinite ease-in-out',
        marquee: 'marquee 28s linear infinite',
      }
    },
  },
  plugins: [],
}
