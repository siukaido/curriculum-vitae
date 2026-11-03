/** 自己PRを段落ごとに表示する。 */
export function SelfIntroduction({ paragraphs }: { paragraphs: string[] }) {
  return (
    <section>
      <h2 className="fs-6 fw-bold mb-3">自己PR</h2>
      {paragraphs.map((paragraph, index) => (
        <p className="mb-2" key={index}>{paragraph}</p>
      ))}
    </section>
  )
}
