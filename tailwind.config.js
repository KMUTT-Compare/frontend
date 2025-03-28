/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        'itim-regular' : ['Kanit', 'sans-serif']
      }
    },
  },
  plugins: [
    require("daisyui"),
    require('flowbite/plugin')({
      charts: true,
  }),
  
  ],
  
}

