import type { JSX } from 'react'
import { Link, NavLink, Outlet } from 'react-router'

function Layout(): JSX.Element {
  return (
    <>
      <header className="seitenkopf">
        <div className="seitenkopf__innen">
          <Link className="marke" to="/">
            Fotowetter-Planer
          </Link>
          <nav className="navigation" aria-label="Hauptnavigation">
            <NavLink className="navigation__link" to="/">
              Start
            </NavLink>
            <NavLink className="navigation__link" to="/ort/2761369">
              Ort
            </NavLink>
            <NavLink
              className="navigation__link"
              to="/briefing/2761369?datum=2026-11-27&motiv=Landschaft"
            >
              Briefing
            </NavLink>
            <NavLink className="navigation__link" to="/spots">
              Spots
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="seiteninhalt">
        <Outlet />
      </main>
      <footer className="seitenfuss">
        <p>Gute Bedingungen für dein nächstes Fotomotiv.</p>
      </footer>
    </>
  )
}

export default Layout
