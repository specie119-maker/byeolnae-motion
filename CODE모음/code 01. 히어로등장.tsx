import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const RedHeroScriptureScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. 텍스트 순차 등장 (감속 커브)
  const pQuoteOpen = interpolate(frame, [10, 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const pLine1 = interpolate(frame, [18, 36], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const pLine2 = interpolate(frame, [34, 52], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const pLine3 = interpolate(frame, [50, 68], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const pQuoteClose = interpolate(frame, [65, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // 2. 오른쪽 상징 히어로 '뿅!' 등장 스프링 (Pop Bounce)
  const heroSpring = spring({
    frame: frame - 45, // 텍스트가 거의 다 나올 즈음 뿅! 등장
    fps,
    config: {
      damping: 10,   // 탱탱한 탄성
      stiffness: 140, // 쾌활한 팝업
      mass: 0.8,
    },
  });

  // 히어로 등장 후 은은한 공중 부유(Float) & 펄스 효과
  const floatY = Math.sin(Math.max(0, frame - 55) * 0.08) * 8;
  const pulseScale = 1 + Math.sin(Math.max(0, frame - 55) * 0.06) * 0.03;

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(ellipse at 75% 50%, #880c21 0%, #44030d 55%, #180004 100%)',
        fontFamily: "'Gowun Batang', 'Pretendard', serif",
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 80px',
      }}
    >
      {/* [배경] 방사형 라이트 빔 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-conic-gradient(from 0deg at 75% 50%, rgba(255, 215, 0, 0.05) 0deg 7.5deg, transparent 7.5deg 15deg)',
          pointerEvents: 'none',
        }}
      />

      {/* [배경] 텍스트 가독성 보호용 다크 딤 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '60%',
          background: 'radial-gradient(circle at 35% 50%, rgba(20, 0, 4, 0.6) 0%, rgba(20, 0, 4, 0) 80%)',
          pointerEvents: 'none',
        }}
      />

      {/* ──────────────── 좌측: 말씀 텍스트 영역 ──────────────── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 14,
          maxWidth: 620,
        }}
      >
        {/* 상단 여는 따옴표 ❝ */}
        <div
          style={{
            fontSize: 48,
            color: '#fbbf24',
            opacity: pQuoteOpen,
            transform: `scale(${pQuoteOpen})`,
            transformOrigin: 'left bottom',
            lineHeight: 1,
            marginBottom: -8,
            textShadow: '0 2px 12px rgba(0,0,0,0.7)',
          }}
        >
          ❝
        </div>

        {/* 1번째 줄 */}
        <div
          style={{
            fontSize: 42,
            fontWeight: 700,
            color: '#fde8ea',
            letterSpacing: '-0.5px',
            lineHeight: 1.25,
            opacity: pLine1,
            transform: `translateY(${(1 - pLine1) * 14}px)`,
            textShadow: '0 3px 14px rgba(0,0,0,0.85), 0 0 20px rgba(0,0,0,0.9)',
          }}
        >
          두려워말라
        </div>

        {/* 2번째 줄 (메인 강조: 골드 옐로우) */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: '#ffd166',
            letterSpacing: '-1px',
            lineHeight: 1.2,
            opacity: pLine2,
            transform: `translateY(${(1 - pLine2) * 14}px)`,
            textShadow: '0 4px 18px rgba(0,0,0,0.9), 0 0 35px rgba(255,209,102,0.35)',
          }}
        >
          내가 너와
        </div>

        {/* 3번째 줄 */}
        <div
          style={{
            fontSize: 46,
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.5px',
            lineHeight: 1.25,
            opacity: pLine3,
            transform: `translateY(${(1 - pLine3) * 14}px)`,
            textShadow: '0 3px 14px rgba(0,0,0,0.85)',
          }}
        >
          함께 함이라
        </div>

        {/* 하단 닫는 따옴표 ❞ (우측 정렬 완결) */}
        <div
          style={{
            alignSelf: 'flex-end',
            fontSize: 48,
            color: '#fbbf24',
            opacity: pQuoteClose,
            transform: `scale(${pQuoteClose})`,
            transformOrigin: 'right top',
            lineHeight: 1,
            marginTop: -10,
            marginRight: 20,
            textShadow: '0 2px 12px rgba(0,0,0,0.7)',
          }}
        >
          ❞
        </div>
      </div>

      {/* ──────────────── 우측: '뿅!' 하고 나타나는 히어로 이모티콘 ──────────────── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: 420,
          height: 420,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* 히어로 등장 시 퍼지는 골드 글로우 링 (Shockwave) */}
        <div
          style={{
            position: 'absolute',
            width: 260,
            height: 260,
            borderRadius: '50%',
            border: '2px solid rgba(255, 215, 0, 0.4)',
            boxShadow: '0 0 50px rgba(255, 209, 102, 0.45)',
            transform: `scale(${Math.max(0, heroSpring)})`,
            opacity: Math.max(0, 1 - (frame - 45) / 40),
            pointerEvents: 'none',
          }}
        />

        {/* 뿅! 나타나는 메인 히어로 심볼 (비둘기/기도손/십자가 등 자유 교체 가능) */}
        <div
          style={{
            transform: `scale(${heroSpring * pulseScale}) translateY(${floatY}px)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            filter: 'drop-shadow(0 20px 35px rgba(0,0,0,0.75)) drop-shadow(0 0 25px rgba(255,209,102,0.5))',
          }}
        >
          {/* 메인 이모티콘 (예: 평안과 임재를 뜻하는 비둘기 🕊️ 또는 기도손 🙏) */}
          <span style={{ fontSize: 160, lineHeight: 1 }}>🕊️</span>

          {/* 반짝이는 별빛 효과 ✨ */}
          <span
            style={{
              position: 'absolute',
              top: 10,
              right: 40,
              fontSize: 48,
              transform: `scale(${heroSpring}) rotate(${frame * 2}deg)`,
            }}
          >
            ✨
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};