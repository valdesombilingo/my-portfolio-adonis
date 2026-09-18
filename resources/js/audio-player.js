import WaveSurfer from 'wavesurfer.js'

export function initAudioPlayer() {
  up.compiler('.audio-player', (player) => {
    const toggle = player.querySelector('.audio-toggle')
    const label = player.querySelector('.audio-label')
    const playIcon = player.querySelector('.audio-play')
    const pauseIcon = player.querySelector('.audio-pause')
    const details = player.querySelector('.audio-details')
    const wave = player.querySelector('.audio-wave')
    const time = player.querySelector('.audio-time')
    const status = player.querySelector('.audio-status')

    const controller = new AbortController()
    const options = { signal: controller.signal }

    let wavesurfer
    let ready = false
    let destroyed = false
    let loadingPromise = null

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

      playIcon.toggleAttribute('hidden', playing)
      pauseIcon.toggleAttribute('hidden', !playing)

      toggle.setAttribute('aria-label', playing ? 'Mettre le morceau en pause' : 'Écouter Hadn')
    }

    function updateProgress() {
      if (!wavesurfer) return

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

        updateControls()

        setStatus('Lecture indisponible. Réessayez avec le bouton lecture.')
      })
    }

    function loadAudio() {
      if (ready) {
        return Promise.resolve()
      }

      if (loadingPromise) {
        return loadingPromise
      }

      if (!wavesurfer) {
        createPlayer()
      }

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
      if (toggle.disabled) return

      player.classList.add('is-expanded')
      label.hidden = true
      details.hidden = false

      try {
        if (!ready) {
          toggle.disabled = true
          toggle.setAttribute('aria-busy', 'true')

          setStatus('Chargement du morceau…')

          try {
            await loadAudio()
          } finally {
            if (!destroyed) {
              toggle.disabled = false
              toggle.removeAttribute('aria-busy')
            }
          }
        }

        if (destroyed || !wavesurfer) return

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
        if (!destroyed) {
          updateControls()
        }
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

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]

        if (!entry?.isIntersecting) return

        loadAudio().catch(() => {})

        observer.disconnect()
      },
      {
        rootMargin: '300px 0px',
      }
    )

    observer.observe(player)

    toggle.addEventListener('click', togglePlayback, options)
    wave.addEventListener('keydown', seekWithKeyboard, options)

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
