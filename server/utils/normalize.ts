export function normalizeRow(row: Record<string, any>) {
  const result: any = {}
  for (const [key, value] of Object.entries(row)) {
    if (typeof value === 'bigint') {
      result[key] = Number(value)   // or: value.toString()
    } else {
      result[key] = value
    }
  }
  return result
}