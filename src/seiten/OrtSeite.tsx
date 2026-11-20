import type { JSX } from 'react'
import { useParams } from 'react-router'

function OrtSeite(): JSX.Element {
  const { id } = useParams<{ id: string }>()

  return (
    <section className="seitenkarte">
      <p className="seitenkarte__augenbraue">Dein Fotospot</p>
      <h1>Ort auswählen</h1>
      <p className="seitenkarte__beschreibung">
        Hier erscheinen später Wetter, Sonnenzeiten und die stündliche
        Foto-Zeitleiste.
      </p>
      <p className="statushinweis">Beispiel-Ort-ID: {id}</p>
    </section>
  )
}

export default OrtSeite
