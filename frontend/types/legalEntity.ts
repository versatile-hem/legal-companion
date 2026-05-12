export type EntityType =
  | 'PRIVATE_LIMITED'
  | 'PUBLIC_LIMITED'
  | 'LLP'
  | 'OPC'
  | 'PARTNERSHIP'
  | 'PROPRIETORSHIP'
  | 'SECTION_8'
  | 'TRUST'
  | 'SOCIETY'
  | 'HUF';

export type ComplianceStatus = 'HEALTHY' | 'AT_RISK' | 'OVERDUE' | 'CRITICAL' | 'NOT_APPLICABLE';
export type EntityStatus = 'ACTIVE' | 'INACTIVE' | 'STRUCK_OFF' | 'UNDER_LIQUIDATION' | 'DORMANT';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ComplianceItemStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE' | 'WAIVED' | 'NA';
export type ComplianceCategory = 'ROC' | 'GST' | 'INCOME_TAX' | 'LABOUR' | 'FEMA_RBI' | 'TRADEMARK' | 'MSME' | 'OTHER';
export type KycStatus = 'COMPLETED' | 'PENDING' | 'OVERDUE' | 'EXPIRED';

export interface DirectorSummary {
  id: string;
  directorName: string;
  din?: string;
  designation?: string;
  kycStatus: KycStatus;
  kycDueDate?: string;
  isActive: boolean;
}

export interface ComplianceSummary {
  id: string;
  complianceName: string;
  formName?: string;
  category: ComplianceCategory;
  status: ComplianceItemStatus;
  riskLevel: RiskLevel;
  dueDate?: string;
  completedDate?: string;
}

export interface LegalEntity {
  id: string;
  entityName: string;
  entityType: EntityType;
  incorporationDate?: string;
  cinLlpin?: string;
  pan?: string;
  tan?: string;
  gstin?: string;
  rocCode?: string;
  financialYearEnd?: string;
  registeredOffice?: string;
  city?: string;
  state?: string;
  pincode?: string;
  email?: string;
  phone?: string;
  website?: string;
  authorizedCapital?: number;
  paidUpCapital?: number;
  complianceStatus: ComplianceStatus;
  nextDueDate?: string;
  status: EntityStatus;
  aiRiskScore: number;
  aiSummary?: string;
  assignedManagerName?: string;
  tags: string[];
  directors: DirectorSummary[];
  compliances: ComplianceSummary[];
  createdAt: string;
  updatedAt: string;
}

export interface LegalEntityRequest {
  entityName: string;
  entityType: EntityType;
  incorporationDate?: string;
  cinLlpin?: string;
  pan?: string;
  tan?: string;
  gstin?: string;
  rocCode?: string;
  financialYearEnd?: string;
  registeredOffice?: string;
  city?: string;
  state?: string;
  pincode?: string;
  email?: string;
  phone?: string;
  website?: string;
  authorizedCapital?: number;
  paidUpCapital?: number;
  status?: EntityStatus;
  assignedManagerId?: string;
  tags?: string[];
  notes?: string;
}

export interface EntityFilters {
  search: string;
  entityType: string;
  state: string;
  status: string;
  complianceStatus: string;
}

export const ENTITY_TYPE_LABELS: Record<EntityType, string> = {
  PRIVATE_LIMITED: 'Private Limited',
  PUBLIC_LIMITED: 'Public Limited',
  LLP: 'LLP',
  OPC: 'OPC',
  PARTNERSHIP: 'Partnership',
  PROPRIETORSHIP: 'Proprietorship',
  SECTION_8: 'Section 8',
  TRUST: 'Trust',
  SOCIETY: 'Society',
  HUF: 'HUF',
};

export const COMPLIANCE_STATUS_CONFIG: Record<ComplianceStatus, { label: string; color: string; bg: string }> = {
  HEALTHY:        { label: 'Healthy',       color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  AT_RISK:        { label: 'At Risk',        color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200'   },
  OVERDUE:        { label: 'Overdue',        color: 'text-orange-700',  bg: 'bg-orange-50 border-orange-200' },
  CRITICAL:       { label: 'Critical',       color: 'text-red-700',     bg: 'bg-red-50 border-red-200'       },
  NOT_APPLICABLE: { label: 'N/A',            color: 'text-slate-500',   bg: 'bg-slate-50 border-slate-200'   },
};

export const ENTITY_STATUS_CONFIG: Record<EntityStatus, { label: string; color: string; bg: string }> = {
  ACTIVE:           { label: 'Active',            color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  INACTIVE:         { label: 'Inactive',           color: 'text-slate-600',   bg: 'bg-slate-100 border-slate-200'   },
  STRUCK_OFF:       { label: 'Struck Off',         color: 'text-red-700',     bg: 'bg-red-50 border-red-200'        },
  UNDER_LIQUIDATION:{ label: 'Under Liquidation',  color: 'text-purple-700',  bg: 'bg-purple-50 border-purple-200'  },
  DORMANT:          { label: 'Dormant',             color: 'text-yellow-700',  bg: 'bg-yellow-50 border-yellow-200'  },
};

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
];
