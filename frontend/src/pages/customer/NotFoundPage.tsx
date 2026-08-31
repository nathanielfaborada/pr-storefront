import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button.tsx';
import { AlertCircle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16 font-mono">
      <div className="w-14 h-14 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400 mb-4 shadow-sm">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h1 className="font-heading text-4xl font-extrabold text-zinc-950">404</h1>
      <h2 className="font-heading text-lg font-bold text-zinc-800 mt-1">Page Not Found</h2>
      <p className="text-xs text-zinc-500 mt-2 max-w-sm leading-relaxed">
        The streetwear archive page or piece you are looking for does not exist or has been removed.
      </p>
      <Button
        variant="primary"
        size="sm"
        className="mt-6 shadow-sm"
        onClick={() => navigate('/')}
      >
        ← Return to Drop 08
      </Button>
    </div>
  );
};
