import 'unpoly/unpoly.js'
import 'unpoly/unpoly.css'

import '../css/app.css'

import { initHeaderNav } from './header-nav.js'
import { initNavCapsule } from './nav-capsule.js'
import { initBackNav } from './back-nav.js'
import { initYoutubeVideos } from './youtube-videos.js'
import { initContactTextarea } from './contact-textarea.js'

import Alpine from 'alpinejs'

up.compiler('[data-page-reveal]', (element) => {
  element.style.opacity = '0'
  element.style.transform = 'translate3d(0, 16px, 0)'

  return up.animate(
    element,
    {
      opacity: '1',
      transform: 'translate3d(0, 0, 0)',
    },
    {
      duration: 450,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    }
  )
})

Alpine.data('alert', function () {
  return {
    isVisible: false,

    init() {
      setTimeout(() => {
        this.isVisible = true
      }, 80)

      setTimeout(() => {
        this.isVisible = false
      }, 20000)
    },
  }
})

Alpine.start()

initBackNav()
initHeaderNav()
initNavCapsule()
initContactTextarea()
initYoutubeVideos()
