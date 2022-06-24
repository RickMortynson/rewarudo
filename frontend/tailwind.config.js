/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: 'rgb(var(--color-brand) / <alpha-value>)'
      },
      backgroundColor: {
        skin: {
          base: 'var(--color-bg-base)',
          secondary: 'var(--color-bg-secondary)'
        }
      },
      textColor: {
        skin: {
          base: 'var(--color-text-base)',
          accent: 'var(--color-text-accent)',
          invert: 'var(--color-text-invert)'
        }
      },
      borderColor: {
        skin: {
          base: 'var(--color-border-base)',
          invert: 'var(--color-border-invert)'
        }
      },
      outlineColor: {
        skin: {
          base: 'var(--color-outline-base)'
        }
      }
    }
  },
  plugins: [
    ({ addVariant }) => {
      addVariant('children', '& > *')
    }
  ]
}
