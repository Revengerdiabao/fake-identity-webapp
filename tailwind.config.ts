import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Persona 3 colors
        p3blue: '#00aaff',
        p3darkblue: '#001a33',
        p3cyan: '#00f2ff',
        p3black: '#020617',
        p3white: '#f1f5f9',
        // Persona 5 colors
        p5red: '#f20d0d',
        p5black: '#000000',
        p5white: '#ffffff',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
