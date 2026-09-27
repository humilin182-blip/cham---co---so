import {
  League,
  Match,
  TeamStanding,
  HighlightItem,
  ExpertAnalysis,
  FriendRank,
  CommunityMessage
} from '../types/football';

export const LEAGUES_DATA: League[] = [
  {
    id: 'ucl',
    name: 'UEFA Champions League',
    shortName: 'UCL',
    country: 'Châu Âu',
    logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=80&q=80',
    flag: '⭐',
    color: '#0e1e5b',
    season: '2026/2027'
  },
  {
    id: 'unl',
    name: 'UEFA Nations League',
    shortName: 'Nations League',
    country: 'Châu Âu',
    logo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=80&q=80',
    flag: '🇪🇺',
    color: '#003399',
    season: '2026/2027'
  },
  {
    id: 'epl',
    name: 'Premier League',
    shortName: 'Ngoại Hạng Anh',
    country: 'Anh',
    logo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=80&q=80',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    color: '#3d195b',
    season: '2026/2027'
  },
  {
    id: 'laliga',
    name: 'La Liga EA Sports',
    shortName: 'La Liga',
    country: 'Tây Ban Nha',
    logo: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=80&q=80',
    flag: '🇪🇸',
    color: '#ee1526',
    season: '2026/2027'
  },
  {
    id: 'bundesliga',
    name: 'Bundesliga',
    shortName: 'Bundesliga',
    country: 'Đức',
    logo: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=80&q=80',
    flag: '🇩🇪',
    color: '#d20515',
    season: '2026/2027'
  },
  {
    id: 'seriea',
    name: 'Serie A Enilive',
    shortName: 'Serie A',
    country: 'Ý',
    logo: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=80&q=80',
    flag: '🇮🇹',
    color: '#024494',
    season: '2026/2027'
  },
  {
    id: 'ligue1',
    name: 'Ligue 1 McDonald’s',
    shortName: 'Ligue 1',
    country: 'Pháp',
    logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=80&q=80',
    flag: '🇫🇷',
    color: '#091c3e',
    season: '2026/2027'
  },
  {
    id: 'vleague',
    name: 'V.League 1',
    shortName: 'V-League',
    country: 'Việt Nam',
    logo: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=80&q=80',
    flag: '🇻🇳',
    color: '#c8102e',
    season: '2026/2027'
  }
];

export const HIGHLIGHTS_DATA: HighlightItem[] = [
  {
    id: 'hl-1',
    matchId: 'match-ucl-1',
    title: 'Highlights: Manchester City 2 - 1 Real Madrid | Siêu phẩm Foden nổ tung cầu trường',
    duration: '09:42',
    league: 'UEFA Champions League',
    thumbnail: '/src/assets/images/cyber_match_highlight_1790513577902.jpg',
    views: '2.4M lượt xem',
    date: 'Hôm nay',
    events: [
      { minute: '23\'', title: 'Haaland mở tỉ số bằng pha đánh đầu sấm sét', timestampSec: 45 },
      { minute: '54\'', title: 'Mbappé tăng tốc ghi bàn gỡ hòa đẳng cấp', timestampSec: 180 },
      { minute: '68\'', title: 'Phil Foden lập siêu phẩm nã đại bác góc xa', timestampSec: 320 },
      { minute: '89\'', title: 'Ederson bay người cản phá cú sút phút chót của Vinícius', timestampSec: 510 }
    ]
  },
  {
    id: 'hl-2',
    matchId: 'match-epl-1',
    title: 'Highlights: Arsenal 1 - 1 Liverpool | Đại chiến rực lửa tại Emirates',
    duration: '11:15',
    league: 'Premier League',
    thumbnail: '/src/assets/images/cyber_pitch_cleats_hero_1790513556958.jpg',
    views: '1.8M lượt xem',
    date: 'Hôm nay',
    events: [
      { minute: '14\'', title: 'Saka cứa lòng ngoạn mục mở tỉ số', timestampSec: 60 },
      { minute: '45\'', title: 'Salah đệm bóng nhạy cảm gỡ hòa 1-1', timestampSec: 250 },
      { minute: '78\'', title: 'Xà ngang từ chối bàn thắng của Gabriel Martinelli', timestampSec: 480 }
    ]
  },
  {
    id: 'hl-3',
    matchId: 'match-seriea-1',
    title: 'Highlights: Inter Milan 2 - 1 AC Milan | Derby rực lửa thành Milan',
    duration: '08:30',
    league: 'Serie A',
    thumbnail: '/src/assets/images/cyber_stadium_broadcast_1790513588901.jpg',
    views: '950K lượt xem',
    date: 'Hôm qua',
    events: [
      { minute: '28\'', title: 'Lautaro đánh đầu mở điểm cho Inter', timestampSec: 50 },
      { minute: '57\'', title: 'Leão solo qua 2 hậu vệ ghi bàn quân bình', timestampSec: 190 },
      { minute: '85\'', title: 'Thuram tung cú sút quyết định ấn định chiến thắng', timestampSec: 380 }
    ]
  }
];

export const EXPERT_ANALYSES: ExpertAnalysis[] = [
  {
    id: 'exp-1',
    matchId: 'match-laliga-1',
    authorName: 'BLV Quang Huy',
    authorTitle: 'Chuyên gia & Nhà bình luận bóng đá quốc tế',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80',
    predictedScore: 'Barcelona 2 - 2 Real Madrid',
    confidenceRate: 85,
    title: 'Đại chiến El Clásico: Cuộc đấu trí đỉnh cao giữa bẫy việt vị và tốc độ sấm sét',
    summary: 'Barcelona dưới thời Hansi Flick đang duy trì khối đội hình dâng rất cao và bẫy việt vị nghẹt thở. Trong khi đó, Real Madrid sở hữu mũi đinh ba Mbappé - Vinícius - Bellingham sẵn sàng trừng phạt bất kỳ khoảng trống nào phía sau lưng hàng thủ.',
    tacticalKeyPoints: [
      'Barca kiểm soát trung tuyến bằng khả năng điều phối nhịp của Pedri và Casadó',
      'Real Madrid chủ động phòng ngự khu vực tầng trung (mid-block) và phất bóng dài vượt tuyến',
      'Yếu tố thể lực ở 20 phút cuối hiệp 2 sẽ mang tính định đoạt cuộc chiến',
      'Trọng tài Gil Manzano nổi tiếng nghiêm khắc, có thể xuất hiện thẻ phạt sớm'
    ],
    keyClash: {
      playerHome: 'Lamine Yamal (Barca)',
      playerAway: 'Ferland Mendy (Real)',
      analysis: 'Yamal có khả năng rê bóng 1v1 đẳng cấp hàng đầu châu Âu hiện tại. Liệu thể lực và kinh nghiệm dằn dặn của Mendy có phong tỏa được ngôi sao trẻ này?'
    },
    oddsHomeWin: 2.35,
    oddsDraw: 3.60,
    oddsAwayWin: 2.80
  },
  {
    id: 'exp-2',
    matchId: 'match-bundesliga-1',
    authorName: 'BLV Anh Ngọc',
    authorTitle: 'Nhà báo thể thao & Thành viên ban bầu chọn Quả bóng Vàng',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
    predictedScore: 'Bayern Munich 3 - 1 Dortmund',
    confidenceRate: 80,
    title: 'Der Klassiker rực lửa Allianz Arena: Kane và Musiala sẽ thị uy sức mạnh',
    summary: 'Bayern đang khát khao khẳng định lại vị thế thống trị tuyệt đối tại Bundesliga. Hàng thủ Dortmund thường bộc lộ điểm yếu khi chịu áp lực pressing tầm cao liên tục của Hùm Xám.',
    tacticalKeyPoints: [
      'Harry Kane lùi sâu kiến thiết tạo không gian cho Olise và Musiala băng cắt',
      'Dortmund cần trông cậy vào các pha phản công biên chớp nhoáng của Adeyemi',
      'Điểm tựa khán đài Allianz Arena luôn là cơn ác mộng đối với đội bóng vùng Ruhr'
    ],
    keyClash: {
      playerHome: 'Harry Kane (Bayern)',
      playerAway: 'Nico Schlotterbeck (Dortmund)',
      analysis: 'Schlotterbeck phải giữ cự ly bọc lót hoàn hảo, nếu bị Kane lôi kéo khỏi vòng cấm thì khoảng trống sẽ bị các tiền đạo cánh Bayern khai thác triệt để.'
    },
    oddsHomeWin: 1.55,
    oddsDraw: 4.50,
    oddsAwayWin: 5.20
  }
];

export const INITIAL_COMMUNITY_MESSAGES: CommunityMessage[] = [
  {
    id: 'msg-1',
    user: 'CyberStriker99',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=64&q=80',
    fanOf: 'Man City',
    content: 'Foden đá trận này cháy quá anh em ơi! Cú sút chân trái đúng thương hiệu không thể cản phá! 🔥⚽',
    timestamp: '2 phút trước',
    reactionCount: 24,
    userLiked: true
  },
  {
    id: 'msg-2',
    user: 'HalaMadrid_VN',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=64&q=80',
    fanOf: 'Real Madrid',
    content: 'Mbappé vẫn quá nhanh, Real chỉ cần một khoảnh khắc phản công là có bàn thắng. Hiệp 2 còn căng lắm!',
    timestamp: '3 phút trước',
    reactionCount: 18
  },
  {
    id: 'msg-3',
    user: 'GunnerHanoi',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=64&q=80',
    fanOf: 'Arsenal',
    content: 'Nhìn Saka ghi bàn xong ăn mừng xúc động ghê, trận sau gặp Man City nhất định phải giữ phong độ này.',
    timestamp: '5 phút trước',
    reactionCount: 15
  },
  {
    id: 'msg-4',
    user: 'VLeague_Fanatic',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=64&q=80',
    fanOf: 'Hà Nội FC',
    content: 'Derby thủ đô chiều nay Hàng Đẫy chắc chắn chật kín chỗ. Chờ đợi màn đối đầu Quang Hải vs Văn Quyết!',
    timestamp: '8 phút trước',
    reactionCount: 31
  }
];

export const FRIENDS_LEADERBOARD: FriendRank[] = [
  { rank: 1, name: 'Nguyễn Minh Tuấn (Bạn)', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=64&q=80', correctPredictions: 24, totalPoints: 720, accuracyRate: '82%' },
  { rank: 2, name: 'Trần Hoàng Long', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=64&q=80', correctPredictions: 22, totalPoints: 660, accuracyRate: '78%' },
  { rank: 3, name: 'Lê Thanh Tùng', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=64&q=80', correctPredictions: 20, totalPoints: 590, accuracyRate: '74%' },
  { rank: 4, name: 'Phạm Văn Nam', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&q=80', correctPredictions: 19, totalPoints: 550, accuracyRate: '71%' },
  { rank: 5, name: 'Đặng Quốc Anh', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=64&q=80', correctPredictions: 17, totalPoints: 490, accuracyRate: '68%' }
];
