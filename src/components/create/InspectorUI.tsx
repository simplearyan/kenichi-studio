import React, { useState } from "react";
import { ChevronDown, ChevronRight, Check } from "lucide-react";

// --- Types ---
interface PropertySectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    rightElement?: React.ReactNode;
}

interface ControlRowProps {
    label: string;
    children: React.ReactNode;
    description?: string;
    layout?: "horizontal" | "vertical";
}

interface ToggleProps {
    value: boolean;
    onChange: (val: boolean) => void;
    label?: string;
}

interface SliderProps {
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (val: number) => void;
    label?: string; // Optional label for the value display
    formatValue?: (val: number) => string;
}

interface SegmentedControlProps {
    options: { value: string; label?: string; icon?: React.ReactNode }[];
    value: string;
    onChange: (val: string) => void;
}

interface IconGridProps {
    options: { value: string; label: string; icon: React.ReactNode }[];
    value: string;
    onChange: (val: string) => void;
    cols?: number;
    size?: "sm" | "md";
}


// --- Components ---

export const PropertySection: React.FC<PropertySectionProps> = ({ title, children, defaultOpen = true, rightElement }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="inspector-section border-b border-slate-100 dark:border-neutral-800 last:border-0">
            <div
                className="inspector-section-header flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-neutral-800/50 transition-colors select-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2">
                    {isOpen ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
                    <span className="inspector-section-title text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">{title}</span>
                </div>
                {rightElement && <div onClick={e => e.stopPropagation()}>{rightElement}</div>}
            </div>
            {isOpen && (
                <div className="inspector-section-content px-4 pb-4 space-y-4 animate-in slide-in-from-top-1 fade-in duration-200">
                    {children}
                </div>
            )}
        </div>
    );
};

export const ControlRow: React.FC<ControlRowProps> = ({ label, children, description, layout = "vertical" }) => {
    return (
        <div className={`inspector-row flex ${layout === "horizontal" ? "items-center justify-between gap-4" : "flex-col gap-2"}`}>
            <div className="inspector-label-container flex flex-col">
                <label className="inspector-label text-[11px] font-semibold text-slate-500 dark:text-slate-400">{label}</label>
                {description && <span className="inspector-description text-[10px] text-slate-400 dark:text-slate-500">{description}</span>}
            </div>
            <div className={`inspector-control-container ${layout === "horizontal" ? "flex-1 flex justify-end min-w-[50%]" : "w-full"}`}>
                {children}
            </div>
        </div>
    );
};

export const Toggle: React.FC<ToggleProps> = ({ value, onChange, label }) => {
    return (
        <button
            className={`
                inspector-toggle relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900
                ${value ? "bg-blue-600" : "bg-slate-200 dark:bg-neutral-700"}
            `}
            onClick={() => onChange(!value)}
        >
            <span className="sr-only">{label || "Toggle"}</span>
            <span
                className={`
                    inspector-toggle-thumb inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform
                    ${value ? "translate-x-6" : "translate-x-1"}
                `}
            />
        </button>
    );
};

export const Slider: React.FC<SliderProps> = ({ value, min, max, step = 1, onChange, formatValue }) => {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className="inspector-slider group relative flex w-full h-8 items-center cursor-pointer touch-none select-none">
            {/* Track Background */}
            <div className="inspector-slider-track h-1.5 w-full bg-slate-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                {/* Fill */}
                <div
                    className="inspector-slider-fill h-full bg-blue-500 rounded-full"
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {/* Thumb (Invisible but large hit area for touch) */}
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="inspector-slider-input absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            {/* Visual Value Label (Optional floating or fixed) */}
            <div className="inspector-slider-label absolute right-0 -top-5 text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-white dark:bg-neutral-800 px-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-100 dark:border-neutral-700">
                {formatValue ? formatValue(value) : value}
            </div>

            {/* Always visible Value inside control if space allows, or specialized display */}
            <div
                className="inspector-slider-thumb absolute h-4 w-4 bg-white border-2 border-blue-500 rounded-full shadow-md pointer-events-none transition-transform"
                style={{ left: `calc(${percentage}% - 8px)` }}
            />
        </div>
    );
};

export const SliderInput: React.FC<SliderProps> = (props) => {
    return (
        <div className="inspector-slider-input-group flex items-center gap-3">
            <div className="flex-1">
                <Slider {...props} />
            </div>
            <input
                type="number"
                value={props.value}
                onChange={(e) => props.onChange(Number(e.target.value))}
                className="inspector-input-number w-14 bg-slate-100 dark:bg-neutral-800 border-none rounded px-2 py-1 text-xs font-mono text-right text-slate-700 dark:text-neutral-300 focus:ring-1 focus:ring-blue-500 outline-none"
            />
        </div>
    )
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({ options, value, onChange }) => {
    return (
        <div className="inspector-segmented-control flex bg-slate-100 dark:bg-neutral-800 p-1 rounded-lg w-full">
            {options.map((option) => {
                const isSelected = value === option.value;
                return (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={`
                            inspector-segmented-item flex-1 flex items-center justify-center gap-2 py-1.5 px-2 rounded-md text-xs font-medium transition-all
                            ${isSelected
                                ? "bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-sm"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            }
                        `}
                    >
                        {option.icon}
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
};

export const IconGrid: React.FC<IconGridProps> = ({ options, value, onChange, cols = 3, size = "md" }) => {
    return (
        <div className={`inspector-icon-grid grid grid-cols-${cols} gap-2 w-full`}>
            {options.map((option) => {
                const isSelected = value === option.value;
                return (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={`
                            inspector-grid-item flex flex-col items-center justify-center rounded-xl border transition-all relative overflow-hidden
                            ${size === "sm" ? "p-1.5 gap-1" : "p-2 gap-1.5"}
                            ${size === "sm" ? "aspect-[4/3]" : "aspect-square"}
                            ${isSelected
                                ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500"
                                : "bg-white dark:bg-neutral-800 border-slate-200 dark:border-neutral-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-neutral-600 hover:bg-slate-50 dark:hover:bg-neutral-800/80"
                            }
                        `}
                    >
                        <div className={`${size === "sm" ? "scale-75 origin-bottom" : ""}`}>{option.icon}</div>
                        <span className={`${size === "sm" ? "text-[8px] leading-tight" : "text-[9px]"} font-bold uppercase truncate max-w-full`}>{option.label}</span>
                        {isSelected && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full" />}
                    </button>
                );
            })}
        </div>
    );
};
