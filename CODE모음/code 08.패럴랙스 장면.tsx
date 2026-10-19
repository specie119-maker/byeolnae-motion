// frames=180 size=1280x720
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ReactNode} from 'react';

const FONT = "'Nanum Gothic', sans-serif";
const GOLD = '#ffd166';
const W = 1280;
const H = 720;

// 3개 레이어 패럴랙스 별무리
const STARS_LAYER_1 = Array.from({length: 120}, (_, i) => ({
  x: random(`s1_x_${i}`) * W,
  y: random(`s1_y_${i}`) * H,
  r: 0.6 + random(`s1_r_${i}`) * 0.8,
  baseAlpha: 0.3 + random(`s1_a_${i}`) * 0.5,
}));

const STARS_LAYER_2 = Array.from({length: 50}, (_, i) => ({
  x: random(`s2_x_${i}`) * W,
  y: random(`s2_y_${i}`) * H,
  r: 1.2 + random(`s2_r_${i}`) * 1.0,
  baseAlpha: 0.5 + random(`s2_a_${i}`) * 0.5,
}));

// 아주 작게 얇게 빛나는 4방향 십자 섬광 별빛 (8개)
const SPARKS = Array.from({length: 8}, (_, i) => ({
  x: 100 + random(`sp_x_${i}`) * (W - 200),
  y: 60 + random(`sp_y_${i}`) * (H - 120),
  phase: random(`sp_ph_${i}`) * Math.PI * 2,
}));

const Layer = ({speed, children}: {speed: number; children: ReactNode}) => {
  const f = useCurrentFrame();
  const x = -((f * speed) % W);
  return (
    <AbsoluteFill style={{transform: `translateX(${x}px)`}}>
      {[0, W].map((dx) => (
        <svg key={dx} width={W} height={H} style={{position: 'absolute', left: dx}}>
          {children}
        </svg>
      ))}
    </AbsoluteFill>
  );
};

const SceneBody = () => {
  const f = useCurrentFrame();

  return (
    <AbsoluteFill style={{fontFamily: FONT, color: '#fff', overflow: 'hidden', background: '#040714'}}>
      {/* 1) 깊은 밤하늘 그라데이션 */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, #040714 0%, #0a1029 45%, #12183a 80%, #070b1a 100%)'}} />

      {/* 2) 신비로운 은하수 성운 (Nebula) 은은한 빛 */}
      <div style={{
        position: 'absolute', left: '20%', top: '15%', width: '60%', height: '70%',
        background: 'radial-gradient(circle, rgba(76, 53, 140, 0.22) 0%, rgba(30, 58, 120, 0.12) 45%, transparent 75%)',
        filter: 'blur(30px)', pointerEvents: 'none'
      }} />

      {/* 3) 원경 별무리 (천천히 흐르는 미세 별들) */}
      <Layer speed={0.1}>
        {STARS_LAYER_1.map((s, i) => {
          const tw = 0.3 + 0.7 * Math.sin(f * 0.05 + i * 2.1);
          return <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#e2e8f0" opacity={s.baseAlpha * tw} />;
        })}
      </Layer>

      {/* 4) 중경 별무리 (영롱한 별들) */}
      <Layer speed={0.25}>
        {STARS_LAYER_2.map((s, i) => {
          const tw = 0.4 + 0.6 * Math.sin(f * 0.07 + i * 1.7);
          return (
            <g key={i}>
              <circle cx={s.x} cy={s.y} r={s.r * 2} fill="#93c5fd" opacity={0.15 * tw} />
              <circle cx={s.x} cy={s.y} r={s.r} fill={i % 3 === 0 ? '#ffeaa7' : '#ffffff'} opacity={s.baseAlpha * tw} />
            </g>
          );
        })}
      </Layer>

      {/* 5) 근경 섬세한 십자 별빛 플레어 (작게 얇게 빛남) */}
      <Layer speed={0.45}>
        {SPARKS.map((sp, i) => {
          const pulse = Math.pow(Math.sin(f * 0.05 + sp.phase), 6);
          const ray = 10 + pulse * 14;
          return (
            <g key={i}>
              <circle cx={sp.x} cy={sp.y} r={1.6} fill="#ffffff" opacity={0.4 + 0.6 * pulse} />
              {pulse > 0.08 && (
                <>
                  <line x1={sp.x - ray} y1={sp.y} x2={sp.x + ray} y2={sp.y} stroke="#fffdf0" strokeWidth={0.9} opacity={pulse * 0.9} />
                  <line x1={sp.x} y1={sp.y - ray} x2={sp.x} y2={sp.y + ray} stroke="#fffdf0" strokeWidth={0.9} opacity={pulse * 0.9} />
                  <line x1={sp.x - ray * 0.38} y1={sp.y - ray * 0.38} x2={sp.x + ray * 0.38} y2={sp.y + ray * 0.38} stroke="#fffdf0" strokeWidth={0.7} opacity={pulse * 0.6} />
                  <line x1={sp.x - ray * 0.38} y1={sp.y + ray * 0.38} x2={sp.x + ray * 0.38} y2={sp.y - ray * 0.38} stroke="#fffdf0" strokeWidth={0.7} opacity={pulse * 0.6} />
                </>
              )}
            </g>
          );
        })}
      </Layer>

      {/* 6) 말씀 본문 타이포그래피 (모든 글씨를 동일 사이즈로: 나눔고딕 굵고 크게) */}
      <div style={{
        position: 'absolute', left: 140, top: '26%', display: 'flex', flexDirection: 'column', gap: 24,
        fontFamily: FONT,
        textShadow: '0 4px 24px rgba(0,0,0,0.95)'
      }}>
        <div style={{fontSize: 50, fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px'}}>
          주 예수 믿으라
        </div>
        <div style={{fontSize: 50, fontWeight: 800, color: GOLD, letterSpacing: '-0.5px'}}>
          죄가 많아도
        </div>
        <div style={{fontSize: 50, fontWeight: 800, color: '#cbd5e1', letterSpacing: '-0.5px'}}>
          별내사랑의교회
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── 채널 표시: CONNECT AI LAB ──
const BrandMark = () => {
  const {width} = useVideoConfig();
  return (
    <div style={{
      position: 'absolute', right: Math.round(width * 0.02), bottom: Math.round(width * 0.015),
      fontFamily: FONT, fontWeight: 800, fontSize: Math.round(width / 60), letterSpacing: '0.16em',
      color: 'rgba(255,255,255,0.88)', textShadow: '0 1px 6px rgba(0,0,0,0.6)'
    }}>
      CONNECT AI LAB
    </div>
  );
};

export const Scene = () => (
  <AbsoluteFill>
    <SceneBody />
    <BrandMark />
  </AbsoluteFill>
);
