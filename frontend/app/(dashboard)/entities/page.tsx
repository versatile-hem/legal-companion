'use client';

import React, { useEffect } from 'react';
import { useEntityStore } from '@/store/entityStore';
import EntityTopBar from '@/components/entities/EntityTopBar';
import EntityTable from '@/components/entities/EntityTable';
import EntityViewModal from '@/components/entities/EntityViewModal';
import EntityEditModal from '@/components/entities/EntityEditModal';
import EntityComplianceModal from '@/components/entities/EntityComplianceModal';
import EntityCreateModal from '@/components/entities/EntityCreateModal';

export default function EntitiesPage() {
  const { fetchEntities, filters, page } = useEntityStore();

  useEffect(() => {
    fetchEntities();
  }, [filters, page]);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <EntityTopBar />
      <div className="flex-1 overflow-auto">
        <EntityTable />
      </div>
      <EntityViewModal />
      <EntityEditModal />
      <EntityComplianceModal />
      <EntityCreateModal />
    </div>
  );
}
