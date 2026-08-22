"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, File, AlertCircle, CheckCircle } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export function FileUpload({
  onFileSelect,
  accept = ".glb,.gltf",
  maxSize = 50, // 50MB default
  className = "",
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file type
      const validTypes = ["model/gltf-binary", "model/gltf+json"];
      const validExtensions = [".glb", ".gltf"];

      const hasValidType = validTypes.includes(file.type);
      const hasValidExtension = validExtensions.some((ext) =>
        file.name.toLowerCase().endsWith(ext),
      );

      if (!hasValidType && !hasValidExtension) {
        return "Please select a valid GLB or GLTF file.";
      }

      // Check file size
      const sizeInMB = file.size / (1024 * 1024);
      if (sizeInMB > maxSize) {
        return `File size must be less than ${maxSize}MB. Selected file is ${sizeInMB.toFixed(1)}MB.`;
      }

      return null;
    },
    [maxSize],
  );

  const handleFileSelect = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        setSelectedFile(null);
        return;
      }

      setError(null);
      setSelectedFile(file);
      onFileSelect(file);
    },
    [validateFile, onFileSelect],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect],
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Upload area */}
      <motion.div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${
            isDragOver
              ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
          }
          ${selectedFile ? "bg-green-50 dark:bg-green-900/20 border-green-400" : ""}
          ${error ? "bg-red-50 dark:bg-red-900/20 border-red-400" : ""}
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <AnimatePresence mode="wait">
          {selectedFile ? (
            <motion.div
              key="selected"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center justify-center space-x-3"
            >
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div className="text-left">
                <div className="text-sm font-medium text-green-700 dark:text-green-300">
                  {selectedFile.name}
                </div>
                <div className="text-xs text-green-600 dark:text-green-400">
                  {formatFileSize(selectedFile.size)}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearSelection();
                }}
                className="p-1 text-green-500 hover:text-green-700 dark:hover:text-green-300"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center justify-center space-x-3"
            >
              <AlertCircle className="w-8 h-8 text-red-500" />
              <div className="text-left">
                <div className="text-sm font-medium text-red-700 dark:text-red-300">
                  Upload failed
                </div>
                <div className="text-xs text-red-600 dark:text-red-400 max-w-xs">
                  {error}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setError(null);
                }}
                className="p-1 text-red-500 hover:text-red-700 dark:hover:text-red-300"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <Upload
                className={`w-12 h-12 mx-auto ${isDragOver ? "text-blue-500" : "text-gray-400"}`}
              />
              <div>
                <div className="text-lg font-medium text-gray-900 dark:text-white">
                  {isDragOver ? "Drop your file here" : "Upload a 3D model"}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Drag & drop or click to browse
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  Supports GLB and GLTF files up to {maxSize}MB
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
