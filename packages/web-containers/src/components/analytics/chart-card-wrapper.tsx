import { ResponsiveContainer } from 'recharts';

import { ChartContainer } from '../ui/chart';
import { Card, CardContent } from '../ui/card';
import { TimeFilter } from './time-filter';
import { ChartFiltersProvider, type ChartFilters } from './chart-filters-context';
import { cn } from '../../lib/utils';

type Props = {
  title: string;
  label: string;
  filters: Partial<ChartFilters>;
  setOutsideFilters: (filters: Partial<ChartFilters>) => void;
  children: React.ReactElement<unknown, string | React.JSXElementConstructor<any>>;
  overflowAuto?: boolean;
  height?: string;
};

export function ChartCardWrapper({
  title,
  label,
  children,
  filters,
  setOutsideFilters,
  overflowAuto,
  height,
}: Props) {
  return (
    <ChartFiltersProvider initialFilters={filters} setOutsideFilters={setOutsideFilters}>
      <Card className="w-full bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
        <CardContent className="p-4" aria-label={`${title} chart card`}>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-medium text-gray-700">{title}</h3>
              <TimeFilter />
            </div>
          </div>
          <div className="w-full" style={{ height: height || '350px' }}>
            <ChartContainer
              title={title}
              config={{
                value: {
                  label,
                  color: '#38A1E5', // Reverted to original color
                },
              }}
              className={cn(overflowAuto ? 'overflow-auto' : '')}
            >
              <ResponsiveContainer width="100%" height="100%">
                {children}
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </ChartFiltersProvider>
  );
}
