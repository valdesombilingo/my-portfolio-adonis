// Rend le header sticky et ajoute un effet de flou et de transparence lorsque l'utilisateur fait défiler la page.

export function initStickyNav() {
  const headerContainer = document.querySelector('#header-container')

  if (!headerContainer) return

  function updateStickyNav() {
    if (window.scrollY > 0) {
      headerContainer.classList.add('bg-white/85', 'backdrop-blur-sm', 'rounded-full')
    } else {
      headerContainer.classList.remove('bg-white/85', 'backdrop-blur-sm', 'rounded-full')
    }
  }

  updateStickyNav()

  window.addEventListener('scroll', updateStickyNav)
}
