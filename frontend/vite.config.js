import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const keyPath = path.resolve(__dirname, '../backend/certs/key.pem')
const certPath = path.resolve(__dirname, '../backend/certs/cert.pem')

let httpsConfig = false

if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  httpsConfig = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  }
} else {
  console.warn('⚠️ SSL Certificates not found in backend/certs/. Vite will start in HTTP mode.')
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: httpsConfig,
    port: 5173,
  }
})
