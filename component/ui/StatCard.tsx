import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    bgColor: string;
    iconBgColor: string;
    textColor: string;
}

export default function StatCard({
    title,
    value,
    icon: Icon,
    bgColor,
    iconBgColor,
    textColor,
}: StatCardProps) {
    return (
        <div className={`${bgColor} rounded-2xl p-6 flex items-center gap-4 shadow-md hover:shadow-lg transition-shadow`}>
            {/* Icon Container */}
            <div className={`${iconBgColor} w-14 h-12 rounded-[10px] flex items-center justify-center shrink-0`}>
                <Icon className={`w-7 h-7 ${textColor}`} />
            </div>

            {/* Stats Text */}
            <div>
                <p className={`${textColor} text-base font-extrabold leading-tight`}>
                    {title}
                </p>
                <p className={`${textColor} text-3xl font-extrabold mt-1`}>
                    {value}
                </p>
            </div>
        </div>
    );
}