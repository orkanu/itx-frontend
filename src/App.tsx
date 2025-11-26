import React from 'react'
import '@/App.css'
import { Outlet, useLocation } from "react-router";
import { Link } from 'react-router-dom';

const App = (): React.JSX.Element => {
  const location = useLocation()

  const breadcrumbs = location.pathname === '/' ? ['List'] : ['List', 'Details']

  return (
    <div className="app">
      <header className="header">
        <div className="header__left">
          <Link to="/" className="home-link">Home</Link>
          <nav className="breadcrumbs">
            {breadcrumbs.map((crumb, i) => (
              <span key={i}>{crumb}</span>
            ))}
          </nav>
        </div>
        <div className="header__right">
          <span>🛒 {"<Cart Count goes here>"}</span>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}

export default App
