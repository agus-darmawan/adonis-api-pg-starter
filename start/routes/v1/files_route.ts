const FilesController = () => import('#controllers/files_controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export default function filesRoute() {
  router
    .group(() => {
      router.get('/', [FilesController, 'index'])

      router
        .group(() => {
          router.post('/', [FilesController, 'store'])
          router.get('/:id', [FilesController, 'show'])

          router
            .group(() => {
              router.patch('/:id', [FilesController, 'update'])
              router.delete('/:id', [FilesController, 'destroy'])
            })
            .use(middleware.verifiedEmail())
        })
        .middleware(middleware.auth({ guards: ['api'] }))
    })
    .prefix('/files')
}
