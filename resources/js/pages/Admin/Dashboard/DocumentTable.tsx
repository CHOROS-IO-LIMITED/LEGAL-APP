import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePagination } from '@/hooks/Shared/usePagination';
import { AlertTriangle, CheckCircle2, Clock, Eye, FileText, FolderOpen, XCircle } from 'lucide-react';
import { useMemo } from 'react';

// Possible document workflow statuses
type DocumentStatus = 'pending_review' | 'in_review' | 'approved' | 'rejected';

// Document data structure
type DocumentItem = {
    id: string | number;
    title: string;
    submittedBy: string;
    submittedAtLabel: string;
    status: DocumentStatus;
    isUrgent?: boolean;
};

// Component props
type Props = {
    items: DocumentItem[];
    pageSize?: number;
    onReview?: (item: DocumentItem) => void;
};

// Status configuration (label, icon, styles, review permission)
const STATUS: Record<
    DocumentStatus,
    {
        label: string;
        pillClassName: string;
        Icon: React.ElementType;
        canReview: boolean;
    }
> = {
    pending_review: {
        label: 'Pending Review',
        pillClassName: 'rounded-full border px-2.5 py-1 text-xs bg-[#FFF7E6] text-[#B7791F] border-[#F6E4B5]',
        Icon: Clock,
        canReview: true,
    },
    in_review: {
        label: 'In Review',
        pillClassName: 'rounded-full border px-2.5 py-1 text-xs bg-[#EEF2FF] text-[#4F46E5] border-[#C7D2FE]',
        Icon: Eye,
        canReview: true,
    },
    approved: {
        label: 'Approved',
        pillClassName: 'rounded-full border px-2.5 py-1 text-xs bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]',
        Icon: CheckCircle2,
        canReview: false,
    },
    rejected: {
        label: 'Rejected',
        pillClassName: 'rounded-full border px-2.5 py-1 text-xs bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
        Icon: XCircle,
        canReview: false,
    },
};

export default function DocumentTable({ items, pageSize = 5, onReview }: Props) {
    // Pagination logic handled by custom hook
    const pager = usePagination(items, pageSize);

    // Items for the current page
    const rows = pager.paginatedItems;

    // Check if there are no documents
    const empty = useMemo(() => items.length === 0, [items.length]);

    return (
        <Card className="border-[#E7E1D7] bg-white">
            {/* Table header */}
            <CardHeader className="border-b border-[#E7E1D7] pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-[#1A1614]">
                    <FolderOpen className="h-4 w-4 text-[#7C7368]" />
                    Document Queue
                </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
                <div className="divide-y divide-[#E7E1D7]">
                    {/* Empty state */}
                    {empty ? (
                        <div className="p-6 text-sm text-[#6B635B]">No documents in queue.</div>
                    ) : (
                        // Render paginated document rows
                        rows.map((doc) => {
                            const meta = STATUS[doc.status];
                            const StatusIcon = meta.Icon;

                            return (
                                <div key={doc.id} className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-[#F7F3EB]">
                                    {/* Left section: icon + document info */}
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
                                                {/* Document title */}
                                                <div className="truncate text-sm font-medium text-[#1A1614]">{doc.title}</div>

                                                {/* Urgent indicator */}
                                                {doc.isUrgent ? (
                                                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#F6E4B5] bg-[#FFF7E6] px-2 py-0.5 text-[11px] font-medium text-[#B7791F]">
                                                        <AlertTriangle className="h-3 w-3" />
                                                        Urgent
                                                    </span>
                                                ) : null}
                                            </div>

                                            {/* Submission info */}
                                            <div className="truncate text-xs text-[#6B635B]">
                                                {doc.submittedBy} • {doc.submittedAtLabel}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right section: status + review action */}
                                    <div className="flex shrink-0 items-center gap-3">
                                        {/* Status badge */}
                                        <span className={`${meta.pillClassName} inline-flex items-center gap-1.5`}>
                                            <StatusIcon className="h-3.5 w-3.5" />
                                            {meta.label}
                                        </span>

                                        {/* Review button (only if allowed) */}
                                        {meta.canReview && (
                                            <button
                                                type="button"
                                                onClick={() => onReview?.(doc)}
                                                className="inline-flex items-center gap-2 rounded-lg bg-[#3D2B1F] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2E2017] focus:ring-2 focus:ring-[#A68A64]/40 focus:outline-none"
                                            >
                                                <Eye className="h-4 w-4" />
                                                Review
                                            </button>
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
                        {/* Record count */}
                        <div className="text-xs text-[#6B635B]">
                            Showing {pager.showingFrom}-{pager.showingTo} of {pager.totalCount}
                        </div>

                        {/* Pagination controls */}
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={pager.prev}
                                disabled={!pager.canPrev}
                                className="rounded-lg border border-[#E7E1D7] bg-white px-3 py-1.5 text-sm text-[#1A1614] disabled:opacity-50"
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
                                className="rounded-lg border border-[#E7E1D7] bg-white px-3 py-1.5 text-sm text-[#1A1614] disabled:opacity-50"
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
