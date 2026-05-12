export interface Invoice {
  id: string;
  invoiceNumber?: string;
  clientId?: string;
  clientName?: string;
  jobId?: string;
  jobTitle?: string;
  subtotal?: number;
  amount: number;
  gstAmount?: number;
  taxAmount?: number;
  totalAmount: number;
  paidAmount?: number;
  status: string;
  issueDate?: string;
  dueDate?: string;
  paidDate?: string;
  paymentDate?: string;
  paymentMode?: string;
  notes?: string;
  createdAt: string;
}

export interface InvoiceRequest {
  clientId?: string;
  jobId?: string;
  subtotal?: number;
  taxAmount?: number;
  totalAmount: number;
  paidAmount?: number;
  status: string;
  issueDate?: string;
  dueDate?: string;
  paymentDate?: string;
  notes?: string;
}

export interface BillingSummary {
  totalPaid: number;
  totalOutstanding: number;
  overdueCount: number;
  draftCount: number;
}

export const INVOICE_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  DRAFT:     { label: 'Draft',     color: 'text-slate-600',  bg: 'bg-slate-100' },
  SENT:      { label: 'Sent',      color: 'text-blue-700',   bg: 'bg-blue-50' },
  PAID:      { label: 'Paid',      color: 'text-emerald-700',bg: 'bg-emerald-50' },
  OVERDUE:   { label: 'Overdue',   color: 'text-red-700',    bg: 'bg-red-50' },
  CANCELLED: { label: 'Cancelled', color: 'text-slate-500',  bg: 'bg-slate-100' },
};
