import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow:       '#F5C842',
          'yellow-dark':'#E8B820',
          teal:         '#2E6B7A',
          'teal-dark':  '#1E4F5A',
          green:        '#6AAF3D',
          'green-dark': '#4F8A2E',
          'green-light':'#E4F3F7',
          'off-white':  '#F7FBFD',
        },
      },
      fontFamily: {
        display: ['var(--font-baloo2)', 'cursive'],
        heading: ['var(--font-baloo2)', 'sans-serif'],
        body:    ['var(--font-nunito)', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        card: '0 4px 20px rgba(46,107,122,0.12)',
        btn:  '0 4px 14px rgba(46,107,122,0.35)',
      },
    },
  },
  plugins: [],
}

export default config
