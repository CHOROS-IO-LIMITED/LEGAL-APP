import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DASHBOARD_STATUS_META } from '@/types/Admin/Dashboard/status';
import type { DocumentItem } from '@/types/Admin/Dashboard/types';
import { ArrowLeft, ArrowRight, Eye, FileText, FolderOpen, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

type Props = {
    items: DocumentItem[];
    pageSize?: number;
    onOpen: (document: DocumentItem) => void;
};

export default function DocumentTable({ items, pageSize = 8, onOpen }: Props) {
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | DocumentItem['dashboardStatus']>('all');

    const filteredItems = useMemo(() => {
        const keyword = query.trim().toLowerCase();

        return items.filter((item) => {
            const matchesQuery =
                keyword.length === 0 ||
                item.title.toLowerCase().includes(keyword) ||
                (item.client.name ?? '').toLowerCase().includes(keyword) ||
                (item.client.email ?? '').toLowerCase().includes(keyword);

            const matchesStatus = statusFilter === 'all' || item.dashboardStatus === statusFilter;

            return matchesQuery && matchesStatus;
        });
    }, [items, query, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));

    const paginatedItems = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredItems.slice(start, start + pageSize);
    }, [filteredItems, page, pageSize]);

    function handlePrev() {
        setPage((current) => Math.max(1, current - 1));
    }

    function handleNext() {
        setPage((current) => Math.min(totalPages, current + 1));
    }

    function handleQueryChange(value: string) {
        setQuery(value);
        setPage(1);
    }

    function handleStatusChange(value: 'all' | DocumentItem['dashboardStatus']) {
        setStatusFilter(value);
        setPage(1);
    }

    return (
        <Card className="border-[#E7E1D7] bg-white shadow-sm">
            <CardHeader className="border-b border-[#EFE7DB] px-6 pt-5 pb-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#1A1614]">
                        <FolderOpen className="h-5 w-5 text-[#7C7368]" />
                        Documents Queue
                    </CardTitle>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="flex items-center gap-2 rounded-xl border border-[#E2DBD2] bg-[#FCFAF6] px-3 py-2">
                            <Search className="h-4 w-4 text-[#7C7368]" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => handleQueryChange(e.target.value)}
                                placeholder="Search title, client, email..."
                                className="w-full min-w-[220px] bg-transparent text-sm text-[#1A1614] outline-none"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => handleStatusChange(e.target.value as 'all' | DocumentItem['dashboardStatus'])}
                            className="rounded-xl border border-[#E2DBD2] bg-[#FCFAF6] px-3 py-2 text-sm text-[#1A1614] outline-none"
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending_approval">Pending Review</option>
                            <option value="signature">Signature</option>
                            <option value="rejected">Needs Amendment</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-[#EFE7DB] bg-[#FCFAF6]">
                                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wide text-[#6B635B] uppercase">Document</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wide text-[#6B635B] uppercase">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wide text-[#6B635B] uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wide text-[#6B635B] uppercase">Submitted</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wide text-[#6B635B] uppercase">Updated</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold tracking-wide text-[#6B635B] uppercase">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedItems.length > 0 ? (
                                paginatedItems.map((item) => {
                                    const statusMeta = DASHBOARD_STATUS_META[item.dashboardStatus];
                                    const StatusIcon = statusMeta.Icon;

                                    return (
                                        <tr key={item.id} className="border-b border-[#F4EEE5] last:border-b-0">
                                            <td className="px-6 py-4 align-top">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E7E1D7] bg-white">
                                                        <FileText className="h-4 w-4 text-[#7C7368]" />
                                                    </div>

                                                    <div className="flex flex-col gap-1">
                                                        <p className="text-sm font-medium text-[#1A1614]">{item.title}</p>
                                                        <p className="text-xs text-[#8A8178]">Created {item.createdAtLabel ?? 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 align-top">
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-sm text-[#1A1614]">{item.client.name ?? 'N/A'}</p>
                                                    <p className="text-xs text-[#8A8178]">{item.client.email ?? 'N/A'}</p>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 align-top">
                                                <span className={statusMeta.pillClassName}>
                                                    <StatusIcon className="h-3.5 w-3.5" />
                                                    {statusMeta.label}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 align-top text-sm text-[#3B332E]">{item.submittedAtLabel ?? 'N/A'}</td>

                                            <td className="px-6 py-4 align-top text-sm text-[#3B332E]">{item.updatedAtLabel ?? 'N/A'}</td>

                                            <td className="px-6 py-4 text-right align-top">
                                                <button
                                                    type="button"
                                                    onClick={() => onOpen(item)}
                                                    className="inline-flex items-center gap-2 rounded-xl bg-[#3D2B1F] px-3.5 py-2 text-sm font-medium text-white transition-all hover:bg-[#2E2017] hover:shadow-sm focus:ring-2 focus:ring-[#A68A64]/40 focus:outline-none"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    {statusMeta.actionLabel}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-[#6B635B]">
                                        No documents found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between border-t border-[#EFE7DB] px-6 py-4">
                    <p className="text-sm text-[#6B635B]">
                        Showing {paginatedItems.length} of {filteredItems.length} document{filteredItems.length === 1 ? '' : 's'}
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handlePrev}
                            disabled={page === 1}
                            className="inline-flex items-center gap-2 rounded-lg border border-[#E2DBD2] bg-white px-3 py-2 text-sm text-[#2F2A26] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Prev
                        </button>

                        <span className="text-sm text-[#6B635B]">
                            Page {page} of {totalPages}
                        </span>

                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={page === totalPages}
                            className="inline-flex items-center gap-2 rounded-lg border border-[#E2DBD2] bg-white px-3 py-2 text-sm text-[#2F2A26] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Next
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
