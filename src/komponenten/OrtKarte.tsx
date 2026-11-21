import type { JSX } from 'react'
import { Link } from 'react-router'
import type { Ort } from '../typen'

interface OrtKarteProps {
  ort: Ort
}

function OrtKarte({ ort }: OrtKarteProps): JSX.Element {
  const ortsangabe = ort.region
    ? `${ort.region}, ${ort.land}`
    : ort.land

  return (
    <article className="ortkarte">
      <h2 className="ortkarte__titel">
        <Link className="ortkarte__link" to={`/ort/${ort.id}`}>
          {ort.name}
        </Link>
      </h2>
      <p className="ortkarte__details">{ortsangabe}</p>
    </article>
  )
}

export default OrtKarte
