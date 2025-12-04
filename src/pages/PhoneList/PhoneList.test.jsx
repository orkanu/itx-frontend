import React from 'react'
import { render, screen, act, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { usePhoneList } from '@/features/phone/hooks/usePhoneList.ts'
import PhonesList from './PhoneList.tsx'

jest.mock('@/features/phone/hooks/usePhoneList.ts', () => ({
  usePhoneList: jest.fn(),
}))

function createTestClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
        refetchOnWindowFocus: false,
      },
    },
  })
}

function renderWithProviders(ui) {
  const client = createTestClient()
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  )
}

describe('PhonesList', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
    cleanup()
  })

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers()
    })
    jest.useRealTimers()
  })

  it('shows loading state initially and then renders items on success', async () => {
    usePhoneList
      .mockReturnValueOnce({ data: undefined, isLoading: true, isError: false, error: null, refetch: jest.fn() })
      .mockReturnValueOnce({
        data: [
          { id: '1', brand: 'Apple', model: 'iPhone 14', price: 999, imgUrl: 'apple.jpg' },
          { id: '2', brand: 'Samsung', model: 'Galaxy S23', price: 899, imgUrl: 'samsung.jpg' },
        ],
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      })
    // Subsequent renders keep success data
    usePhoneList.mockReturnValue({
      data: [
        { id: '1', brand: 'Apple', model: 'iPhone 14', price: 999, imgUrl: 'apple.jpg' },
        { id: '2', brand: 'Samsung', model: 'Galaxy S23', price: 899, imgUrl: 'samsung.jpg' },
      ],
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    })

    const view = renderWithProviders(<PhonesList />)

    expect(screen.getByRole('status')).toHaveTextContent(/Loading phones/i)

    // Rerender with success state
    view.rerender(
      <QueryClientProvider client={createTestClient()}>
        <MemoryRouter>
          <PhonesList />
        </MemoryRouter>
      </QueryClientProvider>
    )

    expect(await screen.findByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Samsung')).toBeInTheDocument()

    expect(screen.getByText('Phones')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Filter by brand or model/i)).toBeInTheDocument()
  })

  it('renders empty state when API returns an empty list', async () => {
    usePhoneList.mockReturnValueOnce({ data: [], isLoading: false, isError: false, error: null, refetch: jest.fn() })

    renderWithProviders(<PhonesList />)

    // Empty state shows a polite status message
    expect(await screen.findByRole('status')).toBeInTheDocument()

    expect(await screen.findByText(/No phones found/i)).toBeInTheDocument()
  })

  it('renders error state and allows retry on failure', async () => {
    const refetch = jest.fn()
    // First render returns error
    usePhoneList
      .mockReturnValueOnce({ data: undefined, isLoading: false, isError: true, error: new Error('Network error'), refetch })
      // Second render returns success (simulating refetch success)
      .mockReturnValueOnce({
        data: [{ id: '1', brand: 'Xiaomi', model: 'Mi 13', price: 599, imgUrl: 'xiaomi.jpg' }],
        isLoading: false,
        isError: false,
        error: null,
        refetch,
      })
    // Subsequent renders keep success data
    usePhoneList.mockReturnValue({
      data: [{ id: '1', brand: 'Xiaomi', model: 'Mi 13', price: 599, imgUrl: 'xiaomi.jpg' }],
      isLoading: false,
      isError: false,
      error: null,
      refetch,
    })

    const view = renderWithProviders(<PhonesList />)

    // Shows error message
    expect(await screen.findByRole('alert')).toHaveTextContent(/Failed to load phones: Network error/i)

    const retryBtn = screen.getByRole('button', { name: /Retry/i })
    // Switch to real timers so React Query refetch + RTL findBy* work
    jest.useRealTimers()
    await userEvent.click(retryBtn)

    // Simulate hook returning new data after refetch by re-rendering
    view.rerender(
      <QueryClientProvider client={createTestClient()}>
        <MemoryRouter>
          <PhonesList />
        </MemoryRouter>
      </QueryClientProvider>
    )

    // Ensure new data appears
    expect(await screen.findByText('Xiaomi')).toBeInTheDocument()
    // Switch back to fake timers for cleanup
    jest.useFakeTimers()
  })

  it('filters list when input has 3+ characters', async () => {
    usePhoneList
      .mockReturnValueOnce({ data: undefined, isLoading: true, isError: false, error: null, refetch: jest.fn() })
      .mockReturnValueOnce({
        data: [
          { id: '1', brand: 'Google', model: 'Pixel 8', price: 799, imgUrl: 'pixel.jpg' },
          { id: '2', brand: 'Apple', model: 'iPhone 14', price: 999, imgUrl: 'iphone.jpg' },
        ],
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      })
    // Subsequent renders keep same data
    usePhoneList.mockReturnValue({
      data: [
        { id: '1', brand: 'Google', model: 'Pixel 8', price: 799, imgUrl: 'pixel.jpg' },
        { id: '2', brand: 'Apple', model: 'iPhone 14', price: 999, imgUrl: 'iphone.jpg' },
      ],
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    })

    const view = renderWithProviders(<PhonesList />)

    // Loading immediately
    expect(screen.getByRole('status')).toHaveTextContent(/Loading phones/i)

    // Show data after rerender
    view.rerender(
      <QueryClientProvider client={createTestClient()}>
        <MemoryRouter>
          <PhonesList />
        </MemoryRouter>
      </QueryClientProvider>
    )

    // Wait for data
    expect(await screen.findByText('Google')).toBeInTheDocument()
    expect(screen.getByText('Apple')).toBeInTheDocument()

    const input = screen.getByPlaceholderText(/Filter by brand or model/i)

    // Configure user-event to work with Jest fake timers so its internal timers advance
    const user = userEvent.setup({
      advanceTimers: (ms) =>
        act(() => {
          jest.advanceTimersByTime(ms)
        }),
    })

    // Less than 3 chars -> no filtering (both visible)
    await user.clear(input)
    await user.type(input, 'ap')
    // Debounce not triggered yet because < 3
    act(() => {
      jest.advanceTimersByTime(350)
    })
    expect(screen.getByText('Google')).toBeInTheDocument()
    expect(screen.getByText('Apple')).toBeInTheDocument()

    //3+ chars -> filters to Apple
    await user.clear(input)
    await user.type(input, 'appl')
    act(() => {
      jest.advanceTimersByTime(350)
    })

    expect(screen.queryByText('Google')).not.toBeInTheDocument()
    expect(screen.getByText('Apple')).toBeInTheDocument()

    // No match state
    await user.clear(input)
    await user.type(input, 'zzz')
    act(() => {
      jest.advanceTimersByTime(350)
    })

    expect(await screen.findByText(/No matches for "zzz"/i)).toBeInTheDocument()
  })
})
