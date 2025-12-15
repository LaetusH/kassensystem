import { defineEventHandler } from 'h3'
import { query } from '~/server/utils/db'
import { getCurrentUserFromEvent } from '~/server/utils/sessionGuard'
import { normalizeBigInt } from '~/server/utils/normalize'

export default defineEventHandler(async (event) => {
  const user = await getCurrentUserFromEvent(event, { touch: true })
  if (!user) return { ok: false, error: 'Not authenticated' }

  const regularRows = normalizeBigInt(await query(`
    SELECT
      i.id,
      i.name,
      SUM(oi.quantity) AS quantity,
      SUM(oi.quantity * (i.price + IFNULL(i.deposit, 0))) AS revenue
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN items i ON oi.item_id = i.id
    WHERE o.fachschaft = 0
    GROUP BY i.id
    ORDER BY i.name ASC
  `))
    
  const regularItems = normalizeBigInt(regularRows)

  const totalRevenue = regularItems.reduce(
    (s: number, i: any) => s + Number(i.revenue),
    0
  )

  const fachschaftRows = normalizeBigInt(await query(`
    SELECT
      i.id,
      i.name,
      SUM(oi.quantity) AS quantity
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN items i ON oi.item_id = i.id
    WHERE o.fachschaft = 1
    GROUP BY i.id
    ORDER BY i.name ASC
  `))

  const fachschaftItems = normalizeBigInt(fachschaftRows)

  const paymentRows = await query(`
    SELECT COUNT(*) AS count
    FROM fachschaft_payments
  `)

  const paymentCount = Number(paymentRows[0]?.count ?? 0)
  const paymentRevenue = paymentCount * 10

  const lastHourRows = normalizeBigInt(await query(`
    SELECT
      SUM(oi.quantity * (i.price + IFNULL(i.deposit, 0))) AS revenue,
      SUM(oi.quantity) AS quantity
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN items i ON oi.item_id = i.id
    WHERE o.fachschaft = 0
      AND o.created_at >= NOW() - INTERVAL 1 HOUR
  `))

  const prevHourRows = normalizeBigInt(await query(`
    SELECT
      SUM(oi.quantity * (i.price + IFNULL(i.deposit, 0))) AS revenue,
      SUM(oi.quantity) AS quantity
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN items i ON oi.item_id = i.id
    WHERE o.fachschaft = 0
      AND o.created_at BETWEEN
        NOW() - INTERVAL 2 HOUR AND NOW() - INTERVAL 1 HOUR
  `))

  const lastHourRevenue = Number(lastHourRows[0]?.revenue ?? 0)
  const lastHourQuantity = Number(lastHourRows[0]?.quantity ?? 0)

  const prevHourRevenue = Number(prevHourRows[0]?.revenue ?? 0)
  const prevHourQuantity = Number(prevHourRows[0]?.quantity ?? 0)

  return {
    ok: true,

    regularRows,


    regular: {
      items: regularItems,
      totalRevenue
    },

    fachschaft: {
      items: fachschaftItems
    },

    payments: {
      count: paymentCount,
      revenue: paymentRevenue
    },

    lastHour: {
      revenue: lastHourRevenue,
      quantity: lastHourQuantity,
      diffRevenue: lastHourRevenue - prevHourRevenue,
      diffQuantity: lastHourQuantity - prevHourQuantity
    }
  }
})