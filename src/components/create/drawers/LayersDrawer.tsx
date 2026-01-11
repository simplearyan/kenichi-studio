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
            title="Layers"
            // Use standard sheet behaviour for easier scrolling of long lists?
            // Or 'dock' if we want it small. The implementation plan suggested 'dock' or sheet.
            // Let's stick to standard sheet for now as layers lists can be long.
            initialSnap={0.5}
            snaps={[0.5, 0.9]}
        >
            <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 p-4 space-y-2 pb-20 override-touch-action relative">

                {/* Selection Actions (Sticky Top) */}
                {selectedId && (
                    <div className="sticky top-0 z-20 -mx-4 px-4 pb-2 mb-2 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 flex justify-center gap-4 animate-in slide-in-from-top-2">
                        <button onClick={(e) => moveUp(selectedId, e)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <ArrowUp size={14} /> Forward
                        </button>
                        <button onClick={(e) => moveDown(selectedId, e)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <ArrowDown size={14} /> Backward
                        </button>
                    </div>
                )}

                {layers.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-8 text-slate-400">
                        <Square size={48} className="mb-4 opacity-20" />
                        <p className="text-sm">No layers yet</p>
                    </div>
                )}
                {layers.map((layer) => {
                    const isSelected = layer.id === selectedId;
                    return (
                        <div
                            key={layer.id}
                            onClick={() => select(layer.id)}
                            className={`
                                flex items-center gap-3 p-3 rounded-2xl border transition-all touch-manipulation
                                ${isSelected
                                    ? "bg-white dark:bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/10 scale-[1.02]"
                                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
                                }
                            `}
                        >
                            {/* Icon */}
                            <div className={`
                                p-2 rounded-xl shrink-0
                                ${isSelected ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}
                            `}>
                                {layer instanceof TextObject ? <Type size={18} /> :
                                    layer instanceof ChartObject ? <PieChart size={18} /> :
                                        <Square size={18} />}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h4 className={`text-sm font-bold truncate ${isSelected ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>
                                    {layer.name}
                                </h4>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                                    {layer.type}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={(e) => toggleVisibility(layer.id, e)}
                                    className={`p-2 rounded-lg transition-colors ${!layer.visible ? "text-slate-300" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`}
                                >
                                    {layer.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                                </button>

                                {isSelected && (
                                    <>
                                        <div className="w-px h-6 bg-slate-100 dark:bg-slate-800 mx-1" />

                                        <button onClick={(e) => duplicate(layer.id, e)} className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors">
                                            <Copy size={16} />
                                        </button>
                                        <button onClick={(e) => remove(layer.id, e)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </BottomSheet>
    );
};
