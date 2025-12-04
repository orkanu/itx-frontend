import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { usePhone } from '@/features/phone/hooks/usePhone.ts'
import { useAddToBasket } from "@/features/basket/hooks/useAddToBasket.ts";
import PhoneDetail from './PhoneDetail.tsx'

jest.mock('@/features/phone/hooks/usePhone.ts', () => ({
  usePhone: jest.fn(),
}))

jest.mock('@/features/basket/hooks/useAddToBasket.ts', () => ({
  useAddToBasket: jest.fn(),
}))

const mockAdd = jest.fn()
jest.mock('@/store/basket.ts', () => ({
  __esModule: true,
  default: (selector) => selector({ add: mockAdd }),
}))

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ id: '123' }),
  }
})

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

const basePhone = {
  id: '123',
  brand: 'Acme',
  model: 'Turbo X',
  price: '499',
  imgUrl: 'acme.jpg',
  cpu: 'Octa',
  ram: '8GB',
  os: 'Droid',
  displaySize: '6"',
  displayResolution: '1080p',
  battery: '4000mAh',
  primaryCamera: ['12MP'],
  secondaryCmera: '8MP',
  dimentions: '150x70x8',
  weight: '160g',
  options: {
    colors: [
      { code: 1, name: 'Red' },
      { code: 2, name: 'Blue' },
    ],
    storages: [
      { code: 64, name: '64GB' },
      { code: 128, name: '128GB' },
    ],
  },
}

describe('PhoneDetail', () => {
  it('shows loading then renders phone details', async () => {
    // First render: loading
    usePhone.mockReturnValueOnce({ data: undefined, isLoading: true, error: null })
    // Second render: success data
    usePhone.mockReturnValueOnce({ data: basePhone, isLoading: false, error: null })
    // All subsequent renders: stay with success data
    usePhone.mockReturnValue({ data: basePhone, isLoading: false, error: null })
    const mutateAsync = jest.fn()
    useAddToBasket.mockReturnValue({ mutateAsync })

    const view = renderWithProviders(<PhoneDetail />)

    expect(screen.getByRole('status')).toHaveTextContent(/Loading/i)

    // Trigger re-render to get success state
    view.rerender(
      <QueryClientProvider client={createTestClient()}>
        <MemoryRouter>
          <PhoneDetail />
        </MemoryRouter>
      </QueryClientProvider>
    )

    expect(await screen.findByText(/Acme Turbo X/i)).toBeInTheDocument()
    expect(screen.getByAltText(/Acme Turbo X/i)).toBeInTheDocument()

    expect(screen.getByRole('group', { name: /Colors/i })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: /Storages/i })).toBeInTheDocument()
  })

  it('renders error state when fetch fails', async () => {
    usePhone.mockReturnValue({ data: undefined, isLoading: false, error: new Error('boom') })
    const mutateAsync = jest.fn()
    useAddToBasket.mockReturnValue({ mutateAsync })

    renderWithProviders(<PhoneDetail />)

    expect(await screen.findByRole('alert')).toHaveTextContent(/Error loading phone/i)
  })

  it('shows validation error when adding without selections and clears after selecting', async () => {
    usePhone.mockReturnValue({ data: basePhone, isLoading: false, error: null })
    const mutate = jest.fn()
    useAddToBasket.mockReturnValue({ mutate })

    renderWithProviders(<PhoneDetail />)

    await screen.findByText(/Acme Turbo X/i)

    const addBtn = screen.getByRole('button', { name: /Add to basket/i })
    await userEvent.click(addBtn)

    const err = await screen.findByRole('alert')
    expect(err).toHaveTextContent(/Please select a color and a storage option/i)

    await userEvent.click(screen.getByRole('button', { name: /Select color Red/i }))
    await userEvent.click(screen.getByRole('button', { name: /Select storage 64GB/i }))

    // Error is cleared
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('successfully adds to basket and updates basket count', async () => {
    usePhone.mockReturnValue({ data: basePhone, isLoading: false, error: null })
    const mutateAsync = jest.fn().mockReturnValue({ count: 7 })
    useAddToBasket.mockReturnValue({ mutateAsync })

    renderWithProviders(<PhoneDetail />)

    await screen.findByText(/Acme Turbo X/i)
    await userEvent.click(screen.getByRole('button', { name: /Select color Blue/i }))
    await userEvent.click(screen.getByRole('button', { name: /Select storage 128GB/i }))

    const addBtn = screen.getByRole('button', { name: /Add to basket/i })
    await userEvent.click(addBtn)

    expect(mutateAsync).toHaveBeenCalledWith({ id: '123', colorCode: 2, storageCode: 128 })
    expect(mockAdd).toHaveBeenCalledWith(7)
  })

  it('shows an inline error when add to basket fails', async () => {
    usePhone.mockReturnValue({ data: basePhone, isLoading: false, error: null })
    const mutateAsync = jest.fn(() => { throw new Error('network') })
    useAddToBasket.mockReturnValue({ mutateAsync })

    renderWithProviders(<PhoneDetail />)

    await screen.findByText(/Acme Turbo X/i)
    await userEvent.click(screen.getByRole('button', { name: /Select color Red/i }))
    await userEvent.click(screen.getByRole('button', { name: /Select storage 64GB/i }))

    await userEvent.click(screen.getByRole('button', { name: /Add to basket/i }))

    const err = await screen.findByRole('alert')
    expect(err).toHaveTextContent(/Failed to add to basket/i)
  })

  it('auto-selects single color and storage by default and allows add without manual selection', async () => {
    const singleOptionPhone = {
      ...basePhone,
      options: {
        colors: [{ code: 9, name: 'Black' }],
        storages: [{ code: 256, name: '256GB' }],
      },
    }
    usePhone.mockReturnValue({ data: singleOptionPhone, isLoading: false, error: null })
    const mutateAsync = jest.fn().mockReturnValue({ count: 3 })
    useAddToBasket.mockReturnValue({ mutateAsync })

    renderWithProviders(<PhoneDetail />)

    await screen.findByText(/Acme Turbo X/i)

    // The single options should be selected automatically
    const colorBtn = screen.getByRole('button', { name: /Select color Black/i })
    const storageBtn = screen.getByRole('button', { name: /Select storage 256GB/i })
    expect(colorBtn).toHaveAttribute('aria-pressed', 'true')
    expect(storageBtn).toHaveAttribute('aria-pressed', 'true')

    // Click add without making manual selections
    await userEvent.click(screen.getByRole('button', { name: /Add to basket/i }))

    expect(mutateAsync).toHaveBeenCalledWith({ id: '123', colorCode: 9, storageCode: 256 })
    expect(mockAdd).toHaveBeenCalledWith(3)
    // No validation error should appear
    expect(screen.queryByText(/Please select a color and a storage option/i)).not.toBeInTheDocument()
  })
})
