import { getDb } from '../_lib/db.js'
import { route } from '../_lib/http.js'
import { listPresent } from '../_lib/service.js'

export default route({ GET: () => listPresent(getDb()) })
