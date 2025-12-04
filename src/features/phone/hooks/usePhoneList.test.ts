import { usePhoneList } from './usePhoneList.ts'

// Mocks (Common pattern, no DI mocking to keep actual repo instance)
const mockUseQuery = jest.fn()
jest.mock('@tanstack/react-query', () => ({
  useQuery: (...args: any[]) => mockUseQuery(...args),
}))

const mockUseCaseFn = jest.fn()
const mockGetPhoneList = jest.fn(() => mockUseCaseFn)
jest.mock('@/domain/phone/use-cases/getPhoneList.ts', () => ({
  getPhoneList: (...args: any[]) => mockGetPhoneList(...args),
}))

describe('usePhoneList', () => {
  beforeEach(() => {
    mockUseQuery.mockReset()
    mockGetPhoneList.mockClear()
    mockUseCaseFn.mockReset()
  })

  it('creates use-case with phoneRepo and calls useQuery with expected params', () => {
    const ret = { data: [], isLoading: false }
    mockUseQuery.mockReturnValue(ret)

    const result = usePhoneList()

    expect(mockGetPhoneList).toHaveBeenCalledTimes(1)
    // It should be called with a repository instance (from real DI), not undefined
    expect(mockGetPhoneList.mock.calls[0][0]).toEqual(expect.any(Object))

    expect(mockUseQuery).toHaveBeenCalledTimes(1)
    const arg = mockUseQuery.mock.calls[0][0]
    expect(arg.queryKey).toEqual(['phones'])
    expect(arg.queryFn).toBe(mockUseCaseFn)

    expect(result).toBe(ret)
  })
})
