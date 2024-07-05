const AuthController = () => import('#controllers/auth_controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export default function authRoutes() {
  router
    .group(() => {
      router.post('/login', [AuthController, 'login'])
      router.post('/register', [AuthController, 'register'])
      router.get('/email/verify/:email/:id', [AuthController, 'verifyEmail']).as('verifyEmail')
      router.post('/password/forgot', [AuthController, 'forgotPassword'])
      router
        .post('/password/reset/:id/:token', [AuthController, 'resetPassword'])
        .as('resetPassword')

      router
        .group(() => {
          router.post('/logout', [AuthController, 'logout'])
          router.get('/user', [AuthController, 'user'])
          router.post('/email/verify/resend', [AuthController, 'resendVerificationEmail'])
        })
        .middleware(middleware.auth({ guards: ['api'] }))
    })
    .prefix('/auth')
}
