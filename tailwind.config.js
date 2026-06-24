/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0E1311',
        panel: '#161E1A',
        panel2: '#1C2621',
        line: '#27332C',
        chalk: '#EAE8DF',
        muted: '#8B958C',
        phase: {
          fundament: '#5B8A9E',
          aufbau: '#5BA17E',
          hochphase: '#D99A4E',
          peak: '#D9695B',
          deload: '#8893A6'
        },
        type: {
          speed: '#D9695B',
          kraft: '#C98A3E',
          aerob: '#5BA17E',
          intervall: '#E0B341',
          ruhe: '#6B7670',
          locker: '#7E9488'
        }
      },
      fontFamily: {
        heading: ['"Saira Condensed"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      }
    }
  },
  plugins: []
};
