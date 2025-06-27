/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'Satoshi', 'IBM Plex Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: {
          primary: '#f5f5f4',    
          secondary: '#fafaf9', 
        },
        accent: {
          green: '#a3b18a',      
          beige: '#d6ccc2',      
          matcha: '#8b9a47',     
        },
        text: {
          primary: '#1a1a1a',    
          secondary: '#4a4a4a',  
          muted: '#6b6b6b',     
        },
        border: {
          primary: '#1a1a1a',   
          secondary: '#d1d5db',
        }
      },
      borderWidth: {
        '2': '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-in': 'bounceIn 0.8s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'brute': '4px 4px 0px #1a1a1a',
        'brute-lg': '6px 6px 0px #1a1a1a',
        'brute-sm': '2px 2px 0px #1a1a1a',
      }
    },
  },
  plugins: [],
}

