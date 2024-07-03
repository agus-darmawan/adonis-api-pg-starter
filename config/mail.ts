import env from '#start/env'
import { defineConfig, transports } from '@adonisjs/mail'

const mailConfig = defineConfig({
    default: env.get('MAIL_MAILER') || 'smtp',

    /**
     * The mailers object can be used to configure multiple mailers
     * each using a different transport or same transport with different
     * options.
     */
    mailers: {
        smtp: transports.smtp({
            host: env.get('SMTP_HOST'),
            port: env.get('SMTP_PORT'),
            secure: false,

            auth: {
                type: 'login',
                user: env.get('SMTP_USERNAME'),
                pass: env.get('SMTP_PASSWORD'),
            },

            tls: {},

            ignoreTLS: false,
            requireTLS: false,

            pool: false,
            maxConnections: 5,
            maxMessages: 100,
        }),

        resend: transports.resend({
            key: env.get('RESEND_API_KEY'),
            baseUrl: 'https://api.resend.com',
        }),
    },
})

export default mailConfig

declare module '@adonisjs/mail/types' {
    export interface MailersList extends InferMailers<typeof mailConfig> {}
}