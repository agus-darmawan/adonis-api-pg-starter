import User from '#models/user'
import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import VerifyEmailNotification from '#mails/verify_email_notification'
import ResetPasswordNotification from '#mails/reset_password_notification'
import mail from '@adonisjs/mail/services/main'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const messagesProvider = new SimpleMessagesProvider({
  'required': 'The {{ field }} field is required.',
  'email.email': 'The email must be a valid email address.',
  'password.minLength': 'The password must be at least 8 characters.',
  'password.confirmed': 'The password confirmation does not match.',
})

export default class AuthController {
  async login({ request, response }: HttpContext) {
    const data = await vine
      .compile(
        vine.object({
          email: vine.string().trim().email(),
          password: vine.string(),
        })
      )
      .validate(request.all(), { messagesProvider })

    try {
      const user = await User.verifyCredentials(data.email, data.password)
      const token = await User.accessTokens.create(user, ['*'], { expiresIn: '1 days' })

      if (!token.value!.release()) {
        return response.unprocessableEntity({ error: 'Invalid email or password.' })
      }

      return response.ok({ token: token.value!.release() })
    } catch {
      return response.unprocessableEntity({ error: 'Invalid email or password.' })
    }
  }

  async register({ request, response }: HttpContext) {
    const data = await vine
      .compile(
        vine.object({
          email: vine.string().trim().email(),
          password: vine.string().minLength(8).confirmed(),
        })
      )
      .validate(request.all(), { messagesProvider })

    try {
      if (await User.query().where('email', data.email).first()) {
        return response.conflict({ error: 'The email has already been taken.' })
      }

      const user = await User.create({ email: data.email, password: data.password })
      await mail.send(new VerifyEmailNotification(user))
      return response.ok({
        success: 'Please check your email inbox (and spam) for an access link.',
      })
    } catch (e) {
      return response.unprocessableEntity({ error: e.message })
    }
  }

  async user({ auth, response }: HttpContext) {
    return response.ok({ user: auth.user })
  }

  async logout({ auth, response }: HttpContext) {
    await User.accessTokens.delete(auth.user!, auth.user!.currentAccessToken.identifier)
    return response.ok({ success: 'Logged out successfully.' })
  }

  async verifyEmail({ params, request, response }: HttpContext) {
    if (!request.hasValidSignature()) {
      return response.unprocessableEntity({ error: 'Invalid verification link.' })
    }

    const email = decodeURIComponent(params.email)
    const user = await User.query().where('id', params.id).where('email', email).first()
    if (!user) {
      return response.unprocessableEntity({ error: 'Invalid verification link.' })
    }

    if (!user.emailVerifiedAt) {
      user.emailVerifiedAt = DateTime.utc()
      await user.save()
    }

    return response.ok({ success: 'Email verified successfully.' })
  }

  async resendVerificationEmail({ auth, response }: HttpContext) {
    try {
      if (auth.user!.emailVerifiedAt) {
        return response.unprocessableEntity({ error: 'Your email is already verified.' })
      }
      await mail.send(new VerifyEmailNotification(auth.user!))
      return response.ok({ success: 'Verification email sent successfully.' })
    } catch (e) {
      return response.unprocessableEntity({ error: e.message })
    }
  }

  async forgotPassword({ request, response }: HttpContext) {
    const data = await vine
      .compile(
        vine.object({
          email: vine.string().trim().email(),
        })
      )
      .validate(request.all(), { messagesProvider })

    const user = await User.findBy('email', data.email)
    if (!user) {
      return response.unprocessableEntity({
        error: "We can't find a user with that e-mail address.",
      })
    }
    await mail.send(new ResetPasswordNotification(user))
    return response.ok({
      success: 'Please check your email inbox (and spam) for a password reset link.',
    })
  }

  async resetPassword({ params, request, response }: HttpContext) {
    if (!request.hasValidSignature()) {
      return response.unprocessableEntity({ error: 'Invalid reset password link.' })
    }

    const user = await User.find(params.id)
    if (!user) {
      return response.unprocessableEntity({ error: 'Invalid reset password link.' })
    }

    if (encodeURIComponent(user.password) !== params.token) {
      return response.unprocessableEntity({ error: 'Invalid reset password link.' })
    }

    const data = await vine
      .compile(
        vine.object({
          password: vine.string().minLength(8).confirmed(),
        })
      )
      .validate(request.all(), { messagesProvider })

    user.password = data.password
    await user.save()

    return response.ok({ success: 'Password reset successfully.' })
  }
}
