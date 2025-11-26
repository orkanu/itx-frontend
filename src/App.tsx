import React from 'react'
import '@/App.css'
import { Outlet, useLocation } from "react-router";
import { Link } from 'react-router-dom';
import useBasketStore from "@/store/basket.ts";

const App = (): React.JSX.Element => {
  const basketCount = useBasketStore(state => state.count)
  const location = useLocation()

  const breadcrumbs = location.pathname === '/' ? ['List'] : ['List', 'Details']

  return (
    <div className="app">
      <header className="header">
        <div className="header__left">
          <Link to="/" className="home-link">Home</Link>
          <nav className="breadcrumbs">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb} className="crumb">{crumb}{i < breadcrumbs.length - 1 ? ' / ' : ''}</span>
            ))}
          </nav>
        </div>
        <div className="header__right">
          <span>🛒 {basketCount}</span>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}

export default App
