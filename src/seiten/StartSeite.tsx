import type { JSX } from 'react'

function StartSeite(): JSX.Element {
  return (
    <section className="seitenkarte">
      <p className="seitenkarte__augenbraue">Fotografie trifft Wetter</p>
      <h1>Plane dein nächstes Fotomotiv</h1>
      <p className="seitenkarte__beschreibung">
        Der Fotowetter-Planer hilft dir, passende Orte und Zeitfenster für deine
        Aufnahmen zu finden.
      </p>
      <p className="statushinweis">Die Ortssuche folgt im nächsten Schritt.</p>
    </section>
  )
}

export default StartSeite
