import React from "react";
import { Engine } from "../../../engine/Core";
import { BottomSheet } from "../panels/BottomSheet";
import { useLayers } from "../../../hooks/useLayers";
import { Copy, Trash2, Eye, EyeOff, Type, PieChart, Square, ArrowUp, ArrowDown } from "lucide-react";
import { TextObject } from "../../../engine/objects/TextObject";
import { ChartObject } from "../../../engine/objects/ChartObject";

interface LayersDrawerProps {
    engine: Engine | null;
    selectedId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export const LayersDrawer: React.FC<LayersDrawerProps> = ({ engine, selectedId, isOpen, onClose }) => {
    const { layers, select, toggleVisibility, duplicate, remove, moveUp, moveDown } = useLayers(engine, selectedId);

    if (!engine) return null;

    return (
        <BottomSheet
            isOpen={isOpen}
            onClose={onClose}
            initialSnap={0.5}
            snaps={[0.5, 0.9]}
        >
            <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 p-4 space-y-3 pb-24 override-touch-action relative">

                {/* Header (Custom, minimal) */}
                <div className="flex items-center justify-center pb-2 text-slate-300 dark:text-slate-600">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Layers</span>
                </div>

                {/* Selection Actions (Sticky Top) */}
                {selectedId && (
                    <div className="sticky top-0 z-20 -mx-4 px-4 pb-4 pt-1 bg-gradient-to-b from-slate-50 via-slate-50 to-transparent dark:from-slate-950 dark:via-slate-950 flex justify-center gap-3 animate-in slide-in-from-top-2">
                        <button onClick={(e) => moveUp(selectedId, e)} className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold shadow-sm active:scale-95 transition-all text-slate-600 dark:text-slate-300">
                            <ArrowUp size={14} /> Bring Forward
                        </button>
                        <button onClick={(e) => moveDown(selectedId, e)} className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold shadow-sm active:scale-95 transition-all text-slate-600 dark:text-slate-300">
                            <ArrowDown size={14} /> Send Backward
                        </button>
                    </div>
                )}

                {layers.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-12 text-slate-300 dark:text-slate-700">
                        <Square size={48} className="mb-4 opacity-20" />
                        <p className="text-sm font-medium">No layers yet</p>
                    </div>
                )}

                {layers.map((layer) => {
                    const isSelected = layer.id === selectedId;
                    return (
                        <div
                            key={layer.id}
                            onClick={() => select(layer.id)}
                            className={`
                                flex items-center gap-3 p-3 pl-4 rounded-2xl border transition-all touch-manipulation relative overflow-hidden group
                                ${isSelected
                                    ? "bg-white dark:bg-slate-900 border-indigo-500/50 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/20"
                                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
                                }
                            `}
                        >
                            {/* Selection Indicator */}
                            {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />}

                            {/* Icon */}
                            <div className={`
                                p-2 rounded-lg shrink-0 transition-colors
                                ${isSelected ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-600"}
                            `}>
                                {layer instanceof TextObject ? <Type size={18} /> :
                                    layer instanceof ChartObject ? <PieChart size={18} /> :
                                        <Square size={18} />}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h4 className={`text-sm font-bold truncate ${isSelected ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>
                                    {layer.name}
                                </h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-wider">{layer.type}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={(e) => toggleVisibility(layer.id, e)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${!layer.visible ? "text-slate-300" : "text-slate-300 hover:text-slate-500 dark:hover:text-slate-200"}`}
                                >
                                    {layer.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                                </button>

                                {isSelected && (
                                    <div className="flex items-center gap-1 animate-in fade-in slide-in-from-right-2 duration-200">
                                        <div className="w-px h-4 bg-slate-100 dark:bg-slate-800 mx-1" />

                                        <button onClick={(e) => duplicate(layer.id, e)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                            <Copy size={16} />
                                        </button>
                                        <button onClick={(e) => remove(layer.id, e)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </BottomSheet>
    );
};
