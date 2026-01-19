import { defineEventHandler, readBody } from 'h3'
import { query } from '~/server/utils/db'
import { getCurrentUserFromEvent } from '~/server/utils/sessionGuard'

export default defineEventHandler(async (event) => {
  const user = await getCurrentUserFromEvent(event, { touch: true })
  if (!user) return { ok: false, error: 'Not authenticated' }
  if (user.role !== 'admin') return { ok: false, error: 'Not authorized' }

  const { name, is_active = 1 } = await readBody(event)
  if (!name) return { ok: false, error: 'Missing fields' }

  await query(`INSERT INTO events (name, is_active) VALUES (?, ?)`, [name, is_active])
  return { ok: true }
})