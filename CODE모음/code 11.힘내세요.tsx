// frames=180 size=1080x1080 (인스타그램/정사각형) 또는 1080x1920 / 1280x720 변환 가능
import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export interface DeskLetteringProps {
  line1?: string;            // 1번째 줄 (예: 다시는)
  line2?: string;            // 2번째 줄 (예: 오지않을 오늘)
  line3?: string;            // 3번째 줄 (예: 후회없이 행복하게)
  organization?: string;     // 하단 브랜딩 (선택)
}

export const DeskLetteringScene: React.FC<DeskLetteringProps> = ({
  line1 = '다시는',
  line2 = '오지않을 오늘',
  line3 = '후회없이 행복하게',
  organization = '별내사랑의교회',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. 손글씨 순차 등장 애니메이션
  const popSun = spring({ frame: frame - 10, fps, config: { damping: 12, stiffness: 120 } });
  const fade1 = interpolate(frame, [15, 32], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fade2 = interpolate(frame, [30, 48], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fade3 = interpolate(frame, [45, 65], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // 2. 구름과 해님의 미세한 숨쉬기 모션
  const cloudFloat = Math.sin(frame * 0.08) * 4;
  const sunRotate = Math.sin(frame * 0.05) * 6;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#e5e5e5',
        fontFamily: "'Nanum Pen Script', 'Gaegu', cursive, sans-serif",
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {/* ── 1. 배경: 화이트 벽면 & 사선 창가 자연광 그림자 ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #f4f4f4 0%, #ebebeb 60%, #dedede 100%)',
        }}
      />
      
      {/* 창가 사선 햇살 채광 (Sunlight Rays) */}
      <div
        style={{
          position: 'absolute',
          top: -200,
          left: -100,
          width: 600,
          height: 1400,
          background: 'linear-gradient(105deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.3) 40%, transparent 70%)',
          transform: 'rotate(-28deg)',
          filter: 'blur(30px)',
          pointerEvents: 'none',
        }}
      />

      {/* ── 2. 벽면 레터링 & 손그림 일러스트 영역 (상단~중앙) ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          marginTop: 130,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* [1줄] 텍스트 + 방긋 웃는 해님 + 우측 미니 구름 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            marginBottom: 8,
          }}
        >
          {/* 첫째 줄 텍스트 */}
          <span
            style={{
              fontSize: 54,
              fontWeight: 800,
              color: '#262626',
              letterSpacing: '-1px',
              opacity: fade1,
              transform: `translateY(${(1 - fade1) * 15}px)`,
            }}
          >
            {line1}
          </span>

          {/* 방긋 웃는 옐로우 해님 (SVG 손그림) */}
          <div
            style={{
              transform: `scale(${popSun}) rotate(${sunRotate}deg)`,
              transformOrigin: 'center center',
            }}
          >
            <svg width="68" height="68" viewBox="0 0 100 100" fill="none">
              {/* 햇살 라인 */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
                <rect
                  key={idx}
                  x="46"
                  y="6"
                  width="8"
                  height="16"
                  rx="4"
                  fill="#f59e0b"
                  stroke="#1c1917"
                  strokeWidth="3.5"
                  transform={`rotate(${angle} 50 50)`}
                />
              ))}
              {/* 얼굴 원 */}
              <circle cx="50" cy="50" r="28" fill="#fde047" stroke="#1c1917" strokeWidth="4" />
              {/* 눈 */}
              <circle cx="41" cy="46" r="3" fill="#1c1917" />
              <circle cx="59" cy="46" r="3" fill="#1c1917" />
              {/* 방긋 웃는 입 */}
              <path d="M 40 55 Q 50 65 60 55" stroke="#1c1917" strokeWidth="4" strokeLinecap="round" fill="none" />
            </svg>
          </div>

          {/* 오른쪽 작은 하늘색 구름 */}
          <div
            style={{
              transform: `translateY(${cloudFloat}px)`,
              opacity: fade1,
            }}
          >
            <svg width="54" height="34" viewBox="0 0 80 50" fill="none">
              <path
                d="M 15 35 A 12 12 0 0 1 25 15 A 18 18 0 0 1 55 15 A 14 14 0 0 1 70 30 A 10 10 0 0 1 65 42 L 15 42 A 10 10 0 0 1 15 35 Z"
                fill="#93c5fd"
                opacity="0.85"
              />
            </svg>
          </div>
        </div>

        {/* [2줄] 좌측 미니 구름 + 텍스트 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            marginBottom: 12,
            opacity: fade2,
            transform: `translateY(${(1 - fade2) * 15}px)`,
          }}
        >
          {/* 왼쪽 작은 하늘색 구름 */}
          <div style={{ transform: `translateY(${-cloudFloat}px)` }}>
            <svg width="60" height="36" viewBox="0 0 80 50" fill="none">
              <path
                d="M 15 35 A 12 12 0 0 1 25 15 A 18 18 0 0 1 55 15 A 14 14 0 0 1 70 30 A 10 10 0 0 1 65 42 L 15 42 A 10 10 0 0 1 15 35 Z"
                fill="#7dd3fc"
                opacity="0.9"
              />
            </svg>
          </div>

          {/* 두 번째 줄 텍스트 */}
          <span
            style={{
              fontSize: 62,
              fontWeight: 900,
              color: '#1f2937',
              letterSpacing: '-1.5px',
            }}
          >
            {line2}
          </span>
        </div>

        {/* [3줄] 텍스트 */}
        <div
          style={{
            opacity: fade3,
            transform: `translateY(${(1 - fade3) * 15}px)`,
          }}
        >
          <span
            style={{
              fontSize: 54,
              fontWeight: 800,
              color: '#374151',
              letterSpacing: '-1px',
            }}
          >
            {line3}
          </span>
        </div>
      </div>

      {/* ── 3. 하단 데스크 인테리어 소품 (노트북, 알람시계, 스탠드 조명, 책상) ── */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 380,
          zIndex: 5,
        }}
      >
        {/* 화이트 데스크 상판 */}
        <div
          style={{
            position: 'absolute',
            bottom: 120,
            left: '3%',
            right: '3%',
            height: 18,
            backgroundColor: '#ffffff',
            borderRadius: 4,
            boxShadow: '0 12px 28px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
          }}
        />

        {/* 책상 다리 (트러스 프레임) */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '6%',
            width: 70,
            height: 120,
            borderLeft: '4px solid #cbd5e1',
            borderRight: '4px solid #cbd5e1',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: '6%',
            width: 70,
            height: 120,
            borderLeft: '4px solid #cbd5e1',
            borderRight: '4px solid #cbd5e1',
          }}
        />

        {/* 책상 위 소품: [1] 노트북 */}
        <div
          style={{
            position: 'absolute',
            bottom: 138,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 250,
            height: 155,
            backgroundColor: '#1e293b',
            borderRadius: '10px 10px 0 0',
            border: '5px solid #0f172a',
            borderBottom: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
          }}
        >
          {/* 노트북 화면 */}
          <div
            style={{
              width: '94%',
              height: '90%',
              backgroundColor: '#334155',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              fontSize: 14,
              fontFamily: 'sans-serif',
            }}
          >
            {organization}
          </div>
        </div>

        {/* [2] 앤틱 오렌지 알람 시계 (우측) */}
        <div
          style={{
            position: 'absolute',
            bottom: 138,
            right: '25%',
            width: 65,
            height: 65,
            borderRadius: '50%',
            backgroundColor: '#ea580c',
            border: '4px solid #c2410c',
            boxShadow: '0 6px 12px rgba(0,0,0,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              backgroundColor: '#fffbeb',
              position: 'relative',
            }}
          >
            {/* 시계 바늘 */}
            <div style={{ position: 'absolute', top: 12, left: 21, width: 2, height: 12, backgroundColor: '#1c1917' }} />
            <div style={{ position: 'absolute', top: 21, left: 21, width: 14, height: 2, backgroundColor: '#1c1917' }} />
          </div>
        </div>

        {/* [3] 북 스택 (시계 밑 받침) */}
        <div
          style={{
            position: 'absolute',
            bottom: 138,
            right: '