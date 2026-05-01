/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
    animation: {
        'score-pop': 'scorePop 1s ease-out forwards',
        'fade-zoom': 'fadeZoom 0.6s ease-out',
        'timer-pulse': 'timerPulse 1s infinite',
        'flicker': 'flicker 0.1s ease-in-out 3'
    },
    keyframes: {
        scorePop: {
        '0%': { opacity: '0', transform: 'translate(-50%, 0px) scale(0.8)' },
        '50%': { opacity: '1', transform: 'translate(-50%, -20px) scale(1.2)' },
        '100%': { opacity: '0', transform: 'translate(-50%, -40px) scale(1)' }
        },
        fadeZoom: {
        '0%': { opacity: '0', transform: 'scale(0.5)' },
        '100%': { opacity: '1', transform: 'scale(1)' }
        },
        timerPulse: {
        '0%, 100%': { transform: 'scale(1)' },
        '50%': { transform: 'scale(1.1)' }
        },
        flicker: {
            '0%, 100%': { opacity: '1' },
            '50%': { opacity: '0' }
        }
    }
    },
  },
  plugins: [],
}