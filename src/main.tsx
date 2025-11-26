import React from 'react'
import './main.css'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { tanstackQueryClient } from "@/tanstackQueryClient.ts";
import App from './App'
import PhonesList from "@/routes/PhoneList/PhoneList.tsx";
import PhoneDetail from "@/routes/PhoneDetail/PhoneDetail.tsx";
import NotFound from "@/routes/NotFound/NotFound.tsx";



const router = createBrowserRouter([
  {
    Component: App,
    children: [
      { index: true, Component: PhonesList },
      { path: '/phone/:id', Component: PhoneDetail },
    ],
  },
  {
    path: "*", // Catch-all 404 routes
    element: <NotFound />,
  },
])

createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={tanstackQueryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)
