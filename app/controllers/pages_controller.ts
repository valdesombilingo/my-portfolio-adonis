import type { HttpContext } from '@adonisjs/core/http'

export default class PagesController {
  async home({ view }: HttpContext) {
    return view.render('pages/home')
  }

  async experience({ view }: HttpContext) {
    return view.render('pages/experience')
  }

  // Pages des projets
  async projects({ view }: HttpContext) {
    return view.render('pages/projects')
  }

  async kingMayo({ view }: HttpContext) {
    return view.render('pages/projects/king-mayo')
  }
}
