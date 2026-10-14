import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Content-Security-Policy for the built site. GitHub Pages cannot send HTTP
// headers, so it goes in a <meta> tag (which cannot carry frame-ancestors).
// Build only: the dev server injects inline scripts (React refresh) that this
// policy would block.
function contentSecurityPolicy(supabaseUrl: string): Plugin {
  const supabase = new URL(supabaseUrl).host
  const policy = [
    "default-src 'self'",
    "script-src 'self'",
    // Inline styles: motion animates through style attributes.
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    `img-src 'self' data: blob: https://${supabase}`,
    `connect-src 'self' https://${supabase} wss://${supabase}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')
  return {
    name: 'content-security-policy',
    apply: 'build',
    transformIndexHtml: () => [
      { tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: policy }, injectTo: 'head-prepend' },
    ],
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss(), contentSecurityPolicy(env.VITE_SUPABASE_URL)],
  }
})
