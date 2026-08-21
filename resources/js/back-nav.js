// Ajoute un fond au bouton de retour lorsque l'utilisateur fait défiler une page de projet.

export function initBackNav() {
  up.compiler('#back-nav-container', function (backContainer) {
    function updateBackNavAppearance() {
      const hasScrolled = window.scrollY > 0

      backContainer.classList.toggle('bg-white/85', hasScrolled)
      backContainer.classList.toggle('backdrop-blur-sm', hasScrolled)
      backContainer.classList.toggle('rounded-full', hasScrolled)
    }

    function handleScroll() {
      updateBackNavAppearance()
    }

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    })

    updateBackNavAppearance()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  })
}
