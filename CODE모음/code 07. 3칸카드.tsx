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

// Props 인터페이스 (기관명 및 모든 텍스트 커스텀 가능)
export interface ScriptureThreeCardsProps {
  organization?: string;       // 기관/교회명 (예: 별내사랑의교회)
  topHeadline?: string;        // 상단 메인 헤드라인
  highlightWord?: string;      // 상단 핑크색 강조 단어
  card1Title?: string;         // 1번 카드 상단 라벨
  card1Value?: string;         // 1번 카드 메인 단어
  card1Icon?: string;          // 1번 카드 이모지/심볼
  card2Title?: string;         // 2번 카드 상단 라벨
  card2Value?: string;         // 2번 카드 메인 단어
  card2Icon?: string;          // 2번 카드 이모지/심볼
  card3Title?: string;         // 3번 카드 상단 라벨
  card3Value?: string;         // 3번 카드 메인 단어
  card3Icon?: string;          // 3번 카드 이모지/심볼
  bottomSubline?: string;      // 하단 별 강조 문구
  oldPriceText?: string;       // 이전 대가 (취소선 그어질 문구)
  newPriceText?: string;       // 최종 선물/은혜 문구
}

export const ScriptureThreeCardsScene: React.FC<ScriptureThreeCardsProps> = ({
  organization = '별내사랑의교회',
  topHeadline = '조건 없이, 자격 없이',
  highlightWord = '값없는 은혜!',
  card1Title = '죄 사함',
  card1Value = '보혈의 공로',
  card1Icon = '✝️',
  card2Title = '새 생명',
  card2Value = '성령의 임재',
  card2Icon = '🕊️',
  card3Title = '영원한 상급',
  card3Value = '천국 소망',
  card3Icon = '👑',
  bottomSubline = '예수 안에서는 이 모든 게',
  oldPriceText = '내 공로 999억',
  newPriceText = '0원 (전액 은혜)',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. 상단 헤드라인 및 기관명 페이드인
  const topFade = interpolate(frame, [5, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 2. 3개의 카드 순차 스프링 팝업
  const card1Spring = spring({ frame: frame - 15, fps, config: { damping: 13, stiffness: 120 } });
  const card2Spring = spring({ frame: frame - 28, fps, config: { damping: 13, stiffness: 120 } });
  const card3Spring = spring({ frame: frame - 41, fps, config: { damping: 13, stiffness: 120 } });

  // 3. 카드 사이의 (+) 뱃지 팝업
  const plus1Spring = spring({ frame: frame - 32, fps, config: { damping: 11, stiffness: 150 } });
  const plus2Spring = spring({ frame: frame - 45, fps, config: { damping: 11, stiffness: 150 } });

  // 4. 하단 카피 및 취소선 긋기
  const bottomFade = interpolate(frame, [55, 75], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const strikeProgress = interpolate(frame, [75, 95], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const priceSpring = spring({ frame: frame - 90, fps, config: { damping: 10, stiffness: 130 } });

  const cardsData = [
    { title: card1Title, value: card1Value, icon: card1Icon, spr: card1Spring },
    { title: card2Title, value: card2Value, icon: card2Icon, spr: card2Spring },
    { title: card3Title, value: card3Value, icon: card3Icon, spr: card3Spring },
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
        justifyContent: 'space-between',
        padding: '36px 60px 42px 60px',
        overflow: 'hidden',
      }}
    >
      {/* ── 1. 상단: 기관명 뱃지 & 메인 헤드라인 ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          opacity: topFade,
          transform: `translateY(${(1 - topFade) * -15}px)`,
        }}
      >
        {/* 기관명 표시 뱃지 */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '4px 16px',
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 700,
            color: '#cbd5e1',
            letterSpacing: '1px',
          }}
        >
          <span>⛪</span>
          <span>{organization}</span>
        </div>

        {/* 메인 헤드라인 (32% 할인 스타일 ➔ 핑크 포인트) */}
        <div style={{ fontSize: 38, fontWeight: 900, letterSpacing: '-0.5px' }}>
          <span>{topHeadline} </span>
          <span style={{ color: '#ff2e93', textShadow: '0 0 20px rgba(255, 46, 147, 0.4)' }}>
            {highlightWord}
          </span>
        </div>
      </div>

      {/* ── 2. 중앙: 3단 화이트 카드 & 사이의 (+) 뱃지 ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 18,
          position: 'relative',
          width: '100%',
        }}
      >
        {cardsData.map((c, i) => (
          <React.Fragment key={i}>
            {/* 화이트 라운드 카드 (신용카드 비율) */}
            <div
              style={{
                width: 280,
                height: 300,
                backgroundColor: '#ffffff',
                borderRadius: 28,
                padding: '28px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 20px 45px rgba(0, 0, 0, 0.6)',
                transform: `scale(${c.spr})`,
                color: '#111827',
                textAlign: 'center',
              }}
            >
              {/* 상단 텍스트 영역 */}
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: '#64748b', marginBottom: 6 }}>
                  {c.title}
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.5px' }}>
                  {c.value}
                </div>
              </div>

              {/* 하단 아이콘/일러스트 */}
              <div
                style={{
                  fontSize: 72,
                  lineHeight: 1,
                  filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.15))',
                }}
              >
                {c.icon}
              </div>
            </div>

            {/* 카드 사이 분홍색 (+) 원형 뱃지 */}
            {i === 0 && (
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  backgroundColor: '#ff2e93',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 26,
                  fontWeight: 900,
                  transform: `scale(${plus1Spring})`,
                  boxShadow: '0 4px 15px rgba(255, 46, 147, 0.5)',
                  zIndex: 10,
                }}
              >
                +
              </div>
            )}
            {i === 1 && (
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  backgroundColor: '#ff2e93',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 26,
                  fontWeight: 900,
                  transform: `scale(${plus2Spring})`,
                  boxShadow: '0 4px 15px rgba(255, 46, 147, 0.5)',
                  zIndex: 10,
                }}
              >
                +
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ── 3. 하단: ★ 이 모든 게 ★ & 취소선 가격 / 은혜 강조 ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          opacity: bottomFade,
          transform: `translateY(${(1 - bottomFade) * 15}px)`,
        }}
      >
        {/* 별 모양 서브라인 */}
        <div style={{ fontSize: 26, fontWeight: 900, color: '#facc15', letterSpacing: '1px' }}>
          ★ ★ {bottomSubline} ★ ★
        </div>

        {/* 이전 가격 취소선 & 최종 0원(은혜) 강조 */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
          {/* 이전 대가 (회색 글씨 + 빨간 취소선) */}
          <div style={{ position: 'relative', fontSize: 36, fontWeight: 800, color: '#64748b' }}>
            <span>{oldPriceText}</span>
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '-4%',
                width: `${strikeProgress * 1.08}%`,
                height: 4,
                backgroundColor: '#ef4444',
                borderRadius: 2,
                transform: 'translateY(-50%) rotate(-4deg)',
              }}
            />
          </div>

          {/* 최종 확정 (형광 핑크 대형 폰트) */}
          <div
            style={{
              fontSize: 60,
              fontWeight: 900,
              color: '#ff2e93',
              letterSpacing: '-1px',
              textShadow: '0 0 25px rgba(255, 46, 147, 0.5)',
              transform: `scale(${priceSpring})`,
              transformOrigin: 'left center',
            }}
          >
            {newPriceText}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};