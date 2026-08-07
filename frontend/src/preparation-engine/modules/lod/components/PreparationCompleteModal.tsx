import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck,
    X,
    Lock,
    Info,
    Loader2
} from "lucide-react";

interface Props {

    isOpen: boolean;

    isCompleting: boolean;

    parameterName: string | null;

    parameterCode: string | null;

    onClose: () => void;

    onConfirm: () => void;

}

const PreparationCompleteModal: React.FC<Props> = ({

    isOpen,

    isCompleting,

    parameterName,

    parameterCode,

    onClose,

    onConfirm

}) => {

    if (!isOpen)
        return null;

    return (

        <AnimatePresence>

            {isOpen && (

                <motion.div

                    initial={{ opacity: 0 }}

                    animate={{ opacity: 1 }}

                    exit={{ opacity: 0 }}

                    transition={{ duration: 0.15 }}

                    className="
                        fixed
                        inset-0
                        z-50
                        flex
                        items-center
                        justify-center
                        bg-black/50
                        backdrop-blur-sm
                        p-4
                    "

                    onClick={onClose}

                >

                    <motion.div

                        initial={{
                            opacity: 0,
                            scale: 0.95,
                            y: 20
                        }}

                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0
                        }}

                        exit={{
                            opacity: 0,
                            scale: 0.95,
                            y: 20
                        }}

                        transition={{
                            type: "spring",
                            damping: 30,
                            stiffness: 400
                        }}

                        onClick={(e) => e.stopPropagation()}

                        className="
                            w-full
                            max-w-lg
                            overflow-hidden
                            rounded-2xl
                            bg-white
                            shadow-2xl
                        "

                    >

                        {/* HEADER */}

                        <div className="bg-gradient-to-r from-emerald-700 to-slate-900 px-6 py-5">

                            <div className="flex items-center gap-4">

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">

                                    <ShieldCheck className="h-6 w-6 text-white" />

                                </div>

                                <div className="flex-1">

                                    <h3 className="text-xl font-semibold text-white">

                                        Complete Preparation

                                    </h3>

                                    <p className="mt-0.5 text-sm text-emerald-200">

                                        Lock preparation data and unlock calculations

                                    </p>

                                </div>

                                <button

                                    onClick={onClose}

                                    disabled={isCompleting}

                                    className="
                                        flex
                                        h-8
                                        w-8
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-white/10
                                        transition-colors
                                        hover:bg-white/20
                                    "

                                >

                                    <X className="h-5 w-5 text-white" />

                                </button>

                            </div>

                        </div>

                        {/* CONTENT */}

                        <div className="space-y-4 p-6">

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2.5">

                                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">

                                    <span className="text-xs font-medium text-slate-500">

                                        Parameter

                                    </span>

                                    <span className="text-sm font-semibold text-slate-900">

                                        {parameterName}

                                    </span>

                                </div>

                                <div className="flex items-center justify-between">

                                    <span className="text-xs font-medium text-slate-500">

                                        Code

                                    </span>

                                    <span className="font-mono text-sm font-semibold text-slate-900">

                                        {parameterCode}

                                    </span>

                                </div>

                            </div>

                            {/* LOCKED ITEMS */}

                            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">

                                <div className="flex items-start gap-3">

                                    <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100">

                                        <Lock className="h-4 w-4 text-amber-600" />

                                    </div>

                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-amber-900 mb-2">The following will be locked for editing:</p>
                                        <ul className="space-y-1">
                                            {[
                                                "Instruments, Chemicals & Standards",
                                                "Buffer & Mobile Phase Preparation",
                                                "Diluent Preparation",
                                                "Standard & Sample Preparations",
                                            ].map((item) => (
                                                <li key={item} className="flex items-center gap-2 text-sm text-amber-800">
                                                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                </div>

                            </div>

                            {/* INFO */}

                            <div className="flex gap-2.5 rounded-xl border border-blue-200 bg-blue-50 p-3">

                                <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-md bg-blue-100">

                                    <Info className="h-3.5 w-3.5 text-blue-600" />

                                </div>

                                <p className="text-sm leading-relaxed text-blue-800">

                                    Completing preparation will unlock the{" "}

                                    <strong>Calculations</strong>

                                    {" "}section.

                                    You can unlock preparation later if revisions are needed — as long as analysis has not yet been submitted.

                                </p>

                            </div>

                        </div>

                        {/* FOOTER */}

                        <div className="flex gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">

                            <button

                                onClick={onClose}

                                disabled={isCompleting}

                                className="
                                    flex-1
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    hover:bg-slate-50
                                "

                            >

                                Cancel

                            </button>

                            <button

                                onClick={onConfirm}

                                disabled={isCompleting}

                                className="
                                    flex
                                    flex-1
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-lg
                                    bg-gradient-to-r
                                    from-emerald-700
                                    to-slate-800
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-white
                                    shadow-sm
                                    hover:from-emerald-800
                                    hover:to-slate-900
                                "

                            >

                                {isCompleting ? (

                                    <>

                                        <Loader2 className="h-4 w-4 animate-spin" />

                                        Completing...

                                    </>

                                ) : (

                                    <>

                                        <ShieldCheck className="h-4 w-4" />

                                        Complete Preparation

                                    </>

                                )}

                            </button>

                        </div>

                    </motion.div>

                </motion.div>

            )}

        </AnimatePresence>

    );

};

export default PreparationCompleteModal;