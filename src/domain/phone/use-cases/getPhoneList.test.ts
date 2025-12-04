import { getPhoneList } from './getPhoneList.ts'

describe('getPhoneList use-case', () => {
  it('calls repo.list once and returns its value', async () => {
    const phones = [{ id: '1' }, { id: '2' }]
    const repo = { list: jest.fn().mockResolvedValue(phones) } as any

    const useCase = getPhoneList(repo)
    const result = await useCase()

    expect(repo.list).toHaveBeenCalledTimes(1)
    expect(result).toBe(phones)
  })

  it('propagates errors from repo.list', async () => {
    const error = new Error('boom')
    const repo = { list: jest.fn().mockRejectedValue(error) } as any

    const useCase = getPhoneList(repo)

    await expect(useCase()).rejects.toBe(error)
    expect(repo.list).toHaveBeenCalledTimes(1)
  })
})
