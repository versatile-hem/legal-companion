'use client';

import React, { useState } from 'react';
import {
  X, Building2, MapPin, Hash, FileText, Users, ClipboardList, Cpu, AlertTriangle,
  Download, Mail, Loader2,
} from 'lucide-react';
import { useEntityStore } from '@/store/entityStore';
import {
  ENTITY_TYPE_LABELS,
  COMPLIANCE_STATUS_CONFIG,
  ENTITY_STATUS_CONFIG,
} from '@/types/legalEntity';
import { format } from 'date-fns';

function fmtDate(d?: string | null) {
  if (!d) return '—';
  try { return format(new Date(d), 'dd MMM yyyy'); } catch { return d; }
}

function Field({ label, value, children }: { label: string; value?: string | null; children?: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      {children ?? <p className="text-sm text-slate-800 font-medium">{value || '—'}</p>}
    </div>
  );
}

export default function EntityViewModal() {
  const { viewEntity, closeAll } = useEntityStore();
  const [isExporting, setIsExporting] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);
  const [showMailInput, setShowMailInput] = useState(false);
  const [mailTo, setMailTo] = useState('');

  if (!viewEntity) return null;

  const e = viewEntity;
  const compliance = COMPLIANCE_STATUS_CONFIG[e.complianceStatus as keyof typeof COMPLIANCE_STATUS_CONFIG];

  async function generatePdf() {
    const { default: jsPDF } = await import('jspdf');
    const entity = viewEntity!;
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentW = pageW - margin * 2;
    let y = margin;

    const checkPageBreak = (needed = 10) => {
      if (y + needed > pageH - margin) { doc.addPage(); y = margin; }
    };

    // ─── Header banner ───
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageW, 32, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.text(entity.entityName, margin, 13);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    const typeLabel = ENTITY_TYPE_LABELS[entity.entityType as keyof typeof ENTITY_TYPE_LABELS] ?? entity.entityType;
    doc.text(`${typeLabel}  |  Status: ${entity.status}  |  Compliance: ${entity.complianceStatus}`, margin, 21.5);
    doc.text(`Generated: ${format(new Date(), 'dd MMM yyyy, HH:mm')}  |  Suits-In Compliance Platform`, margin, 28.5);
    y = 38;
    doc.setTextColor(30, 41, 59);

    const addSectionTitle = (title: string) => {
      checkPageBreak(12);
      doc.setFillColor(239, 246, 255);
      doc.rect(margin, y, contentW, 7, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 99, 235);
      doc.text(title.toUpperCase(), margin + 2, y + 5);
      doc.setTextColor(30, 41, 59);
      y += 10;
    };

    const addRow = (l1: string, v1: string | null | undefined, l2?: string, v2?: string | null) => {
      checkPageBreak(7);
      const half = contentW / 2;
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(l1, margin + 2, y);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      doc.text(v1 || '—', margin + 42, y);
      if (l2 !== undefined) {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text(l2, margin + half + 2, y);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 41, 59);
        doc.text(v2 || '—', margin + half + 42, y);
      }
      y += 6;
    };

    // ─── Basic Info ───
    addSectionTitle('Basic Information');
    addRow('Entity Name', entity.entityName, 'Entity Type', typeLabel);
    addRow('Incorporation Date', fmtDate(entity.incorporationDate), 'Financial Year End', entity.financialYearEnd);
    addRow('ROC', entity.rocCode, 'Status', entity.status);
    addRow('Assigned Manager', entity.assignedManagerName, 'Next Due Date', fmtDate(entity.nextDueDate));
    y += 3;

    // ─── Tax & Registration ───
    addSectionTitle('Tax & Registration');
    addRow('CIN / LLPIN', entity.cinLlpin, 'PAN', entity.pan);
    addRow('TAN', entity.tan, 'GSTIN', entity.gstin);
    y += 3;

    // ─── Contact & Address ───
    addSectionTitle('Contact & Address');
    addRow('Email', entity.email, 'Phone', entity.phone);
    addRow('Website', entity.website, 'State', entity.state);
    addRow('City', entity.city, 'Pincode', entity.pincode);
    if (entity.registeredOffice) {
      checkPageBreak(10);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('Registered Office', margin + 2, y);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      const addrLines = doc.splitTextToSize(entity.registeredOffice, contentW - 46) as string[];
      addrLines.forEach((line) => { checkPageBreak(6); doc.text(line, margin + 42, y); y += 5.5; });
      y += 1.5;
    }
    y += 3;

    // ─── Directors ───
    if (entity.directors && entity.directors.length > 0) {
      addSectionTitle(`Directors (${entity.directors.length})`);
      checkPageBreak(7);
      doc.setFillColor(219, 234, 254);
      doc.rect(margin, y, contentW, 6.5, 'F');
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 99, 235);
      doc.text('Name', margin + 2, y + 4.5);
      doc.text('Designation', margin + 65, y + 4.5);
      doc.text('DIN', margin + 115, y + 4.5);
      doc.text('KYC', margin + 148, y + 4.5);
      doc.text('Active', margin + 163, y + 4.5);
      y += 7.5;
      entity.directors.forEach((d, i) => {
        checkPageBreak(7);
        if (i % 2 === 0) { doc.setFillColor(248, 250, 252); doc.rect(margin, y - 1, contentW, 6.5, 'F'); }
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 41, 59);
        doc.text(d.directorName || '—', margin + 2, y + 3.5);
        doc.setFont('helvetica', 'normal');
        doc.text(d.designation || '—', margin + 65, y + 3.5);
        doc.text(d.din || '—', margin + 115, y + 3.5);
        doc.text(d.kycStatus || '—', margin + 148, y + 3.5);
        doc.setTextColor(d.isActive ? 22 : 100, d.isActive ? 163 : 116, d.isActive ? 74 : 139);
        doc.text(d.isActive ? 'Yes' : 'No', margin + 163, y + 3.5);
        doc.setTextColor(30, 41, 59);
        y += 6.5;
      });
      y += 3;
    }

    // ─── Compliance ───
    if (entity.compliances && entity.compliances.length > 0) {
      addSectionTitle(`Compliance Items (${entity.compliances.length})`);
      checkPageBreak(7);
      doc.setFillColor(219, 234, 254);
      doc.rect(margin, y, contentW, 6.5, 'F');
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 99, 235);
      doc.text('Compliance', margin + 2, y + 4.5);
      doc.text('Form', margin + 68, y + 4.5);
      doc.text('Category', margin + 103, y + 4.5);
      doc.text('Due Date', margin + 138, y + 4.5);
      doc.text('Status', margin + 163, y + 4.5);
      y += 7.5;
      entity.compliances.forEach((c, i) => {
        checkPageBreak(7);
        if (i % 2 === 0) { doc.setFillColor(248, 250, 252); doc.rect(margin, y - 1, contentW, 6.5, 'F'); }
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 41, 59);
        const nameStr = (doc.splitTextToSize(c.complianceName || '—', 63) as string[])[0];
        doc.text(nameStr, margin + 2, y + 3.5);
        doc.setFont('helvetica', 'normal');
        doc.text(c.formName || '—', margin + 68, y + 3.5);
        doc.text(c.category || '—', margin + 103, y + 3.5);
        doc.text(fmtDate(c.dueDate), margin + 138, y + 3.5);
        const sc = { COMPLETED: [22, 163, 74], OVERDUE: [220, 38, 38], PENDING: [234, 88, 12], IN_PROGRESS: [37, 99, 235] } as Record<string, number[]>;
        const col = sc[c.status] ?? [100, 116, 139];
        doc.setTextColor(col[0], col[1], col[2]);
        doc.text(c.status, margin + 163, y + 3.5);
        doc.setTextColor(30, 41, 59);
        y += 6.5;
      });
      y += 3;
    }

    // ─── AI Insights ───
    if (entity.aiRiskScore != null || entity.aiSummary) {
      addSectionTitle('AI Insights');
      if (entity.aiRiskScore != null) addRow('AI Risk Score', `${entity.aiRiskScore} / 100`);
      if (entity.aiSummary) {
        checkPageBreak(10);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text('AI Summary', margin + 2, y);
        y += 5;
        doc.setTextColor(30, 41, 59);
        (doc.splitTextToSize(entity.aiSummary, contentW - 4) as string[]).forEach((line) => {
          checkPageBreak(5.5); doc.text(line, margin + 2, y); y += 5;
        });
      }
    }

    // ─── Page numbers ───
    const total = (doc.internal as any).getNumberOfPages() as number;
    for (let i = 1; i <= total; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(`Page ${i} of ${total}`, pageW / 2, pageH - 7, { align: 'center' });
      doc.text('Confidential — Suits-In Compliance Platform', margin, pageH - 7);
      doc.text(format(new Date(), 'dd MMM yyyy'), pageW - margin, pageH - 7, { align: 'right' });
    }

    return doc;
  }

  async function handleExportPdf() {
    setIsExporting(true);
    try {
      const pdf = await generatePdf();
      pdf.save(`${e.entityName.replace(/\s+/g, '_')}_Entity_Report.pdf`);
    } finally {
      setIsExporting(false);
    }
  }

  async function handleMailPdf() {
    if (!mailTo.trim()) { setShowMailInput(true); return; }
    setIsEmailing(true);
    try {
      const pdf = await generatePdf();
      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      // Download the PDF so the user can attach it manually
      const a = document.createElement('a');
      a.href = url;
      a.download = `${e.entityName.replace(/\s+/g, '_')}_Entity_Report.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      // Open mail client with pre-filled subject and body
      const subject = encodeURIComponent(`Entity Compliance Report – ${e.entityName}`);
      const body = encodeURIComponent(
        `Hi,\n\nPlease find the attached compliance report for ${e.entityName} (CIN: ${e.cinLlpin ?? 'N/A'}).\n\nRegards`
      );
      window.location.href = `mailto:${mailTo}?subject=${subject}&body=${body}`;
      setShowMailInput(false);
      setMailTo('');
    } finally {
      setIsEmailing(false);
    }
  }
  const status = ENTITY_STATUS_CONFIG[e.status as keyof typeof ENTITY_STATUS_CONFIG];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={closeAll} />

      {/* Drawer */}
      <div className="w-full max-w-2xl bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right-8 duration-200">
        {/* Header */}
        <div className="flex items-start gap-4 px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold truncate">{e.entityName}</h2>
            <p className="text-sm text-blue-100 mt-0.5">
              {ENTITY_TYPE_LABELS[e.entityType as keyof typeof ENTITY_TYPE_LABELS] ?? e.entityType}
              {e.state && ` · ${e.state}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {compliance && (
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${compliance.bg} ${compliance.color}`}>
                {compliance.label}
              </span>
            )}
            <button onClick={closeAll} className="p-1.5 rounded-lg hover:bg-white/20 transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">

          {/* Basic Info */}
          <Section title="Basic Information" icon={FileText}>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Entity Name" value={e.entityName} />
              <Field label="Entity Type" value={ENTITY_TYPE_LABELS[e.entityType as keyof typeof ENTITY_TYPE_LABELS]} />
              <Field label="Incorporation Date" value={fmtDate(e.incorporationDate)} />
              <Field label="Financial Year End" value={e.financialYearEnd} />
              <Field label="ROC" value={e.rocCode} />
              <Field label="Status">
                {status && (
                  <span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>
                    {status.label}
                  </span>
                )}
              </Field>
            </div>
          </Section>

          {/* Tax Registration */}
          <Section title="Tax & Registration" icon={Hash}>
            <div className="grid grid-cols-2 gap-4">
              <Field label="CIN / LLPIN" value={e.cinLlpin} />
              <Field label="PAN" value={e.pan} />
              <Field label="TAN" value={e.tan} />
              <Field label="GSTIN" value={e.gstin} />
            </div>
          </Section>

          {/* Contact */}
          <Section title="Contact & Address" icon={MapPin}>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Email" value={e.email} />
              <Field label="Phone" value={e.phone} />
              <Field label="Website" value={e.website} />
              <Field label="State" value={e.state} />
              <div className="col-span-2">
                <Field label="Registered Address" value={e.registeredOffice} />
              </div>
            </div>
          </Section>

          {/* Directors */}
          {e.directors && e.directors.length > 0 && (
            <Section title={`Directors (${e.directors.length})`} icon={Users}>
              <div className="space-y-2">
                {e.directors.map((d) => (
                  <div key={d.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/60">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                      {d.directorName?.charAt(0) ?? 'D'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">{d.directorName}</p>
                      <p className="text-xs text-slate-500">{d.designation} · DIN: {d.din ?? '—'}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${d.isActive ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {d.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Compliance Summary */}
          {e.compliances && e.compliances.length > 0 && (
            <Section title="Recent Compliance" icon={ClipboardList}>
              <div className="space-y-2">
                {e.compliances.map((c) => {
                  const cfg = COMPLIANCE_STATUS_CONFIG[c.status as keyof typeof COMPLIANCE_STATUS_CONFIG];
                  return (
                    <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{c.complianceName}</p>
                        <p className="text-xs text-slate-400">{c.formName} · Due: {fmtDate(c.dueDate)}</p>
                      </div>
                      {cfg && (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          {/* AI Insights */}
          {(e.aiSummary || e.aiRiskScore != null) && (
            <Section title="AI Insights" icon={Cpu}>
              {e.aiRiskScore != null && (
                <div className="flex items-center gap-3 mb-3">
                  <RiskGauge score={e.aiRiskScore} />
                </div>
              )}
              {e.aiSummary && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-blue-100 text-sm text-slate-700 leading-relaxed">
                  {e.aiSummary}
                </div>
              )}
            </Section>
          )}
        </div>

        {/* Footer */}
        {showMailInput && (
          <div className="px-6 py-3 border-t border-slate-200 bg-blue-50/60 flex items-center gap-2">
            <input
              type="email"
              value={mailTo}
              onChange={e => setMailTo(e.target.value)}
              onKeyDown={ev => ev.key === 'Enter' && handleMailPdf()}
              placeholder="Recipient email address"
              className="flex-1 text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              autoFocus
            />
            <button
              onClick={handleMailPdf}
              disabled={isEmailing || !mailTo.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5 transition"
            >
              {isEmailing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
              Send
            </button>
            <button
              onClick={() => { setShowMailInput(false); setMailTo(''); }}
              className="px-3 py-2 text-sm text-slate-500 hover:text-slate-700 transition"
            >
              Cancel
            </button>
          </div>
        )}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Last updated: {fmtDate(e.updatedAt)}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportPdf}
                disabled={isExporting}
                className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 flex items-center gap-1.5 transition"
              >
                {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                Export PDF
              </button>
              <button
                onClick={() => setShowMailInput(v => !v)}
                className="px-3 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 flex items-center gap-1.5 transition"
              >
                <Mail className="w-3.5 h-3.5" />
                Mail PDF
              </button>
              <button
                onClick={closeAll}
                className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-blue-500" />
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function RiskGauge({ score }: { score: number }) {
  const pct = Math.min(100, Math.max(0, score));
  const color = pct < 30 ? 'text-green-600 bg-green-50' : pct < 60 ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50';
  const label = pct < 30 ? 'Low Risk' : pct < 60 ? 'Medium Risk' : 'High Risk';
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${color}`}>
      <AlertTriangle className="w-4 h-4" />
      AI Risk Score: {score} — {label}
    </div>
  );
}


