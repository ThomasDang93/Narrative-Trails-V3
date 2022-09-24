/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'nunito': ['nunito', 'poppins', 'san-serif'] 
      },
      colors: {
        'bottomNav': '#1F7272',
        'customGreen': '#077272',
        },
        backgroundImage: {
          'hero-pattern': "url('/Hero_image.png')",
          'green-texture': "url('/greentexture.png')",
        },

        screens: {
          'sm': '460px',
          'md': '768px',
          // => @media (min-width: 768px) { ... }
    
          'lg': '1024px',
          // => @media (min-width: 1024px) { ... }
    
          'xl': '1280px',
          // => @media (min-width: 1280px) { ... }
    
          '2xl': '1536px',
        },
    },
  },
  plugins: [],
}