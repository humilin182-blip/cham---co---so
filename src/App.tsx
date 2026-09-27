import React, { useState, useEffect, useRef } from 'react';
import {
  HIGHLIGHTS_DATA,
  INITIAL_COMMUNITY_MESSAGES
} from './data/mockFootballData';
import { Match, LeagueId, CommunityMessage } from './types/football';
import { fetchAllLeaguesMatches } from './services/footballApi';
import { playGoalSound } from './services/soundEffects';
import { Header } from './components/Header';
import { HeroPitchBanner } from './components/HeroPitchBanner';
import { LiveScoreTicker } from './components/LiveScoreTicker';
import { MatchDetailModal } from './components/MatchDetailModal';
import { HighlightsSection } from './components/HighlightsSection';
import { StandingsSection } from './components/StandingsSection';
import { ScheduleSection } from './components/ScheduleSection';
import { ExpertAnalysisSection } from './components/ExpertAnalysisSection';
import { PredictionGameModal } from './components/PredictionGameModal';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';
import { GoalAlertBanner, GoalAlertData } from './components/GoalAlertBanner';
import { RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('scores');
  // Enforce CyberPitch Dark Mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [refreshCountdown, setRefreshCountdown] = useState<number>(30);
  const [selectedLeague, setSelectedLeague] = useState<LeagueId | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'LIVE' | 'SCHEDULED' | 'FINISHED'>('ALL');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Modals state
  const [activeMatchDetail, setActiveMatchDetail] = useState<Match | null>(null);
  const [isPredictionsOpen, setIsPredictionsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Notification leagues subscription
  const [subscribedLeagues, setSubscribedLeagues] = useState<LeagueId[]>([
    'ucl',
    'unl',
    'epl',
    'laliga'
  ]);

  // Live Goal Alert Banner
  const [currentGoalAlert, setCurrentGoalAlert] = useState<GoalAlertData | null>(null);

  // Community Chat Messages
  const [communityMessages, setCommunityMessages] = useState<CommunityMessage[]>(
    INITIAL_COMMUNITY_MESSAGES
  );

  // Keep track of previous matches to detect new live goals
  const prevMatchesRef = useRef<Match[]>([]);

  // Fetch real matches from Football API
  const loadMatches = async (isBackground = false) => {
    if (!isBackground) setIsLoadingMatches(true);
    setIsSyncing(true);

    try {
      const realMatches = await fetchAllLeaguesMatches();

      // Check if any match scored a goal during background refresh
      if (prevMatchesRef.current.length > 0 && realMatches.length > 0) {
        for (const newM of realMatches) {
          const oldM = prevMatchesRef.current.find((m) => m.id === newM.id);
          if (oldM && newM.status === 'LIVE') {
            const homeScored = newM.homeTeam.score > oldM.homeTeam.score;
            const awayScored = newM.awayTeam.score > oldM.awayTeam.score;

            if (homeScored || awayScored) {
              const scoringTeam = homeScored ? newM.homeTeam : newM.awayTeam;
              const latestEvent = newM.events.find(
                (e) => (e.type === 'GOAL' || e.type === 'PENALTY_GOAL') && e.team === (homeScored ? 'home' : 'away')
              );

              playGoalSound();
              setCurrentGoalAlert({
                id: `goal-${Date.now()}`,
                matchTitle: `${newM.homeTeam.shortName} vs ${newM.awayTeam.shortName}`,
                leagueName: newM.round,
                teamName: scoringTeam.name,
                playerName: latestEvent?.player || scoringTeam.name,
                minute: newM.minute || 85,
                newScore: `${newM.homeTeam.score} - ${newM.awayTeam.score}`,
                assistPlayer: latestEvent?.assistPlayer,
                onViewDetails: () => setActiveMatchDetail(newM)
              });
              break;
            }
          }
        }
      }

      setMatches(realMatches);
      prevMatchesRef.current = realMatches;
    } catch (err) {
      console.error('Error fetching live matches:', err);
    } finally {
      setIsLoadingMatches(false);
      setIsSyncing(false);
      setRefreshCountdown(30);
    }
  };

  // Initial load
  useEffect(() => {
    loadMatches();
  }, []);

  // 30-Second Real-Time Live Auto-Update Interval
  useEffect(() => {
    const countdownTimer = setInterval(() => {
      setRefreshCountdown((prev) => {
        if (prev <= 1) {
          loadMatches(true);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, []);

  // Handle countdown expiry: transition scheduled match to live
  const handleMatchBecomesLive = (matchId: string) => {
    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? {
              ...m,
              status: 'LIVE',
              minute: 1
            }
          : m
      )
    );
  };

  // Toggle favorite match
  const handleToggleFavorite = (matchId: string) => {
    setFavorites((prev) =>
      prev.includes(matchId) ? prev.filter((id) => id !== matchId) : [...prev, matchId]
    );
  };

  // Toggle subscribed league for notifications
  const handleToggleSubscribedLeague = (leagueId: LeagueId) => {
    setSubscribedLeagues((prev) =>
      prev.includes(leagueId) ? prev.filter((id) => id !== leagueId) : [...prev, leagueId]
    );
  };

  // Trigger test live goal alert
  const handleTriggerTestGoal = () => {
    const liveMatch = matches.find((m) => m.status === 'LIVE') || matches[0];
    if (!liveMatch) return;

    const newHomeScore = liveMatch.homeTeam.score + 1;

    setMatches((prev) =>
      prev.map((m) => {
        if (m.id === liveMatch.id) {
          const updatedMin = (m.minute || 75) + 1;
          return {
            ...m,
            minute: updatedMin,
            homeTeam: {
              ...m.homeTeam,
              score: newHomeScore
            },
            events: [
              ...m.events,
              {
                id: `e-goal-${Date.now()}`,
                minute: updatedMin,
                type: 'GOAL',
                team: 'home',
                player: liveMatch.homeTeam.name + ' Tiền đạo',
                detail: 'Dứt điểm hiểm hóc cận thành tung lưới'
              }
            ]
          };
        }
        return m;
      })
    );

    setCurrentGoalAlert({
      id: `alert-${Date.now()}`,
      matchTitle: `${liveMatch.homeTeam.shortName} vs ${liveMatch.awayTeam.shortName}`,
      leagueName: 'Trận đấu trực tiếp',
      teamName: liveMatch.homeTeam.name,
      playerName: liveMatch.homeTeam.shortName + ' Tiền đạo',
      minute: (liveMatch.minute || 75) + 1,
      newScore: `${newHomeScore} - ${liveMatch.awayTeam.score}`,
      onViewDetails: () => setActiveMatchDetail(liveMatch)
    });
  };

  // Handle new community message
  const handleSendMessage = (matchId: string, content: string, fanOf: string) => {
    const newMsg: CommunityMessage = {
      id: `msg-${Date.now()}`,
      matchId,
      user: 'Bạn (Fan Việt Nam)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=64&q=80',
      fanOf,
      content,
      timestamp: 'Vừa xong',
      reactionCount: 1,
      userLiked: true
    };
    setCommunityMessages((prev) => [newMsg, ...prev]);
  };

  const liveMatches = matches.filter((m) => m.status === 'LIVE');
  const featuredLiveMatch = liveMatches[0] || matches[0];

  return (
    <div
      className={`min-h-screen transition-colors ${
        isDarkMode
          ? 'bg-[#080d16] text-slate-100'
          : 'bg-[#f4f7fb] text-slate-900'
      }`}
    >
      {/* Top Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenPredictions={() => setIsPredictionsOpen(true)}
        onTriggerTestGoal={handleTriggerTestGoal}
        liveMatchCount={liveMatches.length}
      />

      {/* Floating Goal Alert Banner with procedural audio */}
      <GoalAlertBanner
        alert={currentGoalAlert}
        onClose={() => setCurrentGoalAlert(null)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Hero Pitch Visual Banner */}
        <HeroPitchBanner
          featuredMatch={featuredLiveMatch}
          onSelectMatch={(m) => setActiveMatchDetail(m)}
          onOpenHighlights={() => setActiveTab('highlights')}
        />

        {/* View Switcher based on Active Tab */}
        {activeTab === 'scores' && (
          <>
            {isLoadingMatches && matches.length === 0 ? (
              <div className="p-16 rounded-2xl bg-[#09111e] border border-slate-800 text-center space-y-4">
                <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                <h3 className="text-sm font-bold text-white">
                  Đang đồng bộ tỉ số trực tiếp từ Football API...
                </h3>
                <p className="text-xs text-slate-400">
                  Lấy dữ liệu thời gian thực các giải đấu Nations League, Champions League, Premier League, La Liga...
                </p>
              </div>
            ) : (
              <LiveScoreTicker
                matches={matches}
                selectedLeague={selectedLeague}
                setSelectedLeague={setSelectedLeague}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                favorites={favorites}
                toggleFavorite={handleToggleFavorite}
                onSelectMatch={(m) => setActiveMatchDetail(m)}
                onOpenHighlights={() => setActiveTab('highlights')}
                onOpenAnalysis={() => setActiveTab('analysis')}
                onMatchBecomesLive={handleMatchBecomesLive}
                onManualRefresh={() => loadMatches(false)}
                refreshCountdown={refreshCountdown}
                isSyncing={isSyncing}
              />
            )}
          </>
        )}

        {activeTab === 'schedule' && (
          <ScheduleSection
            matches={matches}
            onSelectMatch={(m) => setActiveMatchDetail(m)}
            onOpenAnalysis={() => setActiveTab('analysis')}
            onOpenPrediction={() => setIsPredictionsOpen(true)}
          />
        )}

        {activeTab === 'standings' && <StandingsSection />}

        {activeTab === 'highlights' && (
          <HighlightsSection highlights={HIGHLIGHTS_DATA} />
        )}

        {activeTab === 'analysis' && (
          <ExpertAnalysisSection
            onSelectMatch={(m) => setActiveMatchDetail(m)}
            matches={matches}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-800/80 bg-[#060a12] py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">CyberPitch Live</span>
            <span>·</span>
            <span>Hệ Thống Tỉ Số & Thể Thao Số Thời Gian Thực</span>
            <span className="text-emerald-400 font-mono text-[11px] ml-1">● Tự động làm mới 30s</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>UEFA Champions League</span>
            <span>·</span>
            <span>Nations League</span>
            <span>·</span>
            <span>Premier League</span>
            <span>·</span>
            <span>La Liga</span>
            <span>·</span>
            <span>Bundesliga</span>
            <span>·</span>
            <span>Serie A</span>
          </div>

          <div className="text-[11px] text-slate-400">
            Dữ liệu bóng đá thời gian thực · Giờ chuẩn Asia/Saigon (GMT+7)
          </div>
        </div>
      </footer>

      {/* Match Center Modal (Details, Timeline, Stats, Lineups, Community Chat) */}
      {activeMatchDetail && (
        <MatchDetailModal
          match={activeMatchDetail}
          onClose={() => setActiveMatchDetail(null)}
          communityMessages={communityMessages}
          onSendMessage={handleSendMessage}
        />
      )}

      {/* Prediction Tournament Mini-Game Modal */}
      {isPredictionsOpen && (
        <PredictionGameModal
          matches={matches}
          onClose={() => setIsPredictionsOpen(false)}
        />
      )}

      {/* Personalized Push Notification Settings Modal */}
      {isNotificationsOpen && (
        <NotificationSettingsModal
          onClose={() => setIsNotificationsOpen(false)}
          enabledLeagues={subscribedLeagues}
          onToggleLeague={handleToggleSubscribedLeague}
        />
      )}
    </div>
  );
}
