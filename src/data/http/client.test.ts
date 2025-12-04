import { fetchWithRetry } from "./client.ts";

const originalFetch = global.fetch;

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  // Restore any mocked fetch to avoid leaking between tests
  global.fetch = originalFetch;
});

describe("fetchWithRetry", () => {
  test("calls fetch with the specified URL amd options", async () => {
    const expected = [{ instalment_count: 3 }, { instalment_count: 6 }];
    const json = jest.fn().mockResolvedValue(expected);
    const mockResponse = { ok: true, json };
    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    const data = await fetchWithRetry('/api/phones', {
      headers: {
        Accept: "application/json"
      },
    })
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/phones',
      { headers: { Accept: "application/json" } },
    );

    expect(await data.json()).toEqual(expected);
  });

  test("calls fetch twice if attempts does not match retries", async () => {
    const expected = [{ instalment_count: 3 }, { instalment_count: 6 }];
    const json = jest.fn().mockResolvedValue(expected);
    const mockFirstResponse = { ok: false };
    const mockSecondResponse = { ok: true, json };
    global.fetch = jest.fn()
      .mockResolvedValueOnce(mockFirstResponse)
      .mockResolvedValue(mockSecondResponse);

    const data = await fetchWithRetry('/api/phones', {
      headers: {
        Accept: "application/json"
      },
    })

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/phones',
      { headers: { Accept: "application/json" } },
    );

    expect(await data.json()).toEqual(expected);
  });


  test("throws error when retries match attempts", async () => {
    const numRetries = 1;

    const mockFirstResponse = { ok: false, status: 500, text: () => 'internal server error' };
    global.fetch = jest.fn()
      .mockResolvedValue(mockFirstResponse);

    await expect(fetchWithRetry('/api/phones', {
      headers: {
        Accept: "application/json"
      },
    }, numRetries)).rejects.toThrow(/failed after 1 attempts: HTTP 500: internal server error/i);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/phones',
      { headers: { Accept: "application/json" } },
    );
  });
});
