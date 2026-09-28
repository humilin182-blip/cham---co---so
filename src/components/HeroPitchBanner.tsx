import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Activity, Flame, BarChart2 } from 'lucide-react';
import { Match } from '../types/football';

interface HeroPitchBannerProps {
  featuredMatch?: Match;
  onSelectMatch: (match: Match) => void;
  onOpenHighlights: () => void;
}

export const HeroPitchBanner: React.FC<HeroPitchBannerProps> = ({
  featuredMatch,
  onSelectMatch,
  onOpenHighlights
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [particlesActive, setParticlesActive] = useState(true);

  // Dynamic cyber light particles canvas effect responding to cursor and clicks
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      life: number;
      maxLife: number;
      color: string;
    }

    const particles: Particle[] = [];
    const colors = ['#10B981', '#06B6D4', '#3B82F6', '#34D399', '#67E8F9'];

    const createBurst = (x: number, y: number, count = 12) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 0.8;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5,
          radius: Math.random() * 2.5 + 1,
          alpha: 1,
          life: 0,
          maxLife: Math.random() * 40 + 30,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };

    // Continuous subtle ground circuit emission
    let tick = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      tick++;
      if (tick % 8 === 0 && particles.length < 90) {
        createBurst(
          width * 0.45 + (Math.random() - 0.5) * 200,
          height * 0.75 + (Math.random() - 0.5) * 50,
          2
        );
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        p.alpha = 1 - p.life / p.maxLife;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      createBurst(e.clientX - rect.left, e.clientY - rect.top, 25);
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, []);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-emerald-500/30 bg-[#09111e] shadow-2xl group">
      {/* Background Graphic Asset: Photorealistic low-angle cyber soccer cleats on glowing circuit glass pitch */}
      <div className="relative aspect-[21/9] min-h-[320px] sm:min-h-[420px] w-full overflow-hidden">
        <img
          src="https://unsplash.com"
          alt="Cận cảnh giày đá bóng"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-bottom scale-100 group-hover:scale-[1.02] transition-transform duration-700 ease-out"
        />

        {/* Interactive light particle canvas overlaid on the glass pitch */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-auto cursor-crosshair z-10"
          title="Nhấp vào mặt sân để phóng các hạt phân tử ánh sáng (Light Particles)!"
        />

        {/* Gradient Scrims ensuring high contrast for text */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080d16] via-[#080d16]/60 to-transparent pointer-events-none z-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080d16]/90 via-[#080d16]/40 to-transparent pointer-events-none z-20" />

        {/* Subdued cybernetic grid scanline effect */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none z-20" />
      </div>

      {/* Main Foreground Content */}
      <div className="absolute inset-0 z-30 flex flex-col justify-end p-5 sm:p-8 lg:p-10 pointer-events-none">
        <div className="max-w-2xl pointer-events-auto">
          {/* Tagline & Status */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-emerald-400 mb-2.5">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              SÂN CỎ SỐ THỜI GIAN THỰC
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-cyan-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Bảng mạch quang học & Matrix Bokeh
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-300">Độ trễ &lt; 0.3s</span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug mb-3">
            Trải Nghiệm Đỉnh Cao Bóng Đá Số Toàn Cầu
          </h1>

          <p className="text-sm sm:text-base text-slate-300 line-clamp-2 sm:line-clamp-none mb-5 text-balance">
            Cập nhật tức thời UEFA Champions League, Nations League, Premier League, La Liga, V-League...
            Báo bàn thắng rung chuông tức thì, đồng hồ đếm ngược thời gian thực, bảng xếp hạng và nhận định chuyên sâu.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            {featuredMatch && (
              <button
                onClick={() => onSelectMatch(featuredMatch)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <BarChart2 className="w-4 h-4" />
                Xem Thống Kê · {featuredMatch.homeTeam.shortName} vs {featuredMatch.awayTeam.shortName}
              </button>
            )}

            <button
              onClick={onOpenHighlights}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-medium text-sm transition-all hover:text-white cursor-pointer backdrop-blur-sm"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              Xem Highlight Bàn Thắng
            </button>
          </div>
        </div>

        {/* Small Pitch Interactive Hint */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 pointer-events-auto">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mẹo: Nhấp chuột vào mặt sân cỏ số để kích hoạt luồng hạt năng lượng ánh sáng</span>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-emerald-400">● 100% Cập nhật tự động</span>
            <span className="text-cyan-400">● Tương thích lịch cá nhân</span>
          </div>
        </div>
      </div>
    </div>
  );
};
