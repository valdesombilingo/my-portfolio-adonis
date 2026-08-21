import type { HttpContext } from '@adonisjs/core/http'
import { contactValidator } from '#validators/contact'

export default class ContactController {
  async submit({ request, response }: HttpContext) {
    const payload = await request.validateUsing(contactValidator)

    console.log(payload)

    return response.redirect().back()
  }
}
