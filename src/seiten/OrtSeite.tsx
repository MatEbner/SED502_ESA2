import type { JSX } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router'
import FehlerAnzeige from '../komponenten/FehlerAnzeige'
import LadeAnzeige from '../komponenten/LadeAnzeige'
import ZeitleistenStunde from '../komponenten/ZeitleistenStunde'
import useOrt from '../hooks/useOrt'
import useWetter from '../hooks/useWetter'
import type { Motiv, WetterStunde } from '../typen'

const motive: Motiv[] = ['Landschaft', 'Architektur', 'Portrait', 'Stadt']

function erstelleNaechsteSiebenTage(): string[] {
  const heute = new Date()

  return Array.from(
    { length: 7 },
    (_: unknown, index: number): string => {
      const datum = new Date(
        Date.UTC(heute.getFullYear(), heute.getMonth(), heute.getDate() + index),
      )
      const jahr = datum.getUTCFullYear()
      const monat = String(datum.getUTCMonth() + 1).padStart(2, '0')
      const tag = String(datum.getUTCDate()).padStart(2, '0')

      return `${jahr}-${monat}-${tag}`
    },
  )
}

function formatiereDatum(datum: string): string {
  const [jahr, monat, tag] = datum.split('-')
  return `${tag}.${monat}.${jahr}`
}

function formatiereUhrzeit(zeit: string): string {
  return zeit.slice(11, 16)
}

function OrtSeite(): JSX.Element {
  const { id: ortId } = useParams<{ id: string }>()
  const id = Number(ortId)
  const [tage] = useState<string[]>(erstelleNaechsteSiebenTage)
  const [datum, setDatum] = useState<string>(() => tage[0] ?? '')
  const [motiv, setMotiv] = useState<Motiv>('Landschaft')
  const { ort, status, fehler } = useOrt(id)
  const {
    stunden,
    sonnenzeiten,
    status: wetterStatus,
    fehler: wetterFehler,
  } = useWetter(ort, datum)

  function waehleDatum(neuesDatum: string): void {
    setDatum(neuesDatum)
  }

  function waehleMotiv(neuesMotiv: Motiv): void {
    setMotiv(neuesMotiv)
  }

  return (
    <section className="seitenkarte">
      <p className="seitenkarte__augenbraue">Dein Fotospot</p>
      <h1>{ort?.name ?? 'Ort'}</h1>
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

          <section className="ortseitenabschnitt" aria-labelledby="datum-titel">
            <h2 id="datum-titel">Tag auswählen</h2>
            <div className="datumsauswahl" role="group" aria-label="Datum auswählen">
              {tage.map((tag: string, index: number): JSX.Element => (
                <button
                  key={tag}
                  className={`auswahlknopf${datum === tag ? ' auswahlknopf--aktiv' : ''}`}
                  type="button"
                  aria-pressed={datum === tag}
                  onClick={(): void => waehleDatum(tag)}
                >
                  {index === 0 && <span>Heute</span>}
                  <time dateTime={tag}>{formatiereDatum(tag)}</time>
                </button>
              ))}
            </div>
          </section>

          <section className="ortseitenabschnitt" aria-labelledby="motiv-titel">
            <h2 id="motiv-titel">Fotomotiv</h2>
            <div className="motivsauswahl" role="group" aria-label="Motiv auswählen">
              {motive.map((motivOption: Motiv): JSX.Element => (
                <button
                  key={motivOption}
                  className={`auswahlknopf${motiv === motivOption ? ' auswahlknopf--aktiv' : ''}`}
                  type="button"
                  aria-pressed={motiv === motivOption}
                  onClick={(): void => waehleMotiv(motivOption)}
                >
                  {motivOption}
                </button>
              ))}
            </div>
          </section>

          <section
            className="ortseitenabschnitt"
            aria-labelledby="wetter-titel"
          >
            <h2 id="wetter-titel">Wetter und Sonnenzeiten</h2>
            {wetterStatus === 'loading' && (
              <LadeAnzeige nachricht="Wetterdaten werden geladen ..." />
            )}
            {wetterStatus === 'error' && wetterFehler !== null && (
              <FehlerAnzeige nachricht={wetterFehler} />
            )}
            {wetterStatus === 'success' && (
              <>
                {sonnenzeiten !== null && (
                  <p className="sonnenzeiten">
                    Sonnenaufgang{' '}
                    <time dateTime={sonnenzeiten.sonnenaufgang}>
                      {formatiereUhrzeit(sonnenzeiten.sonnenaufgang)}
                    </time>
                    <span aria-hidden="true"> · </span>
                    Sonnenuntergang{' '}
                    <time dateTime={sonnenzeiten.sonnenuntergang}>
                      {formatiereUhrzeit(sonnenzeiten.sonnenuntergang)}
                    </time>
                  </p>
                )}
                {stunden.length > 0 ? (
                  <ul className="zeitleiste" aria-label="Stündliche Wetterdaten">
                    {stunden.map((stunde: WetterStunde): JSX.Element => (
                      <ZeitleistenStunde key={stunde.zeit} stunde={stunde} />
                    ))}
                  </ul>
                ) : (
                  <p className="statushinweis">
                    Für diesen Tag sind keine stündlichen Wetterdaten verfügbar.
                  </p>
                )}
              </>
            )}
          </section>
        </>
      )}
    </section>
  )
}

export default OrtSeite
