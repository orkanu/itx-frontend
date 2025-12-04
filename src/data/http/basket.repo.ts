import type { BasketRepository } from '@/domain/basket/repository'
import type { BasketItem, BasketResponse } from '@/domain/basket/model'
import { fetchWithRetry, BASE_URL } from './client'

export class HttpBasketRepository implements BasketRepository {
  async add(item: BasketItem): Promise<BasketResponse> {
    const res = await fetchWithRetry(`${BASE_URL}/api/cart`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    })
    if (!res?.ok) throw new Error('Failed to add to basket')
    return res.json()
  }
}
