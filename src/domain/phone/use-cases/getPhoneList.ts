import type { PhoneRepository } from '../repository'

export const getPhoneList = (repo: PhoneRepository) => () => repo.list()
