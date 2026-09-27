import React, { useState } from 'react';
import { EXPERT_ANALYSES } from '../data/mockFootballData';
import { ExpertAnalysis, Match } from '../types/football';
import { BookOpen, Sparkles, TrendingUp, ShieldAlert, Award, ChevronRight } from 'lucide-react';

interface ExpertAnalysisSectionProps {
  onSelectMatch: (match: Match) => void;
  matches?: Match[];
}

export const ExpertAnalysisSection: React.FC<ExpertAnalysisSectionProps> = ({ onSelectMatch, matches = [] }) => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<ExpertAnalysis>(EXPERT_ANALYSES[0]);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  // Generate tactical analysis
  const handleGenerateAiTactics = () => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      setAiReport(
        `[CyberPitch AI Tactical Lab 2026]\n` +
        `• Tỉ lệ kiểm soát bóng kỳ vọng: 54% - 46%\n` +
        `• Vùng tranh chấp quyết định (Hot-Zone): Hành lang cánh trái nơi hậu vệ biên dâng cao tạo khoảng trống phản công.\n` +
        `• Chỉ số xG dự kiến: Đội chủ nhà (1.85) - Đội khách (1.40).\n` +
        `• Đánh giá xác suất: 45% Đội nhà thắng | 30% Hòa | 25% Đội khách thắng.\n` +
        `• Lời khuyên chiến thuật: Đội khách cần chơi pressing tầm trung và khóa chặt ngòi nổ kiến thiết tuyến 2.`
      );
      setIsGeneratingAi(false);
    }, 1200);
  };

  const currentMatch = matches.find((m) => m.id === selectedAnalysis.matchId) || matches[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            Nhận Định & Bình Luận Chuyên Gia Trước Trận Đấu
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Góc nhìn chiến thuật chuyên sâu, phân tích điểm nóng trên sân và dự đoán tỉ số từ các chuyên gia thể thao
          </p>
        </div>

        {/* AI Tactical Generator Button */}
        <button
          onClick={handleGenerateAiTactics}
          disabled={isGeneratingAi}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-all hover:scale-105"
        >
          <Sparkles className={`w-4 h-4 text-emerald-400 ${isGeneratingAi ? 'animate-spin' : ''}`} />
          <span>{isGeneratingAi ? 'Đang phân tích dữ liệu...' : 'Phân Tích AI Chiến Thuật'}</span>
        </button>
      </div>

      {/* AI Report Card if generated */}
      {aiReport && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-slate-900 border border-emerald-500/30 text-xs text-slate-200 animate-in fade-in">
          <div className="flex items-center justify-between font-bold text-emerald-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Báo Cáo Mô Phỏng Chiến Thuật AI Độc Quyền
            </span>
            <button
              onClick={() => setAiReport(null)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <pre className="font-sans whitespace-pre-line text-slate-300 leading-relaxed">
            {aiReport}
          </pre>
        </div>
      )}

      {/* Main Analysis Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Expert Analyses */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Các Trận Đấu Được Nhận Định
          </h3>

          {EXPERT_ANALYSES.map((item) => {
            const isSelected = selectedAnalysis.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedAnalysis(item)}
                className={`p-3.5 rounded-xl cursor-pointer border transition-all ${
                  isSelected
                    ? 'bg-emerald-500/10 border-emerald-500/50 shadow-lg'
                    : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    {item.predictedScore}
                  </span>
                  <span className="text-[11px] font-mono text-cyan-300 tabular-nums">
                    Tin cậy: {item.confidenceRate}%
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white line-clamp-2 mb-2">
                  {item.title}
                </h4>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                  <img
                    src={item.authorAvatar}
                    alt={item.authorName}
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="text-[11px] text-slate-300 font-medium">
                    {item.authorName}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 2 Columns: Full Selected Article */}
        <div className="lg:col-span-2 space-y-5 p-5 rounded-2xl bg-[#09111e] border border-slate-800 shadow-xl">
          {/* Article Header & Author */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Bình Luận Độc Quyền
              </span>
              <h3 className="text-lg font-bold text-white leading-snug mt-1">
                {selectedAnalysis.title}
              </h3>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
              <img
                src={selectedAnalysis.authorAvatar}
                alt={selectedAnalysis.authorName}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border border-emerald-500/40"
              />
              <div>
                <div className="text-xs font-bold text-white">{selectedAnalysis.authorName}</div>
                <div className="text-[10px] text-slate-400">{selectedAnalysis.authorTitle}</div>
              </div>
            </div>
          </div>

          {/* Quick Odds & Score Prediction Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <div>
              <div className="text-[11px] text-slate-400">Dự đoán tỉ số</div>
              <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                {selectedAnalysis.predictedScore}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Độ tin cậy</div>
              <div className="text-sm font-bold text-cyan-400 font-mono mt-0.5">
                {selectedAnalysis.confidenceRate}%
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Tỉ lệ Thắng Chủ Nhà</div>
              <div className="text-sm font-mono font-bold text-white mt-0.5">
                1 ăn {selectedAnalysis.oddsHomeWin}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Tỉ lệ Hòa / Thua</div>
              <div className="text-sm font-mono font-bold text-slate-300 mt-0.5">
                {selectedAnalysis.oddsDraw} / {selectedAnalysis.oddsAwayWin}
              </div>
            </div>
          </div>

          {/* Summary Prose */}
          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p>{selectedAnalysis.summary}</p>
          </div>

          {/* Tactical Points */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Điểm mấu chốt chiến thuật:
            </h4>
            <div className="space-y-1.5">
              {selectedAnalysis.tacticalKeyPoints.map((pt, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800">
                  <span className="w-4 font-mono font-bold text-emerald-400 tabular-nums">
                    {i + 1}.
                  </span>
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Player Clash */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-[#0c1626] border border-cyan-500/20">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
              Điểm nóng đối đầu 1v1: {selectedAnalysis.keyClash.playerHome} vs {selectedAnalysis.keyClash.playerAway}
            </div>
            <p className="text-xs text-slate-300 italic">
              "{selectedAnalysis.keyClash.analysis}"
            </p>
          </div>

          {/* Link to Match Center */}
          {currentMatch && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => onSelectMatch(currentMatch)}
                className="flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300"
              >
                <span>Xem chi tiết trận đấu và đội hình</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
