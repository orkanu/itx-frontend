import type { BasketRepository } from '../repository'
import type { BasketItem } from "@/domain/basket/model.ts";

export const addToBasket = (repo: BasketRepository) => (item: BasketItem) => repo.add(item)
