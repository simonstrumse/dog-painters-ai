import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: ['src/**/*.{ts,tsx}', 'app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1rem',
        screens: { '2xl': '1200px' },
      }
    },
  },
  plugins: [],
} satisfies Config

