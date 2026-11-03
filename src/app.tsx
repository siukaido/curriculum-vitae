import Container from 'react-bootstrap/Container'
import profile from '../data/profile.json'
import { CompanyHistory } from './components/company_history'
import { DocumentHeader } from './components/document_header'
import { PrintToolbar } from './components/print_toolbar'
import { SelfIntroduction } from './components/self_introduction'
import type { Company } from './types'
import './print.css'

/** 同じ区分の職歴を表示順の降順、同順位ならファイル名順に並べる。 */
function sortCompanies(companies: Record<string, Company>) {
  return Object.entries(companies).sort(
    ([pathA, a], [pathB, b]) => b.order - a.order || pathA.localeCompare(pathB),
  )
}

const companyGroups = [
  {
    title: '職務経歴',
    companies: sortCompanies(import.meta.glob<Company>('../data/experience/*.json', {
      eager: true,
      import: 'default',
    })),
  },
  {
    title: 'フリーランス・副業',
    companies: sortCompanies(import.meta.glob<Company>('../data/side-experience/*.json', {
      eager: true,
      import: 'default',
    })),
  },
]

/** JSON の職歴を読み込み、印刷操作と文書全体を組み立てる。 */
function App() {
  return (
    <div className="document-preview bg-body-secondary min-vh-100 pb-4">
      <PrintToolbar />
      <Container
        as="main"
        className="document bg-white p-4 p-md-5 small text-break"
        style={{ maxWidth: '210mm' }}
      >
        <DocumentHeader
          asOf={profile.as_of}
          name={profile.name}
        />
        {companyGroups.filter((group) => group.companies.length > 0).map((group) => (
          <section key={group.title}>
            <h2 className="fs-5 fw-bold mb-3">{group.title}</h2>
            {group.companies.map(([path, company]) => (
              <CompanyHistory key={path} company={company} />
            ))}
          </section>
        ))}
        <SelfIntroduction paragraphs={profile.self_introduction} />
      </Container>
    </div>
  )
}

export default App
