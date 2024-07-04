import User from '#models/user'
import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import VerifyEmailNotification from '#mails/verify_email_notification'
import ResetPasswordNotification from '#mails/reset_password_notification'
import mail from '@adonisjs/mail/services/main'
import vine from '@vinejs/vine'
import messagesProvider from '../../helper/validation_messages_provider.js'

export default class AuthController {
  async login({ request, response }: HttpContext) {
    try {
      const data = await vine
        .compile(
          vine.object({
            email: vine.string().trim().email(),
            password: vine.string(),
          })
        )
        .validate(request.all(), { messagesProvider })

      const user = await User.verifyCredentials(data.email, data.password)
      const token = await User.accessTokens.create(user, ['*'], { expiresIn: '1 days' })

      if (!token.value!.release()) {
        return response.unprocessableEntity({
          success: false,
          message: 'Invalid email or password.',
        })
      }

      return response.ok({
        success: true,
        message: 'Login successful.',
        data: token.value!.release(),
      })
    } catch (error) {
      return response.unprocessableEntity({
        success: false,
        message: 'Invalid email or password.',
        error: error.message,
      })
    }
  }

  async register({ request, response }: HttpContext) {
    try {
      const data = await vine
        .compile(
          vine.object({
            email: vine.string().trim().email(),
            password: vine.string().minLength(8).confirmed(),
          })
        )
        .validate(request.all(), { messagesProvider })

      if (await User.query().where('email', data.email).first()) {
        return response.conflict({
          success: false,
          message: 'The email has already been taken.',
        })
      }

      const user = await User.create({ email: data.email, password: data.password })
      await mail.send(new VerifyEmailNotification(user))
      return response.ok({
        success: true,
        message: 'Please check your email inbox (and spam) for an access link.',
      })
    } catch (error) {
      return response.unprocessableEntity({
        success: false,
        message: 'Registration failed.',
        error: error.message,
      })
    }
  }

  async user({ auth, response }: HttpContext) {
    try {
      return response.ok({
        success: true,
        message: 'User retrieved successfully.',
        user: auth.user,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to retrieve user.',
        error: error.message,
      })
    }
  }

  async logout({ auth, response }: HttpContext) {
    try {
      await User.accessTokens.delete(auth.user!, auth.user!.currentAccessToken.identifier)
      return response.ok({
        success: true,
        message: 'Logged out successfully.',
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Logout failed.',
        error: error.message,
      })
    }
  }

  async verifyEmail({ params, request, response }: HttpContext) {
    try {
      if (!request.hasValidSignature()) {
        return response.unprocessableEntity({
          success: false,
          message: 'Invalid verification link.',
        })
      }

      const email = decodeURIComponent(params.email)
      const user = await User.query().where('id', params.id).where('email', email).first()
      if (!user) {
        return response.unprocessableEntity({
          success: false,
          message: 'Invalid verification link.',
        })
      }

      if (!user.emailVerifiedAt) {
        user.emailVerifiedAt = DateTime.utc()
        await user.save()
      }

      return response.ok({
        success: true,
        message: 'Email verified successfully.',
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Email verification failed.',
        error: error.message,
      })
    }
  }

  async resendVerificationEmail({ auth, response }: HttpContext) {
    try {
      if (auth.user!.emailVerifiedAt) {
        return response.unprocessableEntity({
          success: false,
          message: 'Your email is already verified.',
        })
      }
      await mail.send(new VerifyEmailNotification(auth.user!))
      return response.ok({
        success: true,
        message: 'Verification email sent successfully.',
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to resend verification email.',
        error: error.message,
      })
    }
  }

  async forgotPassword({ request, response }: HttpContext) {
    try {
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
          success: false,
          message: "We can't find a user with that e-mail address.",
        })
      }
      await mail.send(new ResetPasswordNotification(user))
      return response.ok({
        success: true,
        message: 'Please check your email inbox (and spam) for a password reset link.',
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to send password reset email.',
        error: error.message,
      })
    }
  }

  async resetPassword({ params, request, response }: HttpContext) {
    try {
      if (!request.hasValidSignature()) {
        return response.unprocessableEntity({
          success: false,
          message: 'Invalid reset password link.',
        })
      }

      const user = await User.find(params.id)
      if (!user) {
        return response.unprocessableEntity({
          success: false,
          message: 'Invalid reset password link.',
        })
      }

      if (encodeURIComponent(user.password) !== params.token) {
        return response.unprocessableEntity({
          success: false,
          message: 'Invalid reset password link.',
        })
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

      return response.ok({
        success: true,
        message: 'Password reset successfully.',
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to reset password.',
        error: error.message,
      })
    }
  }
}
