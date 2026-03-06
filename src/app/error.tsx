'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page Error:', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[500px] p-6">
      <Card className="w-full max-w-md border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700">页面加载失败</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-red-600">
            {error.message || '发生了意料之外的错误。'}
          </p>
          {process.env.NODE_ENV === 'development' && (
            <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-40 border border-red-100">
              {error.stack}
            </pre>
          )}
          <Button 
            onClick={() => reset()} 
            variant="destructive"
            className="w-full"
          >
            尝试重新加载
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
