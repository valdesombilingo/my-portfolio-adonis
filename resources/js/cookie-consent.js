const CONSENT_KEY = 'portfolio-analytics-consent-v1'

export const CONSENT_DURATION = 180 * 24 * 60 * 60 * 1000

let instance

export function initCookieConsent() {
  if (instance) return instance

  const subscribers = new Set()

  let saved = readConsent()
  let consent = saved?.value ?? null
  let opener = null
  let consentTimer

  function getBanner() {
    return document.querySelector('#cookie-consent')
  }

  function readConsent() {
    try {
      const value = JSON.parse(localStorage.getItem(CONSENT_KEY))

      if (
        value &&
        ['granted', 'denied'].includes(value.value) &&
        Number.isFinite(value.expiresAt) &&
        value.expiresAt > Date.now()
      ) {
        return value
      }
    } catch {
      // Le site reste utilisable si le stockage est indisponible.
    }

    return null
  }

  function notify(persisted = false) {
    for (const callback of subscribers) {
      callback(consent, { persisted })
    }
  }

  function updatePreferenceButtons() {
    const banner = getBanner()

    document.querySelectorAll('[data-cookie-preferences]').forEach((control) => {
      control.hidden = !banner

      control.setAttribute('aria-expanded', String(Boolean(banner && !banner.hidden)))
    })
  }

  function showBanner(show, moveFocus = false) {
    window.clearTimeout(consentTimer)

    const banner = getBanner()
    if (!banner) return

    const focusWasInside = banner.contains(document.activeElement)

    banner.hidden = !show
    updatePreferenceButtons()

    if (show && moveFocus) {
      banner.querySelector('button')?.focus()
    } else if (!show && focusWasInside) {
      if (opener?.isConnected) {
        opener.focus({ preventScroll: true })
      } else {
        const page = document.querySelector('#page')

        if (page) {
          const previousTabindex = page.getAttribute('tabindex')

          page.setAttribute('tabindex', '-1')
          page.focus({ preventScroll: true })

          if (previousTabindex === null) {
            page.removeAttribute('tabindex')
          } else {
            page.setAttribute('tabindex', previousTabindex)
          }
        }
      }
    }
  }

  function chooseConsent(value) {
    if (!['granted', 'denied'].includes(value)) return

    consent = value

    saved = {
      value,
      expiresAt: Date.now() + CONSENT_DURATION,
    }

    let persisted = false

    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(saved))
      persisted = true
    } catch {
      // Le choix s’applique quand même à la page actuelle.
    }

    showBanner(false)
    notify(persisted)
  }

  function scheduleBanner() {
    window.clearTimeout(consentTimer)

    if (!getBanner() || consent !== null) return

    consentTimer = window.setTimeout(() => {
      if (consent === null) {
        showBanner(true)
      }
    }, 1500)
  }

  // Un seul écouteur pour ouvrir, fermer, accepter et refuser.
  // La délégation reste active pendant les navigations Unpoly.
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return

    const control = event.target.closest('[data-cookie-preferences]')

    if (control) {
      event.preventDefault()

      if (!getBanner()) {
        console.warn('Bandeau de cookies introuvable : vérifie son inclusion dans le layout.')
        return
      }

      opener = control
      showBanner(true, true)
      return
    }

    const banner = getBanner()

    if (!banner || !banner.contains(event.target)) return

    if (event.target.closest('[data-cookie-dismiss]')) {
      // Fermer ne modifie pas le consentement enregistré.
      showBanner(false)
      return
    }

    const button = event.target.closest('[data-analytics-choice]')
    const value = button?.dataset.analyticsChoice

    if (value === 'granted' || value === 'denied') {
      chooseConsent(value)
    }
  })

  // Prépare le contrôle lorsque la politique est affichée par Unpoly.
  up.compiler('[data-cookie-preferences]', (control) => {
    const banner = getBanner()

    control.hidden = !banner

    control.setAttribute('aria-expanded', String(Boolean(banner && !banner.hidden)))
  })

  function synchronizeConsent() {
    saved = readConsent()

    const nextConsent = saved?.value ?? null
    if (nextConsent === consent) return

    consent = nextConsent

    showBanner(false)
    notify(true)
    scheduleBanner()
  }

  // Synchronise les choix effectués dans un autre onglet.
  window.addEventListener('storage', (event) => {
    if (event.key === CONSENT_KEY || event.key === null) {
      synchronizeConsent()
    }
  })

  // Vérifie le choix après une restauration par le navigateur.
  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return

    synchronizeConsent()
    updatePreferenceButtons()
  })

  // Vérifie l’expiration au retour sur l’onglet.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && saved && saved.expiresAt <= Date.now()) {
      synchronizeConsent()
    }
  })

  instance = {
    getAnalyticsConsent() {
      return consent
    },

    onAnalyticsConsentChange(callback) {
      subscribers.add(callback)

      // Transmet immédiatement le choix actuel au module Analytics.
      callback(consent, { persisted: false })

      return () => subscribers.delete(callback)
    },
  }

  // Apparition différée uniquement en l’absence de choix valide.
  showBanner(false)
  scheduleBanner()

  return instance
}
