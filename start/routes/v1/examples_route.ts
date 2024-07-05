const ExamplesController = () => import('#controllers/examples_controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export default function exampleRoute() {
  router
    .group(() => {
      router.get('/', [ExamplesController, 'index'])

      router
        .group(() => {
          router.post('/', [ExamplesController, 'store'])
          router.get('/:id', [ExamplesController, 'show'])

          router
            .group(() => {
              router.patch('/:id', [ExamplesController, 'update'])
              router.delete('/:id', [ExamplesController, 'destroy'])
            })
            .use(middleware.verifiedEmail())
        })
        .middleware(middleware.auth({ guards: ['api'] }))
    })
    .prefix('/examples')
}
