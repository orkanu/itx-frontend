import type { PhoneRepository } from '../repository'

export const getPhoneById = (repo: PhoneRepository) => (id: string) => repo.getById(id)
