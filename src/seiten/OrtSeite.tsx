import type { JSX } from 'react'
import { useParams } from 'react-router'
import FehlerAnzeige from '../komponenten/FehlerAnzeige'
import LadeAnzeige from '../komponenten/LadeAnzeige'
import useOrt from '../hooks/useOrt'

function OrtSeite(): JSX.Element {
  const { id: ortId } = useParams<{ id: string }>()
  const id = Number(ortId)
  const { ort, status, fehler } = useOrt(id)

  return (
    <section className="seitenkarte">
      <p className="seitenkarte__augenbraue">Dein Fotospot</p>
      <h1>{ort?.name ?? 'Ort laden'}</h1>
      {status === 'loading' && (
        <LadeAnzeige nachricht="Ortsdaten werden geladen ..." />
      )}
      {status === 'error' && fehler !== null && (
        <FehlerAnzeige nachricht={fehler} />
      )}
      {status === 'success' && ort !== null && (
        <>
          <p className="seitenkarte__beschreibung">
            {ort.region ? `${ort.region}, ` : ''}
            {ort.land}
          </p>
          <dl className="parameterliste">
            <div>
              <dt>Breitengrad</dt>
              <dd>{ort.breitengrad}</dd>
            </div>
            <div>
              <dt>Längengrad</dt>
              <dd>{ort.laengengrad}</dd>
            </div>
          </dl>
          <p className="statushinweis">
            Wetterdaten und Zeitleiste folgen in den nächsten Schritten.
          </p>
        </>
      )}
    </section>
  )
}

export default OrtSeite
