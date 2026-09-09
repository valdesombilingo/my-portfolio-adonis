import('./bin/server.js').catch((error) => {
  console.error(error)
  process.exitCode = 1
})
