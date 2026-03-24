import { CheckCircle2, Clock, FileSignature, SquarePen, XCircle, type LucideIcon } from 'lucide-react';
import type { DashboardStatus } from './types';

export const DASHBOARD_STATUS_META: Record<
    DashboardStatus,
    {
        label: string;
        Icon: LucideIcon;
        pillClassName: string;
        actionLabel: string;
        action: 'review' | 'sign' | 'completed';
    }
> = {
    draft: {
        label: 'Draft',
        Icon: SquarePen,
        pillClassName:
            'inline-flex items-center gap-1.5 rounded-full border border-[#DDD6FE] bg-[#F4F1FF] px-3 py-1 text-xs font-medium text-[#6D5BD0]',
        actionLabel: 'Review',
        action: 'review',
    },
    pending_approval: {
        label: 'Pending Approval',
        Icon: Clock,
        pillClassName:
            'inline-flex items-center gap-1.5 rounded-full border border-[#F6E4B5] bg-[#FFF7E6] px-3 py-1 text-xs font-medium text-[#B7791F]',
        actionLabel: 'View',
        action: 'review',
    },
    signature: {
        label: 'Signature',
        Icon: FileSignature,
        pillClassName:
            'inline-flex items-center gap-1.5 rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1 text-xs font-medium text-[#1D4ED8]',
        actionLabel: 'View',
        action: 'sign',
    },
    rejected: {
        label: 'Rejected',
        Icon: XCircle,
        pillClassName:
            'inline-flex items-center gap-1.5 rounded-full border border-[#FECACA] bg-[#FEF2F2] px-3 py-1 text-xs font-medium text-[#DC2626]',
        actionLabel: 'Review',
        action: 'review',
    },
    completed: {
        label: 'Completed',
        Icon: CheckCircle2,
        pillClassName:
            'inline-flex items-center gap-1.5 rounded-full border border-[#A7F3D0] bg-[#ECFDF5] px-3 py-1 text-xs font-medium text-[#059669]',
        actionLabel: 'View',
        action: 'completed',
    },
};
