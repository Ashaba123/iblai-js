export const EmptyStats = ({ title = 'No data available' }) => {
  return (
    <div className="flex justify-center items-center h-full">
      <p className="text-gray-500 text-sm">{title}</p>
    </div>
  );
};
