import { fetchWithRetry } from "@/services/http/client.ts";
import { BASE_URL } from "@/services/constants.ts";

interface DeviceOption {
  code: number;
  name: string;
}

interface DeviceOptions {
  colors: DeviceOption[];
  storages: DeviceOption[];
}

interface Device {
  id: string;
  brand: string;
  model: string;
  price: string;
  imgUrl: string;
  networkTechnology: string;
  networkSpeed: string;
  gprs: string;
  edge: string;
  announced: string;
  status: string;
  dimentions: string;
  weight: string;
  sim: string;
  displayType: string;
  displayResolution: string;
  displaySize: string;
  os: string;
  cpu: string;
  chipset: string;
  gpu: string;
  externalMemory: string;
  internalMemory: string[];
  ram: string;
  primaryCamera: string[];
  secondaryCmera: string;
  speaker: string;
  audioJack: string;
  wlan: string[];
  bluetooth: string[];
  gps: string;
  nfc: string;
  radio: string;
  usb: string;
  sensors: string[];
  battery: string;
  colors: string[];
  options: DeviceOptions;
}

export async function fetchPhoneById(id: string): Promise<Device> {
  const res = await fetchWithRetry(`${BASE_URL}/api/product/${encodeURIComponent(id)}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })
  if (!res?.ok) throw new Error('Failed to fetch phone')
  return res?.json()
}
