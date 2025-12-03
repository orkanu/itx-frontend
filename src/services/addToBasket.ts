import { fetchWithRetry } from "@/services/http/client.ts";
import { BASE_URL } from "@/services/constants.ts";

interface BasketItem {
  id: string | number,
  colorCode: number,
  storageCode: number,
}

interface BasketResponse {
  count: number
}
export async function addToBasket(payload: BasketItem):Promise<BasketResponse> {
  const res = await fetchWithRetry(`${BASE_URL}/api/cart`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
  })
  if (!res?.ok) throw new Error('Failed to add to basket')
  return res?.json()
}
