/** 自己PRを段落ごとに表示し、印刷時は全体を同じページにまとめる。 */
export function SelfIntroduction({ paragraphs }: { paragraphs: string[] }) {
  return (
    <section className="keep-together">
      <h2 className="fs-5 fw-bold mb-2">自己PR</h2>
      {paragraphs.map((paragraph, index) => (
        <p className="mb-1" key={index}>{paragraph}</p>
      ))}
    </section>
  )
}
