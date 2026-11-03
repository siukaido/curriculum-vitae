import type { Role } from '../types'

/** セルを結合せずに罫線で職歴をまとめ、段落ごとの改ページを可能にする。 */
export function RoleDetails({ role }: { role: Role }) {
  const blocks = [
    {
      heading: '【担当職務】',
      content: role.positions.map((position, index) => (
        <p className="mb-0" key={index}>
          {position}
        </p>
      )),
    },
    ...role.description.map((paragraph, index) => ({
      heading: index === 0 ? '【業務内容】' : undefined,
      content: <p className="mb-0">{paragraph}</p>,
    })),
    ...(role.technologies.length > 0
      ? [
          {
            heading: '【主な使用技術】',
            content: (
              <ul className="list-unstyled mb-0">
                {role.technologies.map((technology, index) => (
                  <li key={index}>・{technology}</li>
                ))}
              </ul>
            ),
          },
        ]
      : []),
  ]

  return (
    <tbody>
      {blocks.map((block, index) => (
        <tr className="border-0" key={index}>
          <td
            className={[
              'align-top border-secondary',
              index === 0 ? 'border-top pt-2' : 'border-top-0 pt-0',
              index === blocks.length - 1 ? 'border-bottom pb-2' : 'border-bottom-0 pb-0',
            ].join(' ')}
          >
            {index === 0 &&
              role.period.split('\n').map((line, lineIndex) => (
                <span className="d-block" key={lineIndex}>
                  {line}
                </span>
              ))}
          </td>
          <td
            className={[
              'align-top border-secondary',
              index === 0
                ? 'border-top pt-2'
                : `border-top-0 ${block.heading ? 'pt-3' : 'pt-0'}`,
              index === blocks.length - 1 ? 'border-bottom pb-2' : 'border-bottom-0 pb-0',
            ].join(' ')}
          >
            {block.heading && (
              <h3 className="fs-6 fw-normal mb-0">{block.heading}</h3>
            )}
            {block.content}
          </td>
        </tr>
      ))}
    </tbody>
  )
}
