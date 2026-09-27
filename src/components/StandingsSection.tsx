import React, { useState, useEffect } from 'react';
import { fetchLeagueStandings } from '../services/footballApi';
import { TeamStanding, LeagueId } from '../types/football';
import { Trophy, RefreshCw, AlertCircle } from 'lucide-react';

interface StandingsSectionProps {
  onSelectTeam?: (teamName: string) => void;
}

export const StandingsSection: React.FC<StandingsSectionProps> = ({ onSelectTeam }) => {
  const [selectedLeague, setSelectedLeague] = useState<LeagueId>('epl');
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeamDetail, setSelectedTeamDetail] = useState<TeamStanding | null>(null);

  const loadStandings = async (leagueId: LeagueId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLeagueStandings(leagueId);
      setStandings(data);
    } catch (err: any) {
      setError('Không thể tải bảng xếp hạng lúc này. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStandings(selectedLeague);
  }, [selectedLeague]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-emerald-400" />
            Bảng Xếp Hạng Giải Đấu Trực Tiếp (Live API)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Dữ liệu thời gian thực được đồng bộ trực tiếp từ máy chủ thể thao toàn cầu
          </p>
        </div>

        {/* League Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'epl', name: 'Ngoại Hạng Anh' },
            { id: 'ucl', name: 'Champions League' },
            { id: 'laliga', name: 'La Liga' },
            { id: 'bundesliga', name: 'Bundesliga' },
            { id: 'seriea', name: 'Serie A' },
            { id: 'ligue1', name: 'Ligue 1' }
          ].map((lg) => (
            <button
              key={lg.id}
              onClick={() => setSelectedLeague(lg.id as LeagueId)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                selectedLeague === lg.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              {lg.name}
            </button>
          ))}

          <button
            onClick={() => loadStandings(selectedLeague)}
            title="Làm mới bảng xếp hạng"
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-emerald-400 border border-slate-800 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Loading Skeleton or Error or Table */}
      {loading ? (
        <div className="rounded-xl border border-slate-800 bg-[#09111e] p-8 text-center space-y-3">
          <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Đang đồng bộ bảng xếp hạng thời gian thực từ Football API...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-xl border border-rose-500/30 bg-rose-950/20 text-center text-xs text-rose-300 flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{error}</span>
          <button
            onClick={() => loadStandings(selectedLeague)}
            className="ml-2 underline text-white font-bold"
          >
            Thử lại
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#09111e] shadow-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3 w-12 text-center">#</th>
                <th className="py-3 px-4">Đội bóng</th>
                <th className="py-3 px-2 text-center w-12">Trận</th>
                <th className="py-3 px-2 text-center w-12">Thắng</th>
                <th className="py-3 px-2 text-center w-12">Hòa</th>
                <th className="py-3 px-2 text-center w-12">Thua</th>
                <th className="py-3 px-2 text-center w-16 hidden sm:table-cell">BT-BB</th>
                <th className="py-3 px-2 text-center w-12">HS</th>
                <th className="py-3 px-3 text-center w-14 font-extrabold text-white">Điểm</th>
                <th className="py-3 px-3 text-center w-28 hidden md:table-cell">5 trận gần nhất</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {standings.map((team) => {
                const isUCL = selectedLeague === 'ucl';
                const isTop8UCL = isUCL && team.position <= 8;
                const isTop4League = !isUCL && team.position <= 4;
                const isRelegation = !isUCL && team.position >= standings.length - 2;

                return (
                  <tr
                    key={team.teamId}
                    onClick={() => setSelectedTeamDetail(team)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    {/* Position number */}
                    <td className="py-3 px-3 text-center font-mono font-bold tabular-nums">
                      <span
                        className={`inline-block w-6 h-6 leading-6 rounded-md text-xs ${
                          isTop8UCL || isTop4League
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold'
                            : isRelegation
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'text-slate-400'
                        }`}
                      >
                        {team.position}
                      </span>
                    </td>

                    {/* Team Name & Logo */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        {team.teamLogo.startsWith('http') ? (
                          <img
                            src={team.teamLogo}
                            alt={team.teamName}
                            referrerPolicy="no-referrer"
                            className="w-5 h-5 object-contain"
                          />
                        ) : (
                          <span className="text-base">{team.teamLogo}</span>
                        )}
                        <span className="font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {team.teamName}
                        </span>
                      </div>
                    </td>

                    {/* Played, Won, Drawn, Lost */}
                    <td className="py-3 px-2 text-center font-mono tabular-nums text-slate-300">
                      {team.played}
                    </td>
                    <td className="py-3 px-2 text-center font-mono tabular-nums text-emerald-400">
                      {team.won}
                    </td>
                    <td className="py-3 px-2 text-center font-mono tabular-nums text-slate-400">
                      {team.drawn}
                    </td>
                    <td className="py-3 px-2 text-center font-mono tabular-nums text-rose-400">
                      {team.lost}
                    </td>

                    {/* Goals For / Against */}
                    <td className="py-3 px-2 text-center font-mono tabular-nums text-slate-400 hidden sm:table-cell">
                      {team.goalsFor}-{team.goalsAgainst}
                    </td>

                    {/* Goal Difference */}
                    <td className="py-3 px-2 text-center font-mono font-bold tabular-nums text-slate-200">
                      {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                    </td>

                    {/* Points */}
                    <td className="py-3 px-3 text-center font-mono font-black text-sm tabular-nums text-emerald-400 bg-emerald-500/5">
                      {team.points}
                    </td>

                    {/* Form */}
                    <td className="py-3 px-3 text-center hidden md:table-cell">
                      <div className="flex items-center justify-center gap-1">
                        {team.form.map((res, i) => (
                          <span
                            key={i}
                            className={`w-5 h-5 rounded flex items-center justify-center font-mono text-[10px] font-bold ${
                              res === 'W'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : res === 'D'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            }`}
                          >
                            {res === 'W' ? 'T' : res === 'D' ? 'H' : 'B'}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Legend */}
          <div className="p-3 bg-slate-900/60 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center gap-4">
            {selectedLeague === 'ucl' ? (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/40 border border-emerald-400" />
                  <span>Top 1-8: Vào thẳng Vòng 1/8 Champions League</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500/40 border border-cyan-400" />
                  <span>Hạng 9-12: Suất thi đấu Play-off Knockout</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/40 border border-emerald-400" />
                  <span>Suất dự Cúp Châu Âu (UCL)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-rose-500/40 border border-rose-400" />
                  <span>Khu vực xuống hạng</span>
                </div>
              </>
            )}
            <span className="text-slate-500">·</span>
            <span>(T: Thắng, H: Hòa, B: Bại)</span>
          </div>
        </div>
      )}

      {/* Selected Team Detail Drawer */}
      {selectedTeamDetail && (
        <div className="p-5 rounded-2xl bg-[#0b1424] border border-emerald-500/30 text-white animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {selectedTeamDetail.teamLogo.startsWith('http') ? (
                <img
                  src={selectedTeamDetail.teamLogo}
                  alt={selectedTeamDetail.teamName}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 object-contain"
                />
              ) : (
                <span className="text-3xl">{selectedTeamDetail.teamLogo}</span>
              )}
              <div>
                <h3 className="text-lg font-bold">{selectedTeamDetail.teamName}</h3>
                <p className="text-xs text-slate-400">
                  Hạng #{selectedTeamDetail.position} · {selectedTeamDetail.points} Điểm · Tỉ lệ thắng:{' '}
                  {selectedTeamDetail.played > 0
                    ? Math.round((selectedTeamDetail.won / selectedTeamDetail.played) * 100)
                    : 0}%
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedTeamDetail(null)}
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
            >
              Đóng
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-800 text-center">
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <div className="text-[11px] text-slate-400">Bàn thắng ghi được</div>
              <div className="text-lg font-mono font-bold text-emerald-400 tabular-nums">
                {selectedTeamDetail.goalsFor}
              </div>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <div className="text-[11px] text-slate-400">Bàn thua phải nhận</div>
              <div className="text-lg font-mono font-bold text-rose-400 tabular-nums">
                {selectedTeamDetail.goalsAgainst}
              </div>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <div className="text-[11px] text-slate-400">Số trận thắng</div>
              <div className="text-lg font-mono font-bold text-cyan-400 tabular-nums">
                {selectedTeamDetail.won}
              </div>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <div className="text-[11px] text-slate-400">Hiệu số bàn thắng</div>
              <div className="text-lg font-mono font-bold text-amber-400 tabular-nums">
                {selectedTeamDetail.goalDifference > 0
                  ? `+${selectedTeamDetail.goalDifference}`
                  : selectedTeamDetail.goalDifference}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
