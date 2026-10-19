// frames=180 size=1080x1920 (9:16 세로 쇼츠)
import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { FONT } from './font';

// ── 설교 핵심 메시지 3줄 설정 ──
const SERMON_SENTENCE = {
  line1: '일을 행하시는 여호와',
  line2: '일을 지어 성취하시는',
  line3: '하나님',
};

// 채널 링크 정보
const YOUTUBE_URL = 'https://www.youtube.com/@별내사랑의교회1';
const BLOG_URL = 'https://blog.naver.com/aiyamok2015/224430812151';

// 부드러운 감속 곡선 함수 (어지러움 없는 편안한 모션)
const easeOutCubic = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

export const SermonShortsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. 요소별 순차적 진행률 (Progress)
  const pCard = easeOutCubic(frame / 20);            // 중앙 카드 안착
  const pLine1 = easeOutCubic((frame - 15) / 20);   // 1번째 줄
  const pLine2 = easeOutCubic((frame - 30) / 20);   // 2번째 줄
  const pLine3 = easeOutCubic((frame - 45) / 22);   // 3번째 줄 (하나님)
  const pTop = easeOutCubic(frame / 18);            // 상단 유튜브
  const pBottom = easeOutCubic((frame - 25) / 20);  // 하단 블로그

  // 마지막 강조 문구 은은한 호흡 펄스 (Pulse)
  const pulse = 1 + Math.sin(Math.max(0, frame - 65) * 0.08) * 0.02;

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(ellipse at 50% 35%, #162447 0%, #0d1424 55%, #050811 100%)',
        fontFamily: FONT,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '110px 60px 100px 60px',
        color: '#ffffff',
      }}
    >
      {/* ── 배경: 은은하게 회전하는 후광 라이트 ── */}
      <div
        style={{
          position: 'absolute',
          top: '25%',
          left: '50%',
          width: 1400,
          height: 1400,
          marginLeft: -700,
          marginTop: -700,
          backgroundImage:
            'repeating-conic-gradient(from 0deg at 50% 50%, rgba(246, 195, 88, 0.04) 0deg 9deg, transparent 9deg 18deg)',
          transform: `rotate(${frame * 0.25}deg)`,
          pointerEvents: 'none',
        }}
      />

      {/* ── [상단] 유튜브 공식 채널 링크 ── */}
      <div
        style={{
          opacity: pTop,
          transform: `translateY(${(1 - pTop) * -20}px)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          textAlign: 'center',
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1.5px solid rgba(239, 68, 68, 0.5)',
            padding: '10px 28px',
            borderRadius: 999,
          }}
        >
          <span style={{ color: '#ef4444', fontSize: 24, fontWeight: 900 }}>▶</span>
          <span style={{ fontSize: 28, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px' }}>
            별내사랑의교회
          </span>
        </div>
        <p
          style={{
            fontSize: 24,
            fontWeight: 500,
            color: '#94a3b8',
            margin: 0,
            fontFamily: 'monospace',
            letterSpacing: '-0.3px',
          }}
        >
          {YOUTUBE_URL}
        </p>
      </div>

      {/* ── [중앙] 대형 설교 한 문장 화이트 카드 (3줄 정중앙 완전 가운데 정렬, 동일 글씨 크기) ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 20,
          width: '100%',
          maxWidth: 960,
          minHeight: 760,
          background: '#ffffff',
          borderRadius: 56,
          padding: '80px 50px',
          boxShadow: '0 40px 100px rgba(0, 0, 0, 0.65), 0 0 50px rgba(246, 195, 88, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 36,
          textAlign: 'center',
          opacity: pCard,
          transform: `scale(${0.96 + 0.04 * pCard})`,
        }}
      >
        {/* 1번째 줄 */}
        <div
          style={{
            fontSize: 54,
            fontWeight: 700,
            color: '#1e293b',
            lineHeight: 1.4,
            letterSpacing: '-1.5px',
            opacity: pLine1,
            transform: `translateY(${(1 - pLine1) * 20}px)`,
            textAlign: 'center',
          }}
        >
          {SERMON_SENTENCE.line1}
        </div>

        {/* 2번째 줄 */}
        <div
          style={{
            fontSize: 54,
            fontWeight: 700,
            color: '#1e293b',
            lineHeight: 1.4,
            letterSpacing: '-1.5px',
            opacity: pLine2,
            transform: `translateY(${(1 - pLine2) * 20}px)`,
            textAlign: 'center',
          }}
        >
          {SERMON_SENTENCE.line2}
        </div>

        {/* 3번째 줄: 하나님 (동일 글씨 크기, 로즈골드 강조 & 바운스 펄스) */}
        <div
          style={{
            fontSize: 54,
            fontWeight: 900,
            color: '#e11d48',
            lineHeight: 1.4,
            letterSpacing: '-1.5px',
            opacity: pLine3,
            transform: `translateY(${(1 - pLine3) * 25}px) scale(${pulse})`,
            textAlign: 'center',
            textShadow: '0 4px 15px rgba(225, 29, 72, 0.25)',
          }}
        >
          {SERMON_SENTENCE.line3}
        </div>
      </div>

      {/* ── [하단] 네이버 블로그 공식 채널 링크 ── */}
      <div
        style={{
          opacity: pBottom,
          transform: `translateY(${(1 - pBottom) * 20}px)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          textAlign: 'center',
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(3, 199, 90, 0.15)',
            border: '1.5px solid rgba(3, 199, 90, 0.5)',
            padding: '8px 24px',
            borderRadius: 999,
          }}
        >
          <span style={{ color: '#03c75a', fontSize: 22, fontWeight: 900 }}>N</span>
          <span style={{ fontSize: 26, fontWeight: 700, color: '#ffffff' }}>
            블로그 공식 채널
          </span>
        </div>
        <p
          style={{
            fontSize: 22,
            fontWeight: 500,
            color: '#94a3b8',
            margin: 0,
            fontFamily: 'monospace',
            letterSpacing: '-0.3px',
          }}
        >
          {BLOG_URL}
        </p>
      </div>
    </AbsoluteFill>
  );
};

export const Scene = () => (
  <AbsoluteFill>
    <SermonShortsScene />
  </AbsoluteFill>
);
