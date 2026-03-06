import { useEffect, useMemo, useState } from 'react';

export function usePagination<T>(items: T[], initialPageSize = 10) {
    // Current page size and page number
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [page, setPage] = useState(1);

    // Total number of pages
    const totalPages = useMemo(() => Math.max(1, Math.ceil(items.length / pageSize)), [items.length, pageSize]);

    // Reset page if it exceeds total pages
    useEffect(() => {
        if (page > totalPages) setPage(1);
    }, [page, totalPages]);

    // Reset to first page when data or page size changes
    useEffect(() => {
        setPage(1);
    }, [items.length, pageSize]);

    // Slice items for the current page
    const paginatedItems = useMemo(() => {
        const start = (page - 1) * pageSize;
        return items.slice(start, start + pageSize);
    }, [items, page, pageSize]);

    // Range of currently visible items
    const showingFrom = items.length === 0 ? 0 : (page - 1) * pageSize + 1;
    const showingTo = Math.min(page * pageSize, items.length);

    // Navigation helpers
    const prev = () => setPage((p) => Math.max(1, p - 1));
    const next = () => setPage((p) => Math.min(totalPages, p + 1));

    return {
        page,
        setPage,
        pageSize,
        setPageSize,
        totalPages,
        paginatedItems,
        showingFrom,
        showingTo,
        canPrev: page > 1,
        canNext: page < totalPages,
        prev,
        next,
        totalCount: items.length,
    };
}
