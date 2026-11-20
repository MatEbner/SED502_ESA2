import type { JSX } from 'react'
import { useSearchParams, useParams } from 'react-router'

function BriefingSeite(): JSX.Element {
  const { id } = useParams<{ id: string }>()
  const [suchparameter] = useSearchParams()
  const datum = suchparameter.get('datum')
  const motiv = suchparameter.get('motiv')

  return (
    <section className="seitenkarte">
      <p className="seitenkarte__augenbraue">Dein Aufnahmeplan</p>
      <h1>Briefing</h1>
      <p className="seitenkarte__beschreibung">
        Das KI-Briefing wird in Teil 2 ergänzt.
      </p>
      <dl className="parameterliste">
        <div>
          <dt>Ort-ID</dt>
          <dd>{id ?? 'Nicht angegeben'}</dd>
        </div>
        <div>
          <dt>Datum</dt>
          <dd>{datum ?? 'Nicht angegeben'}</dd>
        </div>
        <div>
          <dt>Motiv</dt>
          <dd>{motiv ?? 'Nicht angegeben'}</dd>
        </div>
      </dl>
    </section>
  )
}

export default BriefingSeite
