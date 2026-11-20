import type { JSX } from 'react'

function SpotsSeite(): JSX.Element {
  return (
    <section className="seitenkarte">
      <p className="seitenkarte__augenbraue">Deine Favoriten</p>
      <h1>Gemerkte Spots</h1>
      <p className="seitenkarte__beschreibung">
        Deine gespeicherten Fotospots kannst du in Teil 2 hier wiederfinden.
      </p>
      <p className="statushinweis">Die Spot-Verwaltung folgt in Teil 2.</p>
    </section>
  )
}

export default SpotsSeite
