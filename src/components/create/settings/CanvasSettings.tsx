import React, { useState } from "react";
import { Engine } from "../../../engine/Core";
import { ControlRow, ColorPicker } from "../ui/InspectorUI";

interface CanvasSettingsProps {
    engine: Engine | null;
    onResize?: (width: number, height: number) => void;
    onUpdate?: () => void;
    variant?: 'desktop' | 'mobile';
}

const PRESET_COLORS = [
    { val: "#FACC15", label: "Yellow" },
    { val: "#EF4444", label: "Red" },
    { val: "#22C55E", label: "Green" },
    { val: "#3B82F6", label: "Blue" },
    { val: "#8B5CF6", label: "Purple" },
    { val: "#EC4899", label: "Pink" },
    { val: "#000000", label: "Black" },
    { val: "#FFFFFF", label: "White" },
];

const PRESET_RATIOS = [
    { label: "16:9", val: 16 / 9 },
    { label: "9:16", val: 9 / 16 },
    { label: "1:1", val: 1 },
    { label: "4:3", val: 4 / 3 },
    { label: "3:4", val: 3 / 4 },
    { label: "21:9", val: 21 / 9 },
    { label: "4:5", val: 4 / 5 },
];

const PRESET_RESOLUTIONS = [
    { label: "480p", base: 480 },
    { label: "720p", base: 720 },
    { label: "1080p", base: 1080 },
    { label: "4K", base: 2160 }
];

const PRESET_DURATIONS = [5, 10, 15, 30, 60];

const MobileCanvasSettings: React.FC<CanvasSettingsProps & { forceUpdate: any, setForceUpdate: any }> = ({ engine, onResize, onUpdate, setForceUpdate }) => {
    if (!engine) return null;
    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Aspect Ratio - Horizontal Scroll */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <span>Aspect Ratio</span>
                </div>
                <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                    {PRESET_RATIOS.map((ratio) => {
                        const currentRatio = engine.scene.width / engine.scene.height;
                        const isActive = Math.abs(currentRatio - ratio.val) < 0.05;
                        return (
                            <button
                                key={ratio.label}
                                onClick={() => {
                                    const shortEdge = Math.min(engine.scene.width, engine.scene.height);
                                    let base = shortEdge;
                                    if (Math.abs(base - 1080) < 50) base = 1080;
                                    if (Math.abs(base - 720) < 50) base = 720;
                                    if (Math.abs(base - 2160) < 100) base = 2160;

                                    let w, h;
                                    if (ratio.val >= 1) { // Landscape or Square
                                        h = base;
                                        w = Math.round(h * ratio.val);
                                    } else { // Portrait
                                        w = base;
                                        h = Math.round(w / ratio.val);
                                    }

                                    engine.resize(w, h);
                                    onResize?.(w, h);
                                    setForceUpdate((n: number) => n + 1);
                                    onUpdate?.();
                                }}
                                className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all border
                                    ${isActive
                                        ? "bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-500 dark:text-indigo-300 ring-1 ring-indigo-500"
                                        : "bg-white dark:bg-app-surface border-slate-200 dark:border-app-border text-slate-600 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-700"}`}
                            >
                                {ratio.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Resolution (Quality) - Segmented Control */}
            <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <span>Resolution</span>
                    <span className="font-mono text-[10px] opacity-70">{engine.scene.width} x {engine.scene.height}</span>
                </div>
                <div className="flex bg-slate-100 dark:bg-app-surface p-1 rounded-xl">
                    {PRESET_RESOLUTIONS.map((qual) => {
                        const shortEdge = Math.min(engine.scene.width, engine.scene.height);
                        const isActive = Math.abs(shortEdge - qual.base) < 10;

                        return (
                            <button
                                key={qual.label}
                                onClick={() => {
                                    const currentRatio = engine.scene.width / engine.scene.height;
                                    let w, h;
                                    if (currentRatio >= 1) {
                                        h = qual.base;
                                        w = Math.round(h * currentRatio);
                                    } else {
                                        w = qual.base;
                                        h = Math.round(w / currentRatio);
                                    }

                                    engine.resize(w, h);
                                    onResize?.(w, h);
                                    setForceUpdate((n: number) => n + 1);
                                    onUpdate?.();
                                }}
                                className={`flex-1 py-2 text-[10px] sm:text-xs font-bold rounded-lg transition-all
                                    ${isActive
                                        ? "bg-white dark:bg-neutral-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                                        : "text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-300"}`}
                            >
                                {qual.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="w-full h-px bg-slate-100 dark:bg-app-border my-1" />

            {/* Color & Duration Section */}
            <div className="flex flex-col gap-6">
                {/* Background Color */}
                <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Background
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                        {PRESET_COLORS.map((color) => (
                            <button
                                key={color.val}
                                onClick={() => {
                                    engine.scene.backgroundColor = color.val;
                                    engine.render();
                                    setForceUpdate((n: number) => n + 1);
                                    onUpdate?.();
                                }}
                                className={`shrink-0 w-8 h-8 rounded-full shadow-sm ring-2 transition-all ${engine.scene.backgroundColor.toLowerCase() === color.val.toLowerCase()
                                    ? "ring-indigo-500 scale-110 z-10"
                                    : "ring-slate-200 dark:ring-neutral-700 hover:scale-105"
                                    }`}
                                style={{ backgroundColor: color.val }}
                                title={color.label}
                            />
                        ))}
                        <div className="shrink-0 w-px h-6 bg-slate-200 dark:bg-app-border mx-2" />
                        <ColorPicker
                            value={engine.scene.backgroundColor}
                            onChange={(val) => {
                                engine.scene.backgroundColor = val;
                                engine.render();
                                setForceUpdate((n: number) => n + 1);
                                onUpdate?.();
                            }}
                        />
                    </div>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Duration
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        {/* Presets */}
                        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 flex-1">
                            {PRESET_DURATIONS.map((sec) => (
                                <button
                                    key={sec}
                                    onClick={() => {
                                        engine.setTotalDuration(sec * 1000);
                                        setForceUpdate((n: number) => n + 1);
                                        onUpdate?.();
                                    }}
                                    className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${Math.round(engine.totalDuration / 1000) === sec
                                        ? "bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-500 dark:text-indigo-300 ring-1 ring-indigo-500"
                                        : "bg-white dark:bg-app-surface border-slate-200 dark:border-app-border text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-neutral-600"
                                        }`}
                                >
                                    {sec}s
                                </button>
                            ))}
                        </div>

                        {/* Custom Input */}
                        <div className="flex items-center gap-2 shrink-0">
                            <input
                                type="number"
                                min={1}
                                max={300}
                                className="w-16 bg-slate-100 dark:bg-app-surface rounded-lg px-2 py-1.5 text-right text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-1 ring-indigo-500 transition-all border border-transparent focus:border-indigo-500"
                                value={Math.round(engine.totalDuration / 1000)}
                                onChange={(e) => {
                                    const val = Math.max(1, Number(e.target.value));
                                    engine.setTotalDuration(val * 1000);
                                    setForceUpdate((n: number) => n + 1);
                                    onUpdate?.();
                                }}
                            />
                            <span className="text-xs font-bold text-slate-400">sec</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DesktopCanvasSettings: React.FC<CanvasSettingsProps & { forceUpdate: any, setForceUpdate: any }> = ({ engine, onResize, onUpdate, setForceUpdate }) => {
    if (!engine) return null;
    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Aspect Ratio - Grid */}
            <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <span>Aspect Ratio</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {PRESET_RATIOS.map((ratio) => {
                        const currentRatio = engine.scene.width / engine.scene.height;
                        const isActive = Math.abs(currentRatio - ratio.val) < 0.05;
                        return (
                            <button
                                key={ratio.label}
                                onClick={() => {
                                    const shortEdge = Math.min(engine.scene.width, engine.scene.height);
                                    let base = shortEdge;
                                    if (Math.abs(base - 1080) < 50) base = 1080;
                                    if (Math.abs(base - 720) < 50) base = 720;
                                    if (Math.abs(base - 2160) < 100) base = 2160;

                                    let w, h;
                                    if (ratio.val >= 1) { // Landscape
                                        h = base;
                                        w = Math.round(h * ratio.val);
                                    } else { // Portrait
                                        w = base;
                                        h = Math.round(w / ratio.val);
                                    }

                                    engine.resize(w, h);
                                    onResize?.(w, h);
                                    setForceUpdate((n: number) => n + 1);
                                    onUpdate?.();
                                }}
                                className={`px-2 py-2 rounded-lg text-xs font-bold transition-all border
                                    ${isActive
                                        ? "bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-500 dark:text-indigo-300 ring-1 ring-indigo-500"
                                        : "bg-white dark:bg-app-surface border-slate-200 dark:border-app-border text-slate-600 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-700"}`}
                            >
                                {ratio.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Resolution */}
            <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <span>Resolution</span>
                    <span className="font-mono text-[10px] opacity-70">{engine.scene.width} x {engine.scene.height}</span>
                </div>
                <div className="flex bg-slate-100 dark:bg-app-surface p-1 rounded-lg">
                    {PRESET_RESOLUTIONS.map((qual) => {
                        const shortEdge = Math.min(engine.scene.width, engine.scene.height);
                        const isActive = Math.abs(shortEdge - qual.base) < 10;
                        return (
                            <button
                                key={qual.label}
                                onClick={() => {
                                    const currentRatio = engine.scene.width / engine.scene.height;
                                    let w, h;
                                    if (currentRatio >= 1) {
                                        h = qual.base;
                                        w = Math.round(h * currentRatio);
                                    } else {
                                        w = qual.base;
                                        h = Math.round(w / currentRatio);
                                    }

                                    engine.resize(w, h);
                                    onResize?.(w, h);
                                    setForceUpdate((n: number) => n + 1);
                                    onUpdate?.();
                                }}
                                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all
                                    ${isActive
                                        ? "bg-white dark:bg-neutral-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                                        : "text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-300"}`}
                            >
                                {qual.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Background Color */}
            <div className="space-y-3">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Background
                </div>
                <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map((color) => (
                        <button
                            key={color.val}
                            onClick={() => {
                                engine.scene.backgroundColor = color.val;
                                engine.render();
                                setForceUpdate((n: number) => n + 1);
                                onUpdate?.();
                            }}
                            className={`w-8 h-8 rounded-full shadow-sm ring-2 transition-all ${engine.scene.backgroundColor.toLowerCase() === color.val.toLowerCase()
                                ? "ring-indigo-500 scale-110 z-10"
                                : "ring-slate-200 dark:ring-slate-700 hover:scale-105"
                                }`}
                            style={{ backgroundColor: color.val }}
                            title={color.label}
                        />
                    ))}
                    <div className="w-px h-8 bg-slate-200 dark:bg-app-border mx-1" />
                    <ColorPicker
                        value={engine.scene.backgroundColor}
                        onChange={(val) => {
                            engine.scene.backgroundColor = val;
                            engine.render();
                            setForceUpdate((n: number) => n + 1);
                            onUpdate?.();
                        }}
                    />
                </div>
            </div>

            {/* Duration */}
            <ControlRow label="Duration" description="Animation length in seconds">
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        min={1}
                        max={300}
                        className="w-full bg-slate-100 dark:bg-app-surface rounded-lg px-3 py-2 text-right text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-1 ring-indigo-500 transition-all border border-transparent focus:border-indigo-500"
                        value={Math.round(engine.totalDuration / 1000)}
                        onChange={(e) => {
                            const val = Math.max(1, Number(e.target.value));
                            engine.setTotalDuration(val * 1000);
                            setForceUpdate((n: number) => n + 1);
                            onUpdate?.();
                        }}
                    />
                    <span className="text-xs font-bold text-slate-400">sec</span>
                </div>
            </ControlRow>
        </div>
    );
}


export const CanvasSettings: React.FC<CanvasSettingsProps> = (props) => {
    const [forceUpdate, setForceUpdate] = useState(0);

    if (props.variant === 'mobile') {
        return <MobileCanvasSettings {...props} forceUpdate={forceUpdate} setForceUpdate={setForceUpdate} />;
    }

    return <DesktopCanvasSettings {...props} forceUpdate={forceUpdate} setForceUpdate={setForceUpdate} />;
};
