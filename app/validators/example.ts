import vine from '@vinejs/vine'

export default class ExampleValidator {
  static createSchema = vine.object({
    string: vine.string().trim(),
    number: vine.number(),
    boolean: vine.boolean(),
  })

  static updateSchema = vine.object({
    string: vine.string().trim(),
    number: vine.number(),
    boolean: vine.boolean(),
  })
}
