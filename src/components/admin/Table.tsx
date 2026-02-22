/**
 * Table Component
 * Reusable data table with newspaper styling
 */

import React from 'react';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  width?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No data available',
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="border-2 border-ink p-8 text-center">
        <p className="font-mono text-sm text-ink/60 uppercase tracking-wide">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="border-2 border-ink overflow-x-auto">
      <table className="w-full">
        <thead className="border-b-2 border-ink bg-surface">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{ width: column.width }}
                className="px-4 py-3 text-left font-mono text-xs font-bold uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/20">
          {data.map((item) => (
            <tr key={keyExtractor(item)} className="hover:bg-surface transition-colors">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 font-body text-sm">
                  {column.render ? column.render(item) : (item as any)[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
