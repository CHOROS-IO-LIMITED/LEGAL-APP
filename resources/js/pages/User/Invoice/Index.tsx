import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import UserLayout from '@/layouts/user-layout';
import { CreditCard, FileClock, FileDown, Receipt, ReceiptText, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface User {
    name: string;
    email: string;
}

interface Props {
    user: User;
}

export default function InvoiceIndex({ user }: Props) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sort, setSort] = useState('recent');
    const [page, setPage] = useState(1);
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

    const baseInvoices = [
        {
            invoice: 'INV-1001',
            id: 'DOC-1001',
            documents: ['Employment Contract', 'NDA Agreement', 'Service Agreement'],
            quantity: 3,
            amount: 117,
            status: 'Paid',
            issued: 'Mar 10, 2026',
        },
        {
            invoice: 'INV-1002',
            id: 'DOC-1002',
            documents: ['NDA Agreement'],
            quantity: 1,
            amount: 29,
            status: 'Pending',
            issued: 'Mar 09, 2026',
        },
        {
            invoice: 'INV-1003',
            id: 'DOC-1003',
            documents: ['Contractor Agreement', 'Employment Contract', 'Partnership Agreement'],
            quantity: 3,
            amount: 96,
            status: 'Paid',
            issued: 'Mar 08, 2026',
        },
    ];

    const invoices = Array.from({ length: 40 }, (_, i) => {
        const base = baseInvoices[i % baseInvoices.length];

        return {
            ...base,
            id: `DOC-${1000 + i}`,
            invoice: `INV-${1000 + i}`,
        };
    });

    const filteredInvoices = invoices
        .filter((invoice) => {
            const q = search.toLowerCase();
            return (
                invoice.invoice.toLowerCase().includes(q) ||
                invoice.id.toLowerCase().includes(q) ||
                invoice.documents.join(' ').toLowerCase().includes(q)
            );
        })
        .filter((invoice) => {
            if (statusFilter === 'all') return true;
            return invoice.status.toLowerCase() === statusFilter;
        })
        .sort((a, b) => {
            switch (sort) {
                case 'highest':
                    return b.amount - a.amount;
                case 'lowest':
                    return a.amount - b.amount;
                case 'oldest':
                    return a.invoice.localeCompare(b.invoice);
                default:
                    return b.invoice.localeCompare(a.invoice);
            }
        });

    const ITEMS_PER_PAGE = 7;
    const totalPages = Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE);

    const paginatedInvoices = filteredInvoices.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const toggleRow = (id: string) => {
        setExpandedRows((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <UserLayout user={user}>
            <main className="flex-1 overflow-y-auto bg-[#FCF9F2] p-4 md:p-6">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                    {/* Header */}
                    <div className="border border-[#E7E1D7] bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-2xl font-semibold tracking-tight text-[#1A1614]">My Invoices</h1>
                                <p className="text-sm text-[#6B635B]">View and manage all your invoices, payments, and billing history.</p>
                            </div>

                            <Button className="inline-flex cursor-pointer items-center gap-2 rounded-none bg-[#3D2B1F] px-4 text-sm text-white shadow-sm hover:bg-[#2E2017] hover:shadow-md focus:ring-2 focus:ring-[#3D2B1F]/20">
                                <FileDown className="h-4 w-4" />
                                Export Invoices
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="rounded-none">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-[#6B635B]">Total Invoices</CardTitle>

                                <div className="flex h-8 w-8 items-center justify-center border border-[#E7E1D7] bg-[#F2EDE4]">
                                    <Receipt className="h-4 w-4 text-[#A68A64]" />
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="text-2xl font-bold text-[#1A1614]">12</div>
                                <p className="text-xs text-[#6B635B]">Invoices created</p>
                            </CardContent>
                        </Card>

                        <Card className="rounded-none">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-[#6B635B]">Paid Invoices</CardTitle>

                                <div className="flex h-8 w-8 items-center justify-center border border-[#E7E1D7] bg-[#F2EDE4]">
                                    <CreditCard className="h-4 w-4 text-[#A68A64]" />
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="text-2xl font-bold text-[#1A1614]">8</div>
                                <p className="text-xs text-[#6B635B]">Payments completed</p>
                            </CardContent>
                        </Card>

                        <Card className="rounded-none">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-[#6B635B]">Pending Payments</CardTitle>

                                <div className="flex h-8 w-8 items-center justify-center border border-[#E7E1D7] bg-[#F2EDE4]">
                                    <FileClock className="h-4 w-4 text-[#A68A64]" />
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="text-2xl font-bold text-[#1A1614]">3</div>
                                <p className="text-xs text-[#6B635B]">Awaiting payment</p>
                            </CardContent>
                        </Card>

                        <Card className="rounded-none">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-[#6B635B]">Total Spent</CardTitle>

                                <div className="flex h-8 w-8 items-center justify-center border border-[#E7E1D7] bg-[#F2EDE4]">
                                    <TrendingUp className="h-4 w-4 text-[#A68A64]" />
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="text-2xl font-bold text-[#1A1614]">£1,240</div>
                                <p className="text-xs text-[#6B635B]">Total amount spent on documents</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="w-full md:max-w-sm">
                            <Input
                                placeholder="Search invoices..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                className="rounded-none border-[#E7E1D7] bg-white"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Select
                                value={statusFilter}
                                onValueChange={(v) => {
                                    setStatusFilter(v);
                                    setPage(1);
                                }}
                            >
                                <SelectTrigger className="w-[140px] rounded-none border-[#E7E1D7] bg-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all" className="rounded-none">
                                        All Status
                                    </SelectItem>
                                    <SelectItem value="paid" className="rounded-none">
                                        Paid
                                    </SelectItem>
                                    <SelectItem value="pending" className="rounded-none">
                                        Pending
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={sort}
                                onValueChange={(v) => {
                                    setSort(v);
                                    setPage(1);
                                }}
                            >
                                <SelectTrigger className="w-[160px] rounded-none border-[#E7E1D7] bg-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="recent" className="rounded-none">
                                        Newest First
                                    </SelectItem>
                                    <SelectItem value="oldest" className="rounded-none">
                                        Oldest First
                                    </SelectItem>
                                    <SelectItem value="highest" className="rounded-none">
                                        Highest Amount
                                    </SelectItem>
                                    <SelectItem value="lowest" className="rounded-none">
                                        Lowest Amount
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Table */}
                    <Card className="rounded-none">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-[#E7E1D7]">
                            <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                <ReceiptText className="h-4 w-4 text-[#3D2B1F]" />
                                Invoices ({filteredInvoices.length})
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-[#F8F4EC] hover:bg-[#F8F4EC]">
                                        <TableHead>Invoice No.</TableHead>
                                        <TableHead>Docs No.</TableHead>
                                        <TableHead>Documents</TableHead>
                                        <TableHead className="text-center">Quantity</TableHead>
                                        <TableHead className="text-center">Amount</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                        <TableHead className="text-center">Issued</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {paginatedInvoices.map((invoice) => (
                                        <TableRow key={invoice.id} className="hover:bg-[#FAF6EF]">
                                            <TableCell className="font-medium text-[#1A1614]">{invoice.invoice}</TableCell>

                                            <TableCell className="font-medium text-[#1A1614]">{invoice.id}</TableCell>

                                            <TableCell className="max-w-[240px]">
                                                {expandedRows[invoice.id] ? (
                                                    <div className="flex flex-col gap-1">
                                                        {invoice.documents.map((doc, i) => (
                                                            <span key={i}>{doc}</span>
                                                        ))}

                                                        {invoice.documents.length > 2 && (
                                                            <button
                                                                onClick={() => toggleRow(invoice.id)}
                                                                className="cursor-pointer text-xs text-[#6B635B] underline"
                                                            >
                                                                Show less
                                                            </button>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-wrap items-center gap-1">
                                                        {invoice.documents.slice(0, 2).map((doc, i) => (
                                                            <span key={i}>
                                                                {doc}
                                                                {i < Math.min(invoice.documents.length, 2) - 1 && ','}
                                                            </span>
                                                        ))}

                                                        {invoice.documents.length > 2 && (
                                                            <button
                                                                onClick={() => toggleRow(invoice.id)}
                                                                className="cursor-pointer text-xs text-[#6B635B] underline"
                                                            >
                                                                +{invoice.documents.length - 2} more
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </TableCell>

                                            <TableCell className="text-center">{invoice.quantity}</TableCell>

                                            <TableCell className="text-center font-medium">£{invoice.amount}</TableCell>

                                            <TableCell className="text-center">
                                                {invoice.status === 'Paid' ? (
                                                    <span className="bg-green-100 px-2 py-1 text-xs font-medium text-green-700">Paid</span>
                                                ) : (
                                                    <span className="bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">Pending</span>
                                                )}
                                            </TableCell>

                                            <TableCell className="text-center text-[#6B635B]">{invoice.issued}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>

                        <div className="flex flex-col items-center justify-between border-t border-[#E7E1D7] px-4 py-4 text-sm text-[#6B635B] md:flex-row md:px-6">
                            <span className="mb-2 text-center md:mb-0 md:text-left">
                                Showing <span className="font-medium text-[#1A1614]">{(page - 1) * ITEMS_PER_PAGE + 1}</span> –{' '}
                                <span className="font-medium text-[#1A1614]">{Math.min(page * ITEMS_PER_PAGE, filteredInvoices.length)}</span> of{' '}
                                <span className="font-medium text-[#1A1614]">{filteredInvoices.length}</span>
                            </span>

                            <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                <Button
                                    variant="outline"
                                    className="rounded-none"
                                    size="sm"
                                    disabled={page === 1}
                                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                >
                                    Prev
                                </Button>

                                <span className="text-center">
                                    Page <span className="font-medium text-[#1A1614]">{page}</span> of{' '}
                                    <span className="font-medium text-[#1A1614]">{totalPages}</span>
                                </span>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page === totalPages}
                                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                                    className="rounded-none"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </main>
        </UserLayout>
    );
}
