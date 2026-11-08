import {
  buildCareerEvents,
  calculateAge,
  parseYearMonth,
  sortEvents,
} from '../lib/resume'
import type {
  Company,
  Profile,
  ResumeEvent,
  ResumeContent,
  DocumentSettings,
} from '../types'
import '../resume.css'

interface HistoryRow extends ResumeEvent {
  align?: 'center' | 'right'
}

/** 年月と内容を公式様式に合わせた罫線表に表示し、所定の行数まで空欄を補う。 */
function HistoryTable({
  title,
  rows,
  minRows,
}: {
  title: string
  rows: HistoryRow[]
  minRows: number
}) {
  const paddedRows = [
    ...rows,
    ...Array.from({ length: Math.max(0, minRows - rows.length) }, () => ({
      date: '',
      text: '',
    })),
  ]
  return (
    <table className="resume-grid resume-history" aria-label={title}>
      <colgroup>
        <col className="resume-year" />
        <col className="resume-month" />
        <col />
      </colgroup>
      <thead>
        <tr>
          <th scope="col">年</th>
          <th scope="col">月</th>
          <th scope="col">{title}</th>
        </tr>
      </thead>
      <tbody>
        {paddedRows.map((row: HistoryRow, index) => {
          const date = row.date ? parseYearMonth(row.date) : null
          return (
            <tr key={index}>
              <td>{date?.year}</td>
              <td>{date?.month}</td>
              <td style={{ textAlign: row.align ?? 'left' }}>
                {row.text || '\u00a0'}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

/** 公式様式の自由記入欄を、見出しを枠内に収めて表示する。 */
function TextSection({
  title,
  value,
  compact = false,
}: {
  title: string
  value: string
  compact?: boolean
}) {
  return (
    <section
      className={`resume-text-box${compact ? ' resume-text-box-compact' : ''}`}
    >
      <h2>{title}</h2>
      <div>{value}</div>
    </section>
  )
}

/** 写真欄を省いた基本情報欄。任意の情報は未入力のまま表示する。 */
function PersonalDetails({
  profile,
  asOf,
}: {
  profile: Profile
  asOf: string
}) {
  const age = calculateAge(profile.birth_date, asOf)
  return (
    <table className="resume-grid resume-personal" aria-label="基本情報">
      <colgroup>
        <col style={{ width: '76%' }} />
        <col />
      </colgroup>
      <tbody>
        <tr>
          <td colSpan={2} className="resume-kana">
            <span>ふりがな</span>
            {profile.name_kana}
          </td>
        </tr>
        <tr>
          <td colSpan={2} className="resume-name">
            <span>氏名</span>
            <div>{profile.name}</div>
          </td>
        </tr>
        <tr>
          <td className="resume-birth">
            {profile.birth_date
              ? `${profile.birth_date}生`
              : '　　 年　　 月　　 日生'}
            {`　（満${age ?? '　'}歳）`}
          </td>
          <td>
            <span>性別（任意）</span>
            {profile.gender}
          </td>
        </tr>
        <tr>
          <td className="resume-kana">
            <span>ふりがな</span>
            {profile.address_kana}
          </td>
          <td rowSpan={2}>
            <span>電話</span>
            <div>{profile.phone}</div>
          </td>
        </tr>
        <tr>
          <td className="resume-address">
            <span>現住所　〒{profile.postal_code}</span>
            <div>{profile.address}</div>
          </td>
        </tr>
        <tr>
          <td className="resume-kana">
            <span>ふりがな</span>
            {profile.contact_address_kana}
          </td>
          <td rowSpan={2}>
            <span>電話</span>
            <div>{profile.contact_phone}</div>
          </td>
        </tr>
        <tr>
          <td className="resume-address">
            <span>連絡先　〒{profile.contact_postal_code}</span>
            <small>（現住所以外に連絡を希望する場合のみ記入）</small>
            <div>{profile.contact_address}</div>
          </td>
        </tr>
        <tr>
          <td colSpan={2} className="resume-email">
            <span>メールアドレス</span>
            {profile.email}
          </td>
        </tr>
      </tbody>
    </table>
  )
}

/** 厚生労働省のA4様式例をもとに、写真なしの履歴書を2ページ構成で表示する。 */
export function ResumeDocument({
  profile,
  resume,
  companies,
  documentSettings,
  education,
  qualifications,
}: {
  profile: Profile
  resume: ResumeContent
  companies: Company[]
  documentSettings: DocumentSettings
  education: ResumeEvent[]
  qualifications: ResumeEvent[]
}) {
  const career = buildCareerEvents(companies, resume.career_events)
  const history: HistoryRow[] = [
    { date: '', text: '学歴', align: 'center' },
    ...sortEvents(education),
    { date: '', text: '職歴', align: 'center' },
    ...career,
    ...(companies.some((company) => company.employment?.end === null)
      ? [{ date: '', text: '現在に至る' }]
      : []),
    { date: '', text: '以上', align: 'right' },
  ]
  const missing = [
    !profile.name_kana && 'ふりがな',
    !profile.birth_date && '生年月日',
    !profile.address && '住所',
    !profile.phone && '電話番号',
    !profile.email && 'メールアドレス',
    education.length === 0 && '学歴',
    companies.some((company) => !company.employment) &&
      '一部の職歴の入退社年月',
  ].filter(Boolean)
  return (
    <article className="resume" aria-label="履歴書">
      {missing.length > 0 && (
        <aside className="alert alert-warning d-print-none" role="status">
          未入力：{missing.join('・')}
          。基本情報は空欄で印刷されます。入退社年月のない会社は掲載されません。
        </aside>
      )}
      <section className="resume-sheet" aria-label="履歴書 1ページ目">
        <header className="resume-heading">
          <h1>履 歴 書</h1>
          <p>{documentSettings.as_of}</p>
        </header>
        <PersonalDetails profile={profile} asOf={documentSettings.as_of} />
        <HistoryTable
          title="学歴・職歴（各別にまとめて書く）"
          rows={history.slice(0, 15)}
          minRows={15}
        />
        <p className="resume-note">
          ※「性別」欄の記載は任意です。未記載とすることも可能です。
        </p>
      </section>
      <section className="resume-sheet" aria-label="履歴書 2ページ目">
        <HistoryTable
          title="学歴・職歴（各別にまとめて書く）"
          rows={history.slice(15)}
          minRows={7}
        />
        <HistoryTable
          title="免許・資格"
          rows={sortEvents(qualifications, true)}
          minRows={6}
        />
        <TextSection
          title="志望の動機、特技、好きな学科、アピールポイントなど"
          value={resume.motivation}
        />
        <TextSection
          title="本人希望記入欄（特に給料・職種・勤務時間・勤務地・その他についての希望などがあれば記入）"
          value={resume.preferences}
          compact
        />
      </section>
    </article>
  )
}
