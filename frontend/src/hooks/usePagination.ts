import {useState} from "react";

/**
 * Explicit pagination state. `page` is the requested page; `page` in the
 * returned object is always the clamped, render-safe page in [1, totalPages].
 * Navigation is relative to the clamped page, so stale requests can never
 * strand the UI on a phantom page.
 */
export const usePagination = (itemCount: number, pageSize: number) => {
    const [requestedPage, setRequestedPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(itemCount / pageSize));
    const currentPage = Math.min(requestedPage, totalPages);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, itemCount);

    return {
        page: currentPage,
        totalPages,
        startIndex,
        endIndex,
        canGoPrevious: currentPage > 1,
        canGoNext: currentPage < totalPages,
        goPrevious: () => setRequestedPage(Math.max(1, currentPage - 1)),
        goNext: () => setRequestedPage(Math.min(totalPages, currentPage + 1)),
        reset: () => setRequestedPage(1),
    };
};
