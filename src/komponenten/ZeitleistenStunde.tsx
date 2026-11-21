import type { JSX } from 'react'
import type { BewerteteStunde } from '../typen'

interface ZeitleistenStundeProps {
  stunde: BewerteteStunde
  goldeneStunde: boolean
  bestesZeitfenster: boolean
}

function ZeitleistenStunde({
  stunde,
  goldeneStunde,
  bestesZeitfenster,
}: ZeitleistenStundeProps): JSX.Element {
  const uhrzeit = stunde.zeit.slice(11, 16)
  const scoreText =
    stunde.score >= 80
      ? 'Sehr gut'
      : stunde.score >= 60
        ? 'Gut'
        : stunde.score >= 40
          ? 'Mittel'
          : 'Niedrig'
  const scoreKlasse =
    stunde.score >= 80
      ? 'fotowert--hoch'
      : stunde.score >= 60
        ? 'fotowert--gut'
        : stunde.score >= 40
          ? 'fotowert--mittel'
          : 'fotowert--niedrig'

  return (
    <li className="zeitleiste__eintrag">
      <article className="zeitleistenstunde">
        <time className="zeitleistenstunde__zeit" dateTime={stunde.zeit}>
          {uhrzeit}
        </time>
        <dl className="zeitleistenstunde__werte">
          <div>
            <dt>Bewölkung</dt>
            <dd>{stunde.bewoelkung} %</dd>
          </div>
          <div>
            <dt>Regen</dt>
            <dd>{stunde.regenwahrscheinlichkeit} %</dd>
          </div>
          <div>
            <dt>Wind</dt>
            <dd>{stunde.wind} km/h</dd>
          </div>
        </dl>
        <p className={`fotowert ${scoreKlasse}`}>
          Foto-Score: <strong>{stunde.score}/100</strong> · {scoreText}
        </p>
        {(goldeneStunde || bestesZeitfenster) && (
          <ul className="stundemerkmale">
            {goldeneStunde && <li>Goldene Stunde</li>}
            {bestesZeitfenster && <li>Bestes Zeitfenster</li>}
          </ul>
        )}
      </article>
    </li>
  )
}

export default ZeitleistenStunde
