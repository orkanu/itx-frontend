import { fetchWithRetry} from "@/services/utils/fetchWithRetry.ts";

const BASE_URL = 'https://itx-frontend-test.onrender.com'
// TODO improve type and use instead of any
export async function fetchListPhones(): Promise<Array<any>> {
  const res = await fetchWithRetry(`${BASE_URL}/api/product`, {
    method: 'GET',
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
  if (!res?.ok) throw new Error('Failed to fetch products')
  return res?.json()
}
