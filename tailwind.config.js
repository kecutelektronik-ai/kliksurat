/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          burgundy: '#4A1525',
          'burgundy-dark': '#340D19',
          'burgundy-light': '#F8EDF0',
          'burgundy-glow': '#5E1B30',
          olive: '#334426',
          'olive-dark': '#24311A',
          'olive-light': '#EFF4EC',
          'olive-glow': '#465A34',
          champagne: '#D4C2A3',
          'champagne-dark': '#B59F7C',
          'champagne-light': '#FAF7F2',
          espresso: '#161113',
        },
        primary: {
          DEFAULT: '#4A1525',        // Dominan Burgundy Silk (Kemewahan Marun Kerajaan)
          dark: '#340D19',
          light: '#F8EDF0',
          container: '#5E1B30',
          fixed: '#E6C9D1',
          dim: '#D1A3B0',
        },
        accent: {
          DEFAULT: '#334426',         // Dominan Green Olive Silk (Keanggunan Zaitun Mewah)
          dark: '#24311A',
          light: '#EFF4EC',
          container: '#465A34',
        },
        secondary: {
          DEFAULT: '#334426',
          dark: '#24311A',
          light: '#EFF4EC',
          container: '#465A34',
          fixed: '#D3DFCA',
        },
        warning: {
          DEFAULT: '#D4C2A3',         // Champagne Silk Gold (Aksen Emas Sutra)
          dark: '#B59F7C',
          light: '#FAF7F2',
          container: '#F3ECE0',
          fixed: '#E8DBC5',
        },
        tertiary: {
          DEFAULT: '#D4C2A3',
          dark: '#B59F7C',
          light: '#FAF7F2',
          container: '#F3ECE0',
          fixed: '#E8DBC5',
        },
        danger: {
          DEFAULT: '#73182B',         // Deep Wine Crimson
          dark: '#4F0E1C',
          light: '#FCECEF',
          container: '#FCECEF',
        },
        success: {
          DEFAULT: '#334426',         // Green Olive Silk
          dark: '#24311A',
          light: '#EFF4EC',
          container: '#DCE8D5',
        },
        surface: {
          DEFAULT: '#FAF8F5',         // Warm Pearl / Alabaster Silk (Latar Belakang Mewah)
          low: '#F3EFE9',
          lowest: '#FFFFFF',
          high: '#EAE4DC',
          dim: '#DDD5C9',
        },
        outline: {
          DEFAULT: '#786F69',         // Warm Taupe
          variant: '#D4CCC2',
          subtle: 'rgba(120, 111, 105, 0.18)',
        },
        'on-surface': '#1C1618',      // Espresso Noir Text
        'on-surface-variant': '#786F69',
        'inverse-surface': '#161113',
        'bg-main': '#FAF8F5',
        'bg-card': '#FFFFFF',
        'text-main': '#1C1618',
        'text-muted': '#786F69',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        code: ['Inter', 'monospace'],
      },
      borderRadius: {
        'card': '12px',
        'btn': '10px',
      }
    },
  },
  plugins: [],
}
