const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.API_KEY;

interface FetchOptions {
  page?: number;
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
}

export const fetchData = async <T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> => {
  const { page = 1, params = {}, headers = {} } = options;

  // Build query parameters dynamically
  const urlParams = new URLSearchParams({
    api_key: API_KEY!,
    language: 'en-US',
    page: page.toString(),
    ...Object.entries(params).reduce((acc, [key, value]) => {
      acc[key] = String(value);
      return acc;
    }, {} as Record<string, string>),
  });

  const url = `${BASE_URL}/${endpoint}?${urlParams.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
