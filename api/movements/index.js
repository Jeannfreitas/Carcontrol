import { getDb } from '../_lib/db.js'
import { route } from '../_lib/http.js'
import { createMovement, listMovements } from '../_lib/service.js'

export default route({
  GET: (req) => listMovements(getDb(), req.query?.plate),
  POST: async (req, body) => [201, await createMovement(getDb(), body)],
})
