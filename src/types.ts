/** 一つの担当期間における職務と使用技術。 */
export interface Role {
  keep_together?: boolean
  period: string
  positions: string[]
  scope?: string[]
  results?: string[]
  description: string[]
  technologies: string[]
}

/** 表示順と会社単位の職歴。期間は「現在」「夏」なども書ける自由記述。 */
export interface Company {
  employment?: { start: string; end: string | null }
  order: number
  name: string
  url: string
  period: string
  note?: string
  page_break_before?: boolean
  roles: Role[]
}

/** 両書類で共有する本人の基本情報。 */
export interface Profile {
  name: string
  name_kana: string
  birth_date: string
  gender?: string
  postal_code: string
  address: string
  address_kana?: string
  phone: string
  email: string
  contact_address_kana?: string
  contact_postal_code?: string
  contact_address?: string
  contact_phone?: string
}

/** 両書類で共有する作成基準日。 */
export interface DocumentSettings {
  as_of: string
}

/** 職務経歴書向けの職務要約と自己PR。 */
export interface CareerSummary {
  summary?: string[]
  self_introduction: string[]
}

/** 年月と出来事。年月は YYYY-MM 形式。免許・資格のみ空文字で取得年月不明を表す。 */
export interface ResumeEvent {
  date: string
  text: string
}

/** 履歴書専用の追加職歴と応募用の文章。 */
export interface ResumeContent {
  career_events: ResumeEvent[]
  motivation: string
  preferences: string
}
