import 'unpoly/unpoly.js'
import 'unpoly/unpoly.css'

import '../css/app.css'

import { initHeaderNav } from './header-nav.js'
import { initBackNav } from './back-nav.js'
import { initYoutubeVideos } from './youtube-videos.js'
import { initContactTextarea } from './contact-textarea.js'

import Alpine from 'alpinejs'

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
initContactTextarea()
initYoutubeVideos()
