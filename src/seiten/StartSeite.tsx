import type { JSX } from 'react'
import { useState } from 'react'
import FehlerAnzeige from '../komponenten/FehlerAnzeige'
import LadeAnzeige from '../komponenten/LadeAnzeige'
import OrtKarte from '../komponenten/OrtKarte'
import SuchFeld from '../komponenten/SuchFeld'
import useDebounce from '../hooks/useDebounce'
import useGeocoding from '../hooks/useGeocoding'
import type { Ort } from '../typen'

function StartSeite(): JSX.Element {
  const [suchbegriff, setSuchbegriff] = useState<string>('')
  const verzoegerterSuchbegriff = useDebounce(suchbegriff, 400)
  const { orte, status, fehler } = useGeocoding(verzoegerterSuchbegriff)

  function aktualisiereSuchbegriff(neuerSuchbegriff: string): void {
    setSuchbegriff(neuerSuchbegriff)
  }

  return (
    <section className="seitenkarte">
      <p className="seitenkarte__augenbraue">Fotografie trifft Wetter</p>
      <h1>Plane dein nächstes Fotomotiv</h1>
      <p className="seitenkarte__beschreibung">
        Der Fotowetter-Planer hilft dir, passende Orte und Zeitfenster für deine
        Aufnahmen zu finden.
      </p>
      <SuchFeld
        suchbegriff={suchbegriff}
        onSuchbegriffAendern={aktualisiereSuchbegriff}
      />

      {status === 'loading' && (
        <LadeAnzeige nachricht="Orte werden gesucht ..." />
      )}
      {status === 'error' && fehler !== null && (
        <FehlerAnzeige nachricht={fehler} />
      )}
      {status === 'success' && orte.length === 0 && (
        <p className="statushinweis">Keine Orte gefunden. Versuche einen anderen Suchbegriff.</p>
      )}
      {orte.length > 0 && (
        <ul className="ortliste" aria-label="Suchergebnisse">
          {orte.map((ort: Ort): JSX.Element => (
            <li key={ort.id}>
              <OrtKarte ort={ort} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default StartSeite
