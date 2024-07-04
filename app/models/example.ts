import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Example extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare string: string

  @column()
  declare number: number

  @column()
  declare boolean: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
