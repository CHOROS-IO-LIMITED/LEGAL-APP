import AdminLayout from '@/layouts/admin-layout';
import { CheckCircle, ClipboardList, Clock, XCircleIcon } from 'lucide-react';
import DocumentTable from './DocumentTable';
import StatCard from './StatCard';

interface User {
    name: string;
    email: string;
}

type DocumentItem = {
    id: string | number;
    title: string;
    submittedBy: string;
    submittedAtLabel: string;
    status: 'pending_review' | 'in_review' | 'approved' | 'rejected';
    isUrgent?: boolean;
};

interface DashboardProps {
    user: User;
}

export default function AdminDashboard({ user }: DashboardProps) {
    const stats = [
        { icon: ClipboardList, value: 124, description: 'Total This Month' },
        { icon: Clock, value: 32, description: 'Pending' },
        { icon: CheckCircle, value: 70, description: 'Approved' },
        { icon: XCircleIcon, value: 22, description: 'Rejected' },
    ];

    const documentQueue: DocumentItem[] = [
        {
            id: 1,
            title: 'Residential Lease — J. Harrington',
            submittedBy: 'James Harrington',
            submittedAtLabel: 'Today 14:32',
            status: 'pending_review',
            isUrgent: true,
        },
        {
            id: 2,
            title: 'NDA — Acme Ltd.',
            submittedBy: 'Sarah Mitchell',
            submittedAtLabel: 'Today 11:15',
            status: 'pending_review',
        },
        {
            id: 3,
            title: 'Employment Contract — TechCorp',
            submittedBy: 'Robert Chen',
            submittedAtLabel: 'Yesterday',
            status: 'in_review',
        },
        {
            id: 4,
            title: 'Marketing Agreement — BlueWave',
            submittedBy: 'Lisa Parks',
            submittedAtLabel: '2 Mar',
            status: 'approved',
        },
        {
            id: 5,
            title: 'Partnership Contract — Nova Group',
            submittedBy: 'Daniel Reed',
            submittedAtLabel: '1 Mar',
            status: 'rejected',
        },
        {
            id: 6,
            title: 'Consulting Agreement — Pixel Inc.',
            submittedBy: 'Amanda Lopez',
            submittedAtLabel: '28 Feb',
            status: 'pending_review',
        },
    ];

    return (
        <AdminLayout user={user}>
            <main className="flex-1 overflow-y-auto bg-[#FCF9F2] p-4 md:p-6">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
                    {/* Header */}
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-[#1A1614]">Dashboard Overview</h1>
                        <p className="text-sm text-[#6B635B]">Welcome back, {user.name}! Here's what's happening with your business today.</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat, index) => (
                            <StatCard key={index} icon={stat.icon} value={stat.value} description={stat.description} />
                        ))}
                    </div>

                    {/* Document Queue */}
                    <DocumentTable
                        items={documentQueue}
                        pageSize={5}
                        // onReview={(doc) => console.log("Review document:", doc)}
                    />
                </div>
            </main>
        </AdminLayout>
    );
}
