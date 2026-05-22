export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Capture the actual crash reason
    process.on('uncaughtException', (err) => {
      console.error('UNCAUGHT EXCEPTION:', err)
    })

    process.on('unhandledRejection', (err) => {
      console.error('UNHANDLED REJECTION:', err)
    })

    // Log when process is being terminated
    process.on('SIGTERM', () => {
      console.error('SIGTERM received - process being killed externally')
    })

    process.on('SIGINT', () => {
      console.error('SIGINT received - process being interrupted')
    })

    // Log memory usage periodically (every 2 minutes to reduce log spam)
    setInterval(() => {
      const mem = process.memoryUsage()
      const mb = (bytes: number) => Math.round(bytes / 1024 / 1024)
      console.log(`Memory: RSS=${mb(mem.rss)}MB, Heap=${mb(mem.heapUsed)}/${mb(mem.heapTotal)}MB, External=${mb(mem.external)}MB`)
    }, 120000)
  }
}
