const QIITA_API_BASE_URL = 'https://qiita.com/api/v2';

/**
 * Qiita API client with automatic Authorization header
 */
export async function qiitaFetcher<T>(endpoint: string): Promise<T> {
  const token = import.meta.env.VITE_QIITA_ACCESS_TOKEN;

  if (!token) {
    throw new Error('VITE_QIITA_ACCESS_TOKEN is not defined in .env file');
  }

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${QIITA_API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Qiita API error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Qiita API endpoints
 */
export const qiitaEndpoints = {
  authenticatedUser: '/authenticated_user',
  items: '/items',
  userItems: (userId: string) => `/users/${userId}/items`,
  tags: '/tags',
} as const;
