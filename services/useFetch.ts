const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

interface FetchOptions extends RequestInit {
  // توسيع RequestInit لتشمل كل خيارات fetch
  // يمكن إضافة خيارات مخصصة هنا إذا لزم الأمر
}

export const fetchData = async (
  endpoint: string,
  language: string = 'en',
  filters: Record<string, any> = {},
  options: FetchOptions = {}
) => {
  // تفكيك `method` و `headers` من `options` مع قيم افتراضية
  const { method = 'GET', headers: optionsHeaders = {}, ...restOptions } = options;

  // بناء معلمات البحث (query parameters)
  const queryParams = new URLSearchParams({
    api_key: API_KEY || '',
    language,
    ...filters,
  });

  const url = `${BASE_URL}${endpoint}?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...optionsHeaders, // دمج الـ headers المخصصة
      },
      ...restOptions, // نشر الخيارات الأخرى (مثل body، cache، إلخ.)
    });

    if (!response.ok) {
      throw new Error(`خطأ في HTTP! الحالة: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('حدث خطأ أثناء جلب البيانات:', error);
    throw error;
  }
};