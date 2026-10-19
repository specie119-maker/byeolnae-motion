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

export interface CleanThreeCardsProps {
  organization?: string;       // 맨 아래 박힐 기관명 (기본: 별내사랑의교회)
  card1Text?: string;          // 1번 박스 텍스트 (예: 일을 행하시는 여호와)
  card1Icon?: string;          // 1번 이모티콘
  card2Text?: string;          // 2번 박스 텍스트 (예: 일을 지어 성취하시는)
  card2Icon?: string;          // 2번 이모티콘
  card3Text?: string;          // 3번 박스 텍스트 (예: 하나님)
  card3Icon?: string;          // 3번 이모티콘
}

// 텍스트를 2줄로 보기 좋게 나누는 헬퍼 함수
const splitIntoTwoLines = (text: string) => {
  const words = text.trim().split(/\s+/);
  if (words.length <= 1) return [text, ''];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
};

export const CleanThreeCardsScene: React.FC<CleanThreeCardsProps> = ({
  organization = '별내사랑의교회',
  card1Text = '일을 행하시는 여호와',
  card1Icon = '✝️',
  card2Text = '일을 지어 성취하시는',
  card2Icon = '🕊️',
  card3Text = '하나님',
  card3Icon = '👑',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. 3개 카드 및 (+) 뱃지 순차 등장
  const sprCard1 = spring({ frame: frame - 10, fps, config: { damping: 13, stiffness: 120 } });
  const sprPlus1 = spring({ frame: frame - 22, fps, config: { damping: 11, stiffness: 140 } });
  const sprCard2 = spring({ frame: frame - 26, fps, config: { damping: 13, stiffness: 120 } });
  const sprPlus2 = spring({ frame: frame - 38, fps, config: { damping: 11, stiffness: 140 } });
  const sprCard3 = spring({ frame: frame - 42, fps, config: { damping: 13, stiffness: 120 } });

  // 2. 하단 교회명 등장
  const bottomFade = interpolate(frame, [50, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const cards = [
    { text: card1Text, icon: card1Icon, spr: sprCard1 },
    { text: card2Text, icon: card2Icon, spr: sprCard2 },
    { text: card3Text, icon: card3Icon, spr: sprCard3 },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0a0c',
        fontFamily: FONT,
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 40,
        padding: '40px 60px',
        overflow: 'hidden',
      }}
    >
      {/* ── 중앙 3개 화이트 박스 (이모티콘 위쪽 배치 + 박스 안 2줄 텍스트) ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          position: 'relative',
          width: '100%',
        }}
      >
        {cards.map((c, i) => {
          const [lineA, lineB] = splitIntoTwoLines(c.text);

          return (
            <React.Fragment key={i}>
              {/* 카드 본체 */}
              <div
                style={{
                  width: 320,
                  height: 400,
                  backgroundColor: '#ffffff',
                  borderRadius: 36,
                  padding: '38px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.65)',
                  transform: `scale(${c.spr})`,
                  color: '#0f172a',
                  textAlign: 'center',
                }}
              >
                {/* [상단] 박스 위에 놓이는 이모티콘 심볼 */}
                <div
                  style={{
                    fontSize: 96,
                    lineHeight: 1,
                    filter: 'drop-shadow(0 12px 18px rgba(0,0,0,0.18))',
                    marginTop: 10,
                  }}
                >
                  {c.icon}
                </div>

                {/* [하단] 흰 박스 안에 큼직하게 2줄로 출력되는 말씀 구절 */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      fontSize: 34,
                      fontWeight: 900,
                      letterSpacing: '-1px',
                      color: '#0f172a',
                      lineHeight: 1.25,
                    }}
                  >
                    {lineA}
                  </div>
                  {lineB && (
                    <div
                      style={{
                        fontSize: 34,
                        fontWeight: 900,
                        letterSpacing: '-1px',
                        color: i === 2 ? '#ff2e93' : '#1e293b', // 마지막 카드는 포인트 강조
                        lineHeight: 1.25,
                      }}
                    >
                      {lineB}
                    </div>
                  )}
                </div>
              </div>

              {/* 1번-2번 사이 분홍색 (+) 뱃지 */}
              {i === 0 && (
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    backgroundColor: '#ff2e93',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 30,
                    fontWeight: 900,
                    transform: `scale(${sprPlus1})`,
                    boxShadow: '0 6px 20px rgba(255, 46, 147, 0.55)',
                    zIndex: 10,
                  }}
                >
                  +
                </div>
              )}

              {/* 2번-3번 사이 분홍색 (+) 뱃지 */}
              {i === 1 && (
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    backgroundColor: '#ff2e93',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 30,
                    fontWeight: 900,
                    transform: `scale(${sprPlus2})`,
                    boxShadow: '0 6px 20px rgba(255, 46, 147, 0.55)',
                    zIndex: 10,
                  }}
                >
                  +
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* ── 맨 박스 밑: 기관명 (별내사랑의교회) ── */}
      <div
        style={{
          opacity: bottomFade,
          transform: `translateY(${(1 - bottomFade) * 15}px)`,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1.5px solid rgba(255, 255, 255, 0.25)',
            padding: '10px 32px',
            borderRadius: 999,
            fontSize: 22,
            fontWeight: 800,
            color: '#f8fafc',
            letterSpacing: '1px',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
          }}
        >
          <span style={{ color: '#ff2e93', fontSize: 20 }}>✝</span>
          <span>{organization}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Scene = () => (
  <AbsoluteFill>
    <CleanThreeCardsScene />
  </AbsoluteFill>
);