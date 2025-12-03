import { addToBasket } from '@/services/addToBasket.ts'
import { BASE_URL } from '@/services/constants.ts'

jest.mock('@/services/http/client.ts', () => ({
  fetchWithRetry: jest.fn(),
}))

const { fetchWithRetry } = jest.requireMock('@/services/http/client.ts')

describe('addToBasket', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('posts the payload and returns parsed json on success', async () => {
    const payload = { id: 'abc', colorCode: 2, storageCode: 128 }
    const responseBody = { count: 5 }
    fetchWithRetry.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(responseBody),
    })

    const result = await addToBasket(payload)

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

    await expect(
      addToBasket({ id: 'abc', colorCode: 1, storageCode: 64 }),
    ).rejects.toThrow('Failed to add to basket')
  })
})
