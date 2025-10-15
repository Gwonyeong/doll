const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const getApiUrl = (path: string) => {
  // API URL이 설정되어 있으면 해당 URL 사용, 아니면 현재 도메인 사용
  if (API_BASE_URL) {
    return `${API_BASE_URL}${path}`;
  }
  // 로컬 개발 환경 또는 API_URL이 설정되지 않은 경우 relative path 사용
  return path;
};

export const apiClient = {
  async get(path: string, options?: RequestInit) {
    const response = await fetch(getApiUrl(path), {
      ...options,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
    return response;
  },

  async post(path: string, data?: any, options?: RequestInit) {
    const response = await fetch(getApiUrl(path), {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    return response;
  },

  async put(path: string, data?: any, options?: RequestInit) {
    const response = await fetch(getApiUrl(path), {
      ...options,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    return response;
  },

  async delete(path: string, options?: RequestInit) {
    const response = await fetch(getApiUrl(path), {
      ...options,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
    return response;
  },
};
