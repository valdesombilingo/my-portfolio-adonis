export function initContactTextarea() {
  up.compiler('.contact-textarea', function (textarea) {
    function resizeTextarea() {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }

    textarea.addEventListener('input', resizeTextarea)

    resizeTextarea()

    return () => {
      textarea.removeEventListener('input', resizeTextarea)
    }
  })
}
