import React from 'react'
import '@/App.css'
import {Outlet} from "react-router";

const App = (): React.JSX.Element => {
  return (
    <div className="app">
      <Outlet />
    </div>
  )
}

export default App
