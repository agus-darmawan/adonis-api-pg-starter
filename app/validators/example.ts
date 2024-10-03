import vine from '@vinejs/vine'

export default class ExampleValidator {
  public static createSchema = vine.object({
    string: vine.string().trim(),
    number: vine.number(),
    boolean: vine.boolean(),
  })

  public static updateSchema = vine.object({
    string: vine.string().trim(),
    number: vine.number(),
    boolean: vine.boolean(),
  })
}
