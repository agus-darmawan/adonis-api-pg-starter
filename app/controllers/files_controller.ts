import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import File from '#models/file'
import messagesProvider from '#helpers/validation_messages_provider'
import { saveFile, checkBase64, deleteFile, getFilePath, getFileName } from '#helpers/file_helpers'
import path from 'node:path'
import FileValidator from '#validators/file'

export default class FilesController {
  async index({ response }: HttpContext) {
    try {
      const files = await File.all()
      return response.ok({
        success: true,
        message: 'Files retrieved successfully.',
        data: files,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to retrieve files.',
        error: error.message,
      })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const file = await File.find(params.id)
      if (!file) {
        return response.notFound({
          success: false,
          message: 'File not found.',
        })
      }
      return response.ok({
        success: true,
        message: 'File retrieved successfully.',
        data: file,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to retrieve file.',
        error: error.message,
      })
    }
  }

  async store({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    const userId = user.currentAccessToken.tokenableId

    const data = await vine
      .compile(FileValidator.fileSchema)
      .validate(request.all(), { messagesProvider })

    const validFormats = ['png', 'jpg', 'jpeg']
    const fileExtension = checkBase64(data.file, validFormats)
    if (!fileExtension) {
      return response.unsupportedMediaType({
        success: false,
        message: `Invalid file format. Only ${validFormats.join(', ')} are allowed.`,
      })
    }

    const filePath = getFilePath(String(userId), 'example_file')
    const fileName = getFileName(data.name, fileExtension)

    try {
      await saveFile(data.file, filePath, fileName)
      const file = await File.create({ name: data.name, filePath: path.join(filePath, fileName) })
      return response.created({
        success: true,
        message: 'File uploaded successfully.',
        data: file,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to upload file.',
        error: error.message,
      })
    }
  }

  async update({ params, request, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    const userId = user.currentAccessToken.tokenableId

    const data = await vine
      .compile(FileValidator.fileSchema)
      .validate(request.all(), { messagesProvider })

    const validFormats = ['png', 'jpg', 'jpeg']
    const fileExtension = checkBase64(data.file, validFormats)
    if (!fileExtension) {
      return response.unsupportedMediaType({
        success: false,
        message: `Invalid file format. Only ${validFormats.join(', ')} are allowed.`,
      })
    }

    const file = await File.find(params.id)
    if (!file) {
      return response.notFound({
        success: false,
        message: 'File not found.',
      })
    }

    const filePath = getFilePath(String(userId), 'example_file')
    const fileName = getFileName(data.name, fileExtension)
    const oldFilePath = file.filePath

    try {
      await saveFile(data.file, filePath, fileName)
      file.filePath = path.join(filePath, fileName)
      file.name = data.name
      await file.save()
      await deleteFile(oldFilePath)
      return response.ok({
        success: true,
        message: 'File updated successfully.',
        data: file,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to update file.',
        error: error.message,
      })
    }
  }

  async destroy({ params, response }: HttpContext) {
    const file = await File.find(params.id)
    if (!file) {
      return response.notFound({
        success: false,
        message: 'File not found.',
      })
    }
    const filePath = file.filePath

    try {
      await deleteFile(filePath)
      await file.delete()
      return response.ok({
        success: true,
        message: 'File deleted successfully.',
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to delete file.',
        error: error.message,
      })
    }
  }
}
