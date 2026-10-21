import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const iconProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
} as const;

const HomeIcon = (props: IconProps) => (
    <svg {...iconProps} {...props}>
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <path d="M9 22V12h6v10"/>
    </svg>
);

const UsersIcon = (props: IconProps) => (
    <svg {...iconProps} {...props}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
);

const UserPlusIcon = (props: IconProps) => (
    <svg {...iconProps} {...props}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M19 8v6"/>
        <path d="M22 11h-6"/>
    </svg>
);

const PawIcon = (props: IconProps) => (
    <svg {...iconProps} {...props}>
        <circle cx="11" cy="4" r="2"/>
        <circle cx="18" cy="8" r="2"/>
        <circle cx="20" cy="16" r="2"/>
        <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/>
    </svg>
);

const ScissorsIcon = (props: IconProps) => (
    <svg {...iconProps} {...props}>
        <circle cx="6" cy="6" r="3"/>
        <path d="M8.12 8.12 12 12"/>
        <path d="M20 4 8.12 15.88"/>
        <circle cx="6" cy="18" r="3"/>
        <path d="M14.8 14.8 20 20"/>
    </svg>
);

const WalletIcon = (props: IconProps) => (
    <svg {...iconProps} {...props}>
        <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2"/>
        <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>
    </svg>
);

const CalendarIcon = (props: IconProps) => (
    <svg {...iconProps} {...props}>
        <path d="M8 2v4"/>
        <path d="M16 2v4"/>
        <rect width="18" height="18" x="3" y="4" rx="2"/>
        <path d="M3 10h18"/>
    </svg>
);

const PlusIcon = (props: IconProps) => (
    <svg {...iconProps} {...props}>
        <path d="M5 12h14"/>
        <path d="M12 5v14"/>
    </svg>
);

const ArrowUpRightIcon = (props: IconProps) => (
    <svg {...iconProps} {...props}>
        <path d="M7 7h10v10"/>
        <path d="M7 17 17 7"/>
    </svg>
);

const TrendingUpIcon = (props: IconProps) => (
    <svg {...iconProps} {...props}>
        <path d="m22 7-8.5 8.5-5-5L2 17"/>
        <path d="M16 7h6v6"/>
    </svg>
);

const RefreshIcon = (props: IconProps) => (
    <svg {...iconProps} {...props}>
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
        <path d="M3 21v-5h5"/>
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
        <path d="M21 3v5h-5"/>
    </svg>
);

const AlertTriangleIcon = (props: IconProps) => (
    <svg {...iconProps} {...props}>
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>
        <path d="M12 9v4"/>
        <path d="M12 17h.01"/>
    </svg>
);

export {
    HomeIcon,
    UsersIcon,
    UserPlusIcon,
    PawIcon,
    ScissorsIcon,
    WalletIcon,
    CalendarIcon,
    PlusIcon,
    ArrowUpRightIcon,
    TrendingUpIcon,
    RefreshIcon,
    AlertTriangleIcon,
};
