import { fetchListPhones } from '@/services/phonesListService.ts'
import { BASE_URL } from '@/services/constants.ts'

jest.mock('@/services/http/client.ts', () => ({
  fetchWithRetry: jest.fn(),
}))

const { fetchWithRetry } = jest.requireMock('@/services/http/client.ts')

describe('fetchListPhones', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetches list of phones and returns parsed json', async () => {
    const list = [
      { id: '1', brand: 'A', model: 'M1', price: 100, imgUrl: 'x' },
      { id: '2', brand: 'B', model: 'M2', price: 200, imgUrl: 'y' },
    ]
    fetchWithRetry.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(list) })

    const result = await fetchListPhones()

    expect(fetchWithRetry).toHaveBeenCalledWith(`${BASE_URL}/api/product`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
    expect(result).toEqual(list)
  })

  it('throws a friendly error when response is not ok', async () => {
    fetchWithRetry.mockResolvedValueOnce({ ok: false, json: async () => ([]) })
    await expect(fetchListPhones()).rejects.toThrow('Failed to fetch products')
  })
})
