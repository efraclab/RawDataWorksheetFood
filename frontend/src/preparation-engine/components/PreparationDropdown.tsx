import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

interface PreparationGroup {
    id: string;
    title: string;
    color: string;
    icon?: string;
}

interface Props {
    open: boolean;
    groups: PreparationGroup[];
    activeGroups: string[];
    onSelect: (groupId: string) => void;
}

const PreparationDropdown: React.FC<Props> = ({
    open,
    groups,
    activeGroups,
    onSelect
}) => {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="
                        absolute
                        top-full
                        right-0
                        mt-2
                        w-72
                        bg-white
                        border
                        border-emerald-300
                        rounded-lg
                        shadow-xl
                        z-[9999]
                        max-h-80
                        overflow-y-auto
                    "
                >
                    {groups.map(group => {
                        const isActive =
                            activeGroups.includes(group.id);
                        return (
                            <button
                                type="button"
                                key={group.id}
                                onClick={() => onSelect(group.id)}
                                className="w-full text-left px-3 py-3 hover:bg-emerald-50 border-b border-emerald-200 last:border-b-0 transition-colors text-sm"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-gray-900">
                                        {group.title}
                                    </span>
                                    {isActive && (
                                        <Check className="w-4 h-4 text-emerald-600" />
                                    )}
                                </div>
                            </button>
                        );
                    })}

                </motion.div>

            )}

        </AnimatePresence>

    );

};

export default PreparationDropdown;