import React, { useEffect } from 'react';
import { X, Play, BellRing, Sparkles } from 'lucide-react';
import { playGoalSound } from '../services/soundEffects';

export interface GoalAlertData {
  id: string;
  matchTitle: string;
  leagueName: string;
  teamName: string;
  playerName: string;
  minute: number;
  newScore: string;
  assistPlayer?: string;
  onViewDetails?: () => void;
}

interface GoalAlertBannerProps {
  alert: GoalAlertData | null;
  onClose: () => void;
}

export const GoalAlertBanner: React.FC<GoalAlertBannerProps> = ({ alert, onClose }) => {
  useEffect(() => {
    if (alert) {
      playGoalSound();
      const timer = setTimeout(() => {
        onClose();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [alert, onClose]);

  if (!alert) return null;

  return (
    <div className="fixed top-20 right-4 z-50 max-w-md w-full animate-in slide-in-from-top-6 fade-in duration-300">
      <div className="relative overflow-hidden rounded-xl bg-[#091524] border-2 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)] text-white p-4">
        {/* Glow scanline header */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400 animate-pulse" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0 animate-bounce">
              <span className="text-xl">⚽</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <BellRing className="w-3.5 h-3.5 animate-pulse" />
                VÀOOOOOO! BÀN THẮNG MỚI!
              </div>
              <p className="text-xs text-slate-300">{alert.leagueName} · {alert.matchTitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Big Scorer & Score Display */}
        <div className="my-3 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-between">
          <div>
            <div className="text-base font-bold text-white flex items-center gap-1.5">
              {alert.playerName}
              <span className="text-xs font-semibold text-emerald-300 px-1.5 py-0.5 rounded bg-emerald-500/20 tabular-nums">
                {alert.minute}'
              </span>
            </div>
            {alert.assistPlayer && (
              <div className="text-xs text-slate-400 mt-0.5">
                Kiến tạo: <span className="text-slate-200">{alert.assistPlayer}</span>
              </div>
            )}
          </div>

          <div className="text-2xl font-black text-emerald-400 font-mono tracking-wider tabular-nums px-3 py-1 rounded bg-black/40 border border-emerald-500/30">
            {alert.newScore}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            Cập nhật tức thời thời gian thực
          </span>

          {alert.onViewDetails && (
            <button
              onClick={() => {
                alert.onViewDetails?.();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-transform hover:scale-105 cursor-pointer"
            >
              Xem Diễn Biến
            </button>
          )}
        </div>

        {/* Progress bar auto dismiss */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-800">
          <div className="h-full bg-emerald-400 animate-[shrink_8s_linear]" />
        </div>
      </div>
    </div>
  );
};
