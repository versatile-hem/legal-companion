export interface Director {
  id: string;
  fullName: string;
  din?: string;
  pan?: string;
  aadhaar?: string;
  email?: string;
  phone?: string;
  designation?: string;
  nationality?: string;
  kycStatus: string;
  kycDueDate?: string;
  dscValidUntil?: string;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DirectorRequest {
  fullName: string;
  din?: string;
  pan?: string;
  aadhaar?: string;
  email?: string;
  phone?: string;
  designation?: string;
  kycStatus?: string;
  kycDueDate?: string;
  dscValidUntil?: string;
  isActive?: boolean;
  notes?: string;
}

export const KYC_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  COMPLETED: { label: 'Completed', color: 'text-emerald-700', bg: 'bg-emerald-50' },
  PENDING:   { label: 'Pending',   color: 'text-amber-700',   bg: 'bg-amber-50' },
  OVERDUE:   { label: 'Overdue',   color: 'text-red-700',     bg: 'bg-red-50' },
  EXPIRED:   { label: 'Expired',   color: 'text-red-700',     bg: 'bg-red-50' },
};
