import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { BarChart3, Calendar, DollarSign, Download, ShoppingCart, TrendingDown, TrendingUp } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface User {
    name: string;
    email: string;
}

interface BillingIndexProps {
    user: User;
}

export default function BillingIndex({ user }: BillingIndexProps) {
    // ui state

    const [search, setSearch] = useState('');
    const [qtyFilter, setQtyFilter] = useState('all-qty');
    const [sort, setSort] = useState('name-a-z');
    const [page, setPage] = useState(1);
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

    // exmple static dataz

    const revenueData = [
        { month: 'Jan', revenue: 1200, orders: 20 },
        { month: 'Feb', revenue: 2100, orders: 32 },
        { month: 'Mar', revenue: 1800, orders: 27 },
        { month: 'Apr', revenue: 2400, orders: 35 },
        { month: 'May', revenue: 3200, orders: 41 },
        { month: 'Jun', revenue: 2900, orders: 45 },
    ];

    const topDocuments = [
        { name: 'Employment Contract', sales: 42 },
        { name: 'NDA Agreement', sales: 35 },
        { name: 'Contractor Agreement', sales: 27 },
        { name: 'Lease Agreement', sales: 21 },
        { name: 'Service Agreement', sales: 18 },
        { name: 'Other Documents', sales: 57 },
    ];

    const baseOrders = [
        {
            invoice: 'INV-1001',
            customer: 'John Smith',
            email: 'john.smith@email.com',
            documents: ['Employment Contract', 'NDA Agreement', 'Partnership Agreement'],
            quantity: 3,
            price: 117,
            status: 'Paid',
        },
        {
            invoice: 'INV-1002',
            customer: 'Emily Johnson',
            email: 'emily.johnson@email.com',
            documents: ['NDA Agreement'],
            quantity: 1,
            price: 29,
            status: 'Paid',
        },
        {
            invoice: 'INV-1003',
            customer: 'Michael Brown',
            email: 'michael.brown@email.com',
            documents: ['Contractor Agreement', 'Lease Agreement', 'Service Agreement', 'Partnership Agreement'],
            quantity: 4,
            price: 156,
            status: 'Pending',
        },
    ];

    const orders = Array.from({ length: 200 }, (_, i) => {
        const base = baseOrders[i % baseOrders.length];

        return {
            ...base,
            id: `DOC-${1000 + i}`,
            invoice: `INV-${1000 + i}`,
        };
    });

    // derived data

    const filteredOrders = orders
        .filter((order) => {
            const query = search.toLowerCase();

            return order.customer.toLowerCase().includes(query) || order.email.toLowerCase().includes(query);
        })
        .filter((order) => {
            if (qtyFilter === 'all-qty') return true;

            const qty = parseInt(qtyFilter.split('-')[0]);
            return order.quantity === qty;
        })
        .sort((a, b) => {
            switch (sort) {
                case 'name-a-z':
                    return a.customer.localeCompare(b.customer);

                case 'name-z-a':
                    return b.customer.localeCompare(a.customer);

                case 'email-a-z':
                    return a.email.localeCompare(b.email);

                case 'email-z-a':
                    return b.email.localeCompare(a.email);

                default:
                    return 0;
            }
        });

    // pagination

    const ITEMS_PER_PAGE = 7;

    const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

    const paginatedOrders = filteredOrders.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    // derived metrics

    const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);

    const totalOrders = revenueData.reduce((sum, item) => sum + item.orders, 0);

    const ordersThisMonth = revenueData[revenueData.length - 1].orders;

    const lastMonthOrders = revenueData[revenueData.length - 2].orders;

    const averageOrderValue = totalRevenue / totalOrders;

    const orderTrend = ((ordersThisMonth - lastMonthOrders) / lastMonthOrders) * 100;

    // handlers

    const toggleRow = (id: string) => {
        setExpandedRows((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <AdminLayout user={user}>
            <main className="flex-1 overflow-y-auto bg-[#FCF9F2] p-4 md:p-6">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-2xl font-semibold tracking-tight text-[#1A1614]">Revenue & Payments</h1>

                            <p className="text-sm text-[#6B635B]">Monitor earnings, track transactions, and manage payment activity.</p>
                        </div>

                        <Button className="bg-[#3D2B1F] text-white hover:bg-[#5A4638]">
                            <Download className="mr-2 h-4 w-4" />
                            Export Report
                        </Button>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {/* Total Revenue */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-[#6B635B]">Total Revenue</CardTitle>

                                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E7E1D7] bg-[#F2EDE4]">
                                    <DollarSign className="h-4 w-4 text-[#A68A64]" />
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="text-2xl font-bold text-[#1A1614]">£{totalRevenue.toLocaleString()}</div>

                                <p className="text-xs text-[#6B635B]">Lifetime revenue</p>
                            </CardContent>
                        </Card>

                        {/* Total Orders */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-[#6B635B]">Total Orders</CardTitle>

                                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E7E1D7] bg-[#F2EDE4]">
                                    <ShoppingCart className="h-4 w-4 text-[#A68A64]" />
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="text-2xl font-bold text-[#1A1614]">{totalOrders}</div>

                                <p className="text-xs text-[#6B635B]">All completed purchases</p>
                            </CardContent>
                        </Card>

                        {/* AOV */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-[#6B635B]">Average Order Value</CardTitle>

                                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E7E1D7] bg-[#F2EDE4]">
                                    <BarChart3 className="h-4 w-4 text-[#A68A64]" />
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="text-2xl font-bold text-[#1A1614]">£{averageOrderValue.toFixed(2)}</div>

                                <p className="text-xs text-[#6B635B]">Average revenue per order</p>
                            </CardContent>
                        </Card>

                        {/* Orders This Month */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-[#6B635B]">Orders This Month</CardTitle>

                                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E7E1D7] bg-[#F2EDE4]">
                                    <Calendar className="h-4 w-4 text-[#A68A64]" />
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="flex items-center gap-2">
                                    <div className="text-2xl font-bold text-[#1A1614]">{ordersThisMonth}</div>

                                    {orderTrend >= 0 ? (
                                        <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                                            <TrendingUp className="h-3.5 w-3.5" />
                                            {orderTrend.toFixed(1)}%
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 text-xs font-medium text-red-600">
                                            <TrendingDown className="h-3.5 w-3.5" />
                                            {Math.abs(orderTrend).toFixed(1)}%
                                        </div>
                                    )}
                                </div>

                                <p className="text-xs text-[#6B635B]">Compared to last month</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts */}
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Revenue Trend */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="text-[#1A1614]">Revenue Trend</CardTitle>
                            </CardHeader>

                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={revenueData}>
                                        <CartesianGrid stroke="#E7E1D7" strokeDasharray="3 3" />

                                        <XAxis dataKey="month" stroke="#6B635B" tick={{ fontSize: 12 }} />

                                        <YAxis stroke="#6B635B" tick={{ fontSize: 12 }} />

                                        <Tooltip
                                            contentStyle={{
                                                fontSize: '12px',
                                                borderRadius: '8px',
                                                border: '1px solid #E7E1D7',
                                            }}
                                        />

                                        <Line type="monotone" dataKey="revenue" stroke="#3D2B1F" strokeWidth={3} dot={{ r: 4 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Top Documents */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-[#1A1614]">Top Legal Documents</CardTitle>
                            </CardHeader>

                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart layout="vertical" data={topDocuments} barCategoryGap="30%">
                                        <XAxis type="number" stroke="#6B635B" tick={{ fontSize: 12 }} />

                                        <YAxis type="category" dataKey="name" stroke="#6B635B" width={90} tick={{ fontSize: 12 }} />

                                        <Tooltip />

                                        <Bar dataKey="sales" fill="#A68A64" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        {/* Search */}
                        <div className="w-full md:max-w-sm">
                            <Input
                                placeholder="Search name of recipients..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                className="border-[#E7E1D7] bg-white"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-2">
                            <Select
                                value={qtyFilter}
                                onValueChange={(value) => {
                                    setQtyFilter(value);
                                    setPage(1);
                                }}
                            >
                                <SelectTrigger className="w-[140px] border-[#E7E1D7] bg-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all-qty">All Qty.</SelectItem>
                                    <SelectItem value="1-qty">1 Qty</SelectItem>
                                    <SelectItem value="2-qty">2 Qty</SelectItem>
                                    <SelectItem value="3-qty">3 Qty</SelectItem>
                                    <SelectItem value="4-qty">4 Qty</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={sort}
                                onValueChange={(value) => {
                                    setSort(value);
                                    setPage(1);
                                }}
                            >
                                <SelectTrigger className="w-[140px] border-[#E7E1D7] bg-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name-a-z">Name A-Z</SelectItem>
                                    <SelectItem value="name-z-a">Name Z-A</SelectItem>
                                    <SelectItem value="email-a-z">Email A-Z</SelectItem>
                                    <SelectItem value="email-z-a">Email Z-A</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between border-b border-[#E7E1D7]">
                            <CardTitle className="text-base font-semibold text-[#1A1614]">
                                Recent Orders <span className="text-[#6B635B]">({filteredOrders.length})</span>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-[#F8F4EC] hover:bg-[#F8F4EC]">
                                        <TableHead className="w-[120px]">Invoice #</TableHead>
                                        <TableHead className="w-[120px]">Document #</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Document</TableHead>
                                        <TableHead className="text-center">Quantity</TableHead>
                                        <TableHead className="text-center">Price</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {paginatedOrders.map((order) => (
                                        <TableRow key={order.id} className="hover:bg-[#FAF6EF]">
                                            <TableCell className="font-medium text-[#1A1614]">{order.invoice}</TableCell>
                                            <TableCell className="font-medium text-[#1A1614]">{order.id}</TableCell>

                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-[#1A1614]">{order.customer}</span>

                                                    <span className="text-xs text-[#6B635B]">{order.email}</span>
                                                </div>
                                            </TableCell>

                                            <TableCell className="max-w-[240px]">
                                                {expandedRows[order.id] ? (
                                                    <div className="flex flex-col gap-1">
                                                        {order.documents.map((doc, i) => (
                                                            <span key={i}>{doc}</span>
                                                        ))}

                                                        {order.documents.length > 2 && (
                                                            <button onClick={() => toggleRow(order.id)} className="text-xs cursor-pointer text-[#6B635B] underline">
                                                                Show less
                                                            </button>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-wrap items-center gap-1">
                                                        {order.documents.slice(0, 2).map((doc, i) => (
                                                            <span key={i}>
                                                                {doc}
                                                                {i < Math.min(order.documents.length, 2) - 1 && ','}
                                                            </span>
                                                        ))}

                                                        {order.documents.length > 2 && (
                                                            <button
                                                                onClick={() => toggleRow(order.id)}
                                                                className="cursor-pointer text-xs text-[#6B635B] underline"
                                                            >
                                                                +{order.documents.length - 2} more
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </TableCell>

                                            <TableCell className="text-center">{order.quantity}</TableCell>

                                            <TableCell className="text-center font-medium">£{order.price}</TableCell>

                                            <TableCell className="text-center">
                                                {order.status === 'Paid' ? (
                                                    <span className="rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700">Paid</span>
                                                ) : (
                                                    <span className="rounded-md bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
                                                        Pending
                                                    </span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>

                        <div className="flex items-center justify-between border-t border-[#E7E1D7] px-6 py-4 text-sm text-[#6B635B]">
                            <span>
                                Showing <span className="font-medium text-[#1A1614]">{(page - 1) * ITEMS_PER_PAGE + 1}</span> –{' '}
                                <span className="font-medium text-[#1A1614]">{Math.min(page * ITEMS_PER_PAGE, orders.length)}</span> of{' '}
                                <span className="font-medium text-[#1A1614]">{orders.length}</span> orders
                            </span>

                            <div className="flex items-center gap-3">
                                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(p - 1, 1))}>
                                    Prev
                                </Button>

                                <span>
                                    Page <span className="font-medium text-[#1A1614]">{page}</span> of{' '}
                                    <span className="font-medium text-[#1A1614]">{totalPages}</span>
                                </span>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page === totalPages}
                                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </main>
        </AdminLayout>
    );
}
