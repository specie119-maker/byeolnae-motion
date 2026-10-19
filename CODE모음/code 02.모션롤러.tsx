import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const RollingYellowBoxScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  // 1. 구르는 물리 스프링 애니메이션 (0 -> 1 진행률)
  // damping과 stiffness로 굴러오다가 딱 멈출 때 쫀득한 감속 구현
  const rollProgress = spring({
    frame: frame - 10,
    fps,
    config: {
      damping: 14,   // 감속 마찰력
      stiffness: 70, // 굴러오는 탄성력
      mass: 1.2,     // 박스의 무게감
    },
  });

  // 2. 이동 좌표: 화면 왼쪽 바깥(-650px)에서 화면 중앙(0px)으로 굴러옴
  const translateX = interpolate(rollProgress, [0, 1], [-width * 0.7, 0]);

  // 3. 회전 각도: 구르면서 2바퀴(-720도) 회전 후 0도에서 정확히 수평 정지
  const rotateDeg = interpolate(rollProgress, [0, 1], [-720, 0]);

  // 4. 착지 순간 바닥 충격 바운스 (Y축으로 살짝 쿵 내려앉았다가 복원)
  const squashY = interpolate(
    rollProgress,
    [0.85, 0.95, 1],
    [1, 0.92, 1],
    { extrapolateRight: 'clamp' }
  );

  // 5. 텍스트 등장 (박스가 멈추는 시점 35프레임 이후 선명하게 페이드인)
  const textOpacity = interpolate(frame, [38, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const textScale = spring({
    frame: frame - 38,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, #1a1e29 0%, #0d1017 60%, #06080c 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Pretendard', sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* 바닥 그림자 (박스 위치에 맞춰 함께 따라오며 크기 조절) */}
      <div
        style={{
          position: 'absolute',
          bottom: '22%',
          width: 320,
          height: 36,
          borderRadius: '50%',
          background: 'rgba(0, 0, 0, 0.6)',
          filter: 'blur(16px)',
          transform: `translateX(${translateX}px) scaleX(${rollProgress})`,
        }}
      />

      {/* 데굴데굴 굴러오는 노란색 메인 박스 */}
      <div
        style={{
          transform: `translateX(${translateX}px) rotate(${rotateDeg}deg) scaleY(${squashY})`,
          width: 280,
          height: 280,
          backgroundColor: '#facc15', // 생생한 옐로우
          backgroundImage: 'linear-gradient(135deg, #fde047 0%, #eab308 100%)',
          borderRadius: 36,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(250, 204, 21, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '4px solid #fef08a',
          position: 'relative',
        }}
      >
        {/* 박스 안 내용: 굴러온 후 촥 나타나는 텍스트 */}
        <div
          style={{
            opacity: textOpacity,
            transform: `scale(${Math.max(0, textScale)})`,
            textAlign: 'center',
            color: '#1e293b',
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 800, color: '#854d0e', marginBottom: 6 }}>
            말씀 카드
          </div>
          <div style={{ fontSize: 34, fontWeight: 900, lineHeight: 1.25 }}>
            두려워<br />말라
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, marginTop: 10, color: '#713f12', background: 'rgba(255,255,255,0.4)', padding: '4px 14px', borderRadius: 999 }}>
            이사야 41:10
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
