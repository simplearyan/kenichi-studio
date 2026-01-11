import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, type PanInfo, useAnimation } from "framer-motion";
import { X, ChevronDown } from "lucide-react";

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    initialSnap?: number; // 0 to 1 (percentage of screen height)
    snaps?: number[]; // [0.5, 0.9]
    variant?: 'sheet' | 'dock';
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
    isOpen,
    onClose,
    children,
    title,
    initialSnap = 0.5,
    snaps = [0.5, 0.9],
    variant = 'sheet'
}) => {
    const [scope, animate] = [null, useAnimation()];
    const [isDragging, setIsDragging] = useState(false);

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    const isDock = variant === 'dock';

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop - Only for sheet variant */}
                    {!isDock && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 bg-transparent z-40 lg:hidden"
                        />
                    )}

                    {/* Sheet / Dock */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: isDock ? "0%" : `${(1 - initialSnap) * 100}%` }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        drag={isDock ? false : "y"}
                        dragConstraints={{ top: 0 }}
                        dragElastic={0.05}
                        dragMomentum={false}
                        onDragEnd={isDock ? undefined : (e, info) => {
                            if (info.offset.y > 100) {
                                onClose();
                            } else {
                                // Snap logic could go here, for now just snapping to initial
                            }
                        }}
                        className={`fixed left-0 right-0 z-50 bg-white dark:bg-slate-900 shadow-2xl flex flex-col lg:hidden
                            ${isDock ? "border-t border-slate-200 dark:border-slate-800 pb-safe bottom-16" : "rounded-t-3xl max-h-[95vh] bottom-0"}
                        `}
                        style={{ height: isDock ? "auto" : "95vh" }}
                    >
                        {/* Handle / Header */}
                        {!isDock && (
                            <div className="flex flex-col items-center pt-2 pb-0 shrink-0 cursor-grab active:cursor-grabbing touch-none">
                                <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mb-3" />
                                {title && (
                                    <div className="w-full px-4 pb-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
                                        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Content */}
                        <div className={`flex-1 overflow-y-auto overscroll-contain ${isDock ? "" : "px-4 pb-8"}`}>
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
