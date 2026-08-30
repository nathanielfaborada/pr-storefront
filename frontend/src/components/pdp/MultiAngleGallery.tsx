import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Video, Camera } from 'lucide-react';
import { ImageWithFallback } from '../common/ImageWithFallback.tsx';

interface MultiAngleGalleryProps {
  images: string[];
  fitpicUrls?: string[];
  videoUrl?: string;
  title: string;
}

export const MultiAngleGallery: React.FC<MultiAngleGalleryProps> = ({
  images,
  fitpicUrls = [],
  videoUrl,
  title,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'photos' | 'fitpics' | 'video'>('photos');

  const activeMediaList = activeTab === 'fitpics' && fitpicUrls.length > 0 ? fitpicUrls : images;

  const prev = () => setCurrentIndex(i => (i === 0 ? activeMediaList.length - 1 : i - 1));
  const next = () => setCurrentIndex(i => (i === activeMediaList.length - 1 ? 0 : i + 1));

  return (
    <div className="space-y-3">
      {/* Media Type Selector Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => { setActiveTab('photos'); setCurrentIndex(0); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
            activeTab === 'photos'
              ? 'bg-amber-500 text-black font-bold'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Photos ({images.length})</span>
        </button>

        {fitpicUrls.length > 0 && (
          <button
            onClick={() => { setActiveTab('fitpics'); setCurrentIndex(0); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeTab === 'fitpics'
                ? 'bg-amber-500 text-black font-bold'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <span>Fitpics ({fitpicUrls.length})</span>
          </button>
        )}

        {videoUrl && (
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeTab === 'video'
                ? 'bg-amber-500 text-black font-bold'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>10s Drape Loop</span>
          </button>
        )}
      </div>

      {/* Main Showcase Container */}
      <div className="relative rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 aspect-[4/5] group">
        {activeTab === 'video' && videoUrl ? (
          <video
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <ImageWithFallback
            src={activeMediaList[currentIndex]}
            alt={`${title} - Angle ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />
        )}

        {/* Navigation Chevrons */}
        {activeTab !== 'video' && activeMediaList.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/70 backdrop-blur-md text-white hover:bg-black border border-zinc-700 transition-all active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/70 backdrop-blur-md text-white hover:bg-black border border-zinc-700 transition-all active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Counter Badge */}
        {activeTab !== 'video' && (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-zinc-300 text-[10px] font-mono border border-zinc-800">
            {currentIndex + 1} / {activeMediaList.length}
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      {activeTab !== 'video' && activeMediaList.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {activeMediaList.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative rounded-xl overflow-hidden w-16 h-20 shrink-0 border-2 transition-all ${
                currentIndex === idx
                  ? 'border-amber-500 shadow-amber-glow scale-105'
                  : 'border-zinc-800 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
