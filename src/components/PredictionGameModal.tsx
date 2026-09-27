import React, { useState } from 'react';
import { Match, FriendRank } from '../types/football';
import { FRIENDS_LEADERBOARD } from '../data/mockFootballData';
import { X, Trophy, Award, CheckCircle, Share2, Sparkles, Flame } from 'lucide-react';

interface PredictionGameModalProps {
  matches: Match[];
  onClose: () => void;
}

export const PredictionGameModal: React.FC<PredictionGameModalProps> = ({ matches, onClose }) => {
  const upcomingMatches = matches.filter((m) => m.status === 'SCHEDULED');
  const [selectedMatchId, setSelectedMatchId] = useState<string>(
    upcomingMatches[0]?.id || matches[0]?.id || ''
  );
  const [homeScore, setHomeScore] = useState<number>(2);
  const [awayScore, setAwayScore] = useState<number>(1);
  const [firstScorer, setFirstScorer] = useState('Erling Haaland');
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [myPoints, setMyPoints] = useState(720);

  const selectedMatch = matches.find((m) => m.id === selectedMatchId) || matches[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setMyPoints((prev) => prev + 30);
  };

  const handleShare = () => {
    if (navigator.clipboard && selectedMatch) {
      navigator.clipboard.writeText(
        `🏆 Tôi vừa dự đoán trận ${selectedMatch.homeTeam.name} ${homeScore} - ${awayScore} ${selectedMatch.awayTeam.name} trên CyberPitch Live! Cùng vào thi đấu tính điểm tại đây!`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl bg-[#09111e] border border-emerald-500/40 shadow-2xl text-slate-100 overflow-hidden">
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm text-white">Đấu Trường Dự Đoán Tỉ Số Cùng Bạn Bè</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Points & Rules Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-300 font-medium">Điểm tích lũy của bạn:</div>
              <div className="text-2xl font-black font-mono text-emerald-400 tabular-nums">
                {myPoints} PTS
              </div>
            </div>
            <div className="text-right text-[11px] text-slate-400 space-y-0.5">
              <div>🎯 Đúng tỉ số chính xác: <strong>+30 điểm</strong></div>
              <div>⚡ Đúng kết quả (Thắng/Thua): <strong>+10 điểm</strong></div>
              <div>⚽ Đoán đúng cầu thủ mở tỉ số: <strong>+15 điểm</strong></div>
            </div>
          </div>

          {/* Prediction Form */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              1. Chọn trận đấu sắp diễn ra:
            </h4>

            <select
              value={selectedMatchId}
              onChange={(e) => {
                setSelectedMatchId(e.target.value);
                setSubmitted(false);
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
            >
              {matches.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.homeTeam.name} vs {m.awayTeam.name} ({m.round})
                </option>
              ))}
            </select>

            {/* Score Selector */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                2. Dự đoán tỉ số chung cuộc:
              </h4>

              <div className="flex items-center justify-center gap-4">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-bold text-white text-center max-w-[100px] truncate">
                    {selectedMatch.homeTeam.shortName}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setHomeScore(Math.max(0, homeScore - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-mono font-extrabold text-2xl text-emerald-400 tabular-nums">
                      {homeScore}
                    </span>
                    <button
                      type="button"
                      onClick={() => setHomeScore(homeScore + 1)}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-2xl font-mono font-bold text-slate-500 pt-5">:</div>

                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-bold text-white text-center max-w-[100px] truncate">
                    {selectedMatch.awayTeam.shortName}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setAwayScore(Math.max(0, awayScore - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-mono font-extrabold text-2xl text-cyan-400 tabular-nums">
                      {awayScore}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAwayScore(awayScore + 1)}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* First Scorer Selection */}
            <div className="pt-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                3. Cầu thủ ghi bàn đầu tiên:
              </label>
              <input
                type="text"
                value={firstScorer}
                onChange={(e) => setFirstScorer(e.target.value)}
                placeholder="Nhập tên cầu thủ (vd: Erling Haaland, Kylian Mbappé)..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            {/* Submit Button */}
            {submitted ? (
              <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-center text-xs text-emerald-300 font-bold flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Đã gửi dự đoán thành công! Điểm thưởng sẽ cập nhật ngay khi trận đấu kết thúc.
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-emerald-500/20"
              >
                Xác Nhận Dự Đoán & Nhận Điểm
              </button>
            )}

            {/* Share CTA */}
            <button
              type="button"
              onClick={handleShare}
              className={`w-full py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Đã sao chép liên kết dự đoán vào bộ nhớ tạm!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Chia sẻ thẻ dự đoán để thách đấu cùng bạn bè</span>
                </>
              )}
            </button>
          </div>

          {/* Friends Leaderboard */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              Bảng Xếp Hạng Bạn Bè (Tuần Này)
            </h4>

            <div className="divide-y divide-slate-800 rounded-xl bg-slate-900/40 border border-slate-800 overflow-hidden">
              {FRIENDS_LEADERBOARD.map((friend) => (
                <div key={friend.rank} className="p-3 flex items-center justify-between hover:bg-slate-800/40 text-xs">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                        friend.rank === 1
                          ? 'bg-amber-400/20 text-amber-400 border border-amber-400/40'
                          : friend.rank === 2
                          ? 'bg-slate-300/20 text-slate-300'
                          : friend.rank === 3
                          ? 'bg-amber-700/20 text-amber-600'
                          : 'text-slate-500'
                      }`}
                    >
                      {friend.rank}
                    </span>
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <div className="font-bold text-white">{friend.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {friend.correctPredictions} trận chính xác · Tỉ lệ: {friend.accuracyRate}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-extrabold text-emerald-400 tabular-nums">
                      {friend.totalPoints} PTS
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
