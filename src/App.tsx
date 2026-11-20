import type { JSX } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import Layout from './komponenten/Layout'
import BriefingSeite from './seiten/BriefingSeite'
import OrtSeite from './seiten/OrtSeite'
import SpotsSeite from './seiten/SpotsSeite'
import StartSeite from './seiten/StartSeite'

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<StartSeite />} />
          <Route path="/ort/:id" element={<OrtSeite />} />
          <Route path="/briefing/:id" element={<BriefingSeite />} />
          <Route path="/spots" element={<SpotsSeite />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
