import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from './App'
import PhonesList from "@/routes/ProductList/ProductList.tsx";
import PhoneDetail from "@/routes/PhoneDetail/PhoneDetail.tsx";
import NotFoundPage from "@/routes/NotFoundPage/NotFoundPage.tsx";

// Create shared queryClient instance with cache expiration time of 1 hour
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60,
      gcTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
    },
  },
})

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
    element: <NotFoundPage />,
  },
])

createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)
