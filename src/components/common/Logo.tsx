import React from 'react';

interface NanoBananaLogoProps {
    className?: string;
    onClick?: () => void;
}

export const NanoBananaLogo: React.FC<NanoBananaLogoProps> = ({ className = '', onClick }) => {
    return (
        <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-6 cursor-pointer hover:scale-[1.01] transition-transform duration-300 group ${className}`}
            onClick={onClick}
        >
            <svg
                width="64"
                height="64"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 text-ink"
            >
                {/* Newspaper halftone background dot effect */}
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" strokeDasharray="2 4" className="opacity-40" />
                <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1" strokeDasharray="1 3" className="opacity-30" />

                {/* Banana Shape */}
                <path
                    d="M75 25 C65 20, 50 25, 40 40 C30 55, 30 75, 25 85 C35 85, 55 80, 65 65 C75 50, 85 35, 75 25 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:fill-ink group-hover:text-newsprint transition-colors duration-500"
                />

                {/* Subtle detail lines for the banana peel */}
                <path d="M40 40 C45 35, 60 30, 70 30" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
                <path d="M28 78 C32 68, 38 58, 45 50" stroke="currentColor" strokeWidth="2" strokeDasharray="2 4" />

                {/* Nano stem */}
                <path d="M75 25 L80 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />

                {/* Halftone texture overlay on banana */}
                <path d="M50 55 C60 45, 65 35, 65 35" stroke="currentColor" strokeWidth="8" strokeDasharray="1 6" strokeLinecap="round" className="opacity-50" />
            </svg>
            <div className="flex flex-col justify-center items-center sm:items-start text-center sm:text-left">
                <h1 className="font-masthead text-5xl md:text-7xl lg:text-9xl tracking-tight leading-none">
                    The Daily Developer
                </h1>
                <div className="text-xs md:text-sm font-mono italic mt-1 md:mt-2 opacity-80 border-t border-ink pt-1 md:pt-2 w-full">
                    "The daily dose of potassium and code"
                </div>
            </div>
        </div>
    );
};
