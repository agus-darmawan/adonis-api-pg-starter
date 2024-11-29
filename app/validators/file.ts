import vine from '@vinejs/vine'

export default class FileValidator {
  static fileSchema = vine.object({
    name: vine.string().trim(),
    file: vine.string(),
  })
}
