import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: any;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  colorScheme?: "purple" | "blue" | "green" | "amber" | "rose" | "red" | "emerald" | "indigo" | "orange" | "lime" | "sky";
  disabled?: boolean;
}

const colorSchemes = {
  purple: {
    main: "from-purple-600 via-purple-500 to-pink-500",
    light: "from-purple-50 to-pink-50",
    border: "border-purple-300",
    ring: "ring-purple-400",
    text: "text-purple-900",
    hover: "hover:bg-purple-50",
    selected: "bg-purple-100 text-purple-900",
    badge: "bg-purple-500",
  },
  blue: {
    main: "from-blue-600 via-blue-500 to-cyan-500",
    light: "from-blue-50 to-cyan-50",
    border: "border-blue-300",
    ring: "ring-blue-400",
    text: "text-blue-900",
    hover: "hover:bg-blue-50",
    selected: "bg-blue-100 text-blue-900",
    badge: "bg-blue-500",
  },
  green: {
    main: "from-green-600 via-green-500 to-emerald-500",
    light: "from-green-50 to-emerald-50",
    border: "border-green-300",
    ring: "ring-green-400",
    text: "text-green-900",
    hover: "hover:bg-green-50",
    selected: "bg-green-100 text-green-900",
    badge: "bg-green-500",
  },
  amber: {
    main: "from-amber-600 via-amber-500 to-orange-500",
    light: "from-amber-50 to-orange-50",
    border: "border-amber-300",
    ring: "ring-amber-400",
    text: "text-amber-900",
    hover: "hover:bg-amber-50",
    selected: "bg-amber-100 text-amber-900",
    badge: "bg-amber-500",
  },
  red: {
    main: "from-red-600 via-red-500 to-rose-500",
    light: "from-red-50 to-rose-50",
    border: "border-red-300",
    ring: "ring-red-400",
    text: "text-red-900",
    hover: "hover:bg-red-50",
    selected: "bg-red-100 text-red-900",
    badge: "bg-red-500",
  },
  rose: {
    main: "from-rose-600 via-rose-500 to-pink-500",
    light: "from-rose-50 to-pink-50",
    border: "border-rose-300",
    ring: "ring-rose-400",
    text: "text-rose-900",
    hover: "hover:bg-rose-50",
    selected: "bg-rose-100 text-rose-900",
    badge: "bg-rose-500",
  },
  emerald: {
    main: "from-emerald-600 via-emerald-500 to-teal-500",
    light: "from-emerald-50 to-teal-50",
    border: "border-emerald-300",
    ring: "ring-emerald-400",
    text: "text-emerald-900",
    hover: "hover:bg-emerald-50",
    selected: "bg-emerald-100 text-emerald-900",
    badge: "bg-emerald-500",
  },
  indigo: {
    main: "from-indigo-600 via-indigo-500 to-purple-500",
    light: "from-indigo-50 to-purple-50",
    border: "border-indigo-300",
    ring: "ring-indigo-400",
    text: "text-indigo-900",
    hover: "hover:bg-indigo-50",
    selected: "bg-indigo-100 text-indigo-900",
    badge: "bg-indigo-500",
  },
  orange: {
    main: "from-orange-600 via-orange-500 to-amber-500",
    light: "from-orange-50 to-amber-50",
    border: "border-orange-300",
    ring: "ring-orange-400",
    text: "text-orange-900",
    hover: "hover:bg-orange-50",
    selected: "bg-orange-100 text-orange-900",
    badge: "bg-orange-500",
  },
  lime: {
    main: "from-lime-600 via-lime-500 to-green-500",
    light: "from-lime-50 to-green-50",
    border: "border-lime-300",
    ring: "ring-lime-400",
    text: "text-lime-900",
    hover: "hover:bg-lime-50",
    selected: "bg-lime-100 text-lime-900",
    badge: "bg-lime-500",
  },
  sky: {
    main: "from-sky-600 via-sky-500 to-blue-500",
    light: "from-sky-50 to-blue-50",
    border: "border-sky-300",
    ring: "ring-sky-400",
    text: "text-sky-900",
    hover: "hover:bg-sky-50",
    selected: "bg-sky-100 text-sky-900",
    badge: "bg-sky-500",
  },
};

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
  colorScheme = "purple",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const colors = colorSchemes[colorScheme];
  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <motion.button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.01 } : {}}
        whileTap={!disabled ? { scale: 0.99 } : {}}
        className={`
          w-full px-3 py-2 text-left text-xs rounded-lg border 
          transition-all duration-200 flex items-center justify-between gap-2
          ${colors.border} bg-white ${colors.text}
          ${disabled ? "opacity-50 cursor-not-allowed" : `hover:shadow-md focus:outline-none focus:ring-2 ${colors.ring}`}
        `}
      >
        <span className="truncate flex-1">
          {selectedOption ? (
            <span className="font-medium">{selectedOption.label}</span>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`absolute z-50 w-full mt-1 bg-white rounded-lg shadow-xl border overflow-hidden ${colors.border}`}
          >
            {/* Options List */}
            <div className="max-h-60 overflow-y-auto">
              {options.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-gray-500">
                  No options available
                </div>
              ) : (
                <div className="py-1">
                  {options.map((option, index) => {
                    const isSelected = option.value === value;
                    return (
                      <motion.button
                        key={option.value}
                        type="button"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        onClick={() => handleSelect(option.value)}
                        className={`
                          w-full text-left px-3 py-2
                          transition-all duration-150 text-xs font-medium
                          flex items-center justify-between gap-2
                          ${isSelected ? colors.selected : `${colors.hover}`}
                        `}
                      >
                        <span>{option.label}</span>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`w-4 h-4 rounded-full ${colors.badge} flex items-center justify-center flex-shrink-0`}
                          >
                            <Check className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomDropdown;