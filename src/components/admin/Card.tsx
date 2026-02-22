/**
 * Card Component
 * Reusable card container with newspaper styling
 */

import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export const Card: React.FC<CardProps> = React.memo(({
  title,
  subtitle,
  children,
  className = '',
  actions
}) => {
  return (
    <div className={`border-2 border-ink bg-newsprint shadow-[4px_4px_0_0_rgba(var(--rgb-ink),1)] ${className}`}>
      {(title || actions) && (
        <div className="border-b-2 border-ink p-4 flex items-center justify-between">
          <div>
            {title && (
              <h3 className="font-sans font-black text-xl uppercase tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="font-mono text-xs text-ink/60 mt-1 uppercase tracking-wide">
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
});
