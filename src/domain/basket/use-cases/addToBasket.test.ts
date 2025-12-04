import { addToBasket } from './addToBasket.ts'

describe('addToBasket use-case', () => {
  it('calls repo.add with the given item and returns its value', async () => {
    const item = { id: '123', colorCode: 1, storageCode: 64 }
    const response = { count: 3 }
    const repo = { add: jest.fn().mockResolvedValue(response) } as any

    const useCase = addToBasket(repo)
    const result = await useCase(item as any)

    expect(repo.add).toHaveBeenCalledTimes(1)
    expect(repo.add).toHaveBeenCalledWith(item)
    expect(result).toBe(response)
  })

  it('propagates errors from repo.add', async () => {
    const item = { id: '999', colorCode: 2, storageCode: 128 }
    const error = new Error('add failed')
    const repo = { add: jest.fn().mockRejectedValue(error) } as any

    const useCase = addToBasket(repo)
    await expect(useCase(item as any)).rejects.toBe(error)
    expect(repo.add).toHaveBeenCalledTimes(1)
    expect(repo.add).toHaveBeenCalledWith(item)
  })
})
