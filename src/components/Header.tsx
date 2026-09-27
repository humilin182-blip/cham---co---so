import React from 'react';
import { Bell, Moon, Sun, Zap, Radio, Trophy, Search } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onOpenNotifications: () => void;
  onOpenPredictions: () => void;
  onTriggerTestGoal: () => void;
  liveMatchCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  onOpenNotifications,
  onOpenPredictions,
  onTriggerTestGoal,
  liveMatchCount
}) => {
  const navItems = [
    { id: 'scores', label: 'Tỉ số & Trận đấu' },
    { id: 'schedule', label: 'Lịch thi đấu' },
    { id: 'standings', label: 'Bảng xếp hạng' },
    { id: 'highlights', label: 'Highlight 4K' },
    { id: 'analysis', label: 'Nhận định chuyên gia' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#080d16]/90 border-b border-emerald-500/20 text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('scores')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="relative w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center overflow-hidden group-hover:border-emerald-400 transition-colors">
              <span className="text-xl">⚽</span>
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-cyan-500/0 pointer-events-none" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-emerald-400 via-cyan-300 to-white bg-clip-text text-transparent">
                CyberPitch
              </span>
              <span className="text-xs font-semibold text-emerald-400 ml-1.5 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 uppercase tracking-wider">
                Live
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-3.5 py-2 text-sm font-medium transition-all whitespace-nowrap rounded-md ${
                  isActive
                    ? 'text-emerald-400 bg-emerald-500/10 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {item.label}
                {item.id === 'scores' && liveMatchCount > 0 && (
                  <span className="inline-flex items-center ml-2 px-1.5 py-0.2 text-[10px] font-bold bg-rose-500/20 text-rose-400 rounded-full border border-rose-500/30 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1" />
                    {liveMatchCount}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Goal alert test simulation button */}
          <button
            onClick={onTriggerTestGoal}
            title="Thử nghiệm báo bàn thắng tức thì (Live Goal Simulation)"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg hover:bg-amber-500/20 transition-all hover:scale-[1.02]"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span className="hidden sm:inline">Thử báo bàn thắng</span>
          </button>

          {/* Prediction mini game shortcut */}
          <button
            onClick={onOpenPredictions}
            title="Dự đoán tỉ số cùng bạn bè"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-all"
          >
            <Trophy className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Dự đoán điểm</span>
          </button>

          {/* Personalized push notification preferences */}
          <button
            onClick={onOpenNotifications}
            title="Cài đặt thông báo giải đấu & đội bóng"
            className="p-2 text-slate-300 hover:text-emerald-400 hover:bg-slate-800/60 rounded-lg transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#080d16]" />
          </button>

          {/* Dark / Stadium Light Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={isDarkMode ? 'Chuyển sang Chế độ sáng ban ngày' : 'Chuyển sang Chế độ tối ban đêm'}
            className="p-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 rounded-lg transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
