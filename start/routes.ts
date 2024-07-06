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
import { sep, normalize } from 'node:path'
import app from '@adonisjs/core/services/app'
import authRoute from './routes/v1/auth_route.js'
import filesRoute from './routes/v1/files_route.js'
import exampleRoute from './routes/v1/examples_route.js'

const PATH_TRAVERSAL_REGEX = /(?:^|[\\/])\.\.(?:[\\/]|$)/

router.get('/', async ({ response }: HttpContext) => {
  response.status(200).json({
    status: 200,
    message: 'Welcome to Adonis Api Postgres Starter!',
  })
})

router
  .group(() => {
    authRoute()
    filesRoute()
    exampleRoute()
  })
  .prefix('/api/v1')

router.get('/uploads/*', ({ request, response }) => {
  const filePath = request.param('*').join(sep)
  const normalizedPath = normalize(filePath)
  if (PATH_TRAVERSAL_REGEX.test(normalizedPath)) {
    return response.badRequest({
      success: false,
      message: 'Invalid file path.',
    })
  }
  const absolutePath = app.makePath('uploads', normalizedPath)
  return response.download(absolutePath)
})

router.get('*', async ({ response }: HttpContext) => {
  response.status(404).json({
    status: 404,
    message: 'Route not found',
  })
})
