import type { JSX } from 'react'
import type { WetterStunde } from '../typen'

interface ZeitleistenStundeProps {
  stunde: WetterStunde
}

function ZeitleistenStunde({
  stunde,
}: ZeitleistenStundeProps): JSX.Element {
  const uhrzeit = stunde.zeit.slice(11, 16)

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
      </article>
    </li>
  )
}

export default ZeitleistenStunde
