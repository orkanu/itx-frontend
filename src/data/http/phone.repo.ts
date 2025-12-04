import type { PhoneRepository } from '@/domain/phone/repository'
import type { Phone } from '@/domain/phone/model'
import type { PhoneDTO } from './mappers/phone.dto'
import { fetchWithRetry, BASE_URL } from "@/data/http/client.ts";

function toPhone(dto: PhoneDTO): Phone {
  // Minimal mapper; keep extra fields as is to avoid losing data
  return {
    id: dto.id,
    brand: dto.brand,
    model: dto.model,
    price: dto.price,
    imgUrl: dto.imgUrl,
    ...dto,
  }
}

export class HttpPhoneRepository implements PhoneRepository {
  async getById(id: string): Promise<Phone> {
    const res = await fetchWithRetry(`${BASE_URL}/api/product/${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
    if (!res?.ok) throw new Error('Failed to fetch phone')
    const data: PhoneDTO = await res.json()
    return toPhone(data)
  }

  async list(): Promise<Phone[]> {
    const res = await fetchWithRetry(`${BASE_URL}/api/product`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
    if (!res?.ok) throw new Error('Failed to fetch products')
    const data: PhoneDTO[] = await res.json()
    return data.map(toPhone)
  }
}

export const phoneMapper = { toPhone }
