import { Card } from '@/components/ui/card';

type StatCardProps = {
    icon: React.ElementType;
    value: number;
    description: string;
};

export default function StatCard({ icon: Icon, value, description }: StatCardProps) {
    return (
        <Card className="border-[#E7E1D7] bg-white p-6 transition-all hover:shadow-sm">
            <div className="flex items-center justify-between">
                {/* Left */}
                <div className="flex flex-col">
                    <p className="text-sm text-[#6B635B]">{description}</p>

                    <div className="mt-1 text-2xl font-semibold tracking-tight text-[#1A1614]">{value.toLocaleString()}</div>
                </div>

                {/* Right Icon */}
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E7E1D7] bg-[#F2EDE4]">
                    <Icon className="h-5 w-5 text-[#A68A64]" />
                </div>
            </div>
        </Card>
    );
}
