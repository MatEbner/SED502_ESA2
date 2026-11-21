import type { ChangeEvent, JSX } from 'react'

interface SuchFeldProps {
  suchbegriff: string
  onSuchbegriffAendern: (suchbegriff: string) => void
}

function SuchFeld({
  suchbegriff,
  onSuchbegriffAendern,
}: SuchFeldProps): JSX.Element {
  function bearbeiteEingabe(ereignis: ChangeEvent<HTMLInputElement>): void {
    onSuchbegriffAendern(ereignis.currentTarget.value)
  }

  return (
    <div className="suchfeld">
      <label htmlFor="ortssuche">Ort suchen</label>
      <input
        id="ortssuche"
        name="ortssuche"
        type="search"
        autoComplete="off"
        placeholder="Zum Beispiel Wien"
        value={suchbegriff}
        onChange={bearbeiteEingabe}
      />
      <p className="suchfeld__hinweis">Gib mindestens zwei Zeichen ein.</p>
    </div>
  )
}

export default SuchFeld
