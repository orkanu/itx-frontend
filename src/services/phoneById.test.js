import { fetchPhoneById } from '@/services/phoneById.ts'
import { BASE_URL } from '@/services/constants.ts'

jest.mock('@/services/http/client.ts', () => ({
  fetchWithRetry: jest.fn(),
}))

const { fetchWithRetry } = jest.requireMock('@/services/http/client.ts')

describe('fetchPhoneById', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('requests the phone by encoded id and returns parsed json', async () => {
    const id = 'id with spaces/and/slashes'
    const encoded = encodeURIComponent(id)
    const body = { id: '123', brand: 'X', model: 'Y' }
    fetchWithRetry.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(body) })

    const result = await fetchPhoneById(id)

    expect(fetchWithRetry).toHaveBeenCalledWith(`${BASE_URL}/api/product/${encoded}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
    expect(result).toEqual(body)
  })

  it('throws a friendly error when response is not ok', async () => {
    fetchWithRetry.mockResolvedValueOnce({ ok: false, json: async () => ({}) })

    await expect(fetchPhoneById('123')).rejects.toThrow('Failed to fetch phone')
  })
})
