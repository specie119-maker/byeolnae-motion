import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {ding, whoosh} from '@remotion/sfx';

const FONT = 'Pretendard, -apple-system, BlinkMacSystemFont, "Noto Sans KR", sans-serif';

// ── 경건하고 따뜻한 성경 쇼츠 팔레트 ──
const DARK_NAVY = '#0A1124';
const NIGHT_BLUE = '#111D38';
const GOLD = '#F5C242';
const SOFT_WHITE = '#FFFFFF';
const GLOW_GOLD = '#FFDF73';

// ── 3단계 말씀 타이포그래피 (단어가 천천히 여유롭게 넘어가도록 60프레임 = 약 2초 간격) ──
const WORDS = [
  {text: '두려워', start: 0, end: 60, bg: DARK_NAVY, color: SOFT_WHITE},
  {text: '말라', start: 60, end: 120, bg: NIGHT_BLUE, color: GOLD},
  {text: '내가 함께함이라', start: 120, end: 185, bg: DARK_NAVY, color: GLOW_GOLD},
];

// 말씀과 손 그래픽이 안착하는 시점 (약 6.2초 시점 - 충분한 묵상 후 등장)
const DROP = 185;
const NOTE = '이사야 41장 10절 말씀 묵상 · BeeCareLab';

// ── 굳건히 붙들어 주는 주님의 손 벡터 그래픽 ──
const HandOfGodGraphic = () => (
  <svg width="680" height="680" viewBox="0 0 600 600" style={{overflow: 'visible'}}>
    <defs>
      {/* 거룩한 황금빛 광채 그라데이션 */}
      <radialGradient id="divineGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFEAA7" stopOpacity="0.9" />
        <stop offset="60%" stopColor="#F5C242" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#D49B24" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF4D0" />
        <stop offset="40%" stopColor="#F5C242" />
        <stop offset="100%" stopColor="#B37D14" />
      </linearGradient>
    </defs>

    {/* 배경에 은은하게 퍼지는 신성한 후광 */}
    <circle cx="300" cy="300" r="280" fill="url(#divineGlow)" />

    {/* 빛살 레이어 (12방향 광선) */}
    {new Array(12).fill(0).map((_, i) => (
      <line
        key={i}
        x1="300"
        y1="300"
        x2={300 + 260 * Math.cos((i * Math.PI) / 6)}
        y2={300 + 260 * Math.sin((i * Math.PI) / 6)}
        stroke="#FFEAA7"
        strokeWidth="3"
        strokeDasharray="8 12"
        opacity="0.45"
      />
    ))}

    {/* 맞잡은 두 손: 위에서 내려와 굳건히 감싸 쥐는 주님의 손 형상 */}
    <g transform="translate(110, 110)">
      {/* 1. 아래에서 올라와 구원을 구하는 인간의 손 */}
      <path
        d="M 120 320 C 130 260, 150 210, 190 190 C 210 180, 230 195, 230 220 L 230 280 L 260 270 C 275 265, 290 275, 290 290 L 290 320"
        fill="none"
        stroke="#E2E8F0"
        strokeWidth="18"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 2. 위에서 굳건히 내려와 붙들어 주시는 전능자의 황금빛 손 */}
      <path
        d="M 280 40 C 270 100, 250 150, 210 170 C 190 180, 170 165, 170 140 L 170 80 L 140 90 C 125 95, 110 85, 110 70 L 110 40"
        fill="none"
        stroke="url(#goldGradient)"
        strokeWidth="24"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="drop-shadow(0 8px 16px rgba(245, 194, 66, 0.6))"
      />
      {/* 맞잡은 중심부 결합 라인 */}
      <ellipse cx="200" cy="180" rx="36" ry="48" fill="url(#goldGradient)" opacity="0.3" />
      <path
        d="M 160 180 Q 200 150 240 180"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </g>
  </svg>
);

export const BibleShortsScene: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

  // 1) 현재 활성 단어 및 부드러운 감속 스프링
  const cur = [...WORDS].reverse().find((w) => f >= w.start) ?? WORDS[0];
  
  // 글자가 튕기지 않고 천천히 우아하게 안착하도록 stiffness=60, damping=18, mass=1.2 적용
  const slam = spring({
    frame: f - cur.start,
    fps,
    config: {damping: 18, stiffness: 60, mass: 1.2}
  });

  const scene2 = f >= DROP;

  // 2) 은혜의 손 부드러운 낙하 및 안착
  const drop = spring({
    frame: f - DROP,
    fps,
    config: {damping: 12, stiffness: 65, mass: 1.1}
  });
  const land = DROP + 12;
  const shake = f > land ? Math.sin((f - land) * 1.5) * 10 * Math.exp(-(f - land) / 14) : 0;
  const beat = scene2 ? interpolate((f - DROP) % 36, [0, 10, 36], [1.025, 1, 1]) : 1;

  // 3) 배경 색상 부드러운 전환
  const bg = scene2 ? DARK_NAVY : cur.bg;
  const titleSpring = spring({
    frame: f - DROP - 10,
    fps,
    config: {damping: 16, stiffness: 70}
  });
  const bottomY = interpolate(
    spring({frame: f - DROP, fps, config: {damping: 18, stiffness: 60}}),
    [0, 1],
    [0, 680]
  );

  return (
    <AbsoluteFill style={{fontFamily: FONT, overflow: 'hidden', background: bg}}>
      {/* 효과음: 단어마다 부드러운 바람 소리, 손 안착 순간 맑은 벨 소리 */}
      {WORDS.map((w) => (
        <Sequence key={w.text} from={w.start}>
          <Audio src={whoosh} volume={0.3} />
        </Sequence>
      ))}
      <Sequence from={DROP - 8}>
        <Audio src={whoosh} volume={0.5} />
      </Sequence>
      <Sequence from={land}>
        <Audio src={ding} volume={0.65} />
      </Sequence>

      {/* 2장면: 천천히 회전하는 은혜의 광선 백라이트 */}
      <AbsoluteFill
        style={{
          opacity: scene2 ? 0.25 : 0,
          transform: `rotate(${f * 0.18}deg) scale(2.2)`,
          background: `repeating-conic-gradient(from 0deg at 50% 50%, ${GOLD}40 0deg 10deg, transparent 10deg 24deg)`,
          WebkitMaskImage: 'radial-gradient(circle, #000 10%, transparent 60%)',
        }}
      />

      {/* 1장면: 단어들이 급격히 바뀌지 않고 천천히 페이드 인/아웃 되며 넘어가는 타이포그래피 */}
      {!scene2 &&
        WORDS.map((w, idx) => {
          // 해당 단어의 시간 범위
          if (f < w.start || f > w.end + 10) return null;

          // 천천히 나타나고 다음 단어 직전에 천천히 사라지는 투명도 곡선
          const fadeIn = interpolate(f, [w.start, w.start + 18], [0, 1], clamp);
          const fadeOut = idx < WORDS.length - 1
            ? interpolate(f, [w.end - 15, w.end], [1, 0], clamp)
            : 1;
          const wordOpacity = fadeIn * fadeOut;

          // 천천히 스케일 다운되며 안정되는 부드러운 스케일
          const wordSpring = spring({
            frame: f - w.start,
            fps,
            config: {damping: 18, stiffness: 60, mass: 1.2}
          });
          const wordScale = interpolate(wordSpring, [0, 1], [1.35, 1.0], clamp);

          return (
            <AbsoluteFill
              key={w.text}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                opacity: wordOpacity,
                pointerEvents: 'none',
              }}
            >
              {/* 은은한 외곽선 백라이트 잔상 */}
              <div
                style={{
                  position: 'absolute',
                  fontSize: w.text.length > 4 ? 170 : 300,
                  fontWeight: 900,
                  color: 'transparent',
                  WebkitTextStroke: `3px ${w.color}`,
                  transform: `scale(${wordScale * 1.08})`,
                  opacity: 0.3,
                  textAlign: 'center',
                }}
              >
                {w.text}
              </div>

              {/* 메인 텍스트: 글씨를 대폭 확대하여 화면을 압도 */}
              <div
                style={{
                  position: 'relative',
                  fontSize: w.text.length > 4 ? 150 : 280,
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  color: w.color,
                  transform: `scale(${wordScale})`,
                  textShadow: '0 16px 45px rgba(0,0,0,0.6)',
                  textAlign: 'center',
                  padding: '0 40px',
                }}
              >
                {w.text}
              </div>
            </AbsoluteFill>
          );
        })}

      {/* 2장면 안착 텍스트: 마지막 말씀 '내가 함께함이라'가 하단으로 부드럽게 안착 (130px) */}
      {scene2 && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div
            style={{
              fontSize: 130,
              fontWeight: 900,
              letterSpacing: '-0.02em',
              color: GLOW_GOLD,
              transform: `translateY(${bottomY}px) scale(0.85)`,
              textShadow: '0 14px 40px rgba(0,0,0,0.6)',
              textAlign: 'center',
              padding: '0 40px',
            }}
          >
            내가 함께함이라
          </div>
        </AbsoluteFill>
      )}

      {/* 2장면: 주님의 손 그래픽 & 성경 구절 헤더 노출 */}
      {scene2 && (
        <>
          {/* 상단 성경 구절 헤더 */}
          <div
            style={{
              position: 'absolute',
              top: 180,
              width: '100%',
              textAlign: 'center',
              color: '#FFFFFF',
              opacity: titleSpring,
              transform: `translateY(${(1 - titleSpring) * -50}px)`,
            }}
          >
            <div
              style={{
                fontSize: 36,
                fontWeight: 900,
                letterSpacing: '0.3em',
                color: GOLD,
                marginBottom: 8,
              }}
            >
              TODAY'S VERSE
            </div>
            <div
              style={{
                fontSize: 105,
                fontWeight: 900,
                lineHeight: 1.1,
                textShadow: '0 10px 30px rgba(0,0,0,0.7)',
              }}
            >
              이사야 41:10
            </div>
          </div>

          {/* 바닥 그림자 */}
          <div
            style={{
              position: 'absolute',
              left: 540 - 240,
              top: 1380,
              width: 480,
              height: 70,
              borderRadius: '50%',
              background: 'radial-gradient(closest-side, rgba(0,0,0,0.7), transparent)',
              opacity: drop,
            }}
          />

          {/* 중앙: 하늘에서 내려와 꼭 붙들어 주는 주님의 손 */}
          <div
            style={{
              position: 'absolute',
              left: 540 - 340,
              top: 960 - 340,
              width: 680,
              height: 680,
              transform: `translate(${shake}px, ${(1 - drop) * -1400}px) rotate(${shake * 0.15}deg) scale(${beat})`,
              filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <HandOfGodGraphic />
          </div>
        </>
      )}

      {/* 손이 닿는 순간 온 세상을 밝히는 거룩한 빛의 플래시 */}
      <AbsoluteFill
        style={{
          background: '#FFEAA7',
          opacity: interpolate(f, [land, land + 3, land + 16], [0, 0.4, 0], clamp),
          pointerEvents: 'none',
        }}
      />

      {/* 하단 고정 출처 표기 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          width: '100%',
          bottom: 40,
          textAlign: 'center',
          fontSize: 26,
          fontWeight: 700,
          color: 'rgba(255,255,255,0.75)',
          letterSpacing: '0.02em',
        }}
      >
        {NOTE}
      </div>
    </AbsoluteFill>
  );
};

export default BibleShortsScene;