import React, { useState } from "react";
import { Engine } from "../../../engine/Core";
import { useLayers } from "../../../hooks/useLayers";
import { Copy, Trash2, Eye, EyeOff, Type, PieChart, Square, ArrowUp, ArrowDown } from "lucide-react";
import { TextObject } from "../../../engine/objects/TextObject";
import { ChartObject } from "../../../engine/objects/ChartObject";

interface LayersPanelProps {
    engine: Engine | null;
    selectedId: string | null;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({ engine, selectedId }) => {
    const { layers, select, toggleVisibility, duplicate, remove, moveUp, moveDown } = useLayers(engine, selectedId);
    // Add logic to rename if needed, but for now simple list

    if (!engine) return null;

    return (
        <div className="space-y-1">
            {layers.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-400">
                    No layers yet.
                </div>
            )}

            {layers.map((layer) => {
                const isSelected = layer.id === selectedId;
                return (
                    <div
                        key={layer.id}
                        onClick={() => select(layer.id)}
                        className={`
                            flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors group
                            ${isSelected
                                ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                                : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                            }
                        `}
                    >
                        <div className="p-1.5 rounded bg-white dark:bg-slate-900 shadow-sm text-xs shrink-0">
                            {layer instanceof TextObject ? <Type size={12} /> :
                                layer instanceof ChartObject ? <PieChart size={12} /> :
                                    <Square size={12} />}
                        </div>

                        <span className="text-xs font-medium truncate flex-1">{layer.name}</span>

                        <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${isSelected || !layer.visible ? 'opacity-100' : ''}`}>
                            <button
                                onClick={(e) => toggleVisibility(layer.id, e)}
                                className={`p-1 hover:text-indigo-500 ${!layer.visible ? "text-slate-400" : ""}`}
                            >
                                {layer.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                            </button>
                            <button onClick={(e) => duplicate(layer.id, e)} className="p-1 hover:text-indigo-500"><Copy size={12} /></button>
                            <button onClick={(e) => remove(layer.id, e)} className="p-1 hover:text-red-500"><Trash2 size={12} /></button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
