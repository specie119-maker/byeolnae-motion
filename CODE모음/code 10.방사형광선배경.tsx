// frames=180 size=1280x720
import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { FONT } from './font';

export const RadiantBurstScene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 부드러운 회전 애니메이션
  const rotation = f * 0.4;
  const scale = spring({ frame: f - 10, fps, config: { damping: 10, stiffness: 100 } });

  return (
    <AbsoluteFill style={{ background: '#0a0d14', fontFamily: FONT, overflow: 'hidden', padding: 40 }}>
      {/* 10. 광선배경 (repeating-conic-gradient: #FFD633, #F0A51A) */}
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'repeating-conic-gradient(from 0deg at 50% 50%, #FFD633 0deg 10deg, #F0A51A 10deg 20deg)',
            transform: `rotate(${rotation}deg)`,
            transformOrigin: '50% 50%',
          }}
        />

        {/* 중앙 말씀 콘텐츠 */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${scale})`,
            textAlign: 'center',
            padding: 40,
          }}
        >
          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
              color: '#1e293b',
              letterSpacing: '-0.5px',
              marginBottom: 16,
              textShadow: '0 2px 10px rgba(255,255,255,0.4)',
            }}
          >
            일을 행하시는 여호와
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: '#0f172a',
              letterSpacing: '-1.5px',
              marginBottom: 20,
              textShadow: '0 4px 20px rgba(255,255,255,0.5)',
            }}
          >
            일을 지어 성취하시는
          </div>
          <div
            style={{
              background: '#0f172a',
              color: '#FFD633',
              fontSize: 22,
              fontWeight: 900,
              padding: '10px 32px',
              borderRadius: 999,
              boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
            }}
          >
            하나님 · 예레미야 33:2
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── 채널 표시: CONNECT AI LAB ──
const BrandMark = () => {
  const { width } = useVideoConfig();
  return (
    <div
      style={{
        position: 'absolute',
        right: Math.round(width * 0.02),
        bottom: Math.round(width * 0.015),
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: Math.round(width / 60),
        letterSpacing: '0.16em',
        color: 'rgba(255,255,255,0.88)',
        textShadow: '0 1px 6px rgba(0,0,0,0.6)',
      }}
    >
      CONNECT AI LAB
    </div>
  );
};

export const Scene = () => (
  <AbsoluteFill>
    <RadiantBurstScene />
    <BrandMark />
  </AbsoluteFill>
);
