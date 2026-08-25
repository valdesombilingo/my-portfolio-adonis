/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const PagesController = () => import('#controllers/pages_controller')
const ContactController = () => import('#controllers/contact_controller')

import router from '@adonisjs/core/services/router'

router.group(() => {
  router.get('/', [PagesController, 'home']).as('home')
  router.get('/experience', [PagesController, 'experience']).as('experience')
  router.get('/projects', [PagesController, 'projects']).as('projects')
  router.get('/projects/king-mayo', [PagesController, 'kingMayo']).as('projects.king_mayo')
  router.get('/contact', [PagesController, 'contact']).as('contact')
  router.get('/confidentialite', [PagesController, 'privacy']).as('privacy')
})

router.post('/contact', [ContactController, 'submit']).as('contact.submit')
