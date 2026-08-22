"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LOADING_MESSAGES } from "@/config/ui";
import type { LoadingFallbackProps } from "@/lib/types";

const loadingVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Particle component for background effect
function LoadingParticles() {
  // Always render the container for hydration consistency
  // Particles will only animate on client side
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/10 rounded-full"
          initial={{
            x:
              typeof window !== "undefined"
                ? Math.random() * window.innerWidth
                : 0,
            y: typeof window !== "undefined" ? window.innerHeight + 10 : 0,
            opacity: 0,
          }}
          animate={{
            y: -10,
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

export function LoadingFallback({
  message,
  progress = 0,
}: LoadingFallbackProps) {
  const [displayMessage, setDisplayMessage] = useState<string>("");

  useEffect(() => {
    setDisplayMessage(
      message ||
        LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)],
    );
  }, [message]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={loadingVariants}
      transition={{ duration: 0.5 }}
      className="relative flex items-center justify-center w-full h-full bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden"
    >
      {/* Background particles */}
      <LoadingParticles />

      <div className="relative z-10 text-center space-y-8 max-w-md px-4">
        {/* Main loading icon */}
        <motion.div
          className="relative mx-auto w-24 h-24"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />

          {/* Inner ring */}
          <motion.div
            className="absolute inset-2 border-4 border-transparent border-b-pink-500 border-l-cyan-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />

          {/* Center dot */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-3 h-3 bg-white rounded-full shadow-lg" />
          </motion.div>
        </motion.div>

        {/* Loading text with typewriter effect */}
        <motion.div
          className="text-white font-mono text-xl min-h-[2rem] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.span
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {displayMessage}
          </motion.span>
        </motion.div>

        {/* Enhanced progress bar with glow effect */}
        <div className="relative">
          <div className="w-full bg-gray-800/50 rounded-full h-4 overflow-hidden backdrop-blur-sm border border-gray-700/50 shadow-inner">
            <motion.div
              className="h-full relative rounded-full overflow-hidden"
              animate={{
                width:
                  progress > 0
                    ? `${Math.min(100, Math.max(0, progress))}%`
                    : "30%",
              }}
              transition={{
                width:
                  progress > 0
                    ? { duration: 0.5, ease: "easeOut" }
                    : {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        repeatType: "reverse",
                      },
              }}
              key={progress > 0 ? "progress" : "loading"}
            >
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

              {/* Animated shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-sm opacity-50" />
            </motion.div>
          </div>

          {/* Progress percentage with floating animation */}
          {progress > 0 && (
            <motion.div
              className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm text-white font-mono font-bold"
              animate={{
                y: [0, -3, 0],
                textShadow: [
                  "0 0 0px rgba(255,255,255,0)",
                  "0 0 10px rgba(255,255,255,0.5)",
                  "0 0 0px rgba(255,255,255,0)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {Math.round(progress)}%
            </motion.div>
          )}
        </div>

        {/* Animated status indicators */}
        <div className="flex justify-center space-x-4">
          {[
            { label: "Loading", color: "bg-blue-500", delay: 0 },
            { label: "Processing", color: "bg-purple-500", delay: 0.2 },
            { label: "Rendering", color: "bg-pink-500", delay: 0.4 },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              className="flex flex-col items-center space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: item.delay }}
            >
              <motion.div
                className={`w-3 h-3 ${item.color} rounded-full shadow-lg`}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: progress > (i + 1) * 30 ? 1 : [0.3, 1, 0.3],
                }}
                transition={{
                  scale: { duration: 1.5, repeat: Infinity },
                  opacity: { duration: 2, repeat: Infinity },
                }}
              />
              <span className="text-xs text-gray-400 font-medium">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Inspirational message */}
        <motion.div
          className="text-sm text-gray-500 italic max-w-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          &ldquo;Every pixel tells a story...&rdquo;
        </motion.div>
      </div>

      {/* Subtle vignette effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20 pointer-events-none" />
    </motion.div>
  );
}
