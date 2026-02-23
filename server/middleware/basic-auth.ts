export default defineEventHandler((event) => {
    const config = useRuntimeConfig()
  
    const authHeader = getHeader(event, 'authorization')
  
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      setHeader(event, 'WWW-Authenticate', 'Basic realm="Protected"')
      throw createError({ statusCode: 401, statusMessage: 'Auth required' })
    }
  
    const base64 = authHeader.split(' ')[1]
    const decoded = Buffer.from(base64, 'base64').toString()
  
    const [user, pass] = decoded.split(':')
  
    if (
      user !== config.basicAuthUser ||
      pass !== config.basicAuthPass
    ) {
      setHeader(event, 'WWW-Authenticate', 'Basic realm="Protected"')
      throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
    }
  })