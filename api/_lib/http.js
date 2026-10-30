import { HttpError } from './service.js'

const STATUS_TEXT = { 400: 'Bad Request', 404: 'Not Found', 405: 'Method Not Allowed', 409: 'Conflict', 500: 'Internal Server Error' }

function sendError(res, status, message) {
  res.status(status).json({
    timestamp: new Date().toISOString(),
    status,
    error: STATUS_TEXT[status] || 'Error',
    message,
  })
}

function readBody(req) {
  const body = req.body
  if (typeof body === 'string') {
    try { return JSON.parse(body) } catch { throw new HttpError(400, 'JSON inválido.') }
  }
  return body
}

// route({ GET: async (req) => dados, POST: async (req, body) => [status, dados] })
export function route(methods) {
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store')
    const fn = methods[req.method]
    if (!fn) {
      res.setHeader('Allow', Object.keys(methods).join(', '))
      return sendError(res, 405, 'Método não permitido.')
    }
    try {
      const result = await fn(req, req.method === 'GET' ? undefined : readBody(req))
      const [status, data] = Array.isArray(result) && typeof result[0] === 'number' ? result : [200, result]
      res.status(status).json(data)
    } catch (err) {
      if (err instanceof HttpError) return sendError(res, err.status, err.message)
      console.error(err)
      sendError(res, 500, 'Erro interno do servidor.')
    }
  }
}
