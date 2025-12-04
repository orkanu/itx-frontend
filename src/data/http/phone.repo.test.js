import { HttpPhoneRepository } from './phone.repo.ts'
import { fetchWithRetry, BASE_URL } from '@/data/http/client.ts'

jest.mock('@/data/http/client.ts', () => ({
  fetchWithRetry: jest.fn(),
}))

describe('HttpPhoneRepository.getById', () => {
  let testee
  beforeEach(() => {
    testee = new HttpPhoneRepository()
    jest.clearAllMocks()
  })

  it('requests the phone by encoded id and returns parsed json', async () => {
    const id = 'id with spaces/and/slashes'
    const encoded = encodeURIComponent(id)
    const body = { id: '123', brand: 'X', model: 'Y' }
    fetchWithRetry.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(body) })

    const result = await testee.getById(id)

    expect(fetchWithRetry).toHaveBeenCalledWith(`${BASE_URL}/api/product/${encoded}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
    expect(result).toEqual(body)
  })

  it('throws a friendly error when response is not ok', async () => {
    fetchWithRetry.mockResolvedValueOnce({ ok: false, json: async () => ({}) })

    await expect(testee.getById('123')).rejects.toThrow('Failed to fetch phone')
  })
})

describe('HttpPhoneRepository.list', () => {
  let testee
  beforeEach(() => {
    testee = new HttpPhoneRepository()
    jest.clearAllMocks()
  })

  it('fetches list of phones and returns parsed json', async () => {
    const list = [
      { id: '1', brand: 'A', model: 'M1', price: 100, imgUrl: 'x' },
      { id: '2', brand: 'B', model: 'M2', price: 200, imgUrl: 'y' },
    ]
    fetchWithRetry.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(list) })

    const result = await testee.list()

    expect(fetchWithRetry).toHaveBeenCalledWith(`${BASE_URL}/api/product`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
    expect(result).toEqual(list)
  })

  it('throws a friendly error when response is not ok', async () => {
    fetchWithRetry.mockResolvedValueOnce({ ok: false, json: async () => [] })
    await expect(testee.list()).rejects.toThrow('Failed to fetch products')
  })
})
