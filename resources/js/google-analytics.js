import { CONSENT_DURATION } from './cookie-consent.js'

const MEASUREMENT_ID = 'G-GQ9R7ED07L'
const DISABLE_KEY = `ga-disable-${MEASUREMENT_ID}`

let initialized = false

export function initGoogleAnalytics(consentManager) {
  if (initialized) return
  initialized = true

  const production = import.meta.env.PROD && window.location.hostname === 'valdesombilingo.com'

  let started = false
  let lastPage = ''
  let pageTimer

  window.dataLayer = window.dataLayer || []
  window[DISABLE_KEY] = true

  function gtag() {
    window.dataLayer.push(arguments)
  }

  function updateGoogleConsent(value, command = 'update') {
    gtag('consent', command, {
      analytics_storage: value,
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    })
  }

  updateGoogleConsent('denied', 'default')

  function cleanUrl(value) {
    if (!value) return ''

    try {
      const url = new URL(value, window.location.origin)

      if (!['http:', 'https:'].includes(url.protocol)) return ''

      // Ne transmet pas les paramètres ni les fragments.
      return `${url.origin}${url.pathname}`
    } catch {
      return ''
    }
  }

  function canTrack() {
    return production && started && consentManager.getAnalyticsConsent() === 'granted'
  }

  function trackEvent(name, parameters = {}) {
    if (!canTrack()) return

    gtag('event', name, {
      send_to: MEASUREMENT_ID,
      page_location: cleanUrl(window.location.href),
      page_title: document.title,
      ...parameters,
    })
  }

  up.compiler('[data-ga-generate-lead]', (element) => {
    if (element.dataset.gaTracked === 'true') return
    if (!canTrack()) return

    trackEvent('generate_lead', {
      method: 'contact_form',
    })

    element.dataset.gaTracked = 'true'
  })

  function trackPage() {
    if (!canTrack()) return

    const page = cleanUrl(window.location.href)
    if (page === lastPage) return

    const referrer = lastPage || cleanUrl(document.referrer)

    gtag('set', {
      page_location: page,
      page_title: document.title,
      page_referrer: referrer,
    })

    trackEvent('page_view', {
      page_referrer: referrer,
    })

    lastPage = page
  }

  function schedulePage() {
    window.clearTimeout(pageTimer)
    pageTimer = window.setTimeout(trackPage, 0)
  }

  function removeAnalyticsCookies() {
    for (const cookie of document.cookie.split(';')) {
      const name = cookie.trim().split('=')[0]

      // Préserve les cookies du formulaire et de session.
      if (!name.startsWith('portfolio_')) continue

      const expired = `${name}=; Max-Age=0; Path=/`

      document.cookie = expired
      document.cookie = `${expired}; Domain=valdesombilingo.com`
    }
  }

  function startAnalytics() {
    if (!production || consentManager.getAnalyticsConsent() !== 'granted') {
      return
    }

    window[DISABLE_KEY] = false
    updateGoogleConsent('granted')

    if (!started) {
      started = true

      gtag('js', new Date())

      gtag('config', MEASUREMENT_ID, {
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        cookie_prefix: 'portfolio',
        cookie_path: '/',
        cookie_expires: CONSENT_DURATION / 1000,
        cookie_update: false,
        page_location: cleanUrl(window.location.href),
        page_referrer: cleanUrl(document.referrer),
      })

      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`

      document.head.appendChild(script)
    }

    schedulePage()
  }

  function stopAnalytics(persisted) {
    window[DISABLE_KEY] = true
    window.clearTimeout(pageTimer)

    updateGoogleConsent('denied')
    removeAnalyticsCookies()
    lastPage = ''

    // Retire le script chargé en rechargeant avec le nouveau choix.
    // Sans stockage disponible, conserve la désactivation en mémoire.
    if (started && persisted) {
      window.location.reload()
    }
  }

  document.addEventListener('click', (event) => {
    if (!canTrack() || !(event.target instanceof Element)) return

    const link = event.target.closest('a[href]')
    if (!link) return

    let url

    try {
      url = new URL(link.getAttribute('href'), window.location.href)
    } catch {
      return
    }

    if (!['http:', 'https:'].includes(url.protocol)) return

    const file = url.pathname.split('/').pop() || ''
    const extension = file.includes('.') ? file.split('.').pop().toLowerCase() : ''

    const downloadable = ['pdf', 'mp3', 'wav', 'zip', 'doc', 'docx']

    if (link.hasAttribute('download') || downloadable.includes(extension)) {
      trackEvent('file_download', {
        file_name: file,
        file_extension: extension,
        link_url: cleanUrl(url.href),
      })
    } else if (url.origin !== window.location.origin) {
      trackEvent('click', {
        outbound: true,
        link_domain: url.hostname,
        link_url: cleanUrl(url.href),
      })
    }
  })

  up.on('up:location:changed', schedulePage)

  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return

    lastPage = ''
    schedulePage()
  })

  // Reçoit immédiatement le choix enregistré,
  consentManager.onAnalyticsConsentChange((value, { persisted }) => {
    if (value === 'granted') {
      startAnalytics()
    } else {
      stopAnalytics(persisted)
    }
  })
}
