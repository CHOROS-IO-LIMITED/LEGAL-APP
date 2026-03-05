import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';

interface User {
    name: string;
    email: string;
}

interface DashboardProps {
    user: User;
}

export default function AdminDashboard({ user }: DashboardProps) {
    const stats = [
        {
            title: 'Total This Month',
            value: 124,
            description: 'All legal documents created this month',
        },
        {
            title: 'Pending',
            value: 32,
            description: 'Waiting for review or approval',
        },
        {
            title: 'Approved',
            value: 70,
            description: 'Successfully approved documents',
        },
        {
            title: 'Rejected',
            value: 22,
            description: 'Documents rejected this month',
        },
    ];

    return (
        <AdminLayout user={user}>
            <main className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-6 dark:bg-gray-900">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard Overview</h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Welcome back, {user.name}! Here's what's happening with your business today.
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat) => (
                            <Card key={stat.title}>
                                <CardHeader>
                                    <CardTitle className="text-muted-foreground text-sm">{stat.title}</CardTitle>
                                </CardHeader>

                                <CardContent>
                                    <div className="text-3xl font-bold">{stat.value}</div>
                                    <CardDescription className="mt-1">{stat.description}</CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>
        </AdminLayout>
    );
}
