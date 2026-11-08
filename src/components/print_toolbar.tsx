import Button from 'react-bootstrap/Button'
import Stack from 'react-bootstrap/Stack'

/** 印刷設定の案内と、ブラウザ標準の印刷ボタンを表示する。 */
export function PrintToolbar({ isResume = false }: { isResume?: boolean }) {
  return (
    <Stack
      as="aside"
      direction="horizontal"
      className="container py-3 gap-3 flex-wrap justify-content-between d-print-none"
      style={{ maxWidth: '210mm' }}
      aria-label="印刷操作"
    >
      <div>
        <nav className="d-flex gap-3 mb-1" aria-label="書類の切り替え">
          <a
            href="?document=career"
            aria-current={!isResume ? 'page' : undefined}
          >
            職務経歴書
          </a>
          <a
            href="?document=resume"
            aria-current={isResume ? 'page' : undefined}
          >
            履歴書
          </a>
        </nav>
        <p className="small text-body-secondary mb-0">
          A4・縦／倍率 100%／ヘッダーとフッターをオフにして保存
        </p>
      </div>
      <Button variant="dark" onClick={() => window.print()}>
        印刷 / PDF 保存
      </Button>
    </Stack>
  )
}
