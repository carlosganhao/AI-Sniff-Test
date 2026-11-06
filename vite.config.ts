import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'
import tailwindcss from "@tailwindcss/vite"; 

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/AI-Sniff-Test/' : '/',
  build: {
    outDir: "docs",
  },
  plugins: [
    tailwindcss(),
    svelte()
  ],
})
