/** 自己PRを段落ごとに表示する。 */
export function SelfIntroduction({ paragraphs }: { paragraphs: string[] }) {
  return (
    <section>
      <h2 className="fs-5 fw-bold mb-2">自己PR</h2>
      {paragraphs.map((paragraph, index) => (
        <p className="mb-1" key={index}>{paragraph}</p>
      ))}
    </section>
  )
}
