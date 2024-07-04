const AuthController = () => import('#controllers/auth_controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export default function authRoute() {
  router
    .group(() => {
      router.post('/login', [AuthController, 'login'])
      router.post('/register', [AuthController, 'register'])
      router.get('/email/verify/:email/:id', [AuthController, 'verifyEmail']).as('verifyEmail')
      router
        .group(() => {
          router.get('/user', [AuthController, 'user'])
          router.post('/logout', [AuthController, 'logout'])
        })
        .middleware(middleware.auth({ guards: ['api'] }))
    })
    .prefix('/auth')
}
