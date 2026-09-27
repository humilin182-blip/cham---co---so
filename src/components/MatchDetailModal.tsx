import React, { useState } from 'react';
import { Match, CommunityMessage } from '../types/football';
import { X, Play, Clock, Shield, Users, MessageSquare, Send, ThumbsUp, Flame } from 'lucide-react';

interface MatchDetailModalProps {
  match: Match | null;
  onClose: () => void;
  communityMessages: CommunityMessage[];
  onSendMessage: (matchId: string, content: string, fanOf: string) => void;
}

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({
  match,
  onClose,
  communityMessages,
  onSendMessage
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'stats' | 'lineups' | 'chat'>('timeline');
  const [chatInput, setChatInput] = useState('');
  const [selectedFanTeam, setSelectedFanTeam] = useState<string>('');

  if (!match) return null;

  const currentFanTeam = selectedFanTeam || match.homeTeam.shortName;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendMessage(match.id, chatInput.trim(), currentFanTeam);
    setChatInput('');
  };

  const isLive = match.status === 'LIVE';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-[#09111e] border border-slate-700/80 shadow-2xl text-slate-100 overflow-hidden">
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 uppercase tracking-wide">
              Trung Tâm Trận Đấu
            </span>
            <span className="text-slate-400 text-xs">·</span>
            <span className="text-slate-300 text-xs">{match.round}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Score Header Showcase */}
        <div className="p-6 bg-gradient-to-b from-slate-900/90 to-[#09111e] border-b border-slate-800">
          <div className="grid grid-cols-3 items-center text-center">
            {/* Home Team */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-lg text-white shadow-lg">
                {match.homeTeam.shortName.substring(0, 3)}
              </div>
              <h3 className="font-bold text-base text-white">{match.homeTeam.name}</h3>
            </div>

            {/* Score & Time */}
            <div className="flex flex-col items-center">
              {isLive ? (
                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-bold mb-2 animate-pulse tabular-nums">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  {match.minute}' ĐANG DIỄN RA
                </div>
              ) : (
                <div className="text-xs text-slate-400 mb-2">
                  {match.status === 'SCHEDULED' ? 'Chưa bắt đầu' : 'Trận đấu kết thúc'}
                </div>
              )}

              <div className="text-4xl sm:text-5xl font-extrabold font-mono text-white tracking-widest tabular-nums">
                {match.status === 'SCHEDULED' ? 'VS' : `${match.homeTeam.score} - ${match.awayTeam.score}`}
              </div>

              <div className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                <span>📍 {match.stadium}</span>
                <span>·</span>
                <span>👨‍⚖️ {match.referee}</span>
              </div>
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-lg text-white shadow-lg">
                {match.awayTeam.shortName.substring(0, 3)}
              </div>
              <h3 className="font-bold text-base text-white">{match.awayTeam.name}</h3>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/40 px-4">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'timeline'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Diễn biến ({match.events.length})
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'stats'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Thống kê chuyên sâu
          </button>
          <button
            onClick={() => setActiveTab('lineups')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'lineups'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Đội hình ra sân
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'chat'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Phòng Chat Cộng Đồng ({communityMessages.length})
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* TAB 1: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              {match.events.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">
                  Trận đấu chưa có sự kiện nào hoặc chưa bắt đầu.
                </div>
              ) : (
                <div className="relative border-l-2 border-slate-800 ml-4 pl-4 space-y-4">
                  {match.events.map((e) => {
                    const isHome = e.team === 'home';
                    const icon =
                      e.type === 'GOAL' || e.type === 'PENALTY_GOAL'
                        ? '⚽'
                        : e.type === 'YELLOW_CARD'
                        ? '🟨'
                        : e.type === 'RED_CARD'
                        ? '🟥'
                        : e.type === 'VAR'
                        ? '📺'
                        : '🔄';

                    return (
                      <div key={e.id} className="relative flex items-start gap-3">
                        {/* Minute node */}
                        <div className="absolute -left-[25px] w-6 h-6 rounded-full bg-slate-900 border-2 border-emerald-400 flex items-center justify-center text-[10px] font-bold text-emerald-400 tabular-nums">
                          {e.minute}'
                        </div>

                        <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{icon}</span>
                              <span className="text-sm font-bold text-white">
                                {e.player}
                              </span>
                              <span className="text-xs text-slate-400">
                                ({isHome ? match.homeTeam.shortName : match.awayTeam.shortName})
                              </span>
                            </div>
                            <span className="text-xs font-semibold text-emerald-400 capitalize">
                              {e.type === 'GOAL'
                                ? 'Bàn thắng'
                                : e.type === 'YELLOW_CARD'
                                ? 'Thẻ vàng'
                                : e.type === 'VAR'
                                ? 'Tham khảo VAR'
                                : e.type}
                            </span>
                          </div>

                          {e.assistPlayer && (
                            <p className="text-xs text-slate-400 mt-1">
                              Kiến tạo: <span className="text-slate-200">{e.assistPlayer}</span>
                            </p>
                          )}

                          {e.detail && (
                            <p className="text-xs text-slate-300 mt-1 italic">
                              "{e.detail}"
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DETAILED STATS */}
          {activeTab === 'stats' && (
            <div className="space-y-4">
              {[
                { label: 'Kiểm soát bóng', home: `${match.stats.possession[0]}%`, away: `${match.stats.possession[1]}%`, hVal: match.stats.possession[0], aVal: match.stats.possession[1] },
                { label: 'Tổng số cú sút', home: match.stats.shots[0], away: match.stats.shots[1], hVal: match.stats.shots[0], aVal: match.stats.shots[1] },
                { label: 'Sút trúng đích', home: match.stats.shotsOnTarget[0], away: match.stats.shotsOnTarget[1], hVal: match.stats.shotsOnTarget[0], aVal: match.stats.shotsOnTarget[1] },
                { label: 'Bàn thắng kỳ vọng (xG)', home: match.stats.expectedGoals[0].toFixed(2), away: match.stats.expectedGoals[1].toFixed(2), hVal: match.stats.expectedGoals[0], aVal: match.stats.expectedGoals[1] },
                { label: 'Phạt góc', home: match.stats.corners[0], away: match.stats.corners[1], hVal: match.stats.corners[0], aVal: match.stats.corners[1] },
                { label: 'Phạm lỗi', home: match.stats.fouls[0], away: match.stats.fouls[1], hVal: match.stats.fouls[0], aVal: match.stats.fouls[1] },
                { label: 'Việt vị', home: match.stats.offsides[0], away: match.stats.offsides[1], hVal: match.stats.offsides[0], aVal: match.stats.offsides[1] },
                { label: 'Thẻ vàng', home: match.stats.yellowCards[0], away: match.stats.yellowCards[1], hVal: match.stats.yellowCards[0], aVal: match.stats.yellowCards[1] },
                { label: 'Đường chuyền chính xác', home: `${match.stats.passAccuracy[0]}%`, away: `${match.stats.passAccuracy[1]}%`, hVal: match.stats.passAccuracy[0], aVal: match.stats.passAccuracy[1] }
              ].map((stat, idx) => {
                const total = (Number(stat.hVal) + Number(stat.aVal)) || 1;
                const homePercent = (Number(stat.hVal) / total) * 100;

                return (
                  <div key={idx} className="bg-slate-900/40 p-3 rounded-lg border border-slate-800/80">
                    <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                      <span className="text-emerald-400 font-mono text-sm tabular-nums">{stat.home}</span>
                      <span className="text-slate-300">{stat.label}</span>
                      <span className="text-cyan-400 font-mono text-sm tabular-nums">{stat.away}</span>
                    </div>
                    {/* Visual Comparison Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${homePercent}%` }}
                      />
                      <div
                        className="h-full bg-cyan-400 transition-all duration-500"
                        style={{ width: `${100 - homePercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: LINEUPS */}
          {activeTab === 'lineups' && (
            <div className="space-y-6">
              {match.lineup ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Home Lineup */}
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800 mb-3">
                      <div>
                        <h4 className="font-bold text-white text-sm">{match.homeTeam.name}</h4>
                        <span className="text-xs text-slate-400">HLV: {match.lineup.home.coach}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        {match.lineup.home.formation}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Đội hình xuất phát</div>
                      {match.lineup.home.startingXI.map((player) => (
                        <div key={player.number} className="flex items-center justify-between text-xs py-1 px-2 rounded hover:bg-slate-800/40">
                          <div className="flex items-center gap-2">
                            <span className="w-5 font-mono text-slate-400 tabular-nums">{player.number}</span>
                            <span className="font-medium text-slate-200">{player.name}</span>
                            {player.isCaptain && <span className="text-[10px] text-amber-400 font-bold">(C)</span>}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 font-mono">{player.position}</span>
                            {player.rating && (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold tabular-nums">
                                {player.rating}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Away Lineup */}
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800 mb-3">
                      <div>
                        <h4 className="font-bold text-white text-sm">{match.awayTeam.name}</h4>
                        <span className="text-xs text-slate-400">HLV: {match.lineup.away.coach}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                        {match.lineup.away.formation}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Đội hình xuất phát</div>
                      {match.lineup.away.startingXI.map((player) => (
                        <div key={player.number} className="flex items-center justify-between text-xs py-1 px-2 rounded hover:bg-slate-800/40">
                          <div className="flex items-center gap-2">
                            <span className="w-5 font-mono text-slate-400 tabular-nums">{player.number}</span>
                            <span className="font-medium text-slate-200">{player.name}</span>
                            {player.isCaptain && <span className="text-[10px] text-amber-400 font-bold">(C)</span>}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 font-mono">{player.position}</span>
                            {player.rating && (
                              <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold tabular-nums">
                                {player.rating}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 text-sm">
                  Đội hình chính thức sẽ được công bố trước giờ bóng lăn 60 phút.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: REAL-TIME COMMUNITY CHAT */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-[380px]">
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                {communityMessages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-2.5 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
                    <img
                      src={msg.avatar}
                      alt={msg.user}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-200">{msg.user}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                            Fan {msg.fanOf}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 break-words">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSend} className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2">
                <select
                  value={currentFanTeam}
                  onChange={(e) => setSelectedFanTeam(e.target.value)}
                  className="bg-slate-800 text-xs text-slate-200 rounded-lg px-2 py-2 border border-slate-700 focus:outline-none"
                >
                  <option value={match.homeTeam.shortName}>Fan {match.homeTeam.shortName}</option>
                  <option value={match.awayTeam.shortName}>Fan {match.awayTeam.shortName}</option>
                  <option value="Trung lập">Trung lập</option>
                </select>

                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Bình luận trận đấu cùng cộng đồng..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400"
                />

                <button
                  type="submit"
                  className="p-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
