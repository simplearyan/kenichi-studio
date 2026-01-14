import React, { useState, useEffect } from "react";
import { Engine } from "../../../engine/Core";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw, Move } from "lucide-react";
import { BottomSheet } from "../panels/BottomSheet";

interface PositionDrawerProps {
    engine: Engine | null;
    selectedId: string | null;
    onClose: () => void;
}

export const PositionDrawerContent: React.FC<PositionDrawerProps> = ({ engine, selectedId, onClose }) => {
    const [forceUpdate, setForceUpdate] = useState(0);

    const obj = selectedId && engine ? engine.scene.get(selectedId) : null;

    if (!obj) return null;

    const handleChange = (key: string, value: any) => {
        (obj as any)[key] = value;
        engine?.render();
        setForceUpdate(n => n + 1);
    };

    const handleNudge = (axis: 'x' | 'y', delta: number) => {
        const current = (obj as any)[axis] || 0;
        handleChange(axis, current + delta);
    };

    return (
        <div className="flex flex-col gap-6 p-6 min-h-[200px]">
            {/* Header / Info */}
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Move size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Position</span>
            </div>

            {/* X / Y Controls */}
            <div className="grid grid-cols-2 gap-4">
                {/* X Axis */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                        <span>X Axis</span>
                        <input
                            type="number"
                            value={Math.round(obj.x)}
                            onChange={(e) => handleChange('x', Number(e.target.value))}
                            className="w-16 bg-slate-100 dark:bg-app-surface rounded px-2 py-1 text-right text-slate-900 dark:text-white outline-none focus:ring-1 ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Y Axis */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                        <span>Y Axis</span>
                        <input
                            type="number"
                            value={Math.round(obj.y)}
                            onChange={(e) => handleChange('y', Number(e.target.value))}
                            className="w-16 bg-slate-100 dark:bg-app-surface rounded px-2 py-1 text-right text-slate-900 dark:text-white outline-none focus:ring-1 ring-indigo-500"
                        />
                    </div>
                </div>
            </div>

            {/* Nudge Controls */}
            <div className="flex flex-col items-center gap-2 mt-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">Nudge</span>

                <div className="grid grid-cols-3 gap-2">
                    {/* Top Row */}
                    <div className="col-start-2">
                        <button
                            onClick={() => handleNudge('y', -10)}
                            className="p-3 bg-slate-100 dark:bg-app-surface rounded-xl hover:bg-slate-200 dark:hover:bg-app-surface-hover active:scale-95 transition-all text-slate-700 dark:text-slate-200"
                        >
                            <ArrowUp size={20} />
                        </button>
                    </div>

                    {/* Middle Row */}
                    <div className="col-start-1 row-start-2">
                        <button
                            onClick={() => handleNudge('x', -10)}
                            className="p-3 bg-slate-100 dark:bg-app-surface rounded-xl hover:bg-slate-200 dark:hover:bg-app-surface-hover active:scale-95 transition-all text-slate-700 dark:text-slate-200"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    </div>

                    <div className="col-start-2 row-start-2 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                    </div>

                    <div className="col-start-3 row-start-2">
                        <button
                            onClick={() => handleNudge('x', 10)}
                            className="p-3 bg-slate-100 dark:bg-app-surface rounded-xl hover:bg-slate-200 dark:hover:bg-app-surface-hover active:scale-95 transition-all text-slate-700 dark:text-slate-200"
                        >
                            <ArrowRight size={20} />
                        </button>
                    </div>

                    {/* Bottom Row */}
                    <div className="col-start-2 row-start-3">
                        <button
                            onClick={() => handleNudge('y', 10)}
                            className="p-3 bg-slate-100 dark:bg-app-surface rounded-xl hover:bg-slate-200 dark:hover:bg-app-surface-hover active:scale-95 transition-all text-slate-700 dark:text-slate-200"
                        >
                            <ArrowDown size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
