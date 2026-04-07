import { CheckCircle2, Clock3, FileSignature, RotateCcw, type LucideIcon } from 'lucide-react';
import type { DashboardStatus } from './types';

export const DASHBOARD_STATUS_META: Record<
    DashboardStatus,
    {
        label: string;
        pillClassName: string;
        Icon: LucideIcon;
        actionLabel: string;
    }
> = {
    pending_approval: {
        label: 'Pending Review',
        pillClassName: 'inline-flex items-center gap-1.5 border border-[#F6DFAF] bg-[#FFF8E8] px-3 py-1 text-xs font-medium text-[#B7791F]',
        Icon: Clock3,
        actionLabel: 'Review',
    },
    signature: {
        label: 'Signature',
        pillClassName: 'inline-flex items-center gap-1.5 border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1 text-xs font-medium text-[#1D4ED8]',
        Icon: FileSignature,
        actionLabel: 'View',
    },
    rejected: {
        label: 'Needs Amendment',
        pillClassName: 'inline-flex items-center gap-1.5 border border-[#F3C9C9] bg-[#FFF1F1] px-3 py-1 text-xs font-medium text-[#B42318]',
        Icon: RotateCcw,
        actionLabel: 'Review',
    },
    completed: {
        label: 'Completed',
        pillClassName: 'inline-flex items-center gap-1.5 border border-[#A7F3D0] bg-[#ECFDF5] px-3 py-1 text-xs font-medium text-[#059669]',
        Icon: CheckCircle2,
        actionLabel: 'View',
    },
};
