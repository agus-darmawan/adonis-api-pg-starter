import vine from '@vinejs/vine'

export default class AuthValidator {
  public static loginSchema = vine.object({
    email: vine.string().trim().email(),
    password: vine.string(),
  })

  public static registerSchema = vine.object({
    email: vine.string().trim().email(),
    password: vine.string().minLength(8).confirmed(),
  })

  public static forgotPasswordSchema = vine.object({
    email: vine.string().trim().email(),
  })

  public static resetPasswordSchema = vine.object({
    password: vine.string().minLength(8).confirmed(),
  })
}
