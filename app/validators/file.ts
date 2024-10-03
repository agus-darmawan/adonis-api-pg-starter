import vine from '@vinejs/vine'

export default class FileValidator {
  public static fileSchema = vine.object({
    name: vine.string().trim(),
    file: vine.string(), 
  })
}
