import { getPhoneById } from './getPhoneById.ts'

describe('getPhoneById use-case', () => {
  it('calls repo.getById once and returns its value', async () => {
    const phones = [{ id: '1' }, { id: '2' }]
    const repo = { getById: jest.fn().mockResolvedValue(phones) } as any

    const useCase = getPhoneById(repo)
    const result = await useCase("1")

    expect(repo.getById).toHaveBeenCalledTimes(1)
    expect(result).toBe(phones)
  })

  it('propagates errors from repo.getById', async () => {
    const error = new Error('boom')
    const repo = { getById: jest.fn().mockRejectedValue(error) } as any

    const useCase = getPhoneById(repo)

    await expect(useCase("1")).rejects.toBe(error)
    expect(repo.getById).toHaveBeenCalledTimes(1)
  })
})
