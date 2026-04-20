import { motion } from "framer-motion";
import { useState } from "react";

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
}

export default function Input({
  value,
  onChange,
  placeholder = "",
  className = "",
  multiline = false,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const baseClasses = "w-full p-4 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none transition-all duration-300 resize-none";
  const focusClasses = isFocused ? "border-blue-500 shadow-lg shadow-blue-500/20" : "";

  return (
    <motion.div
      className={`relative ${className}`}
      animate={{ scale: isFocused ? 1.01 : 1 }}
      transition={{ duration: 0.2 }}
    >
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${baseClasses} ${focusClasses} min-h-[120px]`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${baseClasses} ${focusClasses}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      )}
    </motion.div>
  );
}