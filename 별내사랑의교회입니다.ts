import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// ── 교회 브랜드 맞춤 컬러 팔레트 ──
const WARM_GOLD = '#F5C242';
const DEEP_NAVY = '#0E172E';
const LIGHT_GOLD = '#FFF4D0';
const SOFT_WHITE = '#FFFFFF';
const FONT = 'Pretendard, Noto Sans KR, sans-serif';

// ── 이미지 및 문구 설정 ──
// 실제 캐릭터나 로고 파일이 생기면 staticFile('images/church_logo.png') 형태로 경로를 교체하세요.
const CHAR_IMAGE: string | null = null; 
const TEXT = '안녕하세요? 별내사랑의교회입니다 ✨';
const SUB_TEXT = '은혜와 평강이 함께하시길 축복합니다';
const LAND = 28; // 바닥에 착지하는 프레임
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ── 외부 이미지 없을 때 단독으로 귀엽게 등장하는 교회 그래픽 ──
const ChurchGraphic = ({cw, ch}: {cw: number; ch: number}) => (
  <svg width={cw} height={ch} viewBox="0 0 330 573" fill="none">
    {/* 은은한 배경 광채 */}
    <circle cx="165" cy="300" r="160" fill="url(#bgGlow)" />
    
    {/* 십자가 첨탑 지붕 */}
    <path d="M 165 60 L 250 200 L 80 200 Z" fill="#991B1B" />
    <rect x="157" y="10" width="16" height="60" rx="4" fill={WARM_GOLD} />
    <rect x="141" y="24" width="48" height="14" rx="4" fill={WARM_GOLD} />
    
    {/* 교회 본당 건물 */}
    <rect x="90" y="200" width="150" height="280" rx="16" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="6" />
    
    {/* 아치형 스테인드글라스 창문 */}
    <path d="M 135 270 A 30 30 0 0 1 195 270 L 195 330 L 135 330 Z" fill="url(#stainedGlass)" stroke="#64748B" strokeWidth="4" />
    <line x1="165" y1="240" x2="165" y2="330" stroke="#64748B" strokeWidth="4" />
    <line x1="135" y1="285" x2="195" y2="285" stroke="#64748B" strokeWidth="4" />
    
    {/* 따뜻한 원목 출입문 */}
    <path d="M 135 410 A 30 30 0 0 1 195 410 L 195 480 L 135 480 Z" fill="#78350F" />
    <circle cx="185" cy="445" r="4" fill={WARM_GOLD} />

    {/* 그라데이션 정의 */}
    <defs>
      <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#FEF08A" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="stainedGlass" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="50%" stopColor="#F472B6" />
        <stop offset="100%" stopColor="#FBBF24" />
      </linearGradient>
    </defs>
  </svg>
);

export const ChurchGreetingScene: React.FC = () => {
  const f = useCurrentFrame();
  const {fps, width} = useVideoConfig();

  // 1) 낙하 모션 (가속도 붙어 빠르게 떨어짐)
  const fall = interpolate(f, [6, LAND], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  const y = (1 - fall) * -760;

  // 2) 착지 순간 찌그러짐 & 통통 튀는 바운스 (Squash & Stretch)
  const t = f - LAND;
  const squash = t < 0 ? -0.06 * fall : 0.13 * Math.exp(-t / 7) * Math.cos(t / 3.2);
  const sx = 1 + squash * 0.8;
  const sy = 1 - squash;

  // 3) 바닥 그림자 크기 & 농도 변화
  const shadow = interpolate(fall, [0, 1], [0.2, 1]);

  // 4) 말풍선 팝업 & 타이핑 효과
  const bubble = spring({frame: f - 48, fps, config: {damping: 14}});
  const chars = Math.floor(
    interpolate(f, [60, 60 + TEXT.length * 2.8], [0, TEXT.length], clamp)
  );
  const cursor = Math.floor(f / 8) % 2 === 0 && chars < TEXT.length;

  // 5) 서브 축복 문구 페이드인
  const subOpacity = interpolate(f, [110, 130], [0, 1], clamp);

  const CW = 320;
  const CH = 520;

  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT,
        color: SOFT_WHITE,
        overflow: 'hidden',
        background: 'radial-gradient(ellipse 65% 75% at 38% 50%, #1A284D 0%, #0F1A34 45%, #070C1A 100%)',
      }}
    >
      {/* 상단 웰컴 배지 */}
      <div
        style={{
          position: 'absolute',
          top: 36,
          left: 60,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <div
          style={{
            background: 'rgba(245, 194, 66, 0.15)',
            border: `1.5px solid ${WARM_GOLD}`,
            borderRadius: 24,
            padding: '8px 22px',
            fontSize: 22,
            fontWeight: 800,
            color: WARM_GOLD,
          }}
        >
          WELCOME
        </div>
        <div style={{fontSize: 34, fontWeight: 900, color: SOFT_WHITE}}>
          별내사랑의교회 온라인 채널
        </div>
      </div>

      {/* 무대 바닥 광채 & 캐릭터 발밑 그림자 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 530,
          height: 120,
          background: 'radial-gradient(ellipse 38% 90% at 35% 100%, rgba(245,194,66,0.25), rgba(0,0,0,0)), linear-gradient(rgba(14,23,46,0), #162444)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 450 - 240 * shadow,
          top: 615,
          width: 480 * shadow,
          height: 46,
          borderRadius: '50%',
          background: 'radial-gradient(closest-side, rgba(0,0,0,0.85), rgba(0,0,0,0))',
          opacity: shadow,
        }}
      />

      {/* 캐릭터/교회 아이콘: 발밑 기준점 바운스 */}
      <div
        style={{
          position: 'absolute',
          left: 450 - CW / 2,
          top: 690 - CH,
          width: CW,
          height: CH,
          transform: `translateY(${y}px) scale(${sx}, ${sy})`,
          transformOrigin: '50% 100%',
        }}
      >
        {CHAR_IMAGE ? (
          <Img src={CHAR_IMAGE} style={{width: CW, height: CH, objectFit: 'contain'}} />
        ) : (
          <ChurchGraphic cw={CW} ch={CH} />
        )}
      </div>

      {/* 무대 앞 턱 (교회 슬로건 안내 바) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 650,
          bottom: 0,
          background: 'linear-gradient(#121E3B, #090F1E)',
          borderTop: `3px solid ${WARM_GOLD}`,
          boxShadow: '0 -10px 30px rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 60,
        }}
      >
        <div style={{fontSize: 26, fontWeight: 800, color: 'rgba(255,255,255,0.9)'}}>
          <span style={{color: WARM_GOLD}}>말씀</span> 안에서 하나되는 은혜로운 공동체 · <span style={{color: LIGHT_GOLD}}>주일예배 & 온라인 말씀 묵상</span>
        </div>
      </div>

      {/* 우측 상단 말풍선: 타이핑 효과 */}
      <div
        style={{
          position: 'absolute',
          left: 630,
          top: 170,
          transform: `scale(${bubble})`,
          transformOrigin: '0% 100%',
          opacity: bubble,
        }}
      >
        {/* 말풍선 본체 */}
        <div
          style={{
            background: SOFT_WHITE,
            color: DEEP_NAVY,
            borderRadius: 36,
            padding: '30px 44px',
            minWidth: 540,
            boxShadow: '0 20px 48px rgba(0,0,0,0.45)',
          }}
        >
          {/* 타이핑 텍스트 */}
          <div
            style={{
              fontSize: 44,
              fontWeight: 900,
              whiteSpace: 'nowrap',
              letterSpacing: '-0.02em',
            }}
          >
            {TEXT.slice(0, chars)}
            <span style={{color: WARM_GOLD, opacity: cursor ? 1 : 0}}>|</span>
          </div>

          {/* 타이핑 완료 후 자연스럽게 뜨는 축복 서브 문구 */}
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: '#475569',
              marginTop: 12,
              opacity: subOpacity,
              transition: 'opacity 0.2s ease',
            }}
          >
            {SUB_TEXT}
          </div>
        </div>

        {/* 말풍선 꼬리 (캐릭터 입 방향) */}
        <svg
          width="80"
          height="60"
          style={{position: 'absolute', left: 34, top: '100%', marginTop: -2}}
        >
          <path d="M 10 0 L 60 0 L 0 50 Z" fill={SOFT_WHITE} />
        </svg>
      </div>

      {/* 우측 하단 브랜딩 */}
      <div
        style={{
          position: 'absolute',
          right: Math.round(width * 0.025),
          bottom: Math.round(width * 0.015),
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 20,
          letterSpacing: '0.12em',
          color: 'rgba(255,255,255,0.7)',
        }}
      >
        BYEOLNAE SARANG CHURCH
      </div>
    </AbsoluteFill>
  );
};

export default ChurchGreetingScene;