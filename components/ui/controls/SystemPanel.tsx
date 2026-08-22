import { useServiceWorkerContext } from "@/components/ServiceWorkerProvider";
import { HardDrive } from "lucide-react";
import { toast } from "sonner";

export function SystemPanel() {
  const { isRegistered, version, clearCache } = useServiceWorkerContext();

  const handleClearCache = async () => {
    await clearCache();
    toast.success("Cache cleared");
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <h4 className="text-white font-medium mb-3">System Information</h4>

      <div className="space-y-3">
        {/* Service Worker Status */}
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300 text-sm">Service Worker</span>
            <span
              className={`text-xs px-2 py-1 rounded-full ${isRegistered ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
            >
              {isRegistered ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Version: {version || "Unknown"}
          </div>
        </div>

        {/* Clear Cache */}
        <button
          onClick={handleClearCache}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded transition-colors"
        >
          <HardDrive className="w-4 h-4" />
          Clear Cache
        </button>
      </div>
    </div>
  );
}
