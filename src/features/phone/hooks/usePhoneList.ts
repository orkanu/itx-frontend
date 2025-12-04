import { useQuery } from '@tanstack/react-query'
import { phoneRepo } from '@/data/di'

export function usePhoneList() {
  return useQuery({ queryKey: ['phones'], queryFn: phoneRepo.list })
}
