import { useEffect, useMemo, useState } from 'react';

export function usePagination<T>(items: T[], initialPageSize = 10) {
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [page, setPage] = useState(1);

    const totalPages = useMemo(() => Math.max(1, Math.ceil(items.length / pageSize)), [items.length, pageSize]);

    useEffect(() => {
        if (page > totalPages) setPage(1);
    }, [page, totalPages]);

    useEffect(() => {
        setPage(1);
    }, [items.length, pageSize]);

    const paginatedItems = useMemo(() => {
        const start = (page - 1) * pageSize;
        return items.slice(start, start + pageSize);
    }, [items, page, pageSize]);

    const showingFrom = items.length === 0 ? 0 : (page - 1) * pageSize + 1;
    const showingTo = Math.min(page * pageSize, items.length);

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
