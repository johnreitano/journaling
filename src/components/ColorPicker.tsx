'use client';

import { EntryColor } from '@/lib/types';

const COLORS: { name: EntryColor; label: string; bgClass: string }[] = [
  { name: 'red', label: 'Red', bgClass: 'bg-red-500' },
  { name: 'orange', label: 'Orange', bgClass: 'bg-orange-500' },
  { name: 'yellow', label: 'Yellow', bgClass: 'bg-yellow-500' },
  { name: 'green', label: 'Green', bgClass: 'bg-green-500' },
  { name: 'blue', label: 'Blue', bgClass: 'bg-blue-500' },
  { name: 'purple', label: 'Purple', bgClass: 'bg-purple-500' },
  { name: null, label: 'Clear', bgClass: 'bg-stone-300' },
];

interface ColorPickerProps {
  selectedColor: EntryColor;
  onColorChange: (color: EntryColor) => void;
}

export function ColorPicker({ selectedColor, onColorChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-2 border-r border-stone-200 pr-2">
      <span className="text-xs text-stone-600">Color:</span>
      <div className="flex gap-1">
        {COLORS.map((color) => (
          <button
            key={color.name || 'clear'}
            onClick={() => onColorChange(color.name)}
            className={`w-6 h-6 rounded-full border-2 transition-all ${
              selectedColor === color.name
                ? 'border-stone-800 scale-110'
                : 'border-stone-300 hover:border-stone-400'
            } ${color.bgClass}`}
            title={color.label}
            aria-label={color.label}
          />
        ))}
      </div>
    </div>
  );
}
