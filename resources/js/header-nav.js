export function initHeaderNav() {
  up.compiler('#site-header', function (header) {
    const container = header.querySelector('#header-container')
    const button = header.querySelector('#mobile-menu-button')
    const menu = header.querySelector('#mobile-menu')
    const overlay = document.querySelector('#mobile-menu-overlay')

    const openIcon = button?.querySelector('[data-menu-icon="open"]')
    const closeIcon = button?.querySelector('[data-menu-icon="close"]')

    const mobileLinks = menu?.querySelectorAll('a')

    if (!container || !button || !menu || !overlay || !openIcon || !closeIcon) {
      return
    }

    let isOpen = false

    /*
    |--------------------------------------------------------------------------
    | Apparence du header
    |--------------------------------------------------------------------------
    */

    function updateHeaderAppearance() {
      const hasScrolled = window.scrollY > 0

      // Scroll normal
      container.classList.toggle('bg-white/85', hasScrolled && !isOpen)

      container.classList.toggle('backdrop-blur-sm', hasScrolled && !isOpen)

      // Menu ouvert
      container.classList.toggle('bg-white/95', isOpen)

      container.classList.toggle('backdrop-blur-md', isOpen)

      // Arrondi
      container.classList.toggle('rounded-[2rem]', hasScrolled || isOpen)
    }

    /*
    |--------------------------------------------------------------------------
    | État du menu
    |--------------------------------------------------------------------------
    */

    function setMenuState(open) {
      isOpen = open

      button.setAttribute('aria-expanded', String(isOpen))

      button.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu')

      /*
      |----------------------------------------------------------------------
      | Bloquer le scroll
      |----------------------------------------------------------------------
      */

      document.body.classList.toggle('overflow-hidden', isOpen)

      /*
      |----------------------------------------------------------------------
      | Animation du menu
      |----------------------------------------------------------------------
      */

      menu.classList.toggle('grid-rows-[1fr]', isOpen)

      menu.classList.toggle('grid-rows-[0fr]', !isOpen)

      menu.classList.toggle('opacity-100', isOpen)

      menu.classList.toggle('opacity-0', !isOpen)

      /*
      |----------------------------------------------------------------------
      | Overlay
      |----------------------------------------------------------------------
      */

      overlay.classList.toggle('pointer-events-auto', isOpen)

      overlay.classList.toggle('pointer-events-none', !isOpen)

      overlay.classList.toggle('opacity-100', isOpen)

      overlay.classList.toggle('opacity-0', !isOpen)

      /*
      |----------------------------------------------------------------------
      | Burger -> disparition
      |----------------------------------------------------------------------
      */

      openIcon.classList.toggle('opacity-0', isOpen)

      openIcon.classList.toggle('scale-75', isOpen)

      openIcon.classList.toggle('-rotate-90', isOpen)

      openIcon.classList.toggle('opacity-100', !isOpen)

      openIcon.classList.toggle('scale-100', !isOpen)

      openIcon.classList.toggle('rotate-0', !isOpen)

      /*
      |----------------------------------------------------------------------
      | X -> apparition
      |----------------------------------------------------------------------
      */

      closeIcon.classList.toggle('opacity-100', isOpen)

      closeIcon.classList.toggle('scale-100', isOpen)

      closeIcon.classList.toggle('rotate-0', isOpen)

      closeIcon.classList.toggle('opacity-0', !isOpen)

      closeIcon.classList.toggle('scale-75', !isOpen)

      closeIcon.classList.toggle('rotate-90', !isOpen)

      updateHeaderAppearance()
    }

    /*
    |--------------------------------------------------------------------------
    | Toggle
    |--------------------------------------------------------------------------
    */

    function toggleMenu() {
      setMenuState(!isOpen)
    }

    /*
    |--------------------------------------------------------------------------
    | Fermer
    |--------------------------------------------------------------------------
    */

    function closeMenu() {
      if (!isOpen) return

      setMenuState(false)
    }

    /*
    |--------------------------------------------------------------------------
    | Scroll
    |--------------------------------------------------------------------------
    */

    function handleScroll() {
      updateHeaderAppearance()
    }

    /*
    |--------------------------------------------------------------------------
    | Escape
    |--------------------------------------------------------------------------
    */

    function handleKeydown(event) {
      if (event.key === 'Escape' && isOpen) {
        closeMenu()
        button.focus()
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Mobile -> desktop
    |--------------------------------------------------------------------------
    */

    function handleResize() {
      if (window.innerWidth >= 768 && isOpen) {
        closeMenu()
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Events
    |--------------------------------------------------------------------------
    */

    button.addEventListener('click', toggleMenu)

    overlay.addEventListener('click', closeMenu)

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    })

    window.addEventListener('resize', handleResize)

    document.addEventListener('keydown', handleKeydown)

    mobileLinks?.forEach((link) => {
      link.addEventListener('click', closeMenu)
    })

    /*
    |--------------------------------------------------------------------------
    | État initial
    |--------------------------------------------------------------------------
    */

    updateHeaderAppearance()

    /*
    |--------------------------------------------------------------------------
    | Cleanup Unpoly
    |--------------------------------------------------------------------------
    */

    return () => {
      document.body.classList.remove('overflow-hidden')

      button.removeEventListener('click', toggleMenu)

      overlay.removeEventListener('click', closeMenu)

      window.removeEventListener('scroll', handleScroll)

      window.removeEventListener('resize', handleResize)

      document.removeEventListener('keydown', handleKeydown)

      mobileLinks?.forEach((link) => {
        link.removeEventListener('click', closeMenu)
      })
    }
  })
}
