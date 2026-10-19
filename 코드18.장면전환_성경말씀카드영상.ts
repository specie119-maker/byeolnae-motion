// frames=360 size=1280x720 (또는 1080x1920 세로형 변경 가능)
import {AbsoluteFill, Sequence, useVideoConfig} from 'remotion';
import {TransitionSeries, linearTiming, springTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {dissolve} from '@remotion/transitions/dissolve';
import {iris} from '@remotion/transitions/iris';
import {FONT} from './font'; // 또는 명조 계열 폰트

// ── 1. 말씀 데이터 (여기만 바꾸면 매일 새로운 말씀 영상 완성) ──
const VERSES = [
  {
    topic: '오늘의 묵상',
    scripture: '두려워하지 말라 내가 너와 함께 함이라',
    reference: '이사야 41:10',
    bg: '#0F172A', // 딥 네이비
    textColor: '#F8FAFC',
    pointColor: '#FCD34D', // 웜 골드
  },
  {
    topic: '위로와 평안',
    scripture: '놀라지 말라 나는 네 하나님이 됨이라',
    reference: '이사야 41:10',
    bg: '#1E293B',
    textColor: '#F8FAFC',
    pointColor: '#7DF9FF', // 은은한 시안
  },
  {
    topic: '능력과 승리',
    scripture: '내가 너를 굳세게 하리라 참으로 너를 도와주리라',
    reference: '이사야 41:10',
    bg: '#1E1B4B', // 딥 퍼플 네이비
    textColor: '#FFFFFF',
    pointColor: '#FCD34D',
  },
  {
    topic: '마침 기도',
    scripture: '참으로 나의 의로운 오른손으로 너를 붙들리라',
    reference: '이사야 41:10 (아멘)',
    bg: '#020617', // 밤하늘 톤
    textColor: '#F8FAFC',
    pointColor: '#FDE68A',
  },
];

const SCENE_FRAMES = 90; // 구절을 충분히 묵상할 시간 (약 3초)
const TRANS_FRAMES = 20; // 부드러운 전환 시간

// ── 2. 말씀 카드 컴포넌트 ──
const BibleCard = ({verse}: {verse: (typeof VERSES)[number]}) => {
  return (
    <AbsoluteFill
      style={{
        background: verse.bg,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT,
        color: verse.textColor,
        padding: '0 80px',
        textAlign: 'center',
      }}
    >
      {/* 묵상 분위기를 돕는 은은한 비네팅 그라데이션 */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.7) 100%)',
        }}
      />

      {/* 주제 뱃지 */}
      <div
        style={{
          zIndex: 1,
          fontSize: 24,
          fontWeight: 700,
          color: verse.pointColor,
          letterSpacing: '0.15em',
          marginBottom: 32,
          border: `1px solid ${verse.pointColor}66`,
          padding: '8px 24px',
          borderRadius: 30,
          background: 'rgba(0,0,0,0.3)',
        }}
      >
        {verse.topic}
      </div>

      {/* 말씀 본문 */}
      <div
        style={{
          zIndex: 1,
          fontSize: 48,
          fontWeight: 800,
          lineHeight: 1.45,
          wordBreak: 'keep-all',
          marginBottom: 36,
          textShadow: '0 4px 16px rgba(0,0,0,0.6)',
        }}
      >
        "{verse.scripture}"
      </div>

      {/* 장 / 절 출처 */}
      <div
        style={{
          zIndex: 1,
          fontSize: 28,
          fontWeight: 600,
          opacity: 0.8,
          letterSpacing: '0.05em',
        }}
      >
        — {verse.reference} —
      </div>
    </AbsoluteFill>
  );
};

// ── 3. 말씀 시퀀스 조립 ──
export const BibleWordScene = () => {
  const spr = springTiming({config: {damping: 180}, durationInFrames: TRANS_FRAMES});
  const lin = linearTiming({durationInFrames: TRANS_FRAMES});

  return (
    <AbsoluteFill style={{background: '#020617'}}>
      <TransitionSeries>
        {/* 1절: 시작 */}
        <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}>
          <BibleCard verse={VERSES[0]} />
        </TransitionSeries.Sequence>

        {/* 1 -> 2: 부드럽게 스며드는 페이드(fade) */}
        <TransitionSeries.Transition presentation={fade()} timing={lin} />

        {/* 2절 */}
        <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}>
          <BibleCard verse={VERSES[1]} />
        </TransitionSeries.Sequence>

        {/* 2 -> 3: 말씀이 이어지듯 옆에서 밀려오는 슬라이드(slide) */}
        <TransitionSeries.Transition
          presentation={slide({direction: 'from-right'})}
          timing={spr}
        />

        {/* 3절 */}
        <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}>
          <BibleCard verse={VERSES[2]} />
        </TransitionSeries.Sequence>

        {/* 3 -> 4: 깊은 은혜로 묵상되듯 번지는 디졸브(dissolve) */}
        <TransitionSeries.Transition presentation={dissolve({})} timing={lin} />

        {/* 4절: 마지막 확신과 아멘 */}
        <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}>
          <BibleCard verse={VERSES[3]} />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* 우측 하단 채널/묵상 브랜딩 */}
      <div
        style={{
          position: 'absolute',
          right: 40,
          bottom: 30,
          fontFamily: FONT,
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: '0.12em',
          color: 'rgba(255,255,255,0.6)',
          zIndex: 10,
        }}
      >
        DAILY BIBLE MEDITATION
      </div>
    </AbsoluteFill>
  );
};