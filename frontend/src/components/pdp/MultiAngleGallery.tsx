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
    <div className="space-y-1.5 sm:space-y-2 font-mono">
      {/* Media Type Selector Tabs */}
      {(fitpicUrls.length > 0 || videoUrl) && (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => { setActiveTab('photos'); setCurrentIndex(0); }}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-mono font-semibold transition-all shadow-2xs ${
              activeTab === 'photos'
                ? 'bg-zinc-950 text-white font-bold'
                : 'bg-white text-zinc-700 hover:text-black hover:bg-zinc-100 border border-zinc-200'
            }`}
          >
            <Camera className="w-3 h-3" />
            <span>Photos ({images.length})</span>
          </button>

          {fitpicUrls.length > 0 && (
            <button
              onClick={() => { setActiveTab('fitpics'); setCurrentIndex(0); }}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-mono font-semibold transition-all shadow-2xs ${
                activeTab === 'fitpics'
                  ? 'bg-zinc-950 text-white font-bold'
                  : 'bg-white text-zinc-700 hover:text-black hover:bg-zinc-100 border border-zinc-200'
              }`}
            >
              <span>Fitpics ({fitpicUrls.length})</span>
            </button>
          )}

          {videoUrl && (
            <button
              onClick={() => setActiveTab('video')}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-mono font-semibold transition-all shadow-2xs ${
                activeTab === 'video'
                  ? 'bg-zinc-950 text-white font-bold'
                  : 'bg-white text-zinc-700 hover:text-black hover:bg-zinc-100 border border-zinc-200'
              }`}
            >
              <Video className="w-3 h-3 text-orange-500" />
              <span>Drape Loop</span>
            </button>
          )}
        </div>
      )}

      {/* Main Showcase Container (Max-Height 52vh on Desktop) */}
      <div className="relative rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 aspect-4/5 max-h-[46vh] lg:max-h-[54vh] w-full group shadow-xs">
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
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/90 backdrop-blur-md text-zinc-900 hover:bg-white border border-zinc-200 shadow-sm transition-all active:scale-95 opacity-80 hover:opacity-100"
              title="Previous Photo"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/90 backdrop-blur-md text-zinc-900 hover:bg-white border border-zinc-200 shadow-sm transition-all active:scale-95 opacity-80 hover:opacity-100"
              title="Next Photo"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        {/* Counter Badge */}
        {activeTab !== 'video' && activeMediaList.length > 1 && (
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-zinc-950/80 backdrop-blur-md text-white text-[9px] font-mono font-bold shadow-xs">
            {currentIndex + 1} / {activeMediaList.length}
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      {activeTab !== 'video' && activeMediaList.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {activeMediaList.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative rounded-lg overflow-hidden w-11 h-11 sm:w-12 sm:h-12 shrink-0 border-2 transition-all shadow-2xs ${
                currentIndex === idx
                  ? 'border-orange-500 scale-102 ring-1 ring-orange-500/30'
                  : 'border-zinc-200 opacity-60 hover:opacity-100 hover:border-zinc-400'
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
