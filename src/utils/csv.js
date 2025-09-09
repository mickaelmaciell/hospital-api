export function toCsv(rows = []) {
  if (!rows.length) return ''
  const keys = Object.keys(rows[0])
  const head = keys.join(',')
  const body = rows
    .map(r => keys.map(k => `"${String(r[k] ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n')
  return [head, body].join('\n')
}
