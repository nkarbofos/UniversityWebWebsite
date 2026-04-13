import type { ApiClient } from './client';
import type { LinkItem } from './types';

export function linksService(api: ApiClient) {
  return {
    list: async (args: {
      page?: number;
      pageSize?: number;
      userId?: string;
      tagId?: string;
      courseId?: string;
    }) => {
      const qs = new URLSearchParams();
      qs.set('page', String(args.page ?? 1));
      qs.set('pageSize', String(args.pageSize ?? 20));
      if (args.userId) qs.set('userId', args.userId);
      if (args.tagId) qs.set('tagId', args.tagId);
      if (args.courseId) qs.set('courseId', args.courseId);
      return api.request<LinkItem[]>(`/api/links?${qs.toString()}`);
    },
    create: async (payload: {
      userId: string;
      reviewId?: string;
      linkName: string;
      githubPagesUrl: string;
    }) =>
      api.request<LinkItem>('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }),
  };
}
