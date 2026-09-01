/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Tajawal', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#fff9f0',
          100: '#fff1db',
          200: '#ffe4b8',
          300: '#ffd085',
          400: '#ffbb4d',
          500: '#ffaf2e',
          600: '#FFA617',
          700: '#fd9a00',
          800: '#d68400',
          900: '#b36e00',
        },
      },
    },
  },
  plugins: [],
}
