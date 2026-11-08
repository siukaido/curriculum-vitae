import type { Company, ResumeEvent } from '../types'

/** 日本語表記の日付を検証する。未入力や不正な日付は計算に使用しない。 */
function parseDate(value: string) {
  const match = /^(\d{4})年(\d{1,2})月(\d{1,2})日(?:現在)?$/.exec(value.trim())
  if (!match) return null
  const [year, month, day] = match.slice(1).map(Number)
  const date = new Date(0)
  date.setUTCFullYear(year, month - 1, day)
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  )
    return null
  return { year, month, day, time: date.getTime() }
}

/** 作成基準日時点の満年齢を求める。日付不明や出生前の場合は空欄にする。 */
export function calculateAge(birthDate: string, asOf: string): number | null {
  const birth = parseDate(birthDate)
  const reference = parseDate(asOf)
  if (!birth || !reference || reference.time < birth.time) return null
  const beforeBirthday =
    reference.month < birth.month ||
    (reference.month === birth.month && reference.day < birth.day)
  return reference.year - birth.year - Number(beforeBirthday)
}

/** 年月を比較・表示できる値に分解する。不正な年月は明示的に拒否する。 */
export function parseYearMonth(value: string) {
  const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(value)
  if (!match) throw new Error(`年月は YYYY-MM 形式で指定してください: ${value}`)
  return { year: Number(match[1]), month: Number(match[2]) }
}

/** 本業の入退社と追加の出来事を年月順に統合する。副業は呼び出し元で除外する。 */
export function buildCareerEvents(
  companies: Company[],
  additional: ResumeEvent[],
): ResumeEvent[] {
  const events = [...additional]
  for (const company of companies) {
    if (!company.employment) continue
    const { start, end } = company.employment
    parseYearMonth(start)
    if (end !== null) {
      parseYearMonth(end)
      if (end < start)
        throw new Error(`${company.name}: 退社年月が入社年月より前です`)
    }
    events.push({ date: start, text: `${company.name} 入社` })
    if (end !== null) events.push({ date: end, text: `${company.name} 退社` })
  }
  return sortEvents(events)
}

/** 年月順に並べる。空欄を許可する場合は、年月不明の項目を末尾に置く。 */
export function sortEvents(events: ResumeEvent[], allowEmptyDate = false) {
  for (const event of events) {
    if (allowEmptyDate && event.date === '') continue
    parseYearMonth(event.date)
  }
  return [...events].sort((a, b) => {
    if (a.date === b.date) return 0
    if (a.date === '') return 1
    if (b.date === '') return -1
    return a.date.localeCompare(b.date)
  })
}
