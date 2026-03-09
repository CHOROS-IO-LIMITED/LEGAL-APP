import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePagination } from '@/hooks/Shared/usePagination';
import { AlertTriangle, CheckCircle2, Clock, Eye, FileText, FolderOpen, XCircle } from 'lucide-react';
import { useMemo } from 'react';
import type { DocumentItem, DocumentStatus } from './Index';

type Props = {
    items: DocumentItem[];
    pageSize?: number;
    onReview?: (item: DocumentItem) => void;
    onViewCompleted?: (item: DocumentItem) => void;
    onDownload?: (item: DocumentItem) => void;
};

const STATUS: Record<
    DocumentStatus,
    {
        label: string;
        pillClassName: string;
        Icon: React.ElementType;
        action: 'review' | 'view_download' | 'none';
    }
> = {
    pending_review: {
        label: 'Pending Review',
        pillClassName: 'rounded-full border px-2.5 py-1 text-xs bg-[#FFF7E6] text-[#B7791F] border-[#F6E4B5]',
        Icon: Clock,
        action: 'review',
    },
    in_review: {
        label: 'In Review',
        pillClassName: 'rounded-full border px-2.5 py-1 text-xs bg-[#EEF2FF] text-[#4F46E5] border-[#C7D2FE]',
        Icon: Eye,
        action: 'review',
    },
    awaiting_signature: {
        label: 'Awaiting Signature',
        pillClassName: 'rounded-full border px-2.5 py-1 text-xs bg-[#FFF7E6] text-[#B7791F] border-[#F6E4B5]',
        Icon: Clock,
        action: 'none',
    },
    completed: {
        label: 'Completed',
        pillClassName: 'rounded-full border px-2.5 py-1 text-xs bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]',
        Icon: CheckCircle2,
        action: 'view_download',
    },
    rejected: {
        label: 'Rejected',
        pillClassName: 'rounded-full border px-2.5 py-1 text-xs bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
        Icon: XCircle,
        action: 'none',
    },
};

export default function DocumentTable({ items, pageSize = 5, onReview, onViewCompleted, onDownload }: Props) {
    const pager = usePagination(items, pageSize);
    const rows = pager.paginatedItems;
    const empty = useMemo(() => items.length === 0, [items.length]);

    return (
        <Card className="border-[#E7E1D7] bg-white shadow-sm">
            {/* Card Header: Document Title */}
            <CardHeader className="border-b border-[#E7E1D7] pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-[#1A1614]">
                    <FolderOpen className="h-4 w-4 text-[#7C7368]" />
                    Document Queue
                </CardTitle>
            </CardHeader>

            {/* Card Content: Document list or empty state */}
            <CardContent className="p-0">
                <div className="divide-y divide-[#E7E1D7]">
                    {empty ? (
                        <div className="p-6 text-sm text-[#6B635B]">No documents in queue.</div>
                    ) : (
                        rows.map((doc) => {
                            const meta = STATUS[doc.status];
                            const StatusIcon = meta.Icon;

                            return (
                                <div key={doc.id} className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-[#F7F3EB]">
                                    {/* Left: Document info and urgency badge */}
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div
                                            className={['rounded-lg border border-[#E7E1D7] p-2', doc.isUrgent ? 'bg-[#FFF7E6]' : 'bg-white'].join(
                                                ' ',
                                            )}
                                        >
                                            <FileText className="h-4 w-4 text-[#7C7368]" />
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex min-w-0 items-center gap-2">
                                                <div className="truncate text-sm font-medium text-[#1A1614]">{doc.title}</div>

                                                {doc.isUrgent ? (
                                                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#F6E4B5] bg-[#FFF7E6] px-2 py-0.5 text-[11px] font-medium text-[#B7791F]">
                                                        <AlertTriangle className="h-3 w-3" />
                                                        Urgent
                                                    </span>
                                                ) : null}
                                            </div>

                                            <div className="truncate text-xs text-[#6B635B]">
                                                {doc.submittedBy} • {doc.submittedAtLabel}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Status pill and review button */}
                                    <div className="flex shrink-0 items-center gap-3">
                                        <span className={`${meta.pillClassName} inline-flex items-center gap-1.5`}>
                                            <StatusIcon className="h-3.5 w-3.5" />
                                            {meta.label}
                                        </span>

                                        {meta.action === 'review' && (
                                            <button
                                                type="button"
                                                onClick={() => onReview?.(doc)}
                                                className="inline-flex items-center gap-2 rounded-xl bg-[#3D2B1F] px-3.5 py-2 text-sm font-medium text-white transition-all hover:bg-[#2E2017] hover:shadow-sm focus:ring-2 focus:ring-[#A68A64]/40 focus:outline-none"
                                            >
                                                <Eye className="h-4 w-4" />
                                                Review
                                            </button>
                                        )}

                                        {meta.action === 'view_download' && (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => onViewCompleted?.(doc)}
                                                    className="inline-flex items-center gap-2 rounded-xl bg-[#3D2B1F] px-3.5 py-2 text-sm font-medium text-white transition-all hover:bg-[#2E2017] hover:shadow-sm focus:ring-2 focus:ring-[#A68A64]/40 focus:outline-none"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    View
                                                </button>
                                                {/* 
                                                <button
                                                    type="button"
                                                    onClick={() => onDownload?.(doc)}
                                                    className="group inline-flex h-9 items-center gap-2 rounded-lg border border-[#E2DBD2] bg-white px-3 text-sm font-medium text-[#2F2A26] shadow-sm transition-all duration-200 hover:border-[#CDBBA4] hover:bg-[#FCFAF6] hover:shadow-md focus:ring-2 focus:ring-[#A68A64]/20 focus:outline-none"
                                                >
                                                    <Download className="h-4 w-4" />
                                                    Download
                                                </button> */}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Pagination footer */}
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
