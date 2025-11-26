import React from 'react'
import {act, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fetchPhoneById } from '@/services/phoneById.ts'
import { addToBasket } from '@/services/addToBasket.ts'
import PhoneDetail from './PhoneDetail.tsx'

jest.mock('@/services/phoneById.ts', () => ({
  fetchPhoneById: jest.fn(),
}))

jest.mock('@/services/addToBasket.ts', () => ({
  addToBasket: jest.fn(),
}))

const mockAdd = jest.fn()
const mockSet = jest.fn()
jest.mock('@/store/basket.ts', () => ({
  __esModule: true,
  default: (selector) => selector({ add: mockAdd, set: mockSet }),
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
    fetchPhoneById.mockResolvedValueOnce(basePhone)

    renderWithProviders(<PhoneDetail />)

    expect(screen.getByRole('status')).toHaveTextContent(/Loading/i)

    expect(await screen.findByText(/Acme Turbo X/i)).toBeInTheDocument()
    expect(screen.getByAltText(/Acme Turbo X/i)).toBeInTheDocument()

    expect(screen.getByRole('group', { name: /Colors/i })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: /Storages/i })).toBeInTheDocument()
  })

  it('renders error state when fetch fails', async () => {
    fetchPhoneById.mockRejectedValueOnce(new Error('boom'))

    renderWithProviders(<PhoneDetail />)

    expect(await screen.findByRole('alert')).toHaveTextContent(/Error loading phone/i)
  })

  it('shows validation error when adding without selections and clears after selecting', async () => {
    fetchPhoneById.mockResolvedValueOnce(basePhone)

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
    fetchPhoneById.mockResolvedValueOnce(basePhone)
    addToBasket.mockResolvedValueOnce({ count: 7 })

    renderWithProviders(<PhoneDetail />)

    await screen.findByText(/Acme Turbo X/i)
    await userEvent.click(screen.getByRole('button', { name: /Select color Blue/i }))
    await userEvent.click(screen.getByRole('button', { name: /Select storage 128GB/i }))

    const addBtn = screen.getByRole('button', { name: /Add to basket/i })
    await userEvent.click(addBtn)

    expect(addToBasket).toHaveBeenCalledWith({ id: '123', colorCode: 2, storageCode: 128 })
    expect(mockSet).toHaveBeenCalledWith(7)
  })

  it('shows an inline error when add to basket fails', async () => {
    fetchPhoneById.mockResolvedValueOnce(basePhone)
    addToBasket.mockRejectedValueOnce(new Error('network'))

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
    fetchPhoneById.mockResolvedValueOnce(singleOptionPhone)
    addToBasket.mockResolvedValueOnce({ count: 3 })

    renderWithProviders(<PhoneDetail />)

    await screen.findByText(/Acme Turbo X/i)

    // The single options should be selected automatically
    const colorBtn = screen.getByRole('button', { name: /Select color Black/i })
    const storageBtn = screen.getByRole('button', { name: /Select storage 256GB/i })
    expect(colorBtn).toHaveAttribute('aria-pressed', 'true')
    expect(storageBtn).toHaveAttribute('aria-pressed', 'true')

    // Click add without making manual selections
    await userEvent.click(screen.getByRole('button', { name: /Add to basket/i }))

    expect(addToBasket).toHaveBeenCalledWith({ id: '123', colorCode: 9, storageCode: 256 })
    expect(mockSet).toHaveBeenCalledWith(3)
    // No validation error should appear
    expect(screen.queryByText(/Please select a color and a storage option/i)).not.toBeInTheDocument()
  })
})
