import { useQuery } from '@tanstack/react-query'
import { phoneRepo } from '@/data/di'
import {getPhoneList} from "@/domain/phone/use-cases/getPhoneList.ts";

export function usePhoneList() {
  const useCase = getPhoneList(phoneRepo)
  return useQuery({ queryKey: ['phones'], queryFn: useCase })
}
