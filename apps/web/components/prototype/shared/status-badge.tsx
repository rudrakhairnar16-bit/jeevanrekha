import React, { type ReactNode } from 'react';

export function ProtoStatus({
  children,
  tone = 'teal',
  pulsing = false,
}: {
  children: ReactNode;
  tone?: 'teal' | 'amber' | 'red' | 'grey' | 'blue';
  pulsing?: boolean;
}) {
  return (
    <span className={`p-status ${tone} ${pulsing ? 'pulse' : ''}`}>
      <i aria-hidden="true" />
      <span>{children}</span>
    </span>
  );
}
