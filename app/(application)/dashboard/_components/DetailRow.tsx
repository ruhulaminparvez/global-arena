import type { LucideIcon } from "lucide-react";

export interface DetailRowProps {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
}

export function DetailRow({ icon: Icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-100 last:border-0">
      <div className="p-1.5 rounded-lg bg-primary-50 text-primary-600 shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-gray-900 font-medium break-words">{value ?? "—"}</p>
      </div>
    </div>
  );
}
