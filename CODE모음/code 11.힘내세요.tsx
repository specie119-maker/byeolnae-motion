// frames=300 size=1080x1920 (세로 9:16) 또는 1280x720 (가로) 공용
import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { FONT } from './font';

// 찬양 말씀 구절 목록 (기본값)
const DEFAULT_LINES = [
  '내 영혼아 여호와를 송축하라',
  '내 속에 있는 것들아',
  '다 그의 거룩한 이름을 송축하라',
  '내 영혼아',
  '여호와를 송축하며',
  '그의 모든 은택을 잊지 말지어다',
];

export interface AscendingVerseProps {
  lines?: string[];          // 찬양/말씀 구절 줄 목록 (미입력 시 기본 구절 사용)
  verseRef?: string;         // 성경 출처 (예: 시편 103:1-2)
  organization?: string;     // 기관명 (예: 별내사랑의교회)
}

export const AscendingVerseScene: React.FC<AscendingVerseProps> = ({
  lines = DEFAULT_LINES,
  verseRef = '시편 103:1-2',
  organization = '별내사랑의교회',
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const isVertical = height > width;
  const SCRIPTURE_LINES = lines && lines.length > 0 ? lines : DEFAULT_LINES;

  const lineGap = isVertical ? 42 : 62;
  const totalHeight = (SCRIPTURE_LINES.length - 1) * lineGap + 80;

  // 1. 하단에서 상단으로 서서히 올라가는 Y축 이동 계산 (durationInFrames: 300프레임 / 10초)
  const translateY = interpolate(
    frame,
    [0, durationInFrames],
    [height * 0.52, -totalHeight - 40],
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
          height: isVertical ? 240 : 130,
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
          height: isVertical ? 240 : 130,
          background: 'linear-gradient(0deg, #ECE4D8 40%, rgba(236, 228, 216, 0) 100%)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      />

      {/* ── 아래에서 위로 올라가는 텍스트 본체 (맨 아래서 가장 크고 올라갈수록 작아지는 원근감) ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          transform: `translateY(${translateY}px)`,
          opacity: globalOpacity,
          width: '90%',
          gap: lineGap,
        }}
      >
        {SCRIPTURE_LINES.map((line, idx) => {
          const isMagenta = idx % 2 === 0;
          // 맨 아래에서 가장 크고 위로 올라갈수록 작아지는 스케일 계산
          const approxY = height * 0.5 + translateY + idx * lineGap;
          const lineScale = interpolate(approxY, [height * 0.1, height * 0.9], [0.72, 1.28], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={idx}
              style={{
                // 가로 글씨크기 2배 (80px / 64px), 세로는 현재 크기 유지 (54px / 44px)
                fontSize: isVertical ? (isMagenta ? 54 : 44) : (isMagenta ? 80 : 64),
                fontWeight: isMagenta ? 900 : 700,
                // 한 줄은 rgb(230, 43, 117), 다른 한 줄은 검정색
                color: isMagenta ? 'rgb(230, 43, 117)' : '#000000',
                letterSpacing: '-1px',
                lineHeight: 1.3,
                transform: `scale(${lineScale})`,
                transformOrigin: 'center center',
                textShadow: isMagenta
                  ? '0 3px 10px rgba(230, 43, 117, 0.22)'
                  : '0 2px 8px rgba(0, 0, 0, 0.08)',
              }}
            >
              {line}
            </div>
          );
        })}

        {/* 텍스트 롤링 마지막 십자가 심볼 */}
        <div
          style={{
            marginTop: 10,
            fontSize: isVertical ? 36 : 48,
            color: 'rgb(230, 43, 117)',
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