'use client';
import { useState } from 'react';

const accessTimeData = [
  // Sunday
  [2, 1, 0, 0, 0, 1, 3, 8, 12, 15, 18, 22, 25, 28, 24, 20, 18, 22, 28, 32, 25, 18, 12, 6],
  // Monday
  [3, 2, 1, 0, 1, 2, 5, 15, 25, 35, 42, 48, 52, 55, 58, 52, 48, 45, 42, 38, 32, 25, 18, 12],
  // Tuesday
  [4, 2, 1, 1, 1, 3, 6, 18, 28, 38, 45, 52, 58, 62, 65, 58, 52, 48, 45, 40, 35, 28, 22, 15],
  // Wednesday
  [3, 2, 1, 0, 1, 2, 5, 16, 26, 36, 43, 50, 56, 60, 63, 56, 50, 46, 43, 38, 33, 26, 20, 13],
  // Thursday
  [4, 3, 1, 1, 1, 3, 6, 17, 27, 37, 44, 51, 57, 61, 64, 57, 51, 47, 44, 39, 34, 27, 21, 14],
  // Friday
  [5, 3, 2, 1, 2, 4, 7, 19, 29, 39, 46, 53, 59, 63, 66, 59, 53, 49, 46, 41, 36, 29, 23, 16],
  // Saturday
  [3, 2, 1, 0, 1, 2, 4, 10, 16, 22, 28, 32, 35, 38, 35, 32, 28, 25, 30, 35, 32, 25, 18, 12],
];

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const hoursOfDay = Array.from({ length: 24 }, (_, i) => i);

const getHeatmapColor = (value: number) => {
  const maxValue = Math.max(...accessTimeData.flat());
  const intensity = value / maxValue;

  if (intensity === 0) return '#f8fafc'; // slate-50 (keep white for zero)
  if (intensity <= 0.2) return '#dbeafe'; // blue-50
  if (intensity <= 0.4) return '#bfdbfe'; // blue-200
  if (intensity <= 0.6) return '#93c5fd'; // blue-300
  if (intensity <= 0.8) return '#60a5fa'; // blue-400
  return '#3b82f6'; // blue-500
};

const formatHour = (hour: number) => {
  if (hour === 0) return '12 AM';
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
};

export function AccessTimeHeatmap({
  accessTimeData,
  loading,
}: {
  accessTimeData: number[][];
  loading: boolean;
}) {
  const [hoveredCell, setHoveredCell] = useState<{
    day: number;
    hour: number;
    value: number;
  } | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  if (loading)
    return (
      <div className="flex items-center justify-center h-full text-sm text-gray-500">
        Loading...
      </div>
    );

  return (
    <div className="relative">
      <div className="text-xs">
        {/* Header row with hours */}
        <div className="flex mb-1">
          <div className="w-8"></div> {/* Empty cell for day labels */}
          {hoursOfDay.map((hour) => (
            <div
              key={hour}
              className="flex-1 text-center text-gray-500 text-[10px] font-medium min-w-[12px]"
            >
              {hour % 6 === 0 ? formatHour(hour).split(' ')[0] : ''}
            </div>
          ))}
        </div>

        {/* Data rows */}
        {accessTimeData.map((dayData, dayIndex) => (
          <div key={dayIndex} className="flex mb-1">
            {/* Day label */}
            <div className="w-8 text-right text-gray-500 text-[10px] font-medium pr-2 flex items-center justify-end">
              {daysOfWeek[dayIndex]}
            </div>
            {/* Hour cells */}
            <div className="flex flex-1 gap-[1px]">
              {dayData.map((value, hourIndex) => (
                <div
                  key={`${dayIndex}-${hourIndex}`}
                  className="flex-1 aspect-square rounded-sm cursor-pointer transition-all duration-200 hover:ring-1 hover:ring-blue-400 min-w-[12px] min-h-[12px]"
                  style={{ backgroundColor: getHeatmapColor(value) }}
                  onMouseEnter={(e) => {
                    setMousePosition({ x: e.clientX, y: e.clientY });
                    setHoveredCell({ day: dayIndex, hour: hourIndex, value });
                  }}
                  onMouseLeave={() => setHoveredCell(null)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
        <span>Less active</span>
        <div className="flex gap-1">
          {[0, 0.2, 0.4, 0.6, 0.8, 1].map((intensity, index) => (
            <div
              key={index}
              className="w-3 h-3 rounded-sm"
              style={{
                backgroundColor: getHeatmapColor(intensity * Math.max(...accessTimeData.flat())),
              }}
            />
          ))}
        </div>
        <span>More active</span>
      </div>

      {/* Tooltip */}
      {hoveredCell && (
        <div
          className="fixed z-50 bg-gray-900 text-white text-xs rounded-md px-2 py-1 pointer-events-none shadow-lg"
          style={{
            left: mousePosition.x - 100,
            top: mousePosition.y - 60,
          }}
        >
          <div className="font-medium">
            {daysOfWeek[hoveredCell.day]} at {formatHour(hoveredCell.hour)}
          </div>
          <div>{hoveredCell.value} active users</div>
        </div>
      )}
    </div>
  );
}
