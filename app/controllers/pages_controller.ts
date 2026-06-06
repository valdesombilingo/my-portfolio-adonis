import type { HttpContext } from '@adonisjs/core/http'

export default class PagesController {
  async experience({ view }: HttpContext) {
    return view.render('pages/experience')
  }

  async projects({ view }: HttpContext) {
    return view.render('pages/projects')
  }

  async contact({ view }: HttpContext) {
    return view.render('pages/contact')
  }
}
