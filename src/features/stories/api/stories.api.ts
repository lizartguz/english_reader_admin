import { httpClient, request, requestPaginated } from '@/core/api/api-client';
import type { PaginatedResult } from '@/core/api/api-response';
import type {
  CreateStoryPayload,
  StoryAsset,
  StoryAssetType,
  StoryDetail,
  StoryFilters,
  StoryListItem,
  StoryStatus,
  UpdateStoryPayload,
} from '../types/story.types';

const BASE_URL = '/admin/stories';

export const storiesApi = {
  list: (filters: StoryFilters): Promise<PaginatedResult<StoryListItem>> =>
    requestPaginated<StoryListItem>({ url: BASE_URL, params: filters }),

  detail: (id: string) => request<StoryDetail>({ url: `${BASE_URL}/${id}` }),

  create: (payload: CreateStoryPayload) =>
    request<StoryDetail>({ method: 'POST', url: BASE_URL, data: payload }),

  update: (id: string, payload: UpdateStoryPayload) =>
    request<StoryDetail>({ method: 'PATCH', url: `${BASE_URL}/${id}`, data: payload }),

  changeStatus: (id: string, status: StoryStatus) =>
    request<StoryDetail>({ method: 'PATCH', url: `${BASE_URL}/${id}/status`, data: { status } }),

  remove: (id: string) => request<null>({ method: 'DELETE', url: `${BASE_URL}/${id}` }),

  /** Carga un recurso mediante `multipart/form-data`. */
  uploadAsset: (storyId: string, file: File, type: StoryAssetType) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return request<StoryAsset>({
      method: 'POST',
      url: `${BASE_URL}/${storyId}/assets`,
      data: formData,
    });
  },

  deleteAsset: (assetId: string) =>
    request<null>({ method: 'DELETE', url: `/files/story-assets/${assetId}` }),

  /**
   * Descarga un recurso protegido como blob. No se puede usar la URL directa
   * en un `<img>` porque el endpoint exige la cabecera de autorización.
   */
  fetchAssetBlob: async (assetId: string): Promise<string> => {
    const response = await httpClient.get<Blob>(`/files/story-assets/${assetId}`, {
      responseType: 'blob',
    });
    return URL.createObjectURL(response.data);
  },
};
