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
  line1 = '두려워말라',
  line2 = '내가 너와',
  line3 = '함께 함이라',
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // 1. 레이아웃 크기 설정 (16:9 가로 화면)
  const panelGap = width * 0.025;
  const panelW = (width - panelGap * 4) / 3;
  const panelH = height * 0.62;
  const panelY = height * 0.20;

  // [수정 1] 길쭉한 세로 직사각형 카드 규격 (신용카드 비율 1 : 1.5)
  const cardW = panelW * 0.55;
  const cardH = cardW * 1.5;

  // [수정 2] 정확한 정중앙 안착 좌표
  const targetCenterX = (panelW - cardW) / 2; // 패널의 가로 정중앙
  const targetCenterY = (panelH - cardH) / 2; // 패널의 세로 정중앙

  const cards = [
    { title: '깔끔한 등장', sub: '선명한 말씀 상자', text: line1, delay: 0 },
    { title: '부드러운 이동', sub: '천천히 중심으로', text: line2, delay: 25 },
    { title: '또렷한 강조', sub: '그림자 없이 선명하게', text: line3, delay: 50 },
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

      {/* 3단 카드 패널 */}
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
        {cards.map((card, i) => {
          // [수정 3] 각 카드별 순차적 감속 및 회전 계산
          const localFrame = Math.max(0, frame - card.delay);
          const progress = Math.min(1, localFrame / 45); // 45프레임 동안 안착
          const ease = 1 - Math.pow(1 - progress, 3);    // 부드러운 감속 곡선 (Ease-Out)
          const spin = (1 - ease) * -360;                // 한 바퀴 돌면서 0도 안착

          // 왼쪽 바깥(-cardW * 1.5)에서 패널 정중앙(targetCenterX)으로 정확히 안착
          const currentX = -cardW * 1.5 + ease * (targetCenterX - (-cardW * 1.5));

          return (
            <div
              key={i}
              style={{
                flex: 1,
                backgroundColor: '#13224d',
                borderRadius: 20,
                border: '1.5px solid #1e293b',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* 회전하며 정중앙에 '착!' 멈추는 노란색 세로 직사각형 카드 */}
              <div
                style={{
                  position: 'absolute',
                  left: currentX,
                  top: targetCenterY,
                  width: cardW,
                  height: cardH,
                  backgroundColor: '#ffc93c',
                  backgroundImage: 'linear-gradient(145deg, #fde047 0%, #eab308 100%)',
                  borderRadius: 18,
                  border: '3px solid #fef08a',
                  boxShadow: '0 12px 28px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 201, 60, 0.35)',
                  transform: `rotate(${spin}deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: 28,
                  color: '#050914',
                  writingMode: 'vertical-rl', // 세로 읽기 (글자 잘림 방지)
                  textOrientation: 'upright',
                  letterSpacing: '6px',
                }}
              >
                {card.text}
              </div>

              {/* 패널 하단 설명 라벨 */}
              <div style={{ position: 'absolute', bottom: 24, left: 24 }}>
                <div style={{ color: '#ffc93c', fontSize: 18, fontWeight: 900 }}>
                  {card.title}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 600, marginTop: 4 }}>
                  {card.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};