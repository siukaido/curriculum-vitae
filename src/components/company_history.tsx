import Table from 'react-bootstrap/Table'
import type { Company } from '../types'
import { RoleDetails } from './role_details'

/** 会社情報と期間別の職歴を、段落単位で改ページできる表にする。 */
export function CompanyHistory({ company }: { company: Company }) {
  return (
    <section
      className={`company mb-4${company.page_break_before ? ' page-break' : ''}`}
    >
      <Table bordered className="caption-top border-secondary mb-0">
        <caption className="text-body pt-0">
          <h2 className="fs-6 fw-bold mb-1">
            {company.name}{' '}
            {company.url && (
              <a
                className="small fw-normal link-body-emphasis text-decoration-none"
                href={company.url}
              >
                ({company.url})
              </a>
            )}
          </h2>
          <p className="mb-0">{company.period}</p>
          {company.note && <p className="mt-1 mb-0">{company.note}</p>}
        </caption>
        <colgroup>
          <col style={{ width: '19%' }} />
          <col />
        </colgroup>
        <thead className="table-secondary text-center">
          <tr className="border-secondary">
            <th className="fw-normal border-secondary" scope="col">
              期間
            </th>
            <th className="fw-normal border-secondary" scope="col">
              業務内容
            </th>
          </tr>
        </thead>
        {company.roles.map((role, index) => (
          <RoleDetails key={index} role={role} />
        ))}
      </Table>
    </section>
  )
}
