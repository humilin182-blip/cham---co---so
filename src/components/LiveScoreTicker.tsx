import React, { useState, useEffect } from 'react';
import { Match, LeagueId } from '../types/football';
import { LEAGUES_DATA } from '../data/mockFootballData';
import { Star, CalendarPlus, ChevronRight, BarChart2, Video, Clock, BookOpen } from 'lucide-react';
import { getGoogleCalendarUrl, downloadMatchICS } from '../services/calendarExport';
import { calculateMatchCountdown } from '../services/footballApi';

interface LiveScoreTickerProps {
  matches: Match[];
  selectedLeague: LeagueId | 'all';
  setSelectedLeague: (id: LeagueId | 'all') => void;
  statusFilter: 'ALL' | 'LIVE' | 'SCHEDULED' | 'FINISHED';
  setStatusFilter: (status: 'ALL' | 'LIVE' | 'SCHEDULED' | 'FINISHED') => void;
  favorites: string[];
  toggleFavorite: (matchId: string) => void;
  onSelectMatch: (match: Match) => void;
  onOpenHighlights: (match: Match) => void;
  onOpenAnalysis?: (match: Match) => void;
  onMatchBecomesLive?: (matchId: string) => void;
  onManualRefresh?: () => void;
  refreshCountdown?: number;
  isSyncing?: boolean;
}

export const LiveScoreTicker: React.FC<LiveScoreTickerProps> = ({
  matches,
  selectedLeague,
  setSelectedLeague,
  statusFilter,
  setStatusFilter,
  favorites,
  toggleFavorite,
  onSelectMatch,
  onOpenHighlights,
  onOpenAnalysis,
  onMatchBecomesLive,
  onManualRefresh,
  refreshCountdown = 30,
  isSyncing = false
}) => {
  const [calendarMenuOpen, setCalendarMenuOpen] = useState<string | null>(null);
  const [, setTick] = useState(0);

  // Live countdown per-second tick
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter matches
  const filteredMatches = matches.filter((m) => {
    if (selectedLeague !== 'all' && m.leagueId !== selectedLeague) return false;
    if (statusFilter !== 'ALL' && m.status !== statusFilter) return false;
    return true;
  });

  const formatLocalTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('vi-VN', {
        timeZone: 'Asia/Saigon',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch {
      return '20:00';
    }
  };

  const formatLocalDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('vi-VN', {
        timeZone: 'Asia/Saigon',
        weekday: 'short',
        day: '2-digit',
        month: '2-digit'
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-4">
      {/* League Filter Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedLeague('all')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 ${
            selectedLeague === 'all'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'bg-slate-850 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60'
          }`}
        >
          🌍 Tất cả giải đấu ({matches.length})
        </button>

        {LEAGUES_DATA.map((league) => {
          const count = matches.filter((m) => m.leagueId === league.id).length;
          const isSelected = selectedLeague === league.id;
          return (
            <button
              key={league.id}
              onClick={() => setSelectedLeague(league.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 ${
                isSelected
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-850 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              <span>{league.flag}</span>
              <span>{league.shortName}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-black/20 text-slate-950' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Status Segmented Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-lg border border-slate-800">
          {(['ALL', 'LIVE', 'SCHEDULED', 'FINISHED'] as const).map((status) => {
            const labels = {
              ALL: 'Tất cả',
              LIVE: 'Đang diễn ra (Live)',
              SCHEDULED: 'Sắp thi đấu',
              FINISHED: 'Đã kết thúc'
            };
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {status === 'LIVE' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block mr-1.5 animate-pulse" />
                )}
                {labels[status]}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              Múi giờ chuẩn: <strong className="text-emerald-300">Asia/Saigon (GMT+7)</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded font-mono tabular-nums flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isSyncing ? 'bg-amber-400 animate-spin' : 'bg-emerald-400 animate-pulse'
                }`}
              />
              {isSyncing ? 'Đang cập nhật...' : `Cập nhật sau ${refreshCountdown}s`}
            </span>

            {onManualRefresh && (
              <button
                onClick={onManualRefresh}
                title="Làm mới tỉ số trực tiếp ngay"
                className="px-2 py-0.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors"
              >
                Làm mới
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Matches Grid */}
      {filteredMatches.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-slate-900/40 border border-slate-800">
          <p className="text-slate-400 text-sm">Không tìm thấy trận đấu phù hợp trong bộ lọc này.</p>
          <button
            onClick={() => {
              setSelectedLeague('all');
              setStatusFilter('ALL');
            }}
            className="mt-3 px-4 py-1.5 text-xs text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/10"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredMatches.map((match) => {
            const isFav = favorites.includes(match.id);
            const isLive = match.status === 'LIVE';
            const league = LEAGUES_DATA.find((l) => l.id === match.leagueId);

            // Real-time Countdown calculation for scheduled games
            const countdown = calculateMatchCountdown(match.startTime);

            // Auto-trigger live transition when timer expires
            if (countdown.isLive && match.status === 'SCHEDULED' && onMatchBecomesLive) {
              onMatchBecomesLive(match.id);
            }

            const goalEvents = match.events.filter(
              (e) => e.type === 'GOAL' || e.type === 'PENALTY_GOAL'
            );

            return (
              <div
                key={match.id}
                className={`group relative rounded-xl border transition-all duration-200 bg-[#0b1322] hover:bg-[#0e1728] ${
                  isLive
                    ? 'border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.08)]'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header row: League & status/time/countdown */}
                <div className="p-3.5 pb-2 flex items-center justify-between border-b border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{league?.flag}</span>
                    <span className="text-xs font-semibold text-slate-300">
                      {league?.shortName}
                    </span>
                    <span className="text-slate-600 text-xs">·</span>
                    <span className="text-xs text-slate-400 truncate max-w-[150px]">{match.round}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isLive ? (
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-bold tabular-nums">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        <span>{match.minute || 1}' LIVE</span>
                      </div>
                    ) : match.status === 'SCHEDULED' ? (
                      <div className="flex items-center gap-2">
                        {/* Countdown Badge: Còn X ngày, HH:MM:SS hoặc Còn HH:MM:SS */}
                        <div
                          className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-bold tabular-nums shadow-sm"
                          title={`Bắt đầu lúc ${formatLocalTime(match.startTime)} (${formatLocalDate(match.startTime)})`}
                        >
                          <Clock className="w-3 h-3 text-cyan-400 animate-pulse" />
                          <span>{countdown.displayText}</span>
                        </div>
                        <span className="text-[11px] font-medium text-slate-300 hidden sm:inline tabular-nums">
                          {formatLocalTime(match.startTime)} · {formatLocalDate(match.startTime)}
                        </span>
                      </div>
                    ) : (
                      <div className="text-xs font-medium text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded">
                        Đã kết thúc
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(match.id);
                      }}
                      title={isFav ? 'Bỏ theo dõi trận đấu' : 'Theo dõi nhận thông báo bàn thắng'}
                      className="p-1 text-slate-400 hover:text-amber-400 transition-colors"
                    >
                      <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Scoreboard Body */}
                <div
                  onClick={() => onSelectMatch(match)}
                  className="p-3.5 cursor-pointer hover:bg-white/[0.02] transition-colors"
                >
                  {/* Home Team */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      {match.homeTeam.logo.startsWith('http') ? (
                        <img
                          src={match.homeTeam.logo}
                          alt={match.homeTeam.shortName}
                          referrerPolicy="no-referrer"
                          className="w-7 h-7 object-contain rounded bg-slate-800/80 p-0.5 border border-slate-700/60"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-md bg-slate-800 flex items-center justify-center font-bold text-xs text-white border border-slate-700">
                          {match.homeTeam.shortName.substring(0, 2)}
                        </div>
                      )}
                      <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {match.homeTeam.name}
                      </span>
                    </div>
                    <div className="text-lg font-mono font-extrabold text-white tabular-nums px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                      {match.status === 'SCHEDULED' ? '-' : match.homeTeam.score}
                    </div>
                  </div>

                  {/* Away Team */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {match.awayTeam.logo.startsWith('http') ? (
                        <img
                          src={match.awayTeam.logo}
                          alt={match.awayTeam.shortName}
                          referrerPolicy="no-referrer"
                          className="w-7 h-7 object-contain rounded bg-slate-800/80 p-0.5 border border-slate-700/60"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-md bg-slate-800 flex items-center justify-center font-bold text-xs text-white border border-slate-700">
                          {match.awayTeam.shortName.substring(0, 2)}
                        </div>
                      )}
                      <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {match.awayTeam.name}
                      </span>
                    </div>
                    <div className="text-lg font-mono font-extrabold text-white tabular-nums px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                      {match.status === 'SCHEDULED' ? '-' : match.awayTeam.score}
                    </div>
                  </div>

                  {/* Goal Scorers Snippet */}
                  {goalEvents.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-400">
                      {goalEvents.slice(0, 3).map((e) => (
                        <span key={e.id} className="flex items-center gap-1">
                          <span>⚽</span>
                          <span className="text-slate-300">{e.player}</span>
                          <span className="text-emerald-400 tabular-nums">({e.minute}')</span>
                        </span>
                      ))}
                      {goalEvents.length > 3 && (
                        <span className="text-slate-500">+{goalEvents.length - 3} bàn khác</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Action Footer (All Live Stream buttons fully removed for copyright safety) */}
                <div className="px-3.5 py-2.5 border-t border-slate-800/80 bg-slate-900/50 rounded-b-xl flex items-center justify-between text-xs">
                  <div className="text-slate-400 text-[11px] truncate max-w-[180px]">
                    📍 {match.stadium}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View Statistics Button (Replaces Live Stream button) */}
                    <button
                      onClick={() => onSelectMatch(match)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 transition-all text-xs font-semibold cursor-pointer"
                    >
                      <BarChart2 className="w-3 h-3 text-emerald-400" />
                      Xem Thống Kê
                    </button>

                    {/* Pre-Match Analysis Button */}
                    {onOpenAnalysis && (
                      <button
                        onClick={() => onOpenAnalysis(match)}
                        className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors text-xs"
                      >
                        <BookOpen className="w-3 h-3 text-cyan-400" />
                        Nhận Định
                      </button>
                    )}

                    {/* Highlight Action for finished matches */}
                    {match.status === 'FINISHED' && (
                      <button
                        onClick={() => onOpenHighlights(match)}
                        className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-xs"
                      >
                        <Video className="w-3 h-3 text-cyan-400" />
                        Highlight
                      </button>
                    )}

                    {/* Schedule: Add to Calendar */}
                    {match.status === 'SCHEDULED' && (
                      <div className="relative">
                        <button
                          onClick={() => setCalendarMenuOpen(calendarMenuOpen === match.id ? null : match.id)}
                          className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-cyan-950 text-cyan-300 border border-cyan-500/30 transition-colors text-xs"
                        >
                          <CalendarPlus className="w-3 h-3" />
                          Lịch
                        </button>

                        {calendarMenuOpen === match.id && (
                          <div className="absolute right-0 bottom-full mb-1 w-44 rounded-lg bg-slate-900 border border-slate-700 shadow-xl py-1 z-30 animate-in fade-in">
                            <a
                              href={getGoogleCalendarUrl(match)}
                              target="_blank"
                              rel="noreferrer"
                              className="block px-3 py-1.5 text-xs text-slate-200 hover:bg-emerald-500/20 hover:text-emerald-300"
                              onClick={() => setCalendarMenuOpen(null)}
                            >
                              📅 Google Calendar
                            </a>
                            <button
                              onClick={() => {
                                downloadMatchICS(match);
                                setCalendarMenuOpen(null);
                              }}
                              className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-emerald-500/20 hover:text-emerald-300"
                            >
                              📥 Tải file .ICS (Apple)
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
