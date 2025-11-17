import { Card, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export function StatCard({
  title,
  value,
  percentage,
  loading = false,
  showDollarSign = false,
}: {
  title: string;
  value: number | string;
  percentage?: number;
  loading?: boolean;
  showDollarSign?: boolean;
}) {
  let paragraph = <p className="text-sm text-[#898989]">No change from last month</p>;

  if (!percentage) {
    paragraph = <></>;
  }

  if (percentage && percentage > 0) {
    paragraph = (
      <p className="text-sm text-[#898989]">
        <span className="text-green-600 mr-1">+{percentage}%</span>
        compared to last month
      </p>
    );
  }

  if (percentage && percentage < 0) {
    paragraph = (
      <p className="text-sm text-[#898989]">
        <span className="text-red-600 mr-1">{percentage}%</span>
        compared to last month
      </p>
    );
  }

  if (loading) {
    return (
      <Card className="w-full bg-white shadow-xs" style={{ borderColor: 'oklch(.922 0 0)' }}>
        <CardContent className="p-4" aria-label={`${title} mini card loading`}>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-4 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-white shadow-xs" style={{ borderColor: 'oklch(.922 0 0)' }}>
      <CardContent className="p-4" aria-label={`${title} mini card`}>
        <h3 className="text-sm font-medium text-[#898989] mb-2">{title}</h3>
        <p
          className="text-[28px] font-semibold text-[#484848] mb-2"
          aria-label={`${title} mini card value`}
        >
          {showDollarSign ? `$${value}` : value}
        </p>
        {paragraph}
      </CardContent>
    </Card>
  );
}
