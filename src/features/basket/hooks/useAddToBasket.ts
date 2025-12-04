import { useMutation } from '@tanstack/react-query'
import { basketRepo } from '@/data/di'
import type { BasketItem, BasketResponse } from '@/domain/basket/model'
import { addToBasket } from "@/domain/basket/use-cases/addToBasket.ts";

export function useAddToBasket() {
  const useCase = addToBasket(basketRepo)
  return useMutation<BasketResponse, Error, BasketItem>({
    mutationFn: (payload) => useCase(payload),
  })
}
