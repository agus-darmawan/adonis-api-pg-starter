import { SimpleMessagesProvider } from '@vinejs/vine'

const messagesProvider = new SimpleMessagesProvider({
  'required': 'The {{ field }} field is required.',
  'email.email': 'The email must be a valid email address.',
  'password.minLength': 'The password must be at least 8 characters.',
  'password.confirmed': 'The password confirmation does not match.',
})

export default messagesProvider
