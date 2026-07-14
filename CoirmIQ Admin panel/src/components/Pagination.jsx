import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
  page,
  size,
  totalElements = 0,
  totalPages = 0,
  onPageChange,
  onSizeChange,
}) => {
  if (totalPages <= 1 && totalElements === 0) return null;

  const startIdx = page * size + 1;
  const endIdx = Math.min(startIdx + size - 1, totalElements);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-900 bg-slate-950/60 mt-auto">
      {/* Detail count */}
      <div className="text-xs text-slate-400">
        Showing <span className="font-semibold text-slate-200">{totalElements === 0 ? 0 : startIdx}</span> to{' '}
        <span className="font-semibold text-slate-200">{endIdx}</span> of{' '}
        <span className="font-semibold text-slate-200">{totalElements}</span> entries
      </div>

      <div className="flex items-center gap-4">
        {/* Page size selector */}
        {onSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Show</span>
            <select
              value={size}
              onChange={(e) => onSizeChange(Number(e.target.value))}
              className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-md px-2 py-1 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              {[10, 20, 50, 100].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Navigation arrows */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 0}
            className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-slate-900 disabled:hover:text-slate-400 transition-all"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="flex items-center gap-1 min-w-[50px] justify-center text-xs text-slate-300">
            Page <span className="font-semibold text-slate-100 mx-1">{page + 1}</span> of{' '}
            <span className="font-semibold text-slate-100 mx-1">{Math.max(1, totalPages)}</span>
          </div>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages - 1}
            className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-slate-900 disabled:hover:text-slate-400 transition-all"
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
