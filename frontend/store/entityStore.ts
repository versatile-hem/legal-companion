import { create } from 'zustand';
import { apiClient } from '@/lib/api';
import {
  LegalEntity,
  LegalEntityRequest,
  EntityFilters,
} from '@/types/legalEntity';

interface EntityStore {
  // List state
  entities: LegalEntity[];
  filters: EntityFilters;
  page: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isLoading: boolean;
  error?: string;

  // Modal state
  viewEntity: LegalEntity | null;
  editEntity: LegalEntity | null;
  complianceEntity: LegalEntity | null;
  createModalOpen: boolean;

  // Actions
  fetchEntities: () => Promise<void>;
  fetchEntityById: (id: string) => Promise<LegalEntity>;
  createEntity: (data: LegalEntityRequest) => Promise<void>;
  updateEntity: (id: string, data: LegalEntityRequest) => Promise<void>;
  deleteEntity: (id: string) => Promise<void>;
  setFilter: (key: keyof EntityFilters, value: string) => void;
  clearFilters: () => void;
  setPage: (page: number) => void;
  openView: (entity: LegalEntity) => void;
  openEdit: (entity: LegalEntity) => void;
  openCompliance: (entity: LegalEntity) => void;
  openCreate: () => void;
  closeAll: () => void;
}

const defaultFilters: EntityFilters = {
  search: '',
  entityType: '',
  state: '',
  status: '',
  complianceStatus: '',
};

export const useEntityStore = create<EntityStore>((set, get) => ({
  entities: [],
  filters: defaultFilters,
  page: 0,
  pageSize: 20,
  totalElements: 0,
  totalPages: 0,
  isLoading: false,
  viewEntity: null,
  editEntity: null,
  complianceEntity: null,
  createModalOpen: false,

  fetchEntities: async () => {
    set({ isLoading: true, error: undefined });
    try {
      const { filters, page, pageSize } = get();
      const params = new URLSearchParams({
        page: page.toString(),
        size: pageSize.toString(),
        search: filters.search,
        entityType: filters.entityType,
        state: filters.state,
        status: filters.status,
        complianceStatus: filters.complianceStatus,
      });
      const res = await apiClient.get(`/entities?${params}`);
      const data = res.data.data;
      set({
        entities: data.content || [],
        totalElements: data.totalElements || 0,
        totalPages: data.totalPages || 0,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to fetch entities',
        isLoading: false,
      });
    }
  },

  fetchEntityById: async (id: string) => {
    const res = await apiClient.get(`/entities/${id}`);
    return res.data.data as LegalEntity;
  },

  createEntity: async (data: LegalEntityRequest) => {
    await apiClient.post('/entities', data);
    get().fetchEntities();
  },

  updateEntity: async (id: string, data: LegalEntityRequest) => {
    await apiClient.put(`/entities/${id}`, data);
    get().fetchEntities();
  },

  deleteEntity: async (id: string) => {
    await apiClient.delete(`/entities/${id}`);
    set((state) => ({
      entities: state.entities.filter((e) => e.id !== id),
      totalElements: state.totalElements - 1,
    }));
  },

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
      page: 0,
    }));
  },

  clearFilters: () => set({ filters: defaultFilters, page: 0 }),
  setPage: (page) => set({ page }),

  openView: (entity) => set({ viewEntity: entity, editEntity: null, complianceEntity: null }),
  openEdit: (entity) => set({ editEntity: entity, viewEntity: null, complianceEntity: null }),
  openCompliance: (entity) => set({ complianceEntity: entity, viewEntity: null, editEntity: null }),
  openCreate: () => set({ createModalOpen: true, viewEntity: null, editEntity: null }),
  closeAll: () => set({ viewEntity: null, editEntity: null, complianceEntity: null, createModalOpen: false }),
}));
