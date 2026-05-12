export interface ComplianceJob {
  id: string;
  jobNumber?: string;
  title: string;
  jobType: string;
  status: string;
  priority: string;
  dueDate?: string;
  completionDate?: string;
  financialYear?: string;
  entityId?: string;
  entityName?: string;
  clientId?: string;
  clientName?: string;
  assignedTo?: string;
  billingAmount?: number;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceJobRequest {
  title: string;
  jobType: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  financialYear?: string;
  entityId?: string;
  clientId?: string;
  assignedToId?: string;
  billingAmount?: number;
  remarks?: string;
}

export const JOB_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  DRAFT:        { label: 'Draft',        color: 'text-slate-600',  bg: 'bg-slate-100' },
  PENDING_DOCS: { label: 'Pending Docs', color: 'text-amber-700',  bg: 'bg-amber-50' },
  IN_PROGRESS:  { label: 'In Progress',  color: 'text-blue-700',   bg: 'bg-blue-50' },
  REVIEW:       { label: 'In Review',    color: 'text-purple-700', bg: 'bg-purple-50' },
  FILED:        { label: 'Filed',        color: 'text-cyan-700',   bg: 'bg-cyan-50' },
  COMPLETED:    { label: 'Completed',    color: 'text-emerald-700',bg: 'bg-emerald-50' },
  REJECTED:     { label: 'Rejected',     color: 'text-red-700',    bg: 'bg-red-50' },
};

export const JOB_TYPE_LABELS: Record<string, string> = {
  ROC_FILING:    'ROC Filing',
  GST_FILING:    'GST Filing',
  ITR_FILING:    'ITR Filing',
  TDS_RETURN:    'TDS Return',
  AUDIT:         'Audit',
  ANNUAL_RETURN: 'Annual Return',
  DIR_KYC:       'Director KYC',
  DPT3:          'DPT-3',
  AOC4:          'AOC-4',
  MGT7:          'MGT-7',
  FORM11:        'Form 11 (LLP)',
  LLPIN_FILING:  'LLPIN Filing',
  OTHER:         'Other',
};
