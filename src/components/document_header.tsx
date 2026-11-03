interface DocumentHeaderProps {
  asOf: string
  name: string
}

/** 職務経歴書の固定見出しと基本情報を表示する。 */
export function DocumentHeader({ asOf, name }: DocumentHeaderProps) {
  return (
    <header className="mb-4 text-end">
      <h1 className="fs-4 text-center text-decoration-underline mb-4">
        職務経歴書
      </h1>
      <p className="mb-0">{asOf}</p>
      <p className="mb-0">氏名：　{name}</p>
    </header>
  )
}
