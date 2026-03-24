import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePagination } from '@/hooks/Shared/usePagination';
import { DASHBOARD_STATUS_META } from '@/types/User/Dashboard/status';
import type { DocumentItem } from '@/types/User/Dashboard/types';
import { Eye, FileText, FolderOpen } from 'lucide-react';
import { useMemo } from 'react';

type Props = {
    items: DocumentItem[];
    pageSize?: number;
    onOpen: (item: DocumentItem) => void;
};

export default function DocumentTable({ items, pageSize = 5, onOpen }: Props) {
    const pager = usePagination(items, pageSize);
    const rows = pager.paginatedItems;
    const empty = useMemo(() => items.length === 0, [items.length]);

    return (
        <Card className="border-[#E7E1D7] bg-white shadow-sm">
            <CardHeader className="border-b border-[#E7E1D7] pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-[#1A1614]">
                    <FolderOpen className="h-4 w-4 text-[#7C7368]" />
                    My Documents
                </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
                <div className="divide-y divide-[#E7E1D7]">
                    {empty ? (
                        <div className="p-6 text-sm text-[#6B635B]">No generated documents yet.</div>
                    ) : (
                        rows.map((doc) => {
                            const meta = DASHBOARD_STATUS_META[doc.dashboardStatus];
                            const StatusIcon = meta.Icon;

                            return (
                                <div key={doc.id} className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-[#F7F3EB]">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="rounded-lg border border-[#E7E1D7] bg-white p-2">
                                            <FileText className="h-4 w-4 text-[#7C7368]" />
                                        </div>

                                        <div className="min-w-0">
                                            <div className="truncate text-sm font-medium text-[#1A1614]">{doc.title}</div>
                                            <div className="truncate text-xs text-[#6B635B]">
                                                {doc.client.name ?? 'Client'} • {doc.createdAtLabel ?? 'N/A'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-3">
                                        <span className={meta.pillClassName}>
                                            <StatusIcon className="h-3.5 w-3.5" />
                                            {meta.label}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => onOpen(doc)}
                                            className="inline-flex items-center gap-2 rounded-xl bg-[#3D2B1F] px-3.5 py-2 text-sm font-medium text-white transition-all hover:bg-[#2E2017] hover:shadow-sm focus:ring-2 focus:ring-[#A68A64]/40 focus:outline-none"
                                        >
                                            <Eye className="h-4 w-4" />
                                            {meta.actionLabel}
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {!empty ? (
                    <div className="flex items-center justify-between gap-3 border-t border-[#E7E1D7] bg-white px-6 py-3">
                        <div className="text-xs text-[#6B635B]">
                            Showing {pager.showingFrom}-{pager.showingTo} of {pager.totalCount}
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={pager.prev}
                                disabled={!pager.canPrev}
                                className="rounded-lg border border-[#E7E1D7] bg-white px-3 py-1.5 text-sm text-[#1A1614] transition-colors hover:bg-[#F7F3EB] disabled:opacity-50"
                            >
                                Prev
                            </button>

                            <div className="text-xs text-[#6B635B]">
                                Page {pager.page} of {pager.totalPages}
                            </div>

                            <button
                                type="button"
                                onClick={pager.next}
                                disabled={!pager.canNext}
                                className="rounded-lg border border-[#E7E1D7] bg-white px-3 py-1.5 text-sm text-[#1A1614] transition-colors hover:bg-[#F7F3EB] disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                ) : null}
            </CardContent>
        </Card>
    );
}
