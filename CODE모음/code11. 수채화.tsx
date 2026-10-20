// frames=180 size=1080x1920 (세로 쇼츠 / 카드뉴스)
import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const WatercolorScriptureScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. 수채화 핑크 번짐 배경 스프링 팝업
  const bgScale = spring({
    frame: frame - 5,
    fps,
    config: { damping: 18, stiffness: 60 },
  });

  // 2. 나뭇가지 돋아나는 모션
  const branchSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  // 3. 말씀 구절 한 줄씩 은은한 페이드인
  const fade1 = interpolate(frame, [25, 45], [0, 1], { extrapolateRight: 'clamp' });
  const fade2 = interpolate(frame, [45, 65], [0, 1], { extrapolateRight: 'clamp' });
  const fade3 = interpolate(frame, [65, 85], [0, 1], { extrapolateRight: 'clamp' });
  const fadeStamp = interpolate(frame, [85, 100], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#fbfaf8', // 따뜻한 미색 한지/수채화 종이 톤
        fontFamily: "'Nanum Pen Script', 'Gowun Batang', cursive, serif",
        color: '#1e1b18',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 60px',
        overflow: 'hidden',
      }}
    >
      {/* ── [배경] 수채화 핑크 번짐 & 별빛 ── */}
      <div
        style={{
          position: 'absolute',
          width: 820,
          height: 1100,
          borderRadius: '45% 55% 60% 40% / 50% 45% 55% 50%',
          background:
            'radial-gradient(ellipse at 55% 45%, rgba(244, 114, 182, 0.45) 0%, rgba(251, 207, 232, 0.3) 45%, rgba(253, 242, 248, 0) 75%)',
          filter: 'blur(36px)',
          transform: `scale(${bgScale})`,
          pointerEvents: 'none',
        }}
      />

      {/* 은은하게 반짝이는 빛 입자 ✨ */}
      <div
        style={{
          position: 'absolute',
          top: '32%',
          right: '18%',
          fontSize: 28,
          color: '#fbbf24',
          opacity: 0.6 + Math.sin(frame * 0.1) * 0.3,
        }}
      >
        ✦
      </div>
      <div
        style={{
          position: 'absolute',
          top: '46%',
          right: '22%',
          fontSize: 20,
          color: '#f472b6',
          opacity: 0.5 + Math.cos(frame * 0.12) * 0.3,
        }}
      >
        ✦
      </div>

      {/* ── [좌측 하단] 파스텔 감성 나뭇가지 일러스트 (SVG) ── */}
      <div
        style={{
          position: 'absolute',
          left: 100,
          bottom: 340,
          transformOrigin: 'bottom center',
          transform: `scale(${branchSpring})`,
          zIndex: 5,
        }}
      >
        <svg width="180" height="300" viewBox="0 0 120 200" fill="none">
          {/* 줄기 */}
          <path d="M 60 190 L 60 40 M 60 140 Q 40 120 30 110 M 60 110 Q 80 90 90 80 M 60 80 Q 45 65 35 55 M 60 60 Q 75 45 85 35" stroke="#2d2a26" strokeWidth="2.5" strokeLinecap="round" />
          {/* 파스텔 잎사귀들 */}
          <ellipse cx="28" cy="108" rx="8" ry="12" transform="rotate(-35 28 108)" fill="#bae6fd" stroke="#2d2a26" strokeWidth="1.8" />
          <ellipse cx="92" cy="78" rx="8" ry="12" transform="rotate(35 92 78)" fill="#a7f3d0" stroke="#2d2a26" strokeWidth="1.8" />
          <ellipse cx="32" cy="52" rx="7" ry="11" transform="rotate(-40 32 52)" fill="#e9d5ff" stroke="#2d2a26" strokeWidth="1.8" />
          <ellipse cx="88" cy="32" rx="7" ry="11" transform="rotate(35 88 32)" fill="#fef08a" stroke="#2d2a26" strokeWidth="1.8" />
          <ellipse cx="60" cy="30" rx="6" ry="10" fill="#a7f3d0" stroke="#2d2a26" strokeWidth="1.8" />
          {/* 화분 띠 받침 */}
          <path d="M 46 170 L 74 170 L 70 178 L 50 178 Z" fill="#fef08a" stroke="#2d2a26" strokeWidth="2" />
        </svg>
      </div>

      {/* ── [중앙 텍스트 블록] 감성 캘리그라피 말씀 본문 ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: 780,
          marginTop: -60,
        }}
      >
        {/* 1단락: 두려워하지 말라 ~ 내가 너와 함께 함이라 */}
        <div
          style={{
            opacity: fade1,
            transform: `translateY(${(1 - fade1) * 16}px)`,
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: 72, fontWeight: 900, lineHeight: 1.25, letterSpacing: '-2px' }}>
            두려워하지 말라
          </div>
          <div style={{ fontSize: 68, fontWeight: 900, lineHeight: 1.25, letterSpacing: '-2px' }}>
            내가 너와 함께
          </div>
          <div style={{ fontSize: 62, fontWeight: 800, lineHeight: 1.2, letterSpacing: '-2px' }}>
            함이라
          </div>
        </div>

        {/* 2단락: 놀라지 말라 ~ 나는 네 하나님이 됨이라 */}
        <div
          style={{
            opacity: fade2,
            transform: `translateY(${(1 - fade2) * 16}px)`,
            marginBottom: 24,
          }}
        >
          <div style={{ fontSize: 68, fontWeight: 900, lineHeight: 1.25, letterSpacing: '-2px' }}>
            놀라지 말라
          </div>
          <div style={{ fontSize: 68, fontWeight: 900, lineHeight: 1.25, letterSpacing: '-2px' }}>
            나는 네 하나님이
          </div>
          <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.2, letterSpacing: '-2px' }}>
            됨이라~
          </div>
        </div>

        {/* 3단락: 내가 너를 굳세게 하리라 ~ 너를 붙들리라 */}
        <div
          style={{
            opacity: fade3,
            transform: `translateY(${(1 - fade3) * 16}px)`,
            marginBottom: 32,
          }}
        >
          <div style={{ fontSize: 66, fontWeight: 900, lineHeight: 1.25, letterSpacing: '-2px' }}>
            내가 너를 굳세게
          </div>
          <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.2, letterSpacing: '-2px' }}>
            하리라~
          </div>
          <div style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.25, letterSpacing: '-1.5px' }}>
            참으로 너를 도와주리라
          </div>
          <div style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.25, letterSpacing: '-1.5px' }}>
            참으로 나의
          </div>
          <div style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.25, letterSpacing: '-1.5px' }}>
            의로운 오른손으로
          </div>
          <div style={{ fontSize: 72, fontWeight: 900, lineHeight: 1.3, letterSpacing: '-2px' }}>
            너를 붙들리라~
          </div>
        </div>

        {/* 성경 장절 */}
        <div
          style={{
            opacity: fadeStamp,
            fontSize: 40,
            fontWeight: 800,
            letterSpacing: '2px',
            color: '#2d2a26',
            marginBottom: 20,
          }}
        >
          이사야 41:10
        </div>

        {/* 하단 붉은 인장 도장 (낙관) */}
        <div
          style={{
            opacity: fadeStamp,
            transform: `scale(${fadeStamp})`,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 24, fontWeight: 700, color: '#4b5563' }}>하나님사랑</span>
          <div
            style={{
              width: 34,
              height: 34,
              border: '2px solid #ef4444',
              borderRadius: 6,
              color: '#ef4444',
              fontSize: 16,
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
            }}
          >
            은혜
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};