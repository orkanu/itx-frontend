import { useAddToBasket } from './useAddToBasket.ts'

// Classic jest.mock approach
const mockUseMutation = jest.fn()
jest.mock('@tanstack/react-query', () => ({
  useMutation: (...args: any[]) => mockUseMutation(...args),
}))

const mockUseCaseFn = jest.fn()
const mockAddToBasket = jest.fn(() => mockUseCaseFn)
jest.mock('@/domain/basket/use-cases/addToBasket.ts', () => ({
  addToBasket: (...args: any[]) => mockAddToBasket(...args),
}))

describe('useAddToBasket', () => {
  beforeEach(() => {
    mockUseMutation.mockReset()
    mockAddToBasket.mockClear()
    mockUseCaseFn.mockReset()
  })

  it('creates use-case with basketRepo and wires mutationFn to call it', async () => {
    const mutationReturn = { mutate: jest.fn(), mutateAsync: jest.fn() }
    mockUseMutation.mockImplementation(({ mutationFn }) => {
      // Exercise the mutationFn to ensure it calls the useCase with payload
      const payload = { id: '1', colorCode: 1, storageCode: 64 }
      // mock useCase resolution
      mockUseCaseFn.mockResolvedValue({ count: 1 })
      // Call once to verify
      mutationFn(payload as any)
      return mutationReturn
    })

    const ret = useAddToBasket()

    expect(mockAddToBasket).toHaveBeenCalledTimes(1)
    // It should receive a repository instance from DI
    expect(mockAddToBasket.mock.calls[0][0]).toEqual(expect.any(Object))

    expect(mockUseMutation).toHaveBeenCalledTimes(1)
    const args = mockUseMutation.mock.calls[0][0]
    expect(typeof args.mutationFn).toBe('function')

    // verify that mutationFn invoked the created useCase with the payload above
    expect(mockUseCaseFn).toHaveBeenCalledTimes(1)
    expect(mockUseCaseFn).toHaveBeenCalledWith({ id: '1', colorCode: 1, storageCode: 64 })

    expect(ret).toBe(mutationReturn)
  })
})
