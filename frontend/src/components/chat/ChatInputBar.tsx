import React, { useState, useRef } from 'react';
import { Send, Image as ImageIcon, X } from 'lucide-react';

interface ChatInputBarProps {
  onSendMessage: (text: string, imageAttachmentUrl?: string) => void;
  disabled?: boolean;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({ onSendMessage, disabled = false }) => {
  const [text, setText] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if ((text.trim() || attachedImage) && !disabled) {
      onSendMessage(text.trim(), attachedImage || undefined);
      setText('');
      setAttachedImage(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSend} className="p-3 border-t border-zinc-200 bg-white space-y-2">
      {attachedImage && (
        <div className="relative inline-block bg-zinc-100 rounded-lg overflow-hidden border border-zinc-200 shadow-sm">
          <img src={attachedImage} alt="Attachment Preview" className="w-16 h-16 object-cover" />
          <button
            type="button"
            onClick={() => setAttachedImage(null)}
            className="absolute top-1 right-1 p-0.5 rounded-full bg-black text-white hover:bg-zinc-800"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-xl transition-colors shrink-0"
          title="Attach height/build fit reference photo"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask stylist about fit, boxy drape, height..."
          disabled={disabled}
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs sm:text-sm text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:border-black transition-all font-mono"
        />

        <button
          type="submit"
          disabled={(!text.trim() && !attachedImage) || disabled}
          className="p-2.5 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm transition-all shrink-0 font-bold"
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};
