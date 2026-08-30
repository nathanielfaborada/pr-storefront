import React from 'react';
import { AlertCircle } from 'lucide-react';

interface PolicyDisclaimerProps {
  accepted: boolean;
  onToggle: (accepted: boolean) => void;
}

export const PolicyDisclaimer: React.FC<PolicyDisclaimerProps> = ({ accepted, onToggle }) => {
  return (
    <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3 font-mono shadow-sm">
      <div className="flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-700 leading-relaxed">
          <strong className="text-zinc-950 font-heading">1-of-1 Curated Streetwear Policy:</strong> All releases are unique 1-of-1 archive garments. Hand-measured Boxy Width (pit-to-pit) and Cropped Length dimensions are provided on every product specification card.
        </div>
      </div>

      <label className="flex items-start gap-2.5 pt-2 border-t border-zinc-200 cursor-pointer select-none">
        <input
          type="checkbox"
          required
          checked={accepted}
          onChange={(e) => onToggle(e.target.checked)}
          className="mt-0.5 rounded border-zinc-300 text-black focus:ring-black w-4 h-4"
        />
        <span className="text-xs text-zinc-700 leading-tight">
          I confirm that I have verified the Boxy Width and Cropped Length against my personal fit. I agree that all sales of 1-of-1 pieces are final (No Return / No Exchange unless gross misrepresentation).
        </span>
      </label>
    </div>
  );
};
