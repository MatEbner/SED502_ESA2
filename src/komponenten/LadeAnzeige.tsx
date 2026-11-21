import type { JSX } from 'react'

interface LadeAnzeigeProps {
  nachricht: string
}

function LadeAnzeige({ nachricht }: LadeAnzeigeProps): JSX.Element {
  return (
    <p className="statusanzeige statusanzeige--laden" role="status">
      {nachricht}
    </p>
  )
}

export default LadeAnzeige
