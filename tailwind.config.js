/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    darkMode: ['class', 'dark-mode'],
    theme: {
        extend: {
            colors: {
                newsprint: 'rgb(var(--rgb-newsprint) / <alpha-value>)',
                'newsprint-dark': 'rgb(var(--rgb-newsprint-dark) / <alpha-value>)',
                ink: 'rgb(var(--rgb-ink) / <alpha-value>)',
                'ink-light': 'rgb(var(--rgb-ink-light) / <alpha-value>)',
                surface: 'rgb(var(--rgb-surface) / <alpha-value>)',
            },
            fontFamily: {
                masthead: ['"UnifrakturMaguntia"', 'serif'],
                headline: ['"Playfair Display"', 'serif'],
                body: ['"Newsreader"', 'serif'],
                mono: ['"Courier Prime"', 'monospace'],
            },
            backgroundImage: {
                'paper-texture': "url('/cream-paper.png')",
            },
            screens: {
                xs: '475px',
            },
            animation: {
                in: 'fadeIn 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
};
