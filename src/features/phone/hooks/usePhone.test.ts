import { usePhone } from './usePhone.ts'

// Classic jest.mock approach compatible with current Jest config
const mockUseQuery = jest.fn()
jest.mock('@tanstack/react-query', () => ({
  useQuery: (...args: any[]) => mockUseQuery(...args),
}))

const mockUseCaseFn = jest.fn()
const mockGetPhoneById = jest.fn(() => mockUseCaseFn)
jest.mock('@/domain/phone/use-cases/getPhoneById.ts', () => ({
  getPhoneById: (...args: any[]) => mockGetPhoneById(...args),
}))

describe('usePhone', () => {
  beforeEach(() => {
    mockUseQuery.mockReset()
    mockGetPhoneById.mockClear()
    mockUseCaseFn.mockReset()
  })

  it('creates use-case with phoneRepo and calls useQuery with expected params', async () => {
    const ret = { data: { id: 'abc' }, isLoading: false }
    mockUseQuery.mockReturnValue(ret)

    const id = '123'
    const result = usePhone(id)

    expect(mockGetPhoneById).toHaveBeenCalledTimes(1)
    // It should receive an actual repository instance from DI
    expect(mockGetPhoneById.mock.calls[0][0]).toEqual(expect.any(Object))

    expect(mockUseQuery).toHaveBeenCalledTimes(1)
    const arg = mockUseQuery.mock.calls[0][0]
    expect(arg.queryKey).toEqual(['phone', id])
    expect(typeof arg.queryFn).toBe('function')

    // When queryFn is executed, it should call the created useCase with id
    await arg.queryFn()
    expect(mockUseCaseFn).toHaveBeenCalledTimes(1)
    expect(mockUseCaseFn).toHaveBeenCalledWith(id)

    expect(result).toBe(ret)
  })
})
