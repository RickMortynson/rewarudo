module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      backgroundColor: {
        skin: {
          base: 'var(--color-bg-base)',
          secondary: 'var(--color-bg-secondary)',
          ternary: 'var(--color-bg-ternary)'
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
      }
    }
  },
  plugins: [
    ({ addVariant }) => {
      addVariant('children', '& > *')
    }
  ]
}
