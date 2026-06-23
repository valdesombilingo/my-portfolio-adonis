import Typed from 'typed.js'

export function initWelcomeText() {
  const targetElement = document.getElementById('welcome-text')

  if (!targetElement) return

  return new Typed(targetElement, {
    strings: ['Hello World !', 'Salut le monde !', 'Mbote mokili !'],
    typeSpeed: 80,
    backSpeed: 60,
    backDelay: 2000,
    loop: true,
    cursorChar: '|',
  })
}
