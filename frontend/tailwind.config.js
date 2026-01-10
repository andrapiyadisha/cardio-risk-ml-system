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
                    light: '#fca5a5', // red-300
                    DEFAULT: '#ef4444', // red-500
                    dark: '#b91c1c', // red-700
                },
                secondary: {
                    light: '#93c5fd', // blue-300
                    DEFAULT: '#3b82f6', // blue-500
                    dark: '#1d4ed8', // blue-700
                },
                dark: {
                    bg: '#0f172a', // slate-900
                    card: '#1e293b', // slate-800
                    text: '#f8fafc', // slate-50
                },
                light: {
                    bg: '#f8fafc', // slate-50
                    card: '#ffffff', // white
                    text: '#0f172a', // slate-900
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
