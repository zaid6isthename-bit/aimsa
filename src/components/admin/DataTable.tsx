'use client';

import { ReactNode } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  render?: (value: unknown, row: Record<string, unknown>) => ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, unknown>[];
  onEdit?: (row: Record<string, unknown>) => void;
  onDelete?: (row: Record<string, unknown>) => void;
  emptyMessage?: string;
}

export default function DataTable({
  columns,
  data,
  onEdit,
  onDelete,
  emptyMessage = 'No data found',
}: DataTableProps) {
  if (data.length === 0) {
    return (
      <div className="admin-card p-12 text-center">
        <p className="font-mono-tech text-sm text-[#B5AFA3]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="admin-table overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
              {(onEdit || onDelete) && (
                <th className="text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="font-mono-tech text-xs text-[#121110]/70"
                  >
                    {col.render
                      ? col.render(row[col.key], row)
                      : (row[col.key] as ReactNode) ?? '—'}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="rounded-lg p-1.5 text-[#B5AFA3] hover:bg-[#D92525]/10 hover:text-[#D92525] transition-colors"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="rounded-lg p-1.5 text-[#B5AFA3] hover:bg-[#D92525]/10 hover:text-[#D92525] transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
