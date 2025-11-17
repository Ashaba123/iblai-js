'use client';
import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { Button } from '../ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { useChartFilters } from './chart-filters-context';

export function CustomDateRangePicker() {
  const { setActiveFilter, setDateRange, filters, setOutsideFilters } = useChartFilters();
  const [date, setDate] = useState<DateRange | undefined>({
    from: filters.dateRange?.startDate ?? undefined,
    to: filters.dateRange?.endDate ?? undefined,
  });

  // Sync local state with context filters when they change externally
  useEffect(() => {
    if (filters.dateRange?.startDate !== date?.from || filters.dateRange?.endDate !== date?.to) {
      setDate({
        from: filters.dateRange?.startDate ?? undefined,
        to: filters.dateRange?.endDate ?? undefined,
      });
    }
  }, [filters.dateRange?.startDate, filters.dateRange?.endDate, date?.from, date?.to]);

  const handleDateSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);

    if (selectedDate?.from && selectedDate?.to) {
      setActiveFilter('custom');
      setDateRange({ startDate: selectedDate.from, endDate: selectedDate.to });
      setOutsideFilters({
        activeFilter: 'custom',
        dateRange: {
          startDate: selectedDate.from,
          endDate: selectedDate.to,
        },
      });
    }
  };

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            size="sm"
            aria-pressed={filters.activeFilter === 'custom'}
            className={`h-8 px-3 text-sm shadow-sm ${
              filters.activeFilter === 'custom'
                ? 'bg-blue-50 text-blue-600 border border-blue-100 font-medium'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-gray-100 bg-transparent'
            }`}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Custom
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
            classNames={{
              day_selected:
                'bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white',
              day_range_middle:
                'bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800 focus:bg-blue-200 focus:text-blue-800',
              day_range_end:
                'bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white',
              day_range_start:
                'bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white',
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
