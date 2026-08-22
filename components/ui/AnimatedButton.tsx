"use client";

import { motion } from "framer-motion";
import { forwardRef } from "react";

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  glowEffect?: boolean;
  children: React.ReactNode;
}

const buttonVariants = {
  primary: {
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    hoverBackground: "linear-gradient(135deg, #2563eb, #1e40af)",
    shadow: "0 4px 15px rgba(59, 130, 246, 0.4)",
    hoverShadow: "0 6px 20px rgba(59, 130, 246, 0.6)",
  },
  secondary: {
    background: "linear-gradient(135deg, #6b7280, #374151)",
    hoverBackground: "linear-gradient(135deg, #4b5563, #1f2937)",
    shadow: "0 4px 15px rgba(107, 114, 128, 0.3)",
    hoverShadow: "0 6px 20px rgba(107, 114, 128, 0.5)",
  },
  danger: {
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    hoverBackground: "linear-gradient(135deg, #dc2626, #b91c1c)",
    shadow: "0 4px 15px rgba(239, 68, 68, 0.4)",
    hoverShadow: "0 6px 20px rgba(239, 68, 68, 0.6)",
  },
  ghost: {
    background: "rgba(255, 255, 255, 0.05)",
    hoverBackground: "rgba(255, 255, 255, 0.1)",
    shadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
    hoverShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
  },
};

const sizeClasses = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-3 text-base",
  lg: "px-6 py-4 text-lg",
};

export const AnimatedButton = forwardRef<
  HTMLButtonElement,
  AnimatedButtonProps
>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      glowEffect = false,
      className = "",
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const variantStyles = buttonVariants[variant];

    return (
      <motion.div
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        animate={
          glowEffect
            ? {
                boxShadow: [
                  variantStyles.shadow,
                  `${variantStyles.shadow}, 0 0 20px rgba(59, 130, 246, 0.8)`,
                  variantStyles.shadow,
                ],
              }
            : {}
        }
        transition={{
          boxShadow: glowEffect
            ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
            : undefined,
        }}
      >
        <button
          ref={ref}
          className={`relative overflow-hidden rounded-lg font-medium text-white transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/20 ${sizeClasses[size]} ${className}`}
          style={{
            background: variantStyles.background,
            boxShadow: variantStyles.shadow,
          }}
          disabled={disabled || isLoading}
          {...props}
        >
          {isLoading && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          )}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          <motion.div
            className="relative z-10 flex items-center justify-center gap-2"
            animate={{ opacity: isLoading ? 0.5 : 1 }}
          >
            {children}
          </motion.div>
        </button>
      </motion.div>
    );
  },
);

AnimatedButton.displayName = "AnimatedButton";
