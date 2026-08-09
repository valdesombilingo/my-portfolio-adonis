export function initKadeaVideo() {
  up.compiler('#kadea-video', function (container) {
    const button = container.querySelector('#kadea-video-button')

    if (!(button instanceof HTMLButtonElement)) return

    function handlePlay() {
      const iframe = document.createElement('iframe')

      iframe.src = 'https://www.youtube-nocookie.com/embed/AUeaEbtgQc8?autoplay=1'

      iframe.title = 'Cérémonie d’accueil et de collation - Kadea Academy'

      iframe.className = 'absolute inset-0 h-full w-full border-0'

      iframe.allow =
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'

      iframe.allowFullscreen = true

      container.replaceChildren(iframe)
    }

    button.addEventListener('click', handlePlay, { once: true })

    return () => {
      button.removeEventListener('click', handlePlay)
    }
  })
}
