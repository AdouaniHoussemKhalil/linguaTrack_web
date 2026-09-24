import {
  getPaginationRange,
  PAGINATION_ELLIPSIS,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@quickadui/data";

interface ListPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/** Pagination QuickadUI avec libellés accessibles en français. */
export const ListPagination = ({ page, totalPages, onPageChange }: ListPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <Pagination aria-label="Pagination">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            aria-label="Page précédente"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          />
        </PaginationItem>
        {getPaginationRange(page, totalPages).map((item, index) =>
          item === PAGINATION_ELLIPSIS ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <span className="flex size-9 items-center justify-center text-neutral-11" aria-hidden>
                …
              </span>
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                isActive={item === page}
                aria-label={`Page ${item}`}
                onClick={() => onPageChange(item)}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            aria-label="Page suivante"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
