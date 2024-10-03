import Example from '#models/example'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import ExampleValidator from '#validators/example'
import messagesProvider from '#helpers/validation_messages_provider'

export default class ExamplesController {
  async index({ response }: HttpContext) {
    try {
      const examples = await Example.all()
      return response.ok({
        success: true,
        message: 'Examples retrieved successfully.',
        data: examples,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to retrieve examples.',
        error: error.message,
      })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const example = await Example.find(params.id)
      if (!example) {
        return response.notFound({
          success: false,
          message: 'Example not found.',
        })
      }

      return response.ok({
        success: true,
        message: 'Example retrieved successfully.',
        data: example,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to retrieve example.',
        error: error.message,
      })
    }
  }

  async store({ request, response }: HttpContext) {
    const data = await vine
      .compile(ExampleValidator.createSchema)
      .validate(request.all(), { messagesProvider })

    try {
      const example = await Example.create(data)
      return response.created({
        success: true,
        message: 'Example created successfully.',
        data: example,
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: 'Failed to create example.',
        error: error.messages || error.message,
      })
    }
  }

  async update({ params, request, response }: HttpContext) {
    const example = await Example.find(params.id)
    if (!example) {
      return response.notFound({
        success: false,
        message: 'Example not found.',
      })
    }

    const data = await vine
      .compile(ExampleValidator.updateSchema)
      .validate(request.all(), { messagesProvider })

    try {
      example.merge(data)
      await example.save()
      return response.ok({
        success: true,
        message: 'Example updated successfully.',
        data: example,
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: 'Failed to update example.',
        error: error.messages || error.message,
      })
    }
  }

  async destroy({ params, response }: HttpContext) {
    const example = await Example.find(params.id)
    if (!example) {
      return response.notFound({
        success: false,
        message: 'Example not found.',
      })
    }

    try {
      await example.delete()
      return response.ok({
        success: true,
        message: 'Example deleted successfully.',
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to delete example.',
        error: error.message,
      })
    }
  }
}
