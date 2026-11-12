import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fetchPlayerBio } from './server/playerBio.js'

// Dev only: answer /api/player/:id (the player card's bio) straight from the
// API with the key in .env. In production a Netlify function does this with
// caching (netlify/functions/player.mjs).
function playerApi(key) {
  return {
    name: 'dunkfu-player-api',
    configureServer(server) {
      server.middlewares.use('/api/player/', async (req, res) => {
        const id = req.url.split('?')[0].replace(/\D/g, '')
        try {
          const bio = await fetchPlayerBio(id, key)
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify(bio))
        } catch (e) {
          res.statusCode = 502
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify({ error: e.message }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return { plugins: [vue(), playerApi(env.HIGHLIGHTLY_API_KEY)] }
})
