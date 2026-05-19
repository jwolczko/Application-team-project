const DEFAULT_API_BASE_URL = 'https://localhost:57751';

export function getApiBaseUrl() {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL;

  return configuredBaseUrl?.trim() || DEFAULT_API_BASE_URL;
}

export async function apiRequest<TResponse>(path: string, init?: RequestInit): Promise<TResponse> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  const responseText = await response.text();

  if (!response.ok) {
    const fallbackMessage = `Request failed with status ${response.status}.`;

    if (!responseText) {
      throw new Error(fallbackMessage);
    }

    try {
      const data = JSON.parse(responseText) as { detail?: string; error?: string; message?: string; title?: string };
      throw new Error(data.error || data.detail || data.message || data.title || fallbackMessage);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(fallbackMessage);
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error(fallbackMessage);
    }
  }

  if (response.status === 204 || !responseText) {
    return undefined as TResponse;
  }

  return JSON.parse(responseText) as TResponse;
}
