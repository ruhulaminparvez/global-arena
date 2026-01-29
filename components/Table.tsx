"use client";

import { useMemo, useState, useEffect } from "react";
import Pagination from "./Pagination";
import { cn } from "@/lib/utils";

export interface TableColumn<T> {
  key: string;
  label: string;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  itemsPerPage?: number;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  rowKey?: (item: T) => string | number;
  className?: string;
}

export default function Table<T extends Record<string, any>>({
  data,
  columns,
  itemsPerPage = 5,
  emptyMessage = "কোন ডেটা পাওয়া যায়নি",
  onRowClick,
  rowKey,
  className = "",
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  // Pagination logic
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  const getRowKey = (item: T, index: number): string | number => {
    if (rowKey) {
      return rowKey(item);
    }
    return (item as any).id ?? index;
  };

  return (
    <div className={cn("bg-white rounded-xl shadow-lg overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-primary-600 text-white">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-6 py-4 text-left text-sm font-semibold",
                    column.headerClassName
                  )}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr
                  key={getRowKey(item, index)}
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    "hover:bg-gray-50 transition-colors",
                    onRowClick && "cursor-pointer"
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        "px-6 py-4 text-sm",
                        column.className ?? "text-gray-900"
                      )}
                    >
                      {column.render
                        ? column.render(item, index)
                        : (item[column.key] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {data.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={data.length}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
}
