tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Instrument Serif"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: {
          50:  '#fbf9f4',
          100: '#f6f2ea',
          200: '#ece6d8',
        },
        sage: {
          50:  '#f1f4f1',
          100: '#dde6df',
          200: '#bccdc1',
          300: '#92ad9a',
          400: '#6f8e79',
          500: '#557362',
          600: '#3f5a4c',
          700: '#32483d',
          800: '#293a32',
          900: '#1f2c26',
        },
        mist: {
          100: '#eaf0f1',
          200: '#cfdce0',
        },
        ink: '#1c2622',
      },
      letterSpacing: {
        'tightish': '-0.015em',
        'eyebrow':  '0.22em',
      },
      boxShadow: {
        'soft':   '0 1px 2px rgba(28,38,34,.04), 0 8px 24px -12px rgba(28,38,34,.10)',
        'lift':   '0 2px 4px rgba(28,38,34,.05), 0 24px 48px -20px rgba(28,38,34,.18)',
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: 0, transform: 'translateY(14px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'breathe': {
          '0%,100%': { transform: 'scale(1)' },
          '50%':     { transform: 'scale(1.04)' },
        },
      },
      animation: {
        'fade-up':  'fade-up .9s cubic-bezier(.2,.6,.2,1) both',
        'fade-in':  'fade-in 1.2s ease both',
        'breathe':  'breathe 9s ease-in-out infinite',
      },
    },
  },
};
