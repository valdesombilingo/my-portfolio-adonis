import 'unpoly/unpoly.js'
import 'unpoly/unpoly.css'

import '../css/app.css'

import { initHeaderNav } from './header-nav.js'
import { initBackNav } from './back-nav.js'
import { initKadeaVideo } from './kadea-video.js'

import Alpine from 'alpinejs'

Alpine.data('alert', function () {
  return {
    isVisible: false,

    dismiss() {
      this.isVisible = false
    },

    init() {
      setTimeout(() => {
        this.isVisible = true
      }, 80)

      setTimeout(() => {
        this.dismiss()
      }, 5000)
    },
  }
})

Alpine.start()

initBackNav()
initHeaderNav()
initKadeaVideo()
