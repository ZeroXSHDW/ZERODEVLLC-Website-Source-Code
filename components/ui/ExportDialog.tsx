"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Copy, Image, FileText, Settings } from "lucide-react";
import {
  captureScreenshot,
  downloadScreenshot,
  copyScreenshotToClipboard,
} from "@/lib/utils/screenshot";
import { log } from "@/lib/utils/logger";

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  canvas: HTMLCanvasElement | null;
  modelName?: string;
}

interface ExportPreset {
  name: string;
  width: number;
  height: number;
  description: string;
}

const EXPORT_PRESETS: ExportPreset[] = [
  {
    name: "Thumbnail",
    width: 256,
    height: 256,
    description: "Small preview image",
  },
  {
    name: "Social Media",
    width: 1200,
    height: 630,
    description: "Facebook/LinkedIn optimized",
  },
  {
    name: "HD Display",
    width: 1920,
    height: 1080,
    description: "Full HD resolution",
  },
  {
    name: "4K",
    width: 3840,
    height: 2160,
    description: "Ultra high resolution",
  },
  {
    name: "Custom",
    width: 0,
    height: 0,
    description: "Specify custom dimensions",
  },
];

const FORMAT_OPTIONS = [
  {
    value: "png",
    label: "PNG",
    description: "Lossless, supports transparency",
  },
  {
    value: "jpeg",
    label: "JPEG",
    description: "Smaller file size, no transparency",
  },
  {
    value: "webp",
    label: "WebP",
    description: "Modern format, best compression",
  },
] as const;

export function ExportDialog({
  isOpen,
  onClose,
  canvas,
  modelName = "3d-scene",
}: ExportDialogProps) {
  const [selectedPreset, setSelectedPreset] = useState<ExportPreset>(
    EXPORT_PRESETS[2],
  ); // HD Display default
  const [selectedFormat, setSelectedFormat] = useState<"png" | "jpeg" | "webp">(
    "png",
  );
  const [quality, setQuality] = useState(95);
  const [customWidth, setCustomWidth] = useState(1920);
  const [customHeight, setCustomHeight] = useState(1080);
  const [isExporting, setIsExporting] = useState(false);

  const currentWidth =
    selectedPreset.name === "Custom" ? customWidth : selectedPreset.width;
  const currentHeight =
    selectedPreset.name === "Custom" ? customHeight : selectedPreset.height;

  const handleExport = async (action: "download" | "copy") => {
    if (!canvas) return;

    setIsExporting(true);
    try {
      const dataUrl = captureScreenshot(canvas, {
        width: currentWidth,
        height: currentHeight,
        format: selectedFormat,
        quality: quality / 100,
      });

      if (!dataUrl) {
        throw new Error("Failed to capture screenshot");
      }

      const filename = `${modelName}-${selectedPreset.name.toLowerCase().replace(" ", "-")}-${currentWidth}x${currentHeight}.${selectedFormat}`;

      if (action === "download") {
        downloadScreenshot(dataUrl, filename);
      } else if (action === "copy") {
        await copyScreenshotToClipboard(dataUrl);
      }

      onClose();
    } catch (error) {
      log.error("Export failed:", error);
      // You could show a toast here
    } finally {
      setIsExporting(false);
    }
  };

  const estimatedFileSize = () => {
    // Rough estimation based on format and resolution
    const pixels = currentWidth * currentHeight;
    let bytesPerPixel = 4; // RGBA

    switch (selectedFormat) {
      case "jpeg":
        bytesPerPixel = 3 * (quality / 100); // RGB with quality factor
        break;
      case "webp":
        bytesPerPixel = 2.5 * (quality / 100); // WebP compression
        break;
      case "png":
      default:
        bytesPerPixel = 4; // PNG is lossless
        break;
    }

    const bytes = pixels * bytesPerPixel;
    if (bytes < 1024) return `${Math.round(bytes)} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${Math.round(bytes / (1024 * 1024))} MB`;
  };

  if (!canvas) return null;

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

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 max-w-md w-full mx-4 max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-400" />
                <h3 className="text-white font-semibold">Export Options</h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-1"
                aria-label="Close export dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Preset Selection */}
              <div>
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <Image className="w-4 h-4" aria-hidden="true" />
                  Resolution Preset
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {EXPORT_PRESETS.map((preset) => (
                    <label
                      key={preset.name}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedPreset.name === preset.name
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-gray-700 hover:border-gray-600"
                      }`}
                    >
                      <input
                        type="radio"
                        name="preset"
                        value={preset.name}
                        checked={selectedPreset.name === preset.name}
                        onChange={() => setSelectedPreset(preset)}
                        className="text-blue-500"
                      />
                      <div className="flex-1">
                        <div className="text-white font-medium">
                          {preset.name}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {preset.width > 0
                            ? `${preset.width}×${preset.height}`
                            : "Custom dimensions"}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {preset.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Custom Dimensions */}
              {selectedPreset.name === "Custom" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 p-3 bg-gray-800/50 rounded-lg"
                >
                  <h5 className="text-white font-medium">Custom Dimensions</h5>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Width
                      </label>
                      <input
                        type="number"
                        value={customWidth}
                        onChange={(e) =>
                          setCustomWidth(
                            Math.max(64, parseInt(e.target.value) || 1920),
                          )
                        }
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                        min="64"
                        max="8192"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Height
                      </label>
                      <input
                        type="number"
                        value={customHeight}
                        onChange={(e) =>
                          setCustomHeight(
                            Math.max(64, parseInt(e.target.value) || 1080),
                          )
                        }
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                        min="64"
                        max="8192"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Format Selection */}
              <div>
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Export Format
                </h4>
                <div className="space-y-2">
                  {FORMAT_OPTIONS.map((format) => (
                    <label
                      key={format.value}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedFormat === format.value
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-gray-700 hover:border-gray-600"
                      }`}
                    >
                      <input
                        type="radio"
                        name="format"
                        value={format.value}
                        checked={selectedFormat === format.value}
                        onChange={(e) =>
                          setSelectedFormat(
                            e.target.value as typeof selectedFormat,
                          )
                        }
                        className="text-blue-500"
                      />
                      <div className="flex-1">
                        <div className="text-white font-medium">
                          {format.label}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {format.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quality Settings */}
              {(selectedFormat === "jpeg" || selectedFormat === "webp") && (
                <div>
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Quality Settings
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300">Quality</span>
                        <span className="text-white font-mono">{quality}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={quality}
                        onChange={(e) => setQuality(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Export Summary */}
              <div className="bg-gray-800 rounded-lg p-3">
                <h5 className="text-white font-medium mb-2">Export Summary</h5>
                <div className="text-sm space-y-1 text-gray-300">
                  <div>
                    Resolution:{" "}
                    <span className="text-white">
                      {currentWidth}×{currentHeight}
                    </span>
                  </div>
                  <div>
                    Format:{" "}
                    <span className="text-white">
                      {selectedFormat.toUpperCase()}
                    </span>
                  </div>
                  {(selectedFormat === "jpeg" || selectedFormat === "webp") && (
                    <div>
                      Quality: <span className="text-white">{quality}%</span>
                    </div>
                  )}
                  <div>
                    Estimated size:{" "}
                    <span className="text-white">{estimatedFileSize()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-4 border-t border-gray-700">
              <button
                onClick={() => handleExport("download")}
                disabled={isExporting || !canvas}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                {isExporting ? "Exporting..." : "Download"}
              </button>

              <button
                onClick={() => handleExport("copy")}
                disabled={isExporting || !canvas}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                <Copy className="w-4 h-4" />
                {isExporting ? "Copying..." : "Copy"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
