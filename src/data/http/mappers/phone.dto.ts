// API DTO shape for phone as received from backend
export type PhoneDTO = {
  id: string
  brand: string
  model: string
  price: number | string
  imgUrl: string
  // The rest of fields are optional and may vary
  [key: string]: any
}
