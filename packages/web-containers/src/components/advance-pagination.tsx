import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@web-containers/components/ui/pagination";

interface AdvancedPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export const AdvancedPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: AdvancedPaginationProps) => {
  const generateRange = (): (number | string)[] => {
    const totalNumbers = siblingCount * 2 + 5;
    if (totalPages <= totalNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const range: (number | string)[] = [];
    const left = Math.max(currentPage - siblingCount, 2);
    const right = Math.min(currentPage + siblingCount, totalPages - 1);

    range.push(1);
    if (left > 2) range.push("...");
    for (let i = left; i <= right; i++) range.push(i);
    if (right < totalPages - 1) range.push("...");
    range.push(totalPages);

    return range;
  };

  const pages = generateRange();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>

        {pages.map((page, index) => (
          <PaginationItem key={index}>
            {page === "..." ? (
              <span className="px-2 text-gray-400">...</span>
            ) : (
              <PaginationLink
                onClick={() => onPageChange(Number(page))}
                className={
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "text-blue-500 hover:underline"
                }
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() =>
              currentPage < totalPages && onPageChange(currentPage + 1)
            }
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
