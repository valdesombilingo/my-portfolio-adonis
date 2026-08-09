// Rend le header sticky et ajoute un effet de flou
// et de transparence lorsque l'utilisateur fait défiler la page.

export function initStickyNav() {
  up.compiler('#header-container', function (headerContainer) {
    function updateStickyNav() {
      const hasScrolled = window.scrollY > 0

      headerContainer.classList.toggle('bg-white/85', hasScrolled)
      headerContainer.classList.toggle('backdrop-blur-sm', hasScrolled)
      headerContainer.classList.toggle('rounded-full', hasScrolled)
    }

    updateStickyNav()

    window.addEventListener('scroll', updateStickyNav, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateStickyNav)
    }
  })
}
