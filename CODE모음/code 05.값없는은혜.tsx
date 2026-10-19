// frames=180 size=1280x720 (가로) 또는 1080x1920 (세로 변경 가능)
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { FONT } from './font';

// 색상 테마: 깊은 로열 버건디 배경 + 골드 포인트
const BG_COLOR = '#4a0814';
const GOLD = '#F5C042';
const WHITE = '#FFFFFF';

export const GraceOfferScene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1) 좌측 성경/십자가 등장 스프링
  const popObject = spring({ frame: f - 5, fps, config: { damping: 12 } });

  // 2) 노란 별 배지(100% FREE) 팝업 모션
  const badgeSpring = spring({ frame: f - 25, fps, config: { damping: 10, stiffness: 140 } });

  // 3) 대롱대롱 매달려 흔들리는 은혜 택 (Hang Tag Swing)
  const tagDrop = spring({ frame: f - 35, fps, config: { damping: 12 } });
  const tagSwing = Math.sin((f - 35) * 0.18) * Math.exp(-(f - 35) / 25) * 15;

  // 4) 빨간 취소선 긋기 모션 (프레임 65부터 쓱 그어짐)
  const strikeProgress = interpolate(f, [65, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // 5) 최종 변경된 가격(0원/은혜) 쾅! 튀어나오기
  const finalPriceSpring = spring({ frame: f - 85, fps, config: { damping: 9, stiffness: 160 } });

  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: BG_COLOR, overflow: 'hidden' }}>
      
      {/* ── 1. 상단 롤링 티커 띠 ── */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 44, background: '#111', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <div style={{
          display: 'flex', gap: 40, whiteSpace: 'nowrap', color: GOLD, fontSize: 16, fontWeight: 900,
          transform: `translateX(-${(f * 2.5) % 400}px)`
        }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i}>★ 값없는 은혜 (GRACE) ★ 내 공로 0% ★ 100% 예수 그리스도의 사랑 ★</span>
          ))}
        </div>
      </div>

      {/* ── 2. 좌측 메인 비주얼 (십자가 & 말씀 심볼) ── */}
      <div style={{
        position: 'absolute', left: 160, top: 160, width: 340, height: 340,
        transform: `scale(${popObject})`, display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {/* 황금빛 십자가 엠블럼 */}
        <div style={{
          width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,192,66,0.3) 0%, transparent 70%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.5))'
        }}>
          <span style={{ fontSize: 160, lineHeight: 1 }}>✝️</span>
        </div>
        <div style={{ position: 'absolute', bottom: -20, color: '#fde8ea', fontSize: 26, fontWeight: 800, textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
          독생자를 주신 사랑
        </div>
      </div>

      {/* ── 3. 노란 별 모양 '100% FREE' 배지 ── */}
      <div style={{
        position: 'absolute', left: 490, top: 140, transform: `scale(${badgeSpring}) rotate(-12deg)`,
        filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.4))', zIndex: 20
      }}>
        <svg width="150" height="150" viewBox="0 0 100 100">
          <polygon points="50,0 63,28 95,20 78,48 98,75 66,78 55,100 38,76 8,82 22,52 2,26 33,28" fill="#FACC15" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <span style={{ fontSize: 26, fontWeight: 900, color: '#B45309', lineHeight: 1 }}>100%</span>
          <span style={{ fontSize: 18, fontWeight: 900, color: '#B45309' }}>FREE</span>
        </div>
      </div>

      {/* ── 4. 대롱대롱 매달려 흔들리는 가격표 택 (구원 계산서) ── */}
      <div style={{
        position: 'absolute', left: 630, top: 110, width: 380,
        transformOrigin: 'top center',
        transform: `translateY(${(1 - tagDrop) * -200}px) rotate(${tagSwing}deg)`,
        zIndex: 10
      }}>
        {/* 매달린 줄과 고리 */}
        <div style={{ width: 4, height: 50, background: '#ddd', margin: '0 auto' }} />
        <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#fff', border: '3px solid #666', margin: '-7px auto 0 auto' }} />

        {/* 화이트 택 카드 */}
        <div style={{
          background: '#FFFFFF', borderRadius: 24, padding: '36px 30px 40px 30px', textAlign: 'center',
          boxShadow: '0 20px 45px rgba(0,0,0,0.5)'
        }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#334155', marginBottom: 12 }}>
            구원과 영생의 가격
          </div>

          {/* 이전 가격: 2줄 취소선 지원 (예시를 꼭 넣으세요 / 핵심은) */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontSize: 36, fontWeight: 800, color: "#94a3b8", marginBottom: 10 }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <span>예시를 꼭 넣으세요</span>
              {/* 빨간 손그림 취소선 */}
              <div style={{
                position: 'absolute', top: '50%', left: '-5%', height: 4, background: '#E11D48', borderRadius: 2,
                width: `${strikeProgress * 110}%`, transform: 'rotate(-3deg)'
              }} />
            </div>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <span>핵심은</span>
              {/* 빨간 손그림 취소선 */}
              <div style={{
                position: 'absolute', top: '50%', left: '-5%', height: 4, background: '#E11D48', borderRadius: 2,
                width: `${strikeProgress * 110}%`, transform: 'rotate(-3deg)'
              }} />
            </div>
          </div>

          {/* 최종 확정 가격: 0원 (은혜) 쾅! */}
          <div style={{
            fontSize: 68, fontWeight: 900, color: '#E11D48', lineHeight: 1.1,
            transform: `scale(${finalPriceSpring})`, transformOrigin: 'center'
          }}>
            0원 <span style={{ fontSize: 36, color: '#B45309' }}>(은혜)</span>
          </div>
        </div>

        {/* ── 5. 하단 타임 뱃지 ── */}
        <div style={{
          marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 10,
          background: '#FACC15', color: '#1E293B', padding: '8px 24px', borderRadius: 12, fontWeight: 900, fontSize: 18,
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
        }}>
          <span>지금 믿을 때</span>
          <span style={{ fontFamily: 'monospace', fontSize: 20, color: '#000' }}>에베소서 2:8</span>
        </div>
      </div>

      {/* ── 6. 하단 고정 카피 ── */}
      <div style={{ position: 'absolute', bottom: 35, left: 60, fontSize: 26, fontWeight: 800, color: '#FFFFFF', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
        너희는 그 은혜에 의하여 믿음으로 말미암아 구원을 받았으니
      </div>

    </AbsoluteFill>
  );
};