import React from 'react'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import Root from '@/layouts/Root'
import PhonesList from '@/pages/ProductList/ProductList'
import '@/App.css'

const router = createBrowserRouter([
  {
    Component: Root,
    children: [{ index: true, Component: PhonesList }],
  },
])

const App = (): React.JSX.Element => {
  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
