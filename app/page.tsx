'use client';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import GLBViewer from '@/components/ui/glb-viewer';

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="w-screen h-screen bg-black flex items-center justify-center overflow-hidden p-0 m-0">
        <GLBViewer />
      </div>
    </ErrorBoundary>
  );
}
