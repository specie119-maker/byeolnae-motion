// frames=180 size=1280x720
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { FONT } from './font';

export const GraceOfferCleanScene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1) 좌측 십자가 스프링
  const popObject = spring({ frame: f - 5, fps, config: { damping: 14 } });

  // 2) 우측 흰색 카드 매달려 안착
  const cardDrop = spring({ frame: f - 20, fps, config: { damping: 13, stiffness: 90 } });
  const cardSwing = Math.sin(Math.max(0, f - 20) * 0.15) * Math.exp(-(f - 20) / 25) * 6;

  // 3) 100% FREE 원형 배지
  const badgePop = spring({ frame: f - 35, fps, config: { damping: 11, stiffness: 130 } });

  // 4) 빨간 취소선 긋기 (프레임 55~70)
  const strikeProgress = interpolate(f, [55, 70], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 5) 최종 0원 (은혜) 강조 팝업
  const pricePop = spring({ frame: f - 75, fps, config: { damping: 10, stiffness: 140 } });

  return (
    <AbsoluteFill
      style={{
        background: '#38040e',
        fontFamily: FONT,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 80px',
      }}
    >
      {/* ── 1. 좌측 십자가 및 말씀 블록 (좌측 420px 영역 고정) ── */}
      <div
        style={{
          width: 440,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${popObject})`,
          zIndex: 10,
        }}
      >
        {/* 십자가 그래픽 & 후광 */}
        <div
          style={{
            position: 'relative',
            width: 260,
            height: 260,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* 방사형 빛 */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(250, 204, 21, 0.25) 0%, transparent 70%)',
              filter: 'blur(10px)',
            }}
          />
          {/* 십자가 아이콘 */}
          <span
            style={{
              fontSize: 160,
              lineHeight: 1,
              filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.6))',
            }}
          >
            ✝️
          </span>
        </div>

        {/* 십자가 하단 텍스트 (위계와 간격 정돈) */}
        <div
          style={{
            marginTop: 16,
            textAlign: 'center',
            color: '#fde8ea',
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px' }}>
            일을 행하시는 여호와
          </div>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#fca5a5', marginTop: 6 }}>
            그것을 지어 성취하시는 하나님
          </div>
        </div>
      </div>

      {/* ── 2. 우측 정돈된 가격표 카드 (우측 영역 고정, W: 450px) ── */}
      <div
        style={{
          position: 'relative',
          width: 450,
          transformOrigin: 'top center',
          transform: `translateY(${(1 - cardDrop) * -160}px) rotate(${cardSwing}deg)`,
          zIndex: 20,
        }}
      >
        {/* 상단 100% FREE 배지 (카드 좌상단 모서리에 겹치되 화면 안쪽으로 배치) */}
        <div
          style={{
            position: 'absolute',
            top: -24,
            left: -24,
            width: 90,
            height: 90,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${badgePop}) rotate(-12deg)`,
            zIndex: 30,
            border: '3px solid #fef08a',
          }}
        >
          <span style={{ fontSize: 20, fontWeight: 900, color: '#78350f', lineHeight: 1 }}>
            100%
          </span>
          <span style={{ fontSize: 13, fontWeight: 900, color: '#78350f', marginTop: 2 }}>
            FREE
          </span>
        </div>

        {/* 메인 화이트 카드 바디 */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 32,
            padding: '44px 36px 36px 36px',
            boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* 1) 카드 제목 */}
          <div
            style={{
              fontSize: 24,
              fontWeight: 900,
              color: '#0f172a',
              letterSpacing: '-0.5px',
              marginBottom: 20,
            }}
          >
            구원과 영생의 가격
          </div>

          {/* 2) 이전 대가 (가로폭을 넓혀 줄바꿈 없이 1줄로 표시 + 중앙 취소선) */}
          <div
            style={{
              position: 'relative',
              display: 'inline-block',
              fontSize: 26,
              fontWeight: 700,
              color: '#94a3b8',
              letterSpacing: '-0.5px',
              padding: '0 6px',
            }}
          >
            <span>세상의 공로와 대가</span>

            {/* 빨간색 관통 취소선 */}
            <div
              style={{
                position: 'absolute',
                top: '52%',
                left: 0,
                width: `${strikeProgress}%`,
                height: 4,
                background: '#e11d48',
                borderRadius: 2,
                transform: 'translateY(-50%) rotate(-3deg)',
              }}
            />
          </div>

          {/* 3) 최종 가격 (충분한 상하 여백 부여) */}
          <div
            style={{
              margin: '20px 0 24px 0',
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'center',
              gap: 12,
              transform: `scale(${pricePop})`,
              transformOrigin: 'center center',
            }}
          >
            <span
              style={{
                fontSize: 68,
                fontWeight: 900,
                color: '#e11d48',
                lineHeight: 1,
                letterSpacing: '-1px',
              }}
            >
              0원
            </span>
            <span
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: '#b45309',
                lineHeight: 1,
              }}
            >
              (은혜)
            </span>
          </div>

          {/* 4) 하단 장절 캡슐 뱃지 (패딩과 폰트 크기 조화) */}
          <div
            style={{
              width: '100%',
              background: '#fef08a',
              border: '1.5px solid #facc15',
              color: '#713f12',
              fontSize: 16,
              fontWeight: 800,
              padding: '10px 0',
              borderRadius: 14,
              letterSpacing: '-0.2px',
            }}
          >
            지금 믿을 때 · 예레미야 33:2
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};