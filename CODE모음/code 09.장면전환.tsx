// frames=240 size=1280x720 (가로 16:9, 여유롭고 읽기 편한 속도)
import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';

const FONT = "'Nanum Gothic', sans-serif";

export const SceneTransitionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const totalDur = 240; // 8초 루프 (240프레임)
  const sceneDur = 120; // 각 장면 4초 (120프레임)
  const scene = Math.floor((frame % totalDur) / sceneDur);
  const sf = (frame % totalDur) % sceneDur;

  // 글씨가 여유롭고 부드럽게 2번 통통 튀는 애니메이션 (Slower Gentle Double Bounce)
  const getDoubleBounce = (t: number) => {
    if (t < 10) {
      const p = Math.max(0, t / 10);
      const ease = 1 - Math.pow(1 - p, 3);
      return { scale: ease * 1.12, y: (1 - ease) * 32, opacity: ease };
    } else if (t < 40) {
      // 1번째 통! (Frame 10 ~ 40, 총 30프레임 = 1초 동안 우아한 포물선 바운스)
      const p = (t - 10) / 30;
      const arc = Math.sin(p * Math.PI);
      return { scale: 1.0 + 0.16 * arc, y: -24 * arc, opacity: 1 };
    } else if (t < 66) {
      // 2번째 통! (Frame 40 ~ 66, 총 26프레임 = 약 0.9초 동안 작은 포물선 바운스)
      const p = (t - 40) / 26;
      const arc = Math.sin(p * Math.PI);
      return { scale: 1.0 + 0.08 * arc, y: -12 * arc, opacity: 1 };
    } else {
      // 편안하고 정적인 말씀 묵상 시간 (흔들림 없이 또렷하게 감상)
      const breathe = Math.sin((t - 66) * 0.05) * 0.008;
      return { scale: 1.0 + breathe, y: 0, opacity: 1 };
    }
  };

  // ── [장면 1] 연두색 동그란 원이 중앙에서 바깥으로 빠져나가는 장면 ──
  if (scene === 0) {
    const circleScale = interpolate(sf, [0, 32], [0, 3.2], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });

    const ringScale = interpolate(sf, [6, 38], [0, 3.6], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });

    const bounce = getDoubleBounce(sf - 6);

    return (
      <AbsoluteFill
        style={{
          background: '#06281e',
          fontFamily: FONT,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* 외곽 보조 연두색 펄스 링 */}
        <div
          style={{
            position: 'absolute',
            width: Math.min(width, height),
            height: Math.min(width, height),
            borderRadius: '50%',
            background: '#4ade80',
            transform: `scale(${ringScale})`,
            pointerEvents: 'none',
          }}
        />

        {/* 메인 연두색 원 (중앙에서 바깥으로 쫘악 커지며 화면 가득 확장) */}
        <div
          style={{
            position: 'absolute',
            width: Math.min(width, height),
            height: Math.min(width, height),
            borderRadius: '50%',
            background: '#86efac',
            transform: `scale(${circleScale})`,
            boxShadow: '0 0 80px rgba(74, 222, 128, 0.8)',
            pointerEvents: 'none',
          }}
        />

        {/* 중앙 말씀 글씨 (여유롭게 2번 통통 튐) */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            transform: `scale(${bounce.scale}) translateY(${bounce.y}px)`,
            opacity: bounce.opacity,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: '#064e3b',
              letterSpacing: '-1.5px',
              textShadow: '0 2px 14px rgba(255, 255, 255, 0.6)',
              marginBottom: 16,
            }}
          >
            일을 행하시는 여호와
          </div>
          <div
            style={{
              fontSize: 38,
              fontWeight: 800,
              color: '#047857',
              letterSpacing: '-0.5px',
            }}
          >
            그의 이름을 여호와라 하는 이가
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // ── [장면 2] 연보라 배경색이 슬라이딩으로 오른쪽으로 사라지는 장면 ──
  // 프레임 92부터 120까지 부드럽게 오른쪽으로 슬라이드 아웃 (충분한 묵상 시간 확보)
  const slideX = interpolate(sf, [92, 120], [0, width * 1.25], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const bounce = getDoubleBounce(sf - 4);

  return (
    <AbsoluteFill
      style={{
        background: '#06281e',
        fontFamily: FONT,
        overflow: 'hidden',
      }}
    >
      {/* 슬라이딩으로 오른쪽으로 사라지는 연보라 배경 패널 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #c4b5fd 0%, #ddd6fe 100%)',
          transform: `translateX(${slideX}px)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '-20px 0 60px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* 소프트 글로우 장식 */}
        <div
          style={{
            position: 'absolute',
            width: '120%',
            height: '40%',
            background: 'radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.4) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* 중앙 말씀 글씨 (여유롭게 2번 통통 튐) */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            transform: `scale(${bounce.scale}) translateY(${bounce.y}px)`,
            opacity: bounce.opacity,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: '#2e1065',
              letterSpacing: '-1.5px',
              textShadow: '0 2px 16px rgba(255, 255, 255, 0.7)',
              marginBottom: 16,
            }}
          >
            일을 지어 성취하시는
          </div>
          <div
            style={{
              fontSize: 54,
              fontWeight: 900,
              color: '#581c87',
              letterSpacing: '-1px',
            }}
          >
            하나님
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
        color: 'rgba(255,255,255,0.85)',
        textShadow: '0 1px 6px rgba(0,0,0,0.6)',
      }}
    >
      CONNECT AI LAB
    </div>
  );
};

export const Scene = () => (
  <AbsoluteFill>
    <SceneTransitionScene />
    <BrandMark />
  </AbsoluteFill>
);