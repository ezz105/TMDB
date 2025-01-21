const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;


interface FetchOptions {
  method?: string; // Optional method property
  headers?: Record<string, string>; // Optional headers property
  // Add any other properties you expect in options here
}



export const fetchData = async (endpoint: string, language: string = 'en', filters: Record<string, any> = {}, options: FetchOptions = {}) => {
  console.log('Using language for fetch:', language);

  const queryParams = new URLSearchParams({
    api_key: API_KEY || '',
    language,
    ...filters,
  });

  const url = `${BASE_URL}${endpoint}?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: options.method || 'GET', 
      headers: {
        'Content-Type': 'application/json',
        ...options.headers, 
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; 
  }
};