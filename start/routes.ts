/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const PagesController = () => import('#controllers/pages_controller')

import router from '@adonisjs/core/services/router'

router.group(() => {
  router.on('/').render('pages/home').as('home')
  router.get('/experience', [PagesController, 'experience']).as('experience')
  router.get('/projects', [PagesController, 'projects']).as('projects')
  router.get('/contact', [PagesController, 'contact']).as('contact')
})
