// components/StatCard.tsx
import React from "react";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  description,
}) => (
  <div className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-main" />
        <h3 className="text-sm font-medium text-neutral-600">{label}</h3>
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-2xl font-bold">{value}</p>
      {description && <p className="text-sm text-emerald-600">{description}</p>}
    </div>
  </div>
);

export default StatCard;
