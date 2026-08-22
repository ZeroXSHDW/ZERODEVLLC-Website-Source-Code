"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Cpu, Zap, Eye, BarChart3, X } from "lucide-react";
import { usePerformanceMonitor } from "@/lib/hooks/usePerformanceMonitor";

interface PerformanceMonitorProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function PerformanceMonitor({
  isOpen,
  onClose,
  className,
}: PerformanceMonitorProps) {
  const { metrics } = usePerformanceMonitor(isOpen);

  const getFpsColor = (fps: number) => {
    if (fps >= 60) return "text-green-400";
    if (fps >= 30) return "text-yellow-400";
    return "text-red-400";
  };

  const getFrameTimeColor = (frameTime: number) => {
    if (frameTime <= 16.67) return "text-green-400"; // 60 FPS
    if (frameTime <= 33.33) return "text-yellow-400"; // 30 FPS
    return "text-red-400";
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`fixed top-4 right-4 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-2xl z-50 min-w-[280px] ${className || ""}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                <h3 className="text-white font-semibold">
                  Performance Monitor
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-1"
                aria-label="Close performance monitor"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* FPS and Frame Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300 text-sm">FPS</span>
                  </div>
                  <div
                    className={`text-2xl font-bold ${getFpsColor(metrics.fps)}`}
                  >
                    {metrics.fps}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {metrics.fps >= 60
                      ? "Excellent"
                      : metrics.fps >= 30
                        ? "Good"
                        : "Poor"}
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300 text-sm">Frame Time</span>
                  </div>
                  <div
                    className={`text-2xl font-bold ${getFrameTimeColor(metrics.frameTime)}`}
                  >
                    {metrics.frameTime}ms
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Target: &lt;16.7ms
                  </div>
                </div>
              </div>

              {/* Memory Usage */}
              {metrics.memoryUsage !== undefined && (
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-300 text-sm">Memory Usage</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-400">
                    {metrics.memoryUsage}MB
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    JavaScript Heap
                  </div>
                </div>
              )}

              {/* Render Statistics */}
              <div className="space-y-3">
                <h4 className="text-white font-medium text-sm flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Render Statistics
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-800 rounded p-2">
                    <div className="text-xs text-gray-400">Draw Calls</div>
                    <div className="text-lg font-semibold text-white">
                      {formatNumber(metrics.drawCalls)}
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded p-2">
                    <div className="text-xs text-gray-400">Triangles</div>
                    <div className="text-lg font-semibold text-white">
                      {formatNumber(metrics.triangles)}
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded p-2">
                    <div className="text-xs text-gray-400">Geometries</div>
                    <div className="text-lg font-semibold text-white">
                      {metrics.geometries}
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded p-2">
                    <div className="text-xs text-gray-400">Textures</div>
                    <div className="text-lg font-semibold text-white">
                      {metrics.textures}
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Tips */}
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                <h5 className="text-blue-400 font-medium text-sm mb-2">
                  Performance Tips
                </h5>
                <ul className="text-xs text-blue-300 space-y-1">
                  {metrics.fps < 30 && (
                    <li>• Enable performance mode to reduce quality</li>
                  )}
                  {metrics.triangles > 100000 && (
                    <li>• Consider using LOD for complex models</li>
                  )}
                  {metrics.memoryUsage && metrics.memoryUsage > 100 && (
                    <li>• High memory usage detected</li>
                  )}
                  {metrics.fps >= 60 && <li>• Performance is excellent! 🎉</li>}
                </ul>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
