// Aplica db/schema.sql no banco apontado por DATABASE_URL (idempotente).
// Roda automaticamente no deploy da Vercel (script "vercel-build") e manualmente com `npm run migrate`.
import { readFileSync } from 'node:fs'
import { neon } from '@neondatabase/serverless'

const url = process.env.DATABASE_URL
if (!url) {
  console.warn('[migrate] DATABASE_URL não definida — migração ignorada.')
  process.exit(0)
}

const sql = neon(url)
const statements = readFileSync(new URL('../db/schema.sql', import.meta.url), 'utf8')
  .replace(/--.*$/gm, '')
  .split(';')
  .map((s) => s.trim())
  .filter(Boolean)

for (const statement of statements) await sql.query(statement)
console.log(`[migrate] ${statements.length} comandos aplicados.`)
