import type { ApiClient } from './client';
import type { Tag } from './types';

export function tagsService(api: ApiClient) {
  return {
    list: async () => api.request<Tag[]>(`/api/tags?page=1&pageSize=100`),
  };
}
