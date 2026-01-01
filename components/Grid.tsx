'use client';

import { useEffect, useState } from 'react';

const GRID_SIZE = 10;
const COLORS = [
  '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff',
  '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080',
];

export default function Grid() {
  const [grid, setGrid] = useState<string[][]>(
    Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill('#ffffff'))
  );
  const [selectedColor, setSelectedColor] = useState(COLORS[2]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGrid = async () => {
      try {
        const response = await fetch('/api/grid');
        const data = await response.json();
        setGrid(data.grid);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch grid:', error);
        setIsLoading(false);
      }
    };

    fetchGrid();

    const interval = setInterval(() => {
      fetchGrid();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCellClick = async (row: number, col: number) => {
    try {
      const response = await fetch('/api/grid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ row, col, color: selectedColor }),
      });

      const data = await response.json();
      if (data.success) {
        setGrid(data.grid);
      }
    } catch (error) {
      console.error('Failed to update cell:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <h1 className="text-3xl font-bold">Place Clone - 10x10 Grid</h1>
      
      <div className="flex flex-col items-center gap-4">
        <div className="text-sm font-medium">Select a color:</div>
        <div className="flex gap-2 flex-wrap justify-center max-w-md">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-12 h-12 rounded-lg border-2 transition-all hover:scale-110 ${
                selectedColor === color
                  ? 'border-black dark:border-white scale-110'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
        <div className="text-sm">
          Selected: <span className="font-mono">{selectedColor}</span>
        </div>
      </div>

      <div className="inline-block border-4 border-gray-800 dark:border-gray-200 rounded-lg overflow-hidden">
        <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}>
          {grid.map((row, rowIndex) =>
            row.map((color, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className="w-12 h-12 border border-gray-300 dark:border-gray-700 hover:opacity-80 transition-opacity"
                style={{ backgroundColor: color }}
                aria-label={`Cell ${rowIndex}, ${colIndex}`}
              />
            ))
          )}
        </div>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md">
        Click on any cell to paint it with your selected color. The grid updates in real-time for all players!
      </div>
    </div>
  );
}
