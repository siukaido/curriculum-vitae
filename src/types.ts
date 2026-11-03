/** 一つの担当期間における職務と使用技術。 */
export interface Role {
  period: string
  positions: string[]
  description: string[]
  technologies: string[]
}

/** 表示順と会社単位の職歴。期間は「現在」「夏」なども書ける自由記述。 */
export interface Company {
  order: number
  name: string
  url: string
  period: string
  page_break_before?: boolean
  roles: Role[]
}

/** 職務経歴書の基本情報。 */
export interface Profile {
  title: string
  name: string
  as_of: string
  self_introduction: string[]
}
