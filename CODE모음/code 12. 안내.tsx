// frames=200 size=1280x720 (가로 16:9 편지 카드)
import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { FONT } from './font';

const GOLD = '#FFC93C';

const DEFAULT_CHAR_IMG =
  'https://raw.githubusercontent.com/specie119-maker/byeolnae-motion/main/목사님.png';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const BOKEH = Array.from({ length: 14 }, (_, i) => ({
  x: random(`bx${i}`) * 1280,
  y: random(`by${i}`) * 720,
  r: 30 + random(`br${i}`) * 80,
}));

export interface PastorNoticeCardProps {
  charImg?: string;
  badge?: string;
  title?: string;
  line1?: string;
  line2?: string;
  organization?: string;
}

export const SceneBody: React.FC<PastorNoticeCardProps> = ({
  charImg = DEFAULT_CHAR_IMG,
  badge = '목회 서신',
  title = '별내사랑의교회 주간 알림',
  line1 = '1. 이번 주일 예배는 오전 11시에 본당에서 드려집니다.',
  line2 = '2. 예배 후 각 다락방 및 부서별 나눔 모임이 있습니다.',
  organization = '별내사랑의교회',
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;

  // 1) 3D 카드 등장 (rotateY -75도에서 스프링 회전 후 정면 안착)
  const enter = spring({ frame: f - 4, fps, config: { damping: 16, mass: 0.9 } });
  const swayY = -75 * (1 - enter) + 6 * Math.sin(t * 1.2) * enter;
  const swayX = 2.5 * Math.cos(t * 1.0) * enter;

  // 2) 목사님 캐릭터 원형 프로필 팝업
  const face = spring({ frame: f - 14, fps, config: { damping: 12 } });

  // 3) 상단 제목 및 안내문구 순차 페이드인
  const titleAnim = interpolate(f, [20, 36], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const lineAnims = [
    interpolate(f, [32, 46], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) }),
    interpolate(f, [40, 54], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) }),
    interpolate(f, [48, 62], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) }),
    interpolate(f, [56, 70], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) }),
  ];

  // 4) 빛 줄기(Sweep) 효과 (프레임 60과 135에 2번 비스듬히 통과)
  const shine = (s: number) =>
    interpolate(f, [s, s + 30], [-60, 160], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const sweep = f < 110 ? shine(60) : shine(135);

  // 3,4번 문구 삭제 및 1,2번 각 입력칸 당 최대 2줄(총 4줄) 균형 분할
  const splitToTwo = (txt: string, maxChars = 28) => {
    if (!txt) return [];
    const trimmed = String(txt).trim();
    if (!trimmed) return [];
    if (trimmed.includes('\n')) {
      const parts = trimmed.split('\n').map((s) => s.trim()).filter(Boolean);
      if (parts.length >= 2) return [parts[0], parts.slice(1).join(' ')];
    }
    const sentenceRegex = /(?<=[.!?])\s+/g;
    let match: RegExpExecArray | null;
    let splitSentenceIdx = -1;
    while ((match = sentenceRegex.exec(trimmed)) !== null) {
      if (match.index > 3 && match.index < trimmed.length - 2) {
        splitSentenceIdx = match.index;
        break;
      }
    }
    if (splitSentenceIdx > 0) {
      const p1 = trimmed.slice(0, splitSentenceIdx).trim();
      const p2 = trimmed.slice(splitSentenceIdx).trim();
      if (p1.length <= maxChars && p2.length <= maxChars + 6) {
        return [p1, p2];
      }
    }
    const words = trimmed.split(/\s+/);
    if (words.length <= 1) {
      if (trimmed.length > 14) {
        const mid = Math.ceil(trimmed.length / 2);
        return [trimmed.slice(0, mid), trimmed.slice(mid)];
      }
      return [trimmed];
    }
    if (words.length === 2) {
      if (words[0].endsWith('.') || words[0].endsWith(')')) {
        return [trimmed];
      }
      return [words[0], words[1]];
    }
    const minWordsFirst = words[0].endsWith('.') || words[0].endsWith(')') ? 2 : 1;
    let bestIdx = minWordsFirst;
    let minDiff = Infinity;
    for (let i = minWordsFirst; i < words.length; i++) {
      const l1 = words.slice(0, i).join(' ');
      const l2 = words.slice(i).join(' ');
      if (l1.length > maxChars) break;
      const diff = Math.abs(l1.length - l2.length);
      if (diff < minDiff) {
        minDiff = diff;
        bestIdx = i;
      }
    }
    return [words.slice(0, bestIdx).join(' '), words.slice(bestIdx).join(' ')];
  };

  const group1 = splitToTwo(line1);
  const group2 = splitToTwo(line2);

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

      {/* ── 3D 안내 카드 (너비 980px, 높이 430px) ── */}
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
          {/* 카드 좌측 골드 바 */}
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

          {/* 1. 좌측: 원형 목사님 캐릭터 프레임 (1/2 축소 & 원안에 얼굴만 확대) */}
          <div
            style={{
              width: 105,
              height: 105,
              minWidth: 105,
              borderRadius: '50%',
              overflow: 'hidden',
              border: `4px solid ${GOLD}`,
              background: 'radial-gradient(circle at 50% 35%, #ffe7a6, #f0a93a)',
              transform: `scale(${face})`,
              position: 'relative',
              boxShadow: '0 15px 30px rgba(0,0,0,0.4)',
            }}
          >
            <Img
              src={charImg}
              style={{
                position: 'absolute',
                width: '185%',
                height: '185%',
                left: '-42%',
                top: '-15%',
                objectFit: 'contain',
              }}
            />
          </div>

          {/* 2. 우측: 텍스트 정보 영역 (타이틀 + 1,2번 각 2줄씩 최대 4줄) */}
          <div
            style={{
              marginLeft: 32,
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
                marginBottom: 20,
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
                {badge}
              </span>
              <span style={{ fontSize: 34, fontWeight: 900, color: '#ffffff' }}>
                {title}
              </span>
            </div>

            {/* 1번 문구 (최대 2줄) & 2번 문구 (최대 2줄) - 3,4번 삭제 & 각 입력시 2줄로 총 4줄 출력 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {group1.map((t, i) => (
                  <div
                    key={`g1-${i}`}
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      color: '#f8fafc',
                      lineHeight: 1.35,
                      letterSpacing: '-0.3px',
                      paddingLeft: i > 0 ? 18 : 0,
                      opacity: lineAnims[i] ?? 1,
                      transform: `translateX(${(1 - (lineAnims[i] ?? 1)) * 30}px)`,
                    }}
                  >
                    {t}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {group2.map((t, i) => (
                  <div
                    key={`g2-${i}`}
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      color: '#e2e8f0',
                      lineHeight: 1.35,
                      letterSpacing: '-0.3px',
                      paddingLeft: i > 0 ? 18 : 0,
                      opacity: lineAnims[group1.length + i] ?? 1,
                      transform: `translateX(${(1 - (lineAnims[group1.length + i] ?? 1)) * 30}px)`,
                    }}
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. 비스듬한 라이트 스위프 (Light Sweep) */}
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

      {/* ── 하단 기관명 ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 34,
          width: '100%',
          textAlign: 'center',
          fontSize: 18,
          fontWeight: 700,
          color: 'rgba(255,255,255,0.65)',
          letterSpacing: '1px',
        }}
      >
        {organization}
      </div>
    </AbsoluteFill>
  );
};

export const Scene: React.FC<PastorNoticeCardProps> = (props) => (
  <AbsoluteFill>
    <SceneBody {...props} />
  </AbsoluteFill>
);