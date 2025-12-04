import { useMutation } from '@tanstack/react-query'
import { basketRepo } from '@/data/di'
import type { BasketItem, BasketResponse } from '@/domain/basket/model'

export function useAddToBasket() {
  return useMutation<BasketResponse, Error, BasketItem>({
    mutationFn: (payload) => basketRepo.add(payload),
  })
}
