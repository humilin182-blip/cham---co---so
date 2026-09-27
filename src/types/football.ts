export type LeagueId = 
  | 'ucl'
  | 'unl'
  | 'epl'
  | 'laliga'
  | 'bundesliga'
  | 'seriea'
  | 'ligue1'
  | 'vleague';

export interface League {
  id: LeagueId;
  name: string;
  shortName: string;
  country: string;
  logo: string;
  flag: string;
  color: string;
  season: string;
}

export type MatchStatus = 'LIVE' | 'SCHEDULED' | 'FINISHED' | 'HT' | 'ET' | 'PEN';

export interface MatchEvent {
  id: string;
  minute: number;
  extraMinute?: number;
  type: 'GOAL' | 'PENALTY_GOAL' | 'OWN_GOAL' | 'YELLOW_CARD' | 'RED_CARD' | 'SUBSTITUTION' | 'VAR';
  team: 'home' | 'away';
  player: string;
  assistPlayer?: string;
  detail?: string;
}

export interface MatchStats {
  possession: [number, number]; // [home, away] %
  shots: [number, number];
  shotsOnTarget: [number, number];
  expectedGoals: [number, number]; // xG
  fouls: [number, number];
  corners: [number, number];
  offsides: [number, number];
  yellowCards: [number, number];
  redCards: [number, number];
  passes: [number, number];
  passAccuracy: [number, number]; // %
}

export interface Player {
  number: number;
  name: string;
  position: 'GK' | 'DF' | 'MF' | 'FW';
  rating?: number;
  isCaptain?: boolean;
}

export interface Lineup {
  formation: string;
  coach: string;
  startingXI: Player[];
  substitutes: Player[];
}

export interface Match {
  id: string;
  leagueId: LeagueId;
  round: string;
  homeTeam: {
    id: string;
    name: string;
    shortName: string;
    logo: string;
    score: number;
    color: string;
  };
  awayTeam: {
    id: string;
    name: string;
    shortName: string;
    logo: string;
    score: number;
    color: string;
  };
  status: MatchStatus;
  minute?: number;
  startTime: string; // ISO string
  stadium: string;
  city: string;
  referee: string;
  events: MatchEvent[];
  stats: MatchStats;
  lineup?: {
    home: Lineup;
    away: Lineup;
  };
  streamAvailable?: boolean;
  highlightUrl?: string;
  hasGoalAlert?: boolean;
}

export interface TeamStanding {
  position: number;
  teamId: string;
  teamName: string;
  teamLogo: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
}

export interface HighlightItem {
  id: string;
  matchId: string;
  title: string;
  duration: string;
  league: string;
  thumbnail: string;
  videoPlaceholderUrl?: string;
  views: string;
  date: string;
  events: {
    minute: string;
    title: string;
    timestampSec: number;
  }[];
}

export interface ExpertAnalysis {
  id: string;
  matchId: string;
  authorName: string;
  authorTitle: string;
  authorAvatar: string;
  predictedScore: string;
  confidenceRate: number; // 0 - 100
  title: string;
  summary: string;
  tacticalKeyPoints: string[];
  keyClash: {
    playerHome: string;
    playerAway: string;
    analysis: string;
  };
  oddsHomeWin: number;
  oddsDraw: number;
  oddsAwayWin: number;
}

export interface PredictionEntry {
  id: string;
  matchId: string;
  homeScore: number;
  awayScore: number;
  firstScorer?: string;
  submittedAt: string;
  pointsAwarded?: number;
}

export interface CommunityMessage {
  id: string;
  matchId?: string;
  user: string;
  avatar: string;
  fanOf: string;
  content: string;
  timestamp: string;
  reactionCount: number;
  userLiked?: boolean;
}

export interface FriendRank {
  rank: number;
  name: string;
  avatar: string;
  correctPredictions: number;
  totalPoints: number;
  accuracyRate: string;
}
