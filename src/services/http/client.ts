// Utility function that adds automatic retry with exponential backoff:
//  url: the resource URL to fetch.
//  options: fetch configuration (e.g., headers, method, body).
//  retries: maximum number of attempts (default 3).
//  backoffMs: base delay between retries in milliseconds (default 500ms).
// If the fetch call succeeds, it returns the response inmediatelly.
// If not, it attempts to retry if there are retries left (the wait time between retries increases every time
// based on the backoffMs value)
// I´m adding this as seems that the API service sometimes needs to warm up and the first fetch fails.
export async function fetchWithRetry(
  url: string,
  options = {},
  retries = 3,
  backoffMs = 500,
) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      }
      return res;
    } catch (err: Error | any) {
      if (attempt === retries) {
        throw new Error(`Failed after ${retries} attempts: ${err.message}`);
      }
      console.warn(
        `⚠️ Fetch failed (attempt ${attempt}): ${err.message}. Retrying...`,
      );
      await new Promise((r) => setTimeout(r, backoffMs * attempt)); // exponential backoff
    }
  }
}
