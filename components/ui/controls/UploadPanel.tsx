import { Upload, FileText } from 'lucide-react';

interface UploadPanelProps {
  onFileUpload?: (file: File) => void;
}

export function UploadPanel({ onFileUpload }: UploadPanelProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <h4 className="text-white font-medium mb-3">Upload Model</h4>

      <div className="space-y-3">
        <div className="relative border-2 border-dashed border-white/10 rounded-xl p-8 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group text-center cursor-pointer">
          <input
            type="file"
            accept=".glb,.gltf"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 bg-white/5 rounded-full group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6 text-gray-400 group-hover:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Click or drag file to upload</p>
              <p className="text-xs text-gray-500 mt-1">Supports .glb and .gltf</p>
            </div>
          </div>
        </div>

        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex gap-3">
          <FileText className="w-5 h-5 text-blue-400 shrink-0" />
          <p className="text-xs text-blue-200/80">
            Uploaded models are processed locally and optimized for performance. Large files may
            take a moment to load.
          </p>
        </div>
      </div>
    </div>
  );
}
