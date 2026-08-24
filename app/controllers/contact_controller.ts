import type { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'
import { contactValidator } from '#validators/contact'

export default class ContactController {
  async submit({ request, response, session }: HttpContext) {
    const honeypot = request.input('website')

    if (honeypot) {
      return response.noContent()
    }

    const payload = await request.validateUsing(contactValidator)

    try {
      await mail.send((message) => {
        message
          .to('contact@valdesombilingo.com')
          .replyTo(payload.email)
          .subject(`Portfolio - ${payload.subject}`)
          .htmlView('emails/contact-email', payload)
      })

      session.flash('success', 'Merci, votre message a bien été envoyé.')

      return response.redirect().back()
    } catch (error) {
      console.error('Erreur SMTP :', error)

      session.flash(
        'error',
        "Une erreur est survenue lors de l'envoi. Veuillez réessayer dans quelques instants."
      )

      return response.redirect().back()
    }
  }
}
