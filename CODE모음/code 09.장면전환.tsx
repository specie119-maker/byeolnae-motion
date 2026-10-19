// frames=180 size=1280x720 (가로 16:9)
import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { FONT } from './font';

export const ImmersiveScriptureScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // 1. 전체 화면을 천천히 빨아들이는 시네마틱 줌인 (Ken Burns)
  const cameraZoom = interpolate(frame, [0, 180], [1.0, 1.06]);

  // 2. 메인 글자 '여호와는' 스프링 등장
  const textSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 85, mass: 1.1 },
  });

  // 3. 서브 말씀 구절 페이드 & 슬라이드업
  const subProgress = interpolate(frame, [35, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 4. 글자 위를 스치고 지나가는 빛 줄기 (프레임 50~85)
  const lightSweep = interpolate(frame, [50, 85], [-150, 250], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 5. 호흡하듯 잔잔한 골드 글로우 맥박 (Breathing Pulse)
  const glowPulse = 20 + Math.sin(frame * 0.08) * 12;

  return (
    <AbsoluteFill
      style={{
        background: '#07050d',
        fontFamily: FONT,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* ── [레이어 1] 심도 깊은 오로라 퍼플 배경 + 미세 줌인 ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${cameraZoom})`,
          background:
            'radial-gradient(ellipse at 50% 45%, #3b1459 0%, #1a082b 55%, #080310 100%)',
        }}
      />

      {/* ── [레이어 2] 회전하는 은은한 빛줄기 (God Rays) ── */}
      <div
        style={{
          position: 'absolute',
          width: 1400,
          height: 1400,
          backgroundImage:
            'repeating-conic-gradient(from 0deg at 50% 50%, rgba(255, 215, 0, 0.04) 0deg 10deg, transparent 10deg 20deg)',
          transform: `rotate(${frame * 0.15}deg)`,
          pointerEvents: 'none',
        }}
      />

      {/* ── [레이어 3] 배경 거대 타이포 실루엣 (공간 입체감 부여) ── */}
      <div
        style={{
          position: 'absolute',
          fontSize: 220,
          fontWeight: 900,
          color: 'rgba(255, 255, 255, 0.025)',
          letterSpacing: '12px',
          userSelect: 'none',
          transform: `scale(${1 + frame * 0.0005})`,
        }}
      >
        JEHOVAH
      </div>

      {/* ── [레이어 4] 메인 콘텐츠 블록 ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          transform: `scale(${cameraZoom})`,
        }}
      >
        {/* 상단 은혜로운 인용 심볼 */}
        <div
          style={{
            fontSize: 40,
            color: '#fbbf24',
            opacity: textSpring,
            transform: `scale(${textSpring})`,
            marginBottom: -10,
            textShadow: '0 0 20px rgba(251, 191, 36, 0.6)',
          }}
        >
          ❝
        </div>

        {/* 핵심 단어: '여호와는' (대형 폰트 + 골드/화이트 그라데이션 + 골드 후광) */}
        <div style={{ position: 'relative', overflow: 'hidden', padding: '10px 40px' }}>
          <div
            style={{
              fontSize: 88,
              fontWeight: 900,
              letterSpacing: '4px',
              color: '#ffffff',
              opacity: textSpring,
              transform: `scale(${textSpring}) translateY(${(1 - textSpring) * 30}px)`,
              textShadow: `0 4px 30px rgba(0, 0, 0, 0.9), 0 0 ${glowPulse}px rgba(251, 191, 36, 0.55)`,
            }}
          >
            여호와는
          </div>

          {/* 빛이 쓱 지나가는 라이트 스위프 (Light Sweep) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: 80,
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)',
              transform: `skewX(-25deg) translateX(${lightSweep}%)`,
              pointerEvents: 'none',
              opacity: frame >= 50 && frame <= 85 ? 1 : 0,
            }}
          />
        </div>

        {/* 이어지는 말씀 구절 (시편 23:1 나의 목자시니) */}
        <div
          style={{
            fontSize: 34,
            fontWeight: 700,
            color: '#f8fafc',
            opacity: subProgress,
            transform: `translateY(${(1 - subProgress) * 20}px)`,
            marginTop: 14,
            letterSpacing: '1px',
            textShadow: '0 2px 16px rgba(0,0,0,0.8)',
          }}
        >
          나의 목자시니 내게 부족함이 없으리로다
        </div>

        {/* 성경 장절 뱃지 */}
        <div
          style={{
            marginTop: 28,
            opacity: subProgress,
            transform: `translateY(${(1 - subProgress) * 15}px)`,
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(12px)',
            border: '1.5px solid rgba(251, 191, 36, 0.4)',
            color: '#fbbf24',
            fontSize: 18,
            fontWeight: 800,
            padding: '8px 28px',
            borderRadius: 999,
            letterSpacing: '1px',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5), 0 0 20px rgba(251, 191, 36, 0.2)',
          }}
        >
          시편 23:1
        </div>
      </div>

      {/* ── [레이어 5] 하단 채널 브랜딩 ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 30,
          fontSize: 16,
          fontWeight: 700,
          color: 'rgba(255, 255, 255, 0.55)',
          letterSpacing: '2px',
        }}
      >
        별내사랑의교회 · 말씀 묵상
      </div>
    </AbsoluteFill>
  );
};