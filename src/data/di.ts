import { HttpPhoneRepository } from './http/phone.repo'
import { HttpBasketRepository } from './http/basket.repo'

export const phoneRepo = new HttpPhoneRepository()
export const basketRepo = new HttpBasketRepository()
