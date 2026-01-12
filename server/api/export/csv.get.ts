import { defineEventHandler, setHeader } from 'h3'
import { query } from '~/server/utils/db'
import { getCurrentUserFromEvent } from '~/server/utils/sessionGuard'

export default defineEventHandler(async (event) => {
  const user = await getCurrentUserFromEvent(event, { touch: true })
  if (!user) return { ok: false }

  const rows = await query(`
    SELECT
      o.id AS order_id,
      o.created_at,
      o.fachschaft,
      c.name AS cashier,
      i.name AS item,
      oi.quantity,
      i.price,
      IFNULL(i.deposit, 0) AS deposit
    FROM orders o
    JOIN cashiers c ON o.cashier_id = c.id
    JOIN order_items oi ON oi.order_id = o.id
    JOIN items i ON oi.item_id = i.id
    ORDER BY o.created_at DESC
  `)

  let csv = [
    'Order ID,Date,Cashier,Fachschaft,Item,Quantity,Price,Deposit,Total'
  ].join('\n')

  for (const r of rows) {
    const total =
      r.fachschaft === 1
        ? 0
        : (Number(r.price) + Number(r.deposit)) * Number(r.quantity)

    csv += `\n${[
      r.order_id,
      r.created_at.toISOString(),
      `"${r.cashier}"`,
      r.fachschaft,
      `"${r.item}"`,
      r.quantity,
      r.price,
      r.deposit,
      total.toFixed(2)
    ].join(',')}`
  }

  setHeader(event, 'Content-Type', 'text/csv; charset=utf-8')
  setHeader(event, 'Content-Disposition', 'attachment; filename="export.csv"')

  return csv
})
