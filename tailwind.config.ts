import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#14235E',
          yellow: '#FFC94A',
        },
        accent: {
          sky: '#4FC3E8',
          coral: '#FF6F61',
          green: '#3BB273',
          purple: '#7C5CFC',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
