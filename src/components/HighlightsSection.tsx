import React, { useState } from 'react';
import { HighlightItem } from '../types/football';
import { Play, Pause, Volume2, VolumeX, Maximize2, SkipForward, Flame, Eye, Clock } from 'lucide-react';

interface HighlightsSectionProps {
  highlights: HighlightItem[];
}

export const HighlightsSection: React.FC<HighlightsSectionProps> = ({ highlights }) => {
  const [selectedHighlight, setSelectedHighlight] = useState<HighlightItem>(highlights[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [activeBookmark, setActiveBookmark] = useState<string | null>(null);

  const totalDurationSec = 582; // ~9:42 in seconds

  const handleSeek = (timeSec: number, title?: string) => {
    setCurrentTimeSec(timeSec);
    setIsPlaying(true);
    if (title) setActiveBookmark(title);
  };

  const formatSec = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            Highlight Trận Đấu 4K & Khoảnh Khắc Bàn Thắng
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Xem lại toàn bộ pha bóng gay cấn, bàn thắng siêu phẩm và pha cứu thua đỉnh cao trong ứng dụng
          </p>
        </div>
      </div>

      {/* Main Video Highlight Theater */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className="relative rounded-2xl overflow-hidden bg-black border border-emerald-500/30 shadow-2xl aspect-[16/9] group flex items-center justify-center">
            <img
              src={selectedHighlight.thumbnail}
              alt={selectedHighlight.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />

            {/* Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/30 pointer-events-none" />

            {/* Play/Pause center overlay */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute w-16 h-16 rounded-full bg-emerald-500/90 hover:bg-emerald-400 flex items-center justify-center text-slate-950 shadow-2xl transition-transform hover:scale-110 z-20 cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-slate-950" />
              ) : (
                <Play className="w-8 h-8 fill-slate-950 ml-1" />
              )}
            </button>

            {/* Active bookmark toast notification overlay */}
            {activeBookmark && (
              <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-lg bg-black/80 border border-emerald-400 text-xs text-emerald-300 font-semibold backdrop-blur-md animate-in fade-in">
                📌 Đến khoảnh khắc: {activeBookmark}
              </div>
            )}

            {/* Video Player Scrubber & Control Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent z-20">
              {/* Scrubber slider */}
              <div className="relative w-full h-1.5 bg-slate-700/80 rounded-full mb-3 cursor-pointer group/bar">
                <div
                  className="h-full bg-emerald-400 rounded-full relative"
                  style={{ width: `${(currentTimeSec / totalDurationSec) * 100}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow" />
                </div>

                {/* Event timestamp dots on timeline */}
                {selectedHighlight.events.map((ev, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSeek(ev.timestampSec, ev.title);
                    }}
                    title={`${ev.minute}: ${ev.title}`}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-amber-400 border border-black hover:scale-150 transition-transform"
                    style={{ left: `${(ev.timestampSec / totalDurationSec) * 100}%` }}
                  />
                ))}
              </div>

              {/* Controls row */}
              <div className="flex items-center justify-between text-xs text-slate-200">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <span className="font-mono text-xs tabular-nums text-slate-400">
                    {formatSec(currentTimeSec)} / {selectedHighlight.duration}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                    4K ULTRA HD
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Highlight Details & Title */}
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span className="text-emerald-400 font-semibold">{selectedHighlight.league}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {selectedHighlight.views}
              </span>
              <span>·</span>
              <span>{selectedHighlight.date}</span>
            </div>
            <h3 className="text-lg font-bold text-white leading-snug">
              {selectedHighlight.title}
            </h3>
          </div>

          {/* Key Moments Quick Jumper */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <span>⏱️</span>
              Các pha bóng điểm nhấn trong highlight (Nhấp để tua ngay):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedHighlight.events.map((ev, i) => (
                <button
                  key={i}
                  onClick={() => handleSeek(ev.timestampSec, ev.title)}
                  className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-800/60 hover:bg-emerald-500/10 hover:border-emerald-500/40 border border-slate-700/60 text-left transition-all group"
                >
                  <span className="font-mono font-bold text-xs text-emerald-400 px-1.5 py-0.5 rounded bg-black/40 tabular-nums shrink-0">
                    {ev.minute}
                  </span>
                  <span className="text-xs text-slate-300 group-hover:text-white line-clamp-1">
                    {ev.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Highlight Playlist Sidebar */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            Video Đề Xuất Khác
          </h3>

          <div className="space-y-3">
            {highlights.map((item) => {
              const isSelected = selectedHighlight.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedHighlight(item);
                    setCurrentTimeSec(0);
                    setIsPlaying(true);
                  }}
                  className={`flex gap-3 p-2.5 rounded-xl cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500/40 shadow-md'
                      : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="relative w-28 aspect-video rounded-lg overflow-hidden shrink-0 bg-slate-800">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[10px] font-mono text-white tabular-nums">
                      {item.duration}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-emerald-400">
                        {item.league}
                      </span>
                      <h4 className="text-xs font-semibold text-white line-clamp-2 mt-0.5 hover:text-emerald-300">
                        {item.title}
                      </h4>
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-1">
                      <span>{item.views}</span>
                      <span>·</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
