import React from "react";
import { Engine } from "../../../engine/Core";
import { TEXT_OPTIONS, TEXT_EFFECTS, createText } from "../../../data/textOptions";
import { BottomSheet } from "../panels/BottomSheet";
import { Wand2 } from "lucide-react";

interface TextDrawerProps {
    engine: Engine | null;
    isOpen: boolean;
    onClose: () => void;
}

export const TextDrawerContent: React.FC<{ engine: Engine | null; onClose: () => void; isExpanded?: boolean }> = ({ engine, onClose, isExpanded = false }) => {
    const handleAdd = (type: string, effect?: any) => {
        if (!engine) return;
        createText(engine, type, effect);
        onClose();
    };

    // Always use Grid Layout (2 columns)
    const containerClass = "grid grid-cols-2 gap-2 pb-8";

    // Default Card Styles
    const cardClass = "relative overflow-hidden rounded-xl border transition-all active:scale-95 h-24 flex flex-col items-center justify-center";

    return (
        <div className="space-y-6 px-2 pb-8 pt-2">
            <div className="space-y-3">
                <div className={containerClass}>
                    {TEXT_OPTIONS.filter(o => ['heading', 'subheading'].includes(o.type)).map((opt) => (
                        <button
                            key={opt.type}
                            onClick={() => handleAdd(opt.type)}
                            className={`${cardClass} bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-[1.02] group shadow-sm`}
                        >
                            <span className={`block font-black text-center ${opt.type === 'heading' ? 'text-2xl' : 'text-lg font-bold'} ${opt.colorClass}`}>
                                {opt.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Section 2: Text Effects */}
            <div className="space-y-3">
                <div className={containerClass}>
                    {TEXT_EFFECTS.map((effect) => (
                        <button
                            key={effect.id}
                            onClick={() => handleAdd('effect', effect)}
                            className={`${cardClass} bg-slate-100 dark:bg-slate-800 border-transparent dark:border-slate-700/30 hover:bg-slate-200 dark:hover:bg-slate-700`}
                        >
                            <span style={{
                                ...effect.previewStyle,
                                fontSize: '20px',
                                textAlign: 'center',
                                lineHeight: 1.1,
                                width: '100%',
                            }}>
                                {effect.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Section 3: Special FX */}
            <div className="space-y-3">
                <div className={containerClass}>
                    {TEXT_OPTIONS.filter(o => o.type === 'particle').map((opt) => (
                        <button
                            key={opt.type}
                            onClick={() => handleAdd(opt.type)}
                            className={`${cardClass} border-violet-200 dark:border-violet-900/50 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 hover:scale-[1.02]`}
                        >
                            <div className="absolute right-2 top-2 text-violet-500 opacity-20">
                                <Wand2 size={16} />
                            </div>
                            <span className={`block font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400 leading-none`}>
                                {opt.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const TextDrawer: React.FC<TextDrawerProps> = ({ engine, isOpen, onClose }) => {
    return (
        <BottomSheet
            isOpen={isOpen}
            onClose={onClose}
            title="Typography"
            initialSnap={0.5}
            snaps={[0.5, 0.9]}
        >
            <TextDrawerContent engine={engine} onClose={onClose} />
        </BottomSheet>
    );
};
