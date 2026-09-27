import React, { useState } from 'react';
import { LEAGUES_DATA } from '../data/mockFootballData';
import { LeagueId } from '../types/football';
import { X, Bell, BellRing, Volume2, ShieldCheck, Check } from 'lucide-react';
import { playNotificationSound } from '../services/soundEffects';

interface NotificationSettingsModalProps {
  onClose: () => void;
  enabledLeagues: LeagueId[];
  onToggleLeague: (id: LeagueId) => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  onClose,
  enabledLeagues,
  onToggleLeague
}) => {
  const [goalAlertSound, setGoalAlertSound] = useState(true);
  const [varAlerts, setVarAlerts] = useState(true);
  const [matchStartAlerts, setMatchStartAlerts] = useState(true);
  const [browserPermission, setBrowserPermission] = useState<string>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleRequestPermission = async () => {
    if (typeof Notification !== 'undefined') {
      try {
        const perm = await Notification.requestPermission();
        setBrowserPermission(perm);
        playNotificationSound();
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const handleSave = () => {
    setSavedSuccess(true);
    playNotificationSound();
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#09111e] border border-emerald-500/40 shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">Cài Đặt Thông Báo Đẩy Cá Nhân Hóa</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Permission status card */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Thông Báo Trình Duyệt / Thiết Bị
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Trạng thái: <strong className="text-emerald-300 capitalize">{browserPermission}</strong>
              </div>
            </div>

            {browserPermission !== 'granted' && (
              <button
                onClick={handleRequestPermission}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
              >
                Cho phép
              </button>
            )}
          </div>

          {/* Alert Options */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Loại sự kiện thông báo:
            </div>

            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-slate-800 hover:bg-slate-800/40 cursor-pointer">
              <div>
                <div className="text-xs font-semibold text-white">Bàn thắng tức thời (Goal Chime)</div>
                <div className="text-[11px] text-slate-400">Rung chuông và hiện banner khi bóng vào lưới</div>
              </div>
              <input
                type="checkbox"
                checked={goalAlertSound}
                onChange={(e) => setGoalAlertSound(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-slate-800 hover:bg-slate-800/40 cursor-pointer">
              <div>
                <div className="text-xs font-semibold text-white">Thẻ đỏ & VAR kiểm tra</div>
                <div className="text-[11px] text-slate-400">Báo các tình huống quyết định bước ngoặt trận đấu</div>
              </div>
              <input
                type="checkbox"
                checked={varAlerts}
                onChange={(e) => setVarAlerts(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-slate-800 hover:bg-slate-800/40 cursor-pointer">
              <div>
                <div className="text-xs font-semibold text-white">Giờ bóng lăn (Kick-off)</div>
                <div className="text-[11px] text-slate-400">Nhắc nhở trước 15 phút khi trận đấu bắt đầu</div>
              </div>
              <input
                type="checkbox"
                checked={matchStartAlerts}
                onChange={(e) => setMatchStartAlerts(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </label>
          </div>

          {/* Per League subscriptions */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Chọn các giải đấu bạn muốn nhận thông báo đẩy:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {LEAGUES_DATA.map((league) => {
                const isSubscribed = enabledLeagues.includes(league.id);
                return (
                  <button
                    key={league.id}
                    type="button"
                    onClick={() => onToggleLeague(league.id)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-left text-xs transition-all ${
                      isSubscribed
                        ? 'bg-emerald-500/15 border-emerald-500/50 text-white font-semibold'
                        : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{league.flag}</span>
                      <span className="truncate max-w-[140px]">{league.shortName}</span>
                    </div>
                    <span className={`w-2 h-2 rounded-full ${isSubscribed ? 'bg-emerald-400 shadow-[0_0_8px_#10B981]' : 'bg-slate-700'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              onClick={handleSave}
              className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  Đã Lưu Cài Đặt!
                </>
              ) : (
                'Lưu Cài Đặt Thông Báo'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
