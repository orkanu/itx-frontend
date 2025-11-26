import { QueryClient } from "@tanstack/react-query";

// Create shared tanstackQueryClient instance with cache expiration time of 1 hour
export const tanstackQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60,
      gcTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
    },
  },
})
