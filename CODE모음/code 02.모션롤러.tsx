import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const MotionThreeCardsScene: React.FC<{
  verse?: string;
  line1?: string;
  line2?: string;
  line3?: string;
}> = ({
  verse = '이사야 41:10',
  line1 = '구원',
  line2 = '믿음',
  line3 = '생명',
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const phase = (frame % 240) / 240;
  const ease = Math.min(1, phase / 0.28);
  const spin = Math.min(1, phase / 0.35) * 360;

  const panelGap = width * 0.025;
  const panelW = (width - panelGap * 4) / 3;
  const panelH = height * 0.62;
  const panelY = height * 0.20;
  const cardW = panelW * 0.70;
  const cardH = panelH * 0.36;
  const cardX = -cardW + ease * (panelW + cardW * 0.6);

  // 1번째 줄, 2번째 줄, 3번째 줄 각각 서로 다른 단어로 매핑 (카드 단어 중복 없음)
  const cards = [
    { title: '깔끔한 등장', sub: '선명한 말씀 상자', text: line1 },
    { title: '부드러운 이동', sub: '천천히 중심으로', text: line2 },
    { title: '또렷한 강조', sub: '그림자 없이 선명하게', text: line3 },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#050914',
        color: '#ffffff',
        fontFamily: "'Pretendard', sans-serif",
      }}
    >
      {/* 상단 장절 */}
      <div
        style={{
          position: 'absolute',
          top: '7%',
          width: '100%',
          textAlign: 'center',
          fontSize: 28,
          fontWeight: 900,
          color: '#ffd166',
        }}
      >
        {verse}
      </div>

      {/* 3단 카드 패널 (입력한 각 줄이 각각의 카드에 선명하게 나타남) */}
      <div
        style={{
          position: 'absolute',
          top: panelY,
          left: panelGap,
          right: panelGap,
          height: panelH,
          display: 'flex',
          gap: panelGap,
        }}
      >
        {cards.map((card, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              backgroundColor: '#13224d',
              borderRadius: 14,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* 회전하며 이동하는 노란색 말씀 카드 */}
            <div
              style={{
                position: 'absolute',
                left: cardX,
                top: panelH * 0.32,
                width: cardW,
                height: cardH,
                backgroundColor: '#ffc93c',
                borderRadius: 14,
                boxShadow: '0 0 20px rgba(255, 201, 60, 0.4)',
                transform: `rotate(${spin}deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: 26,
                color: '#050914',
              }}
            >
              {card.text}
            </div>

            {/* 패널 하단 라벨 */}
            <div style={{ position: 'absolute', bottom: 24, left: 20 }}>
              <div style={{ color: '#ffc93c', fontSize: 17, fontWeight: 900 }}>
                {card.title}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 700, marginTop: 4 }}>
                {card.sub}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
