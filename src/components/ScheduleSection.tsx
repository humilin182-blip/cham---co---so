import React, { useState, useEffect } from 'react';
import { Match, LeagueId } from '../types/football';
import { LEAGUES_DATA } from '../data/mockFootballData';
import { Calendar, CalendarPlus, Clock, MapPin, Download, Check, BarChart2 } from 'lucide-react';
import { getGoogleCalendarUrl, downloadMatchICS } from '../services/calendarExport';
import { calculateMatchCountdown } from '../services/footballApi';

interface ScheduleSectionProps {
  matches: Match[];
  onSelectMatch: (match: Match) => void;
  onOpenAnalysis: (match: Match) => void;
  onOpenPrediction: (match: Match) => void;
}

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({
  matches,
  onSelectMatch,
  onOpenAnalysis,
  onOpenPrediction
}) => {
  const [selectedLeague, setSelectedLeague] = useState<LeagueId | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [syncedMatchId, setSyncedMatchId] = useState<string | null>(null);
  const [, setTick] = useState(0);

  // Live countdown per-second tick
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredMatches = matches.filter((m) => {
    if (selectedLeague !== 'all' && m.leagueId !== selectedLeague) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchName = `${m.homeTeam.name} ${m.awayTeam.name} ${m.stadium}`.toLowerCase();
      if (!matchName.includes(term)) return false;
    }
    return true;
  });

  const handleDownloadICS = (match: Match) => {
    downloadMatchICS(match);
    setSyncedMatchId(match.id);
    setTimeout(() => setSyncedMatchId(null), 3000);
  };

  const formatDateTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      const timeStr = d.toLocaleTimeString('vi-VN', {
        timeZone: 'Asia/Saigon',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      const dateStr = d.toLocaleDateString('vi-VN', {
        timeZone: 'Asia/Saigon',
        weekday: 'short',
        day: '2-digit',
        month: '2-digit'
      });
      return { timeStr, dateStr };
    } catch {
      return { timeStr: '20:00', dateStr: 'Hôm nay' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" />
            Lịch Thi Đấu Trực Tiếp & Đồng Bộ Lịch Cá Nhân
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Hiển thị chuẩn múi giờ <strong className="text-cyan-300">Asia/Saigon (GMT+7)</strong> · Cập nhật trực tiếp từ hệ thống Football API
          </p>
        </div>

        {/* Search input for team or stadium */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên đội hoặc SVĐ..."
            className="w-full sm:w-64 bg-slate-900 border border-slate-700/80 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* League selector filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedLeague('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-all ${
            selectedLeague === 'all'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          Tất cả giải đấu
        </button>
        {LEAGUES_DATA.map((league) => (
          <button
            key={league.id}
            onClick={() => setSelectedLeague(league.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-all ${
              selectedLeague === league.id
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <span>{league.flag}</span>
            <span>{league.shortName}</span>
          </button>
        ))}
      </div>

      {/* Matches List */}
      <div className="space-y-3">
        {filteredMatches.map((match) => {
          const { timeStr, dateStr } = formatDateTime(match.startTime);
          const league = LEAGUES_DATA.find((l) => l.id === match.leagueId);
          const isLive = match.status === 'LIVE';
          const countdown = calculateMatchCountdown(match.startTime);

          return (
            <div
              key={match.id}
              className="p-4 rounded-xl bg-[#09111e] border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              {/* Date & Time Zone (When LIVE, hide scheduled time to prevent conflicting display) */}
              <div className="flex items-center gap-3 md:w-56 shrink-0">
                {isLive ? (
                  <div className="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/40 text-center min-w-[88px]">
                    <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                      <span>Đang đá</span>
                    </div>
                    <div className="text-sm font-extrabold font-mono text-rose-400 tabular-nums mt-0.5">
                      {match.minute || 1}' LIVE
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-center min-w-[88px]">
                    <div className="text-[11px] font-semibold text-cyan-400 capitalize">{dateStr}</div>
                    <div className="text-base font-extrabold font-mono text-white tabular-nums">{timeStr}</div>
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold text-slate-200 flex items-center gap-1">
                    <span>{league?.flag}</span>
                    <span>{league?.shortName}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[140px]">{match.round}</div>
                  {match.status === 'SCHEDULED' && (
                    <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/50 text-[10px] font-mono font-bold text-cyan-300 tabular-nums mt-1 shadow-sm">
                      <Clock className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
                      <span>{countdown.displayText}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Match Teams Info */}
              <div
                onClick={() => onSelectMatch(match)}
                className="flex-1 flex items-center justify-between sm:justify-center sm:gap-8 cursor-pointer py-1"
              >
                {/* Home */}
                <div className="flex items-center gap-2.5 sm:w-48 justify-end text-right">
                  <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {match.homeTeam.name}
                  </span>
                  {match.homeTeam.logo.startsWith('http') ? (
                    <img
                      src={match.homeTeam.logo}
                      alt={match.homeTeam.shortName}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 object-contain rounded bg-slate-800/80 p-0.5 border border-slate-700/60 shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-xs text-white border border-slate-700 shrink-0">
                      {match.homeTeam.shortName.substring(0, 2)}
                    </div>
                  )}
                </div>

                {/* Score or VS */}
                <div className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-center min-w-[70px]">
                  {isLive ? (
                    <div className="text-sm font-mono font-bold text-emerald-400 tabular-nums">
                      {match.homeTeam.score} - {match.awayTeam.score}
                    </div>
                  ) : match.status === 'FINISHED' ? (
                    <div className="text-sm font-mono font-bold text-slate-200 tabular-nums">
                      {match.homeTeam.score} - {match.awayTeam.score}
                    </div>
                  ) : (
                    <span className="text-xs font-mono font-bold text-cyan-400">VS</span>
                  )}
                </div>

                {/* Away */}
                <div className="flex items-center gap-2.5 sm:w-48 justify-start text-left">
                  {match.awayTeam.logo.startsWith('http') ? (
                    <img
                      src={match.awayTeam.logo}
                      alt={match.awayTeam.shortName}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 object-contain rounded bg-slate-800/80 p-0.5 border border-slate-700/60 shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-xs text-white border border-slate-700 shrink-0">
                      {match.awayTeam.shortName.substring(0, 2)}
                    </div>
                  )}
                  <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {match.awayTeam.name}
                  </span>
                </div>
              </div>

              {/* Stadium & Sync Calendar Actions */}
              <div className="flex flex-wrap items-center justify-between md:justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/80">
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span className="truncate max-w-[130px]">{match.stadium}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* View Stats Button */}
                  <button
                    onClick={() => onSelectMatch(match)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Xem Thống Kê</span>
                  </button>

                  {/* Sync to Google Calendar */}
                  <a
                    href={getGoogleCalendarUrl(match)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-950/50 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 text-xs font-medium transition-colors"
                    title="Thêm vào Google Calendar"
                  >
                    <CalendarPlus className="w-3.5 h-3.5" />
                    <span>Google Lịch</span>
                  </a>

                  {/* Download .ICS file */}
                  <button
                    onClick={() => handleDownloadICS(match)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                    title="Tải file .ICS cho Apple Calendar / Outlook"
                  >
                    {syncedMatchId === match.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    <span>.ICS</span>
                  </button>

                  {/* Pre-Match Analysis */}
                  <button
                    onClick={() => onOpenAnalysis(match)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                    title="Xem nhận định chuyên gia"
                  >
                    Nhận định
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
