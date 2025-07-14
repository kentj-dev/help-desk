interface RadialProgressProps {
    percentage: number;
    size?: number;
    bgColor?: string;
    progressColor?: string;
}

export default function RadialProgress({ percentage, size = 20, bgColor = '#e9ecef', progressColor = 'currentColor' }: RadialProgressProps) {
    const radius = 5;
    const circumference = 2 * Math.PI * radius;
    const strokeDash = `${(percentage / 100) * circumference} ${circumference}`;

    return (
        <svg height={size} width={size} viewBox="0 0 20 20">
            {/* Outer background ring */}
            <circle r="10" cx="10" cy="10" fill={bgColor} />

            {/* Radial progress */}
            <circle
                r={radius}
                cx="10"
                cy="10"
                fill="transparent"
                stroke={progressColor}
                strokeWidth="10"
                strokeDasharray={strokeDash}
                transform="rotate(-90) translate(-20)"
            />

            {/* Inner center circle */}
            <circle r="6" cx="10" cy="10" fill="white" />
        </svg>
    );
}
