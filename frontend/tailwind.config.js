/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    indigo: '#4338ca', // Deep Indigo
                    violet: '#7c3aed', // Deep Violet
                    'violet-dark': '#5b21b6',
                    cyan: '#06b6d4', // Accent Cyan
                    mint: '#10b981', // Success/Growth Mint
                    orange: '#f97316', // Vibrant Orange
                    dark: '#0f172a', // Slate 900
                    'dark-light': '#1e293b', // Slate 800
                    light: '#f8fafc', // Slate 50
                    surface: '#ffffff',
                    blue: '#2563eb', // Royal Blue
                    'blue-dark': '#1e40af', // Darker Royal Blue
                    'deep-bg': '#0B1120', // Very dark blue/slate for backgrounds
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Poppins', 'sans-serif'],
            },
            boxShadow: {
                'premium': '0 20px 40px -5px rgba(0, 0, 0, 0.1), 0 10px 20px -5px rgba(0, 0, 0, 0.04)',
                'premium-hover': '0 25px 50px -12px rgba(79, 70, 229, 0.25)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
                'neon': '0 0 10px rgba(6, 182, 212, 0.5), 0 0 20px rgba(124, 58, 237, 0.3)',
            },
            animation: {
                'scroll': 'scroll 60s linear infinite',
                'float': 'float 6s ease-in-out infinite',
                'fade-up': 'fadeUp 0.8s ease-out forwards',
                'shine': 'shine 2s linear infinite',
                'blob': 'blob 7s infinite',
            },
            keyframes: {
                scroll: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                shine: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                }
            }
        },
    },
    plugins: [],
}
