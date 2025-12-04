import { HttpBasketRepository } from './basket.repo.ts'
import { fetchWithRetry, BASE_URL } from '@/data/http/client.ts'

jest.mock('@/data/http/client.ts', () => ({
  fetchWithRetry: jest.fn(),
}))

describe('HttpBasketRepository', () => {
  let testee;
  beforeEach(() => {
    testee = new HttpBasketRepository()
    jest.clearAllMocks()
  })

  it('posts the payload and returns parsed json on success', async () => {
    const payload = { id: 'abc', colorCode: 2, storageCode: 128 }
    const responseBody = { count: 5 }
    fetchWithRetry.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(responseBody),
    })

    const result = await testee.add(payload)

    expect(fetchWithRetry).toHaveBeenCalledTimes(1)
    expect(fetchWithRetry).toHaveBeenCalledWith(`${BASE_URL}/api/cart`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    expect(result).toEqual(responseBody)
  })

  it('throws a friendly error when response is not ok', async () => {
    fetchWithRetry.mockResolvedValueOnce({ ok: false, json: async () => ({}) })

    await expect(testee.add({ id: 'abc', colorCode: 1, storageCode: 64 })).rejects.toThrow('Failed to add to basket')
  })
})
