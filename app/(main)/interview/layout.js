"use client";

import { Suspense } from "react";

export default function Layout({ children }) {
  return (
    <div className="px-5">
      <div className="flex items-center justify-between mb-5">
        {/* Your header content here */}
      </div>
      <Suspense
        fallback={
          <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
            <div className="h-full bg-blue-500 animate-loading"></div>
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  );
}