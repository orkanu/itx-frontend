import type { BasketItem, BasketResponse } from './model'

export interface BasketRepository {
  add(item: BasketItem): Promise<BasketResponse>
}
