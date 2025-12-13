'use client';

import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ActivityType } from '@/lib/types';

interface ActivityFiltersProps {
  activityTypes: ActivityType[];
  filters: {
    search: string;
    activityType: string;
    dateFrom: string;
    dateTo: string;
  };
  onFilterChange: (filters: {
    search: string;
    activityType: string;
    dateFrom: string;
    dateTo: string;
  }) => void;
}

export function ActivityFilters({ activityTypes, filters, onFilterChange }: ActivityFiltersProps) {
  const activityTypeOptions = [
    { value: '', label: 'All types' },
    ...activityTypes.map(type => ({
      value: type.activityTypeId,
      label: type.name,
    })),
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-4">Filters</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          placeholder="Search notes..."
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
        />
        
        <Select
          options={activityTypeOptions}
          value={filters.activityType}
          onChange={(e) => onFilterChange({ ...filters, activityType: e.target.value })}
        />

        <Input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => onFilterChange({ ...filters, dateFrom: e.target.value })}
          placeholder="From date"
        />

        <Input
          type="date"
          value={filters.dateTo}
          onChange={(e) => onFilterChange({ ...filters, dateTo: e.target.value })}
          placeholder="To date"
        />
      </div>
    </div>
  );
}
