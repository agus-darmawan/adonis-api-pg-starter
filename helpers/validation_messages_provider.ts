import { SimpleMessagesProvider } from '@vinejs/vine'

const messagesProvider = new SimpleMessagesProvider({
  'required': 'The {{ field }} field is required.',
  'email.email': 'The email must be a valid email address.',
  'password.minLength': 'The password must be at least 8 characters.',
  'password.confirmed': 'The password confirmation does not match.',
  'string.required': 'The string field is required.',
  'number.required': 'The number field is required.',
  'boolean.required': 'The boolean field is required.',
  'number.number': 'The number field must be a valid number.',
  'boolean.boolean': 'The boolean field must be true or false.',
})

export default messagesProvider
