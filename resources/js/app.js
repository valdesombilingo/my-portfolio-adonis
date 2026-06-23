import { initWelcomeText } from './welcome-text.js'
import { initStickyNav } from './sticky-nav.js'
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

// Rend le header sticky et ajoute un effet de flou et de transparence lorsque l'utilisateur fait défiler la page.

document.addEventListener('DOMContentLoaded', () => {
  initStickyNav()
})

// Déclenchement sécurisé dès que le navigateur a chargé le HTML
document.addEventListener('DOMContentLoaded', () => {
  initWelcomeText()
})
