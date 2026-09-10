export function initNavCapsule() {
  let previousNavHref = null

  up.compiler('.nav-capsule', (nav) => {
    const capsule = nav.querySelector('.nav-capsule-background')
    const links = [...nav.querySelectorAll('a')]
    const activeLink = nav.querySelector('a[aria-current="page"]')

    if (!capsule || !activeLink) {
      previousNavHref = null
      return
    }

    const previousLink = links.find((link) => link.href === previousNavHref)
    previousNavHref = activeLink.href

    function getPosition(link) {
      const navRect = nav.getBoundingClientRect()
      const linkRect = link.getBoundingClientRect()

      return {
        width: `${linkRect.width}px`,
        height: `${linkRect.height}px`,
        transform: `translate(${linkRect.left - navRect.left}px, ${linkRect.top - navRect.top}px)`,
      }
    }

    function updatePosition() {
      Object.assign(capsule.style, getPosition(activeLink))
      capsule.style.opacity = nav.getBoundingClientRect().width ? '1' : '0'
    }

    updatePosition()

    let animation

    if (
      previousLink &&
      previousLink !== activeLink &&
      nav.getBoundingClientRect().width > 0 &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      animation = capsule.animate([getPosition(previousLink), getPosition(activeLink)], {
        duration: 250,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      })
    }

    const observer = new ResizeObserver(updatePosition)
    observer.observe(nav)
    links.forEach((link) => observer.observe(link))

    return () => {
      observer.disconnect()
      animation?.cancel()
    }
  })
}
