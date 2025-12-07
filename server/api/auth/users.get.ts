import { defineEventHandler } from 'h3'
import { query } from '~/server/utils/db'
import { getCurrentUserFromEvent } from '~/server/utils/sessionGuard'
import { normalizeBigInt } from '~/server/utils/normalize'

export default defineEventHandler(async (event) => {
  const current = await getCurrentUserFromEvent(event, { touch: true })
  if (!current) return { ok: false, error: 'Not authenticated' }
  if (current.role !== 'admin') return { ok: false, error: 'Not authorized' }

  const rows : any = await query(`
    SELECT id, username, role, is_active, created_at
    FROM users
    ORDER BY id ASC
  `)

  return { ok: true, users: normalizeBigInt(rows) }
})