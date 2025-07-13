const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        // Add more if needed...
      },
    },
  },
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        '.bg-background': {
          'background-color': 'hsl(var(--background))',
        },
        '.text-foreground': {
          'color': 'hsl(var(--foreground))',
        },
        '.border-border': {
          'border-color': 'hsl(var(--border))',
        },
      });
    }),
  ],
}
