/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Outfit"', 'system-ui', 'sans-serif'],
      },
      colors: {
        theme: {
          canvas: 'var(--bg-canvas)',
          surface: 'var(--card-surface)',
          border: 'var(--card-border)',
          main: 'var(--text-main)',
          muted: 'var(--text-muted)',
          accent: 'var(--accent-primary)',
          'accent-hover': 'var(--accent-hover)',
          'accent-light': 'var(--accent-light)',
          tag: 'var(--tag-bg)',
          'tag-text': 'var(--tag-text)',
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px var(--shadow-color)',
        'card': '0 4px 16px -2px var(--shadow-color), 0 1px 3px 0 rgba(0, 0, 0, 0.04)',
        'card-hover': '0 12px 28px -4px var(--shadow-color), 0 4px 8px -2px rgba(0, 0, 0, 0.06)',
        'button': '0 3px 10px 0 var(--shadow-color)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      }
    },
  },
  plugins: [],
}
