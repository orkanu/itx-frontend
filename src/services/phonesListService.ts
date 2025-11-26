import { fetchWithRetry} from "@/services/utils/fetchWithRetry.ts";
import { BASE_URL } from "@/services/constants.ts";

type Phone = {
  id: string,
  brand: string,
  model: string,
  price: number,
  imgUrl: string,
}

export async function fetchListPhones(): Promise<Array<Phone>> {
  const res = await fetchWithRetry(`${BASE_URL}/api/product`, {
    method: 'GET',
    headers: {
      Accept: "application/json",
    },
  })
  if (!res?.ok) throw new Error('Failed to fetch products')
  return res?.json()
}
