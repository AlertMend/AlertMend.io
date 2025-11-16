import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'

// Plugin to generate blog HTML files after build
// Note: Blog HTML is now generated before build via npm script
const generateBlogHtmlPlugin = () => {
  return {
    name: 'generate-blog-html',
    writeBundle() {
      // Blog HTML is already generated before build, but we can regenerate here as a fallback
      // This ensures HTML files are in the dist folder
      try {
        console.log('Ensuring blog HTML files are in dist...')
        execSync('node scripts/build-blog-html.js', { stdio: 'inherit' })
      } catch (error) {
        console.error('Error generating blog HTML files:', error)
      }
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), generateBlogHtmlPlugin()],
  publicDir: 'public',
})

