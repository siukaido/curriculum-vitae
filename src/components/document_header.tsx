interface DocumentHeaderProps {
  title: string
  asOf: string
  name: string
}

/** 表題、更新日、氏名を元の職務経歴書の配置で表示する。 */
export function DocumentHeader({ title, asOf, name }: DocumentHeaderProps) {
  return (
    <header className="mb-4 text-end">
      <h1 className="fs-4 text-center text-decoration-underline mb-4">
        {title}
      </h1>
      <p className="mb-0">{asOf}</p>
      <p className="mb-0">氏名：　{name}</p>
    </header>
  )
}
