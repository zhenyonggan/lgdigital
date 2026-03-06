'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global Error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4 text-center">
          <h2 className="text-2xl font-bold text-red-600">应用遇到严重错误</h2>
          <p className="text-gray-600 max-w-md">
            {error.message || '发生未知错误，请尝试刷新页面。'}
          </p>
          <div className="text-xs text-gray-400 font-mono bg-gray-100 p-2 rounded">
            {error.digest && <p>Digest: {error.digest}</p>}
          </div>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            重试
          </button>
        </div>
      </body>
    </html>
  );
}
