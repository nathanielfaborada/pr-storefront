import React from 'react';
import { QuickChip } from '../../types/index.ts';

interface QuickActionChipsProps {
  onSelectChip: (text: string) => void;
  hasAttachedProduct: boolean;
}

export const QuickActionChips: React.FC<QuickActionChipsProps> = ({
  onSelectChip,
  hasAttachedProduct,
}) => {
  const chips: QuickChip[] = hasAttachedProduct
    ? [
        { id: '1', label: '⚡ Available pa?', promptText: 'Available pa ba tong piece na to?' },
        { id: '2', label: '📸 Pa-send fitpic / video', promptText: 'Pwede pa-send ng on-body fitpic or video drape preview?' },
        { id: '3', label: '📏 Inquire boxy measurements', promptText: 'Ano exact boxy chest width and shoulder drop in inches?' },
        { id: '4', label: '⏳ Pa-lock until 12mn', promptText: 'Pwede pa-lock muna or hold until tonight?' },
      ]
    : [
        { id: '1', label: '🔥 How to order?', promptText: 'How to order and checkout pieces?' },
        { id: '2', label: '📦 Same-Day Lalamove?', promptText: 'Available ba same-day Grab/Lalamove dispatch for Metro Manila?' },
        { id: '3', label: '🧼 Fabric & Sanitization', promptText: 'Anong GSM weight ng blanks and sanitized ba before packaging?' },
        { id: '4', label: '🏷️ Next Drop Schedule', promptText: 'Kailan ang next drop ng heavy boxy tees and cargos?' },
      ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 px-1">
      {chips.map(chip => (
        <button
          key={chip.id}
          onClick={() => onSelectChip(chip.promptText)}
          className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-full bg-white hover:bg-zinc-950 hover:text-white text-zinc-700 border border-zinc-200 shrink-0 transition-colors shadow-sm active:scale-95"
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
};
