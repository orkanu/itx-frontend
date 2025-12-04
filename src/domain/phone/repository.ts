import type { Phone } from './model'

export interface PhoneRepository {
  getById(id: string): Promise<Phone>
  list(): Promise<Phone[]>
}
