export function initKadeaVideo() {
  const container = document.querySelector('#kadea-video')
  const button = document.querySelector('#kadea-video-button')

  if (!(container instanceof HTMLElement)) {
    return
  }

  if (!(button instanceof HTMLButtonElement)) {
    return
  }

  button.addEventListener(
    'click',
    () => {
      const iframe = document.createElement('iframe')

      iframe.src = 'https://www.youtube-nocookie.com/embed/AUeaEbtgQc8?autoplay=1'

      iframe.title = 'Cérémonie d’accueil et de collation — Kadea Academy'

      iframe.className = 'absolute inset-0 h-full w-full border-0'

      iframe.allow =
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'

      iframe.allowFullscreen = true

      container.replaceChildren(iframe)
    },
    { once: true }
  )
}
