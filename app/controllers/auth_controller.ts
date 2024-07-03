import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export default class AuthController {
    async login({ request, response }: HttpContext) {
        const data = await vine
            .compile(
                vine.object({
                    email: vine.string().trim().email(),
                    password: vine.string(),
                })
            )
            .validate(request.all(), {
                messagesProvider: new SimpleMessagesProvider({
                    'required': 'The {{ field }} field is required.',
                    'email.email': 'The email must be a valid email address.',
                }),
            })

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
            .validate(request.all(), {
                messagesProvider: new SimpleMessagesProvider({
                    'required': 'The {{ field }} field is required.',
                    'email.email': 'The email must be a valid email address.',
                    'unique': 'The {{ field }} has already been taken.',
                    'password.minLength': 'The password must be atleast 8 characters.',
                    'password.confirmed': 'The password confirmation does not match.',
                }),
            })

        try {
            if (await User.query().where('email', data.email).first()) {
                return response.unprocessableEntity({ error: 'The email has already been taken.' })
            }

            await User.create({
                email: data.email,
                password: data.password,
            })
            return { success: 'Please check your email inbox (and spam) for an access link.' }
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
}