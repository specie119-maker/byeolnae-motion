import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const RedScriptureLandscape: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 순차적 페이드 & 슬라이드 (가독성 유지하며 차분한 등장)
  const pLine1 = interpolate(frame, [15, 35], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pLine2 = interpolate(frame, [32, 52], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pLine3 = interpolate(frame, [50, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pBadge = interpolate(frame, [68, 88], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(ellipse at 70% 50%, #850b1f 0%, #47040f 60%, #200106 100%)',
        fontFamily: "'Gowun Batang', 'Pretendard', serif",
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 100px',
      }}
    >
      {/* 1. 배경 방사형 라이트 빔 (가독성을 해치지 않게 투명도 조절) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-conic-gradient(from 0deg at 70% 50%, rgba(255, 255, 255, 0.04) 0deg 7.5deg, transparent 7.5deg 15deg)',
          pointerEvents: 'none',
        }}
      />

      {/* 2. 텍스트 영역 전용 어두운 비네팅 (글씨 뒤편 선 완화로 가독성 극대화) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '65%',
          background:
            'radial-gradient(circle at 35% 50%, rgba(20, 0, 4, 0.55) 0%, rgba(20, 0, 4, 0) 75%)',
          pointerEvents: 'none',
        }}
      />

      {/* 3. 좌측: 고가독성 말씀 블록 */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 16,
          maxWidth: 900,
        }}
      >
        {/* 인용 포인트 뱃지 */}
        <div
          style={{
            fontSize: 32,
            color: '#fbbf24',
            opacity: pLine1,
            lineHeight: 1,
            marginBottom: -8,
            textShadow: '0 2px 10px rgba(0,0,0,0.6)',
          }}
        >
          ❝
        </div>

        {/* 1번째 줄 */}
        <div
          style={{
            fontSize: 44,
            fontWeight: 700,
            color: '#fde8ea',
            letterSpacing: '-0.5px',
            lineHeight: 1.3,
            opacity: pLine1,
            transform: `translateY(${(1 - pLine1) * 16}px)`,
            textShadow:
              '0 2px 12px rgba(0,0,0,0.8), 0 4px 24px rgba(30,0,6,0.9)',
          }}
        >
          놀라지말라
        </div>

        {/* 2번째 줄 (가장 크고 강조: 골드 옐로우) */}
        <div
          style={{
            fontSize: 68,
            fontWeight: 800,
            color: '#ffd166',
            letterSpacing: '-1px',
            lineHeight: 1.25,
            opacity: pLine2,
            transform: `translateY(${(1 - pLine2) * 16}px)`,
            textShadow:
              '0 4px 16px rgba(0,0,0,0.85), 0 8px 32px rgba(0,0,0,0.9), 0 0 40px rgba(255,209,102,0.3)',
          }}
        >
          너의 하나님이
        </div>

        {/* 3번째 줄 */}
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.5px',
            lineHeight: 1.3,
            opacity: pLine3,
            transform: `translateY(${(1 - pLine3) * 16}px)`,
            textShadow:
              '0 2px 12px rgba(0,0,0,0.8), 0 4px 24px rgba(30,0,6,0.9)',
          }}
        >
          되어주리라
        </div>

        {/* 성경 장절 뱃지 */}
        <div
          style={{
            marginTop: 18,
            opacity: pBadge,
            transform: `translateY(${(1 - pBadge) * 10}px)`,
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 209, 102, 0.4)',
            color: '#ffd166',
            fontSize: 22,
            fontWeight: 700,
            padding: '8px 24px',
            borderRadius: 999,
            letterSpacing: '1px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
          }}
        >
          이사야 41:10
        </div>
      </div>

      {/* 4. 우측: 기도 손 그래픽 (텍스트와 겹치지 않게 우측 30% 영역 고정) */}
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          width: 420,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          src="images/prayer_hands_soft.png"
          alt="기도하는 손"
          style={{
            maxWidth: '100%',
            height: 'auto',
            filter: 'drop-shadow(0 15px 35px rgba(0,0,0,0.6))',
            opacity: pLine2,
            transform: `translateY(${(1 - pLine2) * 20}px)`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};