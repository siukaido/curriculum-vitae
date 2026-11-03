import type { Role } from '../types'

/** 役職と最初の説明をまとめ、担当範囲・成果・取り組みを段落単位で表示する。 */
export function RoleDetails({ role }: { role: Role }) {
  const blocks = [
    {
      heading: '担当職務',
      content: (
        <>
          {role.positions.map((position, index) => (
            <p className="mb-0" key={index}>{position}</p>
          ))}
          {role.description[0] && <p className="mt-2 mb-0">{role.description[0]}</p>}
          {role.scope && role.scope.length > 0 && (
            <div className="mt-2">
              <h3 className="small fw-bold mb-1">担当範囲・体制</h3>
              {role.scope.map((paragraph, index) => (
                <p className="mb-0" key={index}>{paragraph}</p>
              ))}
            </div>
          )}
        </>
      ),
    },
    ...(role.results ?? []).map((paragraph, index) => ({
      heading: index === 0 ? '主な成果' : undefined,
      content: <p className="mb-1">{paragraph}</p>,
    })),
    ...role.description.slice(1).map((paragraph, index) => ({
      heading: index === 0 ? '主な取り組み' : undefined,
      content: <p className="mb-1">{paragraph}</p>,
    })),
    ...(role.technologies.length > 0
      ? [{
          heading: '主な使用技術',
          content: <p className="mb-0">{role.technologies.join(' ／ ')}</p>,
        }]
      : []),
  ]

  return (
    <tbody>
      {blocks.map((block, index) => (
        <tr className={`border-0${index === blocks.length - 2 ? ' keep-with-next' : ''}`} key={index}>
          <td
            className={[
              'align-top border-secondary',
              index === 0 ? 'border-top pt-2' : 'border-top-0 pt-0',
              index === blocks.length - 1 ? 'border-bottom pb-2' : 'border-bottom-0 pb-0',
            ].join(' ')}
          >
            {index === 0 && role.period.split('\n').map((line, lineIndex) => (
              <span className="d-block" key={lineIndex}>{line}</span>
            ))}
          </td>
          <td
            className={[
              'align-top border-secondary',
              index === 0 ? 'border-top pt-2' : `border-top-0 ${block.heading ? 'pt-2' : 'pt-0'}`,
              index === blocks.length - 1 ? 'border-bottom pb-2' : 'border-bottom-0 pb-0',
            ].join(' ')}
          >
            {block.heading && <h3 className="small fw-bold mb-1">{block.heading}</h3>}
            {block.content}
          </td>
        </tr>
      ))}
    </tbody>
  )
}
