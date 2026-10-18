import React, { useMemo, type ReactNode } from 'react';
import { ProtoIcon } from './icons';

export function PageHead({
  eyebrow,
  title,
  copy,
  actions,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  actions?: ReactNode;
}) {
  return (
    <header className="p-pagehead">
      <div className="p-pagehead-content">
        <span className="p-overline">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{copy}</p>
      </div>
      {actions && <div className="p-pagehead-actions">{actions}</div>}
    </header>
  );
}

export function ProtoPanel({
  title,
  subtitle,
  children,
  badge,
  className = '',
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  badge?: ReactNode;
  className?: string;
}) {
  return (
    <section className={`p-panel ${className}`}>
      <header className="p-panel-header">
        <div>
          <h2>{title}</h2>
          {subtitle && <small className="p-panel-sub">{subtitle}</small>}
        </div>
        {badge}
      </header>
      <div className="p-panel-body">{children}</div>
    </section>
  );
}

export function ProtoMetric({
  label,
  value,
  subvalue,
  tone,
}: {
  label: string;
  value: string;
  subvalue?: string;
  tone?: 'teal' | 'amber' | 'red' | 'normal';
}) {
  return (
    <div className={`p-metric ${tone ? `tone-${tone}` : ''}`}>
      <span className="p-metric-label">{label}</span>
      <b className="p-metric-value">{value}</b>
      {subvalue && <small className="p-metric-sub">{subvalue}</small>}
    </div>
  );
}

export function InteractiveQR({
  onScan,
  label = 'Simulated Emergency Credential',
}: {
  onScan?: () => void;
  label?: string;
}) {
  const cells = useMemo(
    () =>
      Array.from({ length: 121 }, (_, i) => {
        const x = i % 11;
        const y = Math.floor(i / 11);
        const finder =
          (x < 3 && y < 3) ||
          (x > 7 && y < 3) ||
          (x < 3 && y > 7);
        return finder || ((x * 7 + y * 5 + x * y) % 7 < 3);
      }),
    []
  );

  return (
    <div
      className={`p-qr-wrapper ${onScan ? 'interactive' : ''}`}
      onClick={onScan}
      role={onScan ? 'button' : undefined}
      tabIndex={onScan ? 0 : undefined}
      title={onScan ? 'Click to simulate scanning this credential' : label}
    >
      <div className="p-qr" aria-label={label}>
        {cells.map((on, i) => (
          <i key={i} className={on ? 'on' : ''} />
        ))}
      </div>
      {onScan && (
        <span className="p-qr-hint">
          <ProtoIcon name="camera" /> Click to scan
        </span>
      )}
    </div>
  );
}

export function ProtoModal({
  title,
  isOpen,
  onClose,
  children,
  maxWidth = '560px',
}: {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="p-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="p-modal-sheet"
        style={{ maxWidth }}
        onClick={e => e.stopPropagation()}
      >
        <header className="p-modal-header">
          <h3>{title}</h3>
          <button className="p-modal-close" onClick={onClose} aria-label="Close dialog">
            ✕
          </button>
        </header>
        <div className="p-modal-content">{children}</div>
      </div>
    </div>
  );
}
