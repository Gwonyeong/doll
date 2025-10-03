"use client";

import dynamic from 'next/dynamic';

const MapPageClient = dynamic(() => import('@/components/MapPageClient'), {
  ssr: false,
  loading: () => (
    <div className="relative w-full h-screen overflow-hidden bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 flex items-center gap-3 shadow-lg">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="text-gray-700">지도를 불러오는 중...</span>
      </div>
    </div>
  )
});

export default function MapPage() {
  return <MapPageClient />;
}