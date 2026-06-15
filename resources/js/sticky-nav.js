// Rend le header sticky et ajoute un effet de flou et de transparence lorsque l'utilisateur fait défiler la page.

export function stickyNav() {
  const headerContainer = document.querySelector('#header-container')

  if (!headerContainer) return

  function updateStickyNav() {
    if (window.scrollY > 0) {
      headerContainer.classList.add('bg-white/80', 'backdrop-blur-md', 'rounded-full')
    } else {
      headerContainer.classList.remove('bg-white/80', 'backdrop-blur-md', 'rounded-full')
    }
  }

  updateStickyNav()

  window.addEventListener('scroll', updateStickyNav)
}
