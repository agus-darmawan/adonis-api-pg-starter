/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { HttpContext } from '@adonisjs/core/http'

import authRoute from './routes/v1/auth_route.js'
import filesRoute from './routes/v1/files_route.js'
import exampleRoute from './routes/v1/examples_route.js'

router.get('/', async ({ response }: HttpContext) => {
  response.status(200).json({
    status: 200,
    message: 'Welcome to Adonis Api Postgres Starter!',
  })
})

router.get('*', async ({ response }: HttpContext) => {
  response.status(404).json({
    status: 404,
    message: 'Route not found',
  })
})

router
  .group(() => {
    authRoute()
    filesRoute()
    exampleRoute()
  })
  .prefix('/api/v1')
