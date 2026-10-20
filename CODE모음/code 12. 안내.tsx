// frames=200 size=1280x720 (가로 16:9 공지 카드)
import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { FONT } from './font';

const GOLD = '#FFC93C';

// ── [캐릭터 이미지 설정] ──
// 1) 깃허브 저장소(specie119-maker/byeolnae-motion)에 올린 이미지 raw 주소
//    (예: https://raw.githubusercontent.com/specie119-maker/byeolnae-motion/main/character.png)
// 2) 또는 프로젝트 public 폴더 안에 넣은 경우: staticFile('character.png')
const CHAR_IMAGE = 'https://raw.githubusercontent.com/specie119-maker/byeolnae-motion/main/character.png';

// ── [소식 내용 4줄 & 안내 타이틀 설정] ──
const NOTICE_DATA = {
  header: '교회 소식 및 안내',
  badge: '공지사항',
  title: '이번 주 주요 안내',
  lines: [
    '• 이번 주일 예배는 오전 11시에 본당에서 드려집니다.',
    '• 예배 후 각 부서별 구역 모임 및 친교가 있습니다.',
    '• 수요일 저녁 8시 온세대 기도회가 진행됩니다.',
    '• 새가족 등록 및 안내는 로비 안내 데스크를 찾아주세요.',
  ],
  footer: '별내사랑의교회',
};

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const BOKEH = Array.from({ length: 14 }, (_, i) => ({
  x: random(`bx${i}`) * 1280,
  y: random(`by${i}`) * 720,
  r: 30 + random(`br${i}`) * 80,
}));

export const SceneBody = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;

  // 1) 3D 카드 등장 (rotateY -75도에서 스프링 회전 후 정면 안착)
  const enter = spring({ frame: f - 4, fps, config: { damping: 16, mass: 0.9 } });
  const swayY = -75 * (1 - enter) + 6 * Math.sin(t * 1.2) * enter;
  const swayX = 2.5 * Math.cos(t * 1.0) * enter;

  // 2) 캐릭터 원형 프로필 팝업
  const face = spring({ frame: f - 14, fps, config: { damping: 12 } });

  // 3) 상단 타이틀 & 4줄 텍스트 순차 페이드인
  const titleAnim = interpolate(f, [20, 36], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const lineAnims = [
    interpolate(f, [32, 46], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) }),
    interpolate(f, [42, 56], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) }),
    interpolate(f, [52, 66], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) }),
    interpolate(f, [62, 76], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) }),
  ];

  // 4) 빛 줄기(Sweep) 효과 (프레임 60과 130에 두 번 스쳐 지나감)
  const shine = (s: number) =>
    interpolate(f, [s, s + 30], [-60, 160], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const sweep = f < 110 ? shine(60) : shine(130);

  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT,
        color: '#fff',
        background: 'radial-gradient(ellipse at 50% 45%, #15234a 0%, #050914 75%)',
        overflow: 'hidden',
      }}
    >
      {/* ── 배경 은은한 보케 라이트 ── */}
      {BOKEH.map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: b.x - b.r,
            top: b.y - b.r + Math.sin(t + i) * 10,
            width: b.r * 2,
            height: b.r * 2,
            borderRadius: '50%',
            background: i % 3 ? 'rgba(91,140,255,0.08)' : 'rgba(255,201,60,0.07)',
            filter: 'blur(8px)',
          }}
        />
      ))}

      {/* ── 상단 메인 헤더 ── */}
      <div
        style={{
          position: 'absolute',
          top: 36,
          width: '100%',
          textAlign: 'center',
          fontSize: 34,
          fontWeight: 900,
          letterSpacing: '-0.5px',
        }}
      >
        {NOTICE_DATA.header}
      </div>

      {/* ── 3D 소식 안내 카드 (너비 980px, 높이 420px로 확장) ── */}
      <AbsoluteFill style={{ perspective: 1200, alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            width: 980,
            height: 430,
            borderRadius: 36,
            position: 'relative',
            overflow: 'hidden',
            opacity: Math.min(1, enter * 1.5),
            transform: `rotateY(${swayY}deg) rotateX(${swayX}deg)`,
            background: 'linear-gradient(135deg, #182a5e 0%, #0d1736 60%, #0a1129 100%)',
            border: '2px solid rgba(255,201,60,0.5)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            padding: '30px 45px 30px 35px',
          }}
        >
          {/* 카드 좌측 골드 띠 */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 14,
              background: GOLD,
            }}
          />

          {/* 1. 좌측: 원형 캐릭터 프로필 프레임 */}
          <div
            style={{
              width: 230,
              height: 230,
              minWidth: 230,
              borderRadius: '50%',
              overflow: 'hidden',
              border: `6px solid ${GOLD}`,
              background: 'radial-gradient(circle at 50% 35%, #ffe7a6, #f0a93a)',
              transform: `scale(${face})`,
              position: 'relative',
              boxShadow: '0 15px 30px rgba(0,0,0,0.4)',
            }}
          >
            <Img
              src={CHAR_IMAGE}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>

          {/* 2. 우측: 텍스트 정보 영역 (타이틀 + 4줄 소식) */}
          <div
            style={{
              marginLeft: 40,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {/* 상단 뱃지 & 소식 메인 제목 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                marginBottom: 18,
                opacity: titleAnim,
                transform: `translateX(${(1 - titleAnim) * 35}px)`,
              }}
            >
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  color: '#0a1129',
                  background: GOLD,
                  borderRadius: 999,
                  padding: '5px 16px',
                }}
              >
                {NOTICE_DATA.badge}
              </span>
              <span style={{ fontSize: 36, fontWeight: 900, color: '#ffffff' }}>
                {NOTICE_DATA.title}
              </span>
            </div>

            {/* 4줄의 상세 소식 목록 (순차적 슬라이드 인) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {NOTICE_DATA.lines.map((line, idx) => (
                <div
                  key={idx}
                  style={{
                    fontSize: 22,
                    fontWeight: 600,
                    color: '#e2e8f0',
                    lineHeight: 1.4,
                    letterSpacing: '-0.3px',
                    opacity: lineAnims[idx],
                    transform: `translateX(${(1 - lineAnims[idx]) * 30}px)`,
                  }}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>

          {/* 3. 비스듬한 화이트 빛 줄기 스위프 (Light Sweep) */}
          <div
            style={{
              position: 'absolute',
              top: -80,
              bottom: -80,
              left: `${sweep}%`,
              width: 180,
              transform: 'rotate(20deg)',
              background:
                'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.25), rgba(255,255,255,0))',
              mixBlendMode: 'screen',
              pointerEvents: 'none',
            }}
          />
        </div>
      </AbsoluteFill>

      {/* ── 하단 중앙 기관명 ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 34,
          width: '100%',
          textAlign: 'center',
          fontSize: 18,
          fontWeight: 700,
          color: 'rgba(255,255,255,0.6)',
          letterSpacing: '1px',
        }}
      >
        {NOTICE_DATA.footer}
      </div>
    </AbsoluteFill>
  );
};

export const Scene = () => (
  <AbsoluteFill>
    <SceneBody />
  </AbsoluteFill>
);