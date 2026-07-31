import React from "react";
import { motion } from "framer-motion";

const variants = {
  primary:
  "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg",

  secondary:
    "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50",

  outline:
    "border border-indigo-600 text-indigo-600 hover:bg-indigo-50",

  ghost:
    "text-slate-700 hover:bg-slate-100",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      disabled={disabled}
      className={`
        inline-flex
        items-center
        justify-center
        rounded-full
        px-8
        py-4
        font-semibold
        transition-all
        duration-300
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
}