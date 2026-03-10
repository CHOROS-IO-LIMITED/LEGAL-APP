import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePagination } from '@/hooks/Shared/usePagination';
import { CheckCircle2, Clock, Eye, FileSignature, FileText, FolderOpen, SquarePen, XCircle } from 'lucide-react';
import { useMemo } from 'react';
import type { DocumentItem, DocumentStatus } from './Index';

type Props = {
    items: DocumentItem[];
    pageSize?: number;
    currentUserEmail: string;
    onReview?: (item: DocumentItem) => void;
    onViewCompleted?: (item: DocumentItem) => void;
};

const STATUS: Record<
    DocumentStatus,
    {
        label: string;
        pillClassName: string;
        Icon: React.ElementType;
        actionLabel: string;
        action: 'review' | 'sign' | 'view_completed';
    }
> = {
    draft: {
        label: 'Draft',
        pillClassName: 'rounded-full border px-2.5 py-1 text-xs bg-[#F4F1FF] text-[#6D5BD0] border-[#DDD6FE]',
        Icon: SquarePen,
        actionLabel: 'Review',
        action: 'review',
    },
    pending_lawyer_review: {
        label: 'Waiting Approval',
        pillClassName: 'rounded-full border px-2.5 py-1 text-xs bg-[#FFF7E6] text-[#B7791F] border-[#F6E4B5]',
        Icon: Clock,
        actionLabel: 'View',
        action: 'review',
    },
    rejected: {
        label: 'Rejected',
        pillClassName: 'rounded-full border px-2.5 py-1 text-xs bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
        Icon: XCircle,
        actionLabel: 'Review',
        action: 'review',
    },
    awaiting_signatures: {
        label: 'Awaiting Signatures',
        pillClassName: 'rounded-full border px-2.5 py-1 text-xs bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]',
        Icon: FileSignature,
        actionLabel: 'View',
        action: 'sign',
    },
    partially_signed: {
        label: 'Partially Signed',
        pillClassName: 'rounded-full border px-2.5 py-1 text-xs bg-[#EEFDF3] text-[#15803D] border-[#BBF7D0]',
        Icon: FileSignature,
        actionLabel: 'View',
        action: 'sign',
    },
    completed: {
        label: 'Completed',
        pillClassName: 'rounded-full border px-2.5 py-1 text-xs bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]',
        Icon: CheckCircle2,
        actionLabel: 'View',
        action: 'view_completed',
    },
};

export default function DocumentTable({ items, pageSize = 5, onReview, onViewCompleted }: Props) {
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
                        <div className="p-6 text-sm text-[#6B635B]">No documents yet.</div>
                    ) : (
                        rows.map((doc) => {
                            const meta = STATUS[doc.status];
                            const StatusIcon = meta.Icon;

                            const actionButton =
                                meta.action === 'view_completed' ? (
                                    <button
                                        type="button"
                                        onClick={() => onViewCompleted?.(doc)}
                                        className="inline-flex items-center gap-2 rounded-xl bg-[#3D2B1F] px-3.5 py-2 text-sm font-medium text-white transition-all hover:bg-[#2E2017] hover:shadow-sm focus:ring-2 focus:ring-[#A68A64]/40 focus:outline-none"
                                    >
                                        <Eye className="h-4 w-4" />
                                        {meta.actionLabel}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => onReview?.(doc)}
                                        className="inline-flex items-center gap-2 rounded-xl bg-[#3D2B1F] px-3.5 py-2 text-sm font-medium text-white transition-all hover:bg-[#2E2017] hover:shadow-sm focus:ring-2 focus:ring-[#A68A64]/40 focus:outline-none"
                                    >
                                        <Eye className="h-4 w-4" />
                                        {meta.actionLabel}
                                    </button>
                                );

                            return (
                                <div key={doc.id} className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-[#F7F3EB]">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="rounded-lg border border-[#E7E1D7] bg-white p-2">
                                            <FileText className="h-4 w-4 text-[#7C7368]" />
                                        </div>

                                        <div className="min-w-0">
                                            <div className="truncate text-sm font-medium text-[#1A1614]">{doc.title}</div>
                                            <div className="truncate text-xs text-[#6B635B]">
                                                {doc.submittedBy} • {doc.submittedAtLabel}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-3">
                                        <span className={`${meta.pillClassName} inline-flex items-center gap-1.5`}>
                                            <StatusIcon className="h-3.5 w-3.5" />
                                            {meta.label}
                                        </span>

                                        {actionButton}
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
