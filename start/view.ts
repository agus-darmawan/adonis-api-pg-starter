import env from '#start/env'
import edge from 'edge.js'

edge.global('env', {
  APP_URL: env.get('FRONTEND_URL'),
})
