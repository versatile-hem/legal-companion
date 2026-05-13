import React, { useEffect, useState } from 'react';
import { X, Building2, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { directorsApi } from '@/lib/api';

interface DirectorEntity {
  entity: {
    id: string;
    entityName: string;
    entityType: string;
    cin: string;
    pan: string;
    complianceStatus: string;
    status: string;
  };
  appointmentDate?: string;
  cessationDate?: string;
  isActive: boolean;
}

interface DirectorEntitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  directorId: string;
  directorName: string;
}

export function DirectorEntitiesModal({
  isOpen,
  onClose,
  directorId,
  directorName,
}: DirectorEntitiesModalProps) {
  const [entities, setEntities] = useState<DirectorEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    if (isOpen && directorId) {
      fetchDirectorEntities();
    }
  }, [isOpen, directorId]);

  const fetchDirectorEntities = async () => {
    setLoading(true);
    try {
      const response = await directorsApi.getEntitiesForDirector(directorId);
      const data = (response.data as any).data || [];
      setEntities(data);
      const active = data.filter((e: DirectorEntity) => e.isActive).length;
      setActiveCount(active);
    } catch (error) {
      console.error('Failed to fetch director entities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return 'bg-emerald-50 text-emerald-700';
      case 'AT_RISK':
        return 'bg-amber-50 text-amber-700';
      case 'OVERDUE':
        return 'bg-orange-50 text-orange-700';
      case 'CRITICAL':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-slate-50 text-slate-700';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Companies where {directorName} is Appointed as Director
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {activeCount} active appointment{activeCount !== 1 ? 's' : ''} • {entities.length} total
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border border-slate-300 border-t-blue-600"></div>
            </div>
          ) : entities.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <Building2 className="w-12 h-12 text-slate-300 mb-2" />
              <p>No company appointments found</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {entities.map((mapping) => (
                <div
                  key={mapping.entity.id}
                  className="p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Company Avatar */}
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {mapping.entity.entityName?.charAt(0) ?? 'C'}
                    </div>

                    {/* Main Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-medium text-slate-900 truncate">
                            {mapping.entity.entityName}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                            <span>CIN: {mapping.entity.cin || '—'}</span>
                            <span>•</span>
                            <span>PAN: {mapping.entity.pan || '—'}</span>
                          </div>
                        </div>
                        {/* Status Badge */}
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap flex-shrink-0 ${
                            mapping.isActive
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {mapping.isActive ? 'Active' : 'Ceased'}
                        </span>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-100">
                        {/* Entity Type & Status */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">Type:</span>
                            <span className="text-xs font-medium text-slate-700">
                              {mapping.entity.entityType?.replace(/_/g, ' ') || '—'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">Status:</span>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${getComplianceStatusColor(mapping.entity.complianceStatus)}`}>
                              {mapping.entity.complianceStatus?.replace(/_/g, ' ') || '—'}
                            </span>
                          </div>
                        </div>

                        {/* Dates */}
                        <div className="space-y-2">
                          {mapping.appointmentDate && (
                            <div className="flex items-center gap-2 text-xs">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-slate-500">Appointed:</span>
                              <span className="font-medium text-slate-700">
                                {new Date(mapping.appointmentDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          {mapping.cessationDate && (
                            <div className="flex items-center gap-2 text-xs">
                              <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                              <span className="text-slate-500">Ceased:</span>
                              <span className="font-medium text-red-700">
                                {new Date(mapping.cessationDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
