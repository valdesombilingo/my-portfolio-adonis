export function initYoutubeVideos(root = document) {
  const videos = root.querySelectorAll('.youtube-video')

  videos.forEach((video) => {
    const button = video.querySelector('.youtube-video-button')

    if (!button || button.dataset.initialized === 'true') {
      return
    }

    button.dataset.initialized = 'true'

    button.addEventListener(
      'click',
      () => {
        const videoId = video.dataset.youtubeId
        const title = video.dataset.youtubeTitle || 'Vidéo YouTube'

        if (!videoId) {
          return
        }

        video.innerHTML = `
          <iframe
            class="h-full w-full"
            src="https://www.youtube.com/embed/${videoId}?autoplay=1"
            title="${title}"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        `
      },
      { once: true }
    )
  })
}

up.compiler('.youtube-video', (video) => {
  initYoutubeVideos(video.parentElement)
})
