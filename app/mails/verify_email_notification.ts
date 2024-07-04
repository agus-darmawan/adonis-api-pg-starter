import User from '#models/user'
import env from '#start/env'
import router from '@adonisjs/core/services/router'
import { BaseMail } from '@adonisjs/mail'

export default class VerifyEmailNotification extends BaseMail {
  from = env.get('MAIL_FROM')
  subject = 'Verify Email Address'

  constructor(private user: User) {
    super()
  }

  prepare() {
    const signedURL = router
      .builder()
      .prefixUrl(env.get('BACKEND_URL'))
      .params({ id: this.user.id, email: this.user.email })
      .makeSigned('verifyEmail', {
        expiresIn: '15 minutes',
      })

    const verifyUrl = `${env.get('EMAIL_VERIFY_PAGE_URL')}?token=${encodeURIComponent(signedURL)}`

    this.message.to(this.user.email).htmlView('emails/verify_email', { verifyUrl })
  }
}
