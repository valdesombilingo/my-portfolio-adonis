import WaveSurfer from 'wavesurfer.js'

export function initAudioPlayer() {
  up.compiler('.audio-player', (player) => {
    const toggle = player.querySelector('.audio-toggle')
    const label = player.querySelector('.audio-label')
    const playIcon = player.querySelector('.audio-play')
    const loadingIcon = player.querySelector('.audio-loading')
    const pauseIcon = player.querySelector('.audio-pause')
    const details = player.querySelector('.audio-details')
    const wave = player.querySelector('.audio-wave')
    const time = player.querySelector('.audio-time')
    const status = player.querySelector('.audio-status')

    const controller = new AbortController()
    const options = { signal: controller.signal }

    let wavesurfer
    let ready = false
    let loading = false
    let destroyed = false
    let loadingPromise = null
    let handlingClick = false

    function formatTime(seconds) {
      const value = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0

      return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`
    }

    function setStatus(message = '') {
      status.textContent = message
      status.hidden = !message
    }

    function updateControls() {
      const playing = wavesurfer?.isPlaying() ?? false

      playIcon.toggleAttribute('hidden', loading || playing)
      pauseIcon.toggleAttribute('hidden', loading || !playing)
      loadingIcon.toggleAttribute('hidden', !loading)

      toggle.setAttribute(
        'aria-label',
        loading ? 'Chargement du morceau' : playing ? 'Mettre le morceau en pause' : 'Écouter Hadn'
      )
    }

    function setLoading(isLoading) {
      loading = isLoading
      toggle.disabled = isLoading

      if (isLoading) {
        toggle.setAttribute('aria-busy', 'true')
      } else {
        toggle.removeAttribute('aria-busy')
      }

      updateControls()
    }

    function updateProgress() {
      if (!wavesurfer || destroyed) return

      const duration = wavesurfer.getDuration()
      const currentTime = wavesurfer.getCurrentTime()
      const hasDuration = Number.isFinite(duration) && duration > 0

      time.textContent = `${formatTime(currentTime)} / ${hasDuration ? formatTime(duration) : '—'}`

      wave.setAttribute('aria-disabled', String(!ready || !hasDuration))
      wave.setAttribute('aria-valuemax', String(hasDuration ? duration : 0))
      wave.setAttribute('aria-valuenow', String(hasDuration ? currentTime : 0))
      wave.setAttribute(
        'aria-valuetext',
        hasDuration ? `${formatTime(currentTime)} sur ${formatTime(duration)}` : 'Durée inconnue'
      )
    }

    function createPlayer() {
      if (wavesurfer) return

      wavesurfer = WaveSurfer.create({
        container: wave,
        height: 40,
        waveColor: '#968367',
        progressColor: '#463D30',
        cursorWidth: 0,
        normalize: true,
        dragToSeek: true,
        hideScrollbar: true,
      })

      wavesurfer.on('play', updateControls)
      wavesurfer.on('pause', updateControls)
      wavesurfer.on('timeupdate', updateProgress)
      wavesurfer.on('seeking', updateProgress)

      wavesurfer.on('finish', () => {
        updateControls()
        updateProgress()
      })

      wavesurfer.on('error', () => {
        if (destroyed) return

        ready = false
        wave.setAttribute('aria-disabled', 'true')
        wavesurfer.pause()

        if (player.classList.contains('is-expanded')) {
          setStatus('Lecture indisponible. Réessayez avec le bouton lecture.')
        }
      })
    }

    function loadAudio() {
      if (destroyed || ready) return Promise.resolve()

      if (loadingPromise) return loadingPromise

      createPlayer()

      loadingPromise = wavesurfer
        .load(player.dataset.audioSrc)
        .then(() => {
          if (destroyed) return

          ready = true
          updateProgress()
        })
        .finally(() => {
          loadingPromise = null
        })

      return loadingPromise
    }

    async function togglePlayback() {
      if (handlingClick || destroyed) return

      handlingClick = true
      observer.disconnect()

      player.classList.add('is-expanded')
      label.hidden = true
      details.hidden = false

      try {
        if (!ready) {
          setLoading(true)
          setStatus('Chargement du morceau…')

          await loadAudio()
        }

        if (destroyed || !wavesurfer) return

        setLoading(false)
        setStatus()

        if (wavesurfer.isPlaying()) {
          wavesurfer.pause()
        } else {
          await wavesurfer.play()
        }
      } catch (error) {
        if (destroyed) return

        setStatus(
          error.name === 'NotAllowedError'
            ? 'Le morceau est prêt. Cliquez à nouveau sur lecture.'
            : 'Lecture indisponible. Réessayez avec le bouton lecture.'
        )
      } finally {
        handlingClick = false

        if (!destroyed) setLoading(false)
      }
    }

    function seekWithKeyboard(event) {
      if (!ready || !wavesurfer) return

      const duration = wavesurfer.getDuration()
      const currentTime = wavesurfer.getCurrentTime()

      if (!Number.isFinite(duration) || duration <= 0) return

      let position

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          position = currentTime + 5
          break

        case 'ArrowLeft':
        case 'ArrowDown':
          position = currentTime - 5
          break

        case 'Home':
          position = 0
          break

        case 'End':
          position = duration
          break

        default:
          return
      }

      event.preventDefault()
      wavesurfer.setTime(Math.max(0, Math.min(duration, position)))
      updateProgress()
    }

    // Prépare le morceau à proximité de l’écran, sans lancer la lecture.
    const observer = new IntersectionObserver(
      (entries) => {
        if (destroyed || !entries.some((entry) => entry.isIntersecting)) {
          return
        }

        observer.disconnect()

        // En cas d’échec, le clic permettra une nouvelle tentative.
        loadAudio().catch(() => {})
      },
      { rootMargin: '500px 0px' }
    )

    observer.observe(player)

    toggle.addEventListener('click', togglePlayback, options)
    wave.addEventListener('keydown', seekWithKeyboard, options)

    // Arrête et détruit le lecteur lorsqu’Unpoly retire la page.
    return () => {
      destroyed = true
      observer.disconnect()
      controller.abort()

      if (wavesurfer) {
        wavesurfer.pause()
        wavesurfer.destroy()
      }
    }
  })
}
