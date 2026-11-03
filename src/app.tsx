import Container from 'react-bootstrap/Container'
import profile from '../data/profile.json'
import { CompanyHistory } from './components/company_history'
import { DocumentHeader } from './components/document_header'
import { PrintToolbar } from './components/print_toolbar'
import { SelfIntroduction } from './components/self_introduction'
import type { Company } from './types'
import './print.css'

const companies = Object.entries(
  import.meta.glob<Company>('../data/experience/*.json', {
    eager: true,
    import: 'default',
  }),
).sort(
  ([pathA, a], [pathB, b]) => b.order - a.order || pathA.localeCompare(pathB),
)

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
        {companies.map(([path, company]) => (
          <CompanyHistory key={path} company={company} />
        ))}
        <SelfIntroduction paragraphs={profile.self_introduction} />
      </Container>
    </div>
  )
}

export default App
