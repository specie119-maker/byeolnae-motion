// 🔒 [LOCKED / 완료 확정] CODE 01 · 히어로 등장 - 수정 금지 완료본
import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const RedHeroScriptureScene: React.FC<{
  line1?: string;
  line2?: string;
  line3?: string;
}> = ({
  line1 = '일을 행하시는 여호와',
  line2 = '일을 지어 성취하시는',
  line3 = '하나님',
}) => {
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
          maxWidth: 960,
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
            fontSize: 64,
            fontWeight: 800,
            color: '#fde8ea',
            letterSpacing: '-0.5px',
            lineHeight: 1.25,
            opacity: pLine1,
            transform: `translateY(${(1 - pLine1) * 14}px)`,
            textShadow: '0 3px 14px rgba(0,0,0,0.85), 0 0 20px rgba(0,0,0,0.9)',
          }}
        >
          {line1}
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
          {line2}
        </div>

        {/* 3번째 줄 */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.5px',
            lineHeight: 1.25,
            opacity: pLine3,
            transform: `translateY(${(1 - pLine3) * 14}px)`,
            textShadow: '0 3px 14px rgba(0,0,0,0.85)',
          }}
        >
          {line3}
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
            marginTop: 20,
            marginRight: 20,
            textShadow: '0 2px 12px rgba(0,0,0,0.7)',
          }}
        >
          ❞
        </div>
      </div>

      </AbsoluteFill>
  );
};