'use client';

import { Header } from '@/components/header';
import { Board } from '@/components/board';
import { useState, useEffect, useCallback } from 'react';
import { type Column } from '@/lib/db/schema';
import { getColumns } from '@/lib/actions/board';

export default function Home() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadColumns = useCallback(async () => {
    try {
      const { data, error } = await getColumns();
      if (error) {
        setError(error);
        return;
      }
      if (data) {
        setColumns(data);
      }
    } catch (error) {
      setError('Failed to load columns');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadColumns();
  }, [loadColumns]);

  const handleColumnCreate = (newColumn: Column) => {
    setColumns(prev => [...prev, newColumn]);
  };

  const handleColumnDelete = (columnId: number) => {
    setColumns(prev => prev.filter(col => col.id !== columnId));
  };

  if (isLoading) {
    return (
      <main className="flex h-screen flex-col">
        <Header onColumnCreate={handleColumnCreate} />
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-gray-500">Loading board data...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex h-screen flex-col">
        <Header onColumnCreate={handleColumnCreate} />
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 font-medium">{error}</p>
            <button 
              onClick={loadColumns}
              className="mt-4 text-sm text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-screen flex-col">
      <Header onColumnCreate={handleColumnCreate} />
      <Board 
        columns={columns} 
        onColumnCreate={handleColumnCreate} 
        onColumnDelete={handleColumnDelete}
      />
    </main>
  );
}
