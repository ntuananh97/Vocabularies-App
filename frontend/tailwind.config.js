/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        newWord: '#1976D2',  // màu xanh lam đậm cho "Word"
        newSentence: '#FFB74D', // màu cam nhạt cho "Sentence"
      },
    },
  },
  plugins: [],
}

