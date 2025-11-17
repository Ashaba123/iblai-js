import { Button } from '../ui/button';
import { CustomDateRangePicker } from './custom-date-range-picker';
import { useChartFilters } from './chart-filters-context';
import { DateFilter } from '@iblai/data-layer';

export function TimeFilter() {
  const { filters, setActiveFilter, setOutsideFilters } = useChartFilters();
  const handleActiveFilter = (filter: DateFilter) => {
    setActiveFilter(filter);
    setOutsideFilters({ activeFilter: filter });
  };
  return (
    <div className="flex flex-wrap gap-2 justify-end">
      <Button
        variant="outline"
        size="sm"
        aria-pressed={filters.activeFilter === 'today'}
        onClick={() => handleActiveFilter('today')}
        className={`h-8 px-3 text-sm shadow-sm ${
          filters.activeFilter === 'today'
            ? 'bg-blue-50 text-blue-600 border border-blue-100 font-medium'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-gray-100 bg-white'
        }`}
      >
        Today
      </Button>
      <Button
        variant="outline"
        size="sm"
        aria-pressed={filters.activeFilter === '7d'}
        onClick={() => handleActiveFilter('7d')}
        className={`h-8 px-3 text-sm shadow-sm ${
          filters.activeFilter === '7d'
            ? 'bg-blue-50 text-blue-600 border border-blue-100 font-medium'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-gray-100 bg-white'
        }`}
      >
        7D
      </Button>
      <Button
        variant="outline"
        size="sm"
        aria-pressed={filters.activeFilter === '30d'}
        onClick={() => handleActiveFilter('30d')}
        className={`h-8 px-3 text-sm shadow-sm ${
          filters.activeFilter === '30d'
            ? 'bg-blue-50 text-blue-600 border border-blue-100 font-medium'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-gray-100 bg-white'
        }`}
      >
        30D
      </Button>
      <Button
        variant="outline"
        size="sm"
        aria-pressed={filters.activeFilter === '90d'}
        onClick={() => handleActiveFilter('90d')}
        className={`h-8 px-3 text-sm shadow-sm ${
          filters.activeFilter === '90d'
            ? 'bg-blue-50 text-blue-600 border border-blue-100 font-medium'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-gray-100 bg-white'
        }`}
      >
        90D
      </Button>
      <CustomDateRangePicker />
    </div>
  );
}
