import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DASHBOARD_STATUS_META } from '@/types/Admin/Dashboard/status';
import type { DocumentItem } from '@/types/Admin/Dashboard/types';
import { Eye, FileText, FolderOpen } from 'lucide-react';
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

    const handlePrev = () => setPage((p) => Math.max(1, p - 1));
    const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

    return (
        <Card className="rounded-none border-[#E7E1D7] bg-white shadow-sm">
            {/* Filters + Header */}
            <CardHeader className="flex flex-col gap-4 border-b border-[#E7E1D7] px-6 pt-5 pb-4 md:flex-row md:items-center md:justify-between">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-[#1A1614]">
                    <FolderOpen className="h-4 w-4 text-[#3D2B1F]" />
                    Documents Queue ({filteredItems.length})
                </CardTitle>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Search title, client, email..."
                        className="rounded-none border border-[#E7E1D7] bg-white px-3 py-2 text-sm text-[#1A1614] outline-none"
                    />

                    <Select
                        value={statusFilter}
                        onValueChange={(v) => {
                            setStatusFilter(v as 'all' | DocumentItem['dashboardStatus']);
                            setPage(1);
                        }}
                    >
                        <SelectTrigger className="w-[140px] rounded-none border border-[#E7E1D7] bg-white px-3 py-2 text-sm text-[#1A1614]">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>

                        <SelectContent className="rounded-none">
                            <SelectItem value="all" className="rounded-none">
                                All Statuses
                            </SelectItem>
                            <SelectItem value="pending_approval" className="rounded-none">
                                Pending Review
                            </SelectItem>
                            <SelectItem value="signature" className="rounded-none">
                                Signature
                            </SelectItem>
                            <SelectItem value="rejected" className="rounded-none">
                                Needs Amendment
                            </SelectItem>
                            <SelectItem value="completed" className="rounded-none">
                                Completed
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-[#F8F4EC] hover:bg-[#F8F4EC]">
                                <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B635B] uppercase">Document</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B635B] uppercase">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B635B] uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B635B] uppercase">Submitted</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B635B] uppercase">Updated</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-[#6B635B] uppercase">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedItems.length > 0 ? (
                                paginatedItems.map((item) => {
                                    const statusMeta = DASHBOARD_STATUS_META[item.dashboardStatus];
                                    const StatusIcon = statusMeta.Icon;

                                    return (
                                        <tr key={item.id} className="border-b border-[#E7E1D7] last:border-b-0 hover:bg-[#FAF6EF]">
                                            <td className="px-6 py-4">
                                                <div className="flex items-start gap-3 border border-[#E7E1D7] bg-[#FCFAF6] p-2">
                                                    <div className="flex h-10 w-10 items-center justify-center border border-[#E7E1D7] bg-white">
                                                        <FileText className="h-4 w-4 text-[#7C7368]" />
                                                    </div>
                                                    <div className="flex flex-col gap-0.5">
                                                        <p className="truncate text-sm font-medium text-[#1A1614]">{item.title}</p>
                                                        <p className="text-xs text-[#8A8178]">Created {item.createdAtLabel ?? 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-sm text-[#1A1614]">{item.client.name ?? 'N/A'}</p>
                                                    <p className="text-xs text-[#8A8178]">{item.client.email ?? 'N/A'}</p>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className={statusMeta.pillClassName}>
                                                    <StatusIcon className="h-3.5 w-3.5" />
                                                    {statusMeta.label}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-[#3B332E]">{item.submittedAtLabel ?? 'N/A'}</td>
                                            <td className="px-6 py-4 text-sm text-[#3B332E]">{item.updatedAtLabel ?? 'N/A'}</td>

                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => onOpen(item)}
                                                    className="inline-flex cursor-pointer items-center gap-2 rounded-none bg-[#3D2B1F] px-3 py-1 text-sm font-medium text-white hover:bg-[#2E2017] focus:ring-2 focus:ring-[#A68A64]/40 focus:outline-none"
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

                {/* Pagination */}
                <div className="flex flex-col items-center justify-between border-t border-[#E7E1D7] px-4 py-4 text-sm text-[#6B635B] md:flex-row md:px-6">
                    <span className="mb-2 text-center md:mb-0 md:text-left">
                        Showing <span className="font-medium text-[#1A1614]">{(page - 1) * pageSize + 1}</span> –{' '}
                        <span className="font-medium text-[#1A1614]">{Math.min(page * pageSize, filteredItems.length)}</span> of{' '}
                        <span className="font-medium text-[#1A1614]">{filteredItems.length}</span> document{filteredItems.length === 1 ? '' : 's'}
                    </span>

                    <div className="flex flex-wrap items-center gap-2 md:gap-3">
                        <button
                            onClick={handlePrev}
                            disabled={page === 1}
                            className="rounded-none border border-[#E7E1D7] bg-white px-3 py-2 text-sm text-[#2F2A26] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Prev
                        </button>

                        <span className="text-center">
                            Page <span className="font-medium text-[#1A1614]">{page}</span> of{' '}
                            <span className="font-medium text-[#1A1614]">{totalPages}</span>
                        </span>

                        <button
                            onClick={handleNext}
                            disabled={page === totalPages}
                            className="rounded-none border border-[#E7E1D7] bg-white px-3 py-2 text-sm text-[#2F2A26] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
