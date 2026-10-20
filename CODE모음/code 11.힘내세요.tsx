// frames=300 size=1080x1920 (세로 9:16) 또는 1280x720 (가로) 공용
import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { FONT } from './font';

// 찬양 말씀 구절 목록 (홀수 줄: 짙은 먹색 / 짝수 줄: 보통 먹색)
const SCRIPTURE_LINES = [
  '내 영혼아 여호와를 송축하라',
  '내 속에 있는 것들아',
  '다 그의 거룩한 이름을 송축하라',
  '내 영혼아',
  '여호와를 송축하며',
  '그의 모든 은택을 잊지 말지어다',
];

export interface AscendingVerseProps {
  verseRef?: string;         // 성경 출처 (예: 시편 103:1-2)
  organization?: string;     // 기관명 (예: 별내사랑의교회)
}

export const AscendingVerseScene: React.FC<AscendingVerseProps> = ({
  verseRef = '시편 103:1-2',
  organization = '별내사랑의교회',
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const isVertical = height > width;

  // 1. 하단에서 상단으로 서서히 올라가는 Y축 이동 계산 (durationInFrames: 300프레임 / 10초)
  // 시작 위치: 화면 중앙 아래 (+height * 0.48) -> 종료 위치: 화면 상단 위 (-height * 0.40)
  const translateY = interpolate(
    frame,
    [0, durationInFrames],
    [height * 0.48, -height * 0.40],
    { extrapolateRight: 'clamp' }
  );

  // 2. 시작과 끝 부분의 부드러운 페이드 인/아웃
  const globalOpacity = interpolate(
    frame,
    [0, 25, durationInFrames - 30, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        // 부담스럽지 않은 환하고 따뜻한 웜 아이보리/크림 베이지 배경
        background: 'linear-gradient(180deg, #FBF9F5 0%, #F5F0E8 50%, #ECE4D8 100%)',
        fontFamily: FONT,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* ── 배경 은은한 햇살 웜 글로우 ── */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          width: width * 0.9,
          height: width * 0.9,
          background: 'radial-gradient(circle, rgba(254, 243, 199, 0.6) 0%, rgba(255, 255, 255, 0) 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      {/* ── 상단 고정 얇은 장식 뱃지 ── */}
      <div
        style={{
          position: 'absolute',
          top: isVertical ? '8%' : '6%',
          zIndex: 20,
          background: 'rgba(255, 255, 255, 0.75)',
          border: '1px solid rgba(217, 204, 185, 0.7)',
          backdropFilter: 'blur(8px)',
          padding: isVertical ? '8px 24px' : '6px 20px',
          borderRadius: 999,
          fontSize: isVertical ? 20 : 16,
          fontWeight: 700,
          color: '#8C7A6B',
          letterSpacing: '1px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
        }}
      >
        ✦ {verseRef} ✦
      </div>

      {/* ── 상·하단 부드러운 페이드 마스크 오버레이 ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: isVertical ? 240 : 120,
          background: 'linear-gradient(180deg, #FBF9F5 40%, rgba(251, 249, 245, 0) 100%)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: isVertical ? 240 : 120,
          background: 'linear-gradient(0deg, #ECE4D8 40%, rgba(236, 228, 216, 0) 100%)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      />

      {/* ── 아래에서 위로 올라가는 텍스트 본체 ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          transform: `translateY(${translateY}px)`,
          opacity: globalOpacity,
          width: '90%',
          gap: isVertical ? 38 : 22,
        }}
      >
        {SCRIPTURE_LINES.map((line, idx) => {
          // 한 줄은 진하게(짝수 인덱스), 한 줄은 보통(홀수 인덱스)
          const isBoldLine = idx % 2 === 0;

          return (
            <div
              key={idx}
              style={{
                fontSize: isVertical ? (isBoldLine ? 54 : 44) : (isBoldLine ? 40 : 32),
                fontWeight: isBoldLine ? 900 : 500,
                // 진한 줄: 깊이 있는 차콜 브라운(#1F1C18) / 보통 줄: 부드러운 웜 토프(#655A4E)
                color: isBoldLine ? '#1F1C18' : '#655A4E',
                letterSpacing: '-1px',
                lineHeight: 1.3,
                textShadow: isBoldLine ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              {line}
            </div>
          );
        })}

        {/* 텍스트 롤링 마지막 여백 및 십자가 심볼 */}
        <div
          style={{
            marginTop: 20,
            fontSize: isVertical ? 30 : 22,
            color: '#B09A84',
          }}
        >
          ✝
        </div>
      </div>

      {/* ── 하단 고정 기관명 ── */}
      <div
        style={{
          position: 'absolute',
          bottom: isVertical ? '5%' : '4%',
          zIndex: 20,
          fontSize: isVertical ? 20 : 16,
          fontWeight: 700,
          color: '#8C7A6B',
          letterSpacing: '1.5px',
        }}
      >
        {organization}
      </div>
    </AbsoluteFill>
  );
};

export const Scene: React.FC<AscendingVerseProps> = (props) => (
  <AbsoluteFill>
    <AscendingVerseScene {...props} />
  </AbsoluteFill>
);