// Ajoute un fond au bouton de retour lorsque l'utilisateur fait défiler une page de projet.

export function initBackNav() {
  up.compiler('#back-nav-container', function (backContainer) {
    function updateBackNav() {
      const hasScrolled = window.scrollY > 0

      backContainer.classList.toggle('bg-white/85', hasScrolled)
      backContainer.classList.toggle('backdrop-blur-sm', hasScrolled)
    }

    updateBackNav()

    window.addEventListener('scroll', updateBackNav, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateBackNav)
    }
  })
}
