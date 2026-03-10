import AdminLayout from '@/layouts/admin-layout';

interface User {
    name: string;
    email: string;
}

interface BillingIndexProps {
    user: User;
}

export default function BillingIndex({ user }: BillingIndexProps) {
    return (
        <AdminLayout user={user}>
            <main className="flex-1 overflow-y-auto bg-[#FCF9F2] p-4 md:p-6">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-[#1A1614 text-2xl font-semibold tracking-tight">Billing & Revenue</h1>

                        <p className="text-sm text-[#6B635B]">Manage invoices, monitor revenue, and view billing analytics.</p>
                    </div>
                </div>
            </main>
        </AdminLayout>
    );
}
