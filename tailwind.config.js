/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
colors: {
        'primary-navy': '#1e3a8a',
        'primary-gold': '#f59e0b',
        'neutral-off-white': '#f3f4f6',
        'neutral-white': '#ffffff',
        'neutral-light-gray': '#e5e7eb',
        'neutral-medium-gray': '#6b7280',
        'status-success': '#10b981',
        'status-error': '#ef4444',
        'status-warning': '#f59e0b'
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
