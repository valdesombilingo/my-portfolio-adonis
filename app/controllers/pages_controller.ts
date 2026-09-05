import type { HttpContext } from '@adonisjs/core/http'

export default class PagesController {
  async home({ view }: HttpContext) {
    return view.render('pages/home')
  }

  async experience({ view }: HttpContext) {
    return view.render('pages/experience')
  }

  async contact({ view }: HttpContext) {
    return view.render('pages/contact')
  }

  async privacy({ view }: HttpContext) {
    return view.render('pages/privacy')
  }

  // Pages des projets
  async projects({ view }: HttpContext) {
    return view.render('pages/projects')
  }

  async kingMayo({ view }: HttpContext) {
    return view.render('pages/projects/king-mayo')
  }

  async orangeMaxData({ view }: HttpContext) {
    return view.render('pages/projects/orange-max-data')
  }

  async cabaneUgcAgency({ view }: HttpContext) {
    return view.render('pages/projects/cabane-ugc-agency')
  }
  async xClone({ view }: HttpContext) {
    return view.render('pages/projects/x-clone')
  }
}
