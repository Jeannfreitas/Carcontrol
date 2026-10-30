import { getDb } from '../../_lib/db.js'
import { route } from '../../_lib/http.js'
import { registerExit } from '../../_lib/service.js'

export default route({ PATCH: (req) => registerExit(getDb(), req.query?.id) })
