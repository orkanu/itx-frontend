import { useQuery } from '@tanstack/react-query'
import { phoneRepo } from '@/data/di'

export function usePhone(id: string) {
  return useQuery({ queryKey: ['phone', id], queryFn: () => phoneRepo.getById(id) })
}
