import React from 'react';
import { CountdownTimer } from '../common/CountdownTimer.tsx';

interface HoldTimerBannerProps {
  secondsRemaining: number;
}

export const HoldTimerBanner: React.FC<HoldTimerBannerProps> = ({ secondsRemaining }) => {
  return (
    <div className="p-3.5 bg-zinc-50 border-b border-zinc-200">
      <CountdownTimer seconds={secondsRemaining} />
    </div>
  );
};
