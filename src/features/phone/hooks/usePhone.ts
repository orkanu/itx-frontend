import { useQuery } from '@tanstack/react-query'
import { phoneRepo } from '@/data/di'
import { getPhoneById } from "@/domain/phone/use-cases/getPhoneById.ts";

export function usePhone(id: string) {
  const useCase = getPhoneById(phoneRepo)
  return useQuery({ queryKey: ['phone', id], queryFn: () => useCase(id) })
}
