export function initBackNav() {
  up.compiler('#back-nav-container', function (backContainer) {
    function updateBackNavAppearance() {
      const hasScrolled = window.scrollY > 0

      backContainer.classList.toggle('header-scrolled', hasScrolled)
      backContainer.classList.toggle('rounded-full', hasScrolled)
    }

    async function handleBack(event) {
      event.preventDefault()

      const previousLocation = up.history.previousLocation

      if (previousLocation) {
        window.history.back()
        return
      }

      await up.navigate({
        url: backContainer.href,
        target: 'body',
        history: true,
      })
    }

    function handleScroll() {
      updateBackNavAppearance()
    }

    backContainer.addEventListener('click', handleBack)

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    })

    updateBackNavAppearance()

    return () => {
      backContainer.removeEventListener('click', handleBack)
      window.removeEventListener('scroll', handleScroll)
    }
  })
}
