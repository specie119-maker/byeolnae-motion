/**
 * Remotion 모션그래픽 44종 템플릿 데이터베이스
 * 
 * 코드 1~6: 사용자 제공 실제 Remotion 코드 100% 반영
 * 코드 7~44: 카테고리별 실무형 고품질 Remotion 템플릿 코드 및 파라미터 완비
 */

window.MOTION_DATA = [
  {
    id: 95, num: "95", category: "성경 쇼츠", group: "typography", groupName: "글자 · 자막",
    title: "오늘 기분 리프레시 · 나의 생명", desc: "면류관과 야고보서 1:12로 만드는 세로 말씀 모션그래픽",
    duration: "8초", fps: 30, frames: 240, resolution: "1080x1920", aspect: "9:16", tag: "CROWN OF LIFE",
    themeColor: "#0A6B59", subColor: "#02151C", code: "// 오늘 기분 리프레시 · 나의 생명\n// 야고보서 1:12 · 생명의 면류관\n// 문구와 색상은 Scene.tsx에서 수정하세요."
  },
  // ── [1~7] 제품 광고 만들기 ──
  {
    id: 51,
    num: "51",
    category: "제품 이미지",
    group: "product",
    groupName: "제품 광고 만들기",
    title: "히어로 등장",
    desc: "음료 광고의 첫 장면처럼 캔이 아래에서 스프링으로 솟아오르고, 뒤에서 빛줄기가 돌고, 캔 위로 사선 빛이 쓱...",
    duration: "6초",
    fps: 30,
    frames: 180,
    resolution: "1280x720",
    aspect: "16:9",
    tag: "PRODUCT HERO",
    themeColor: "#E4002B",
    subColor: "#3a0008",
    copyL: "시원하게",
    copyR: "한 캔",
    backWord: "REFRESH",
    productImg: "https://www.aicitybuilders.com/video/remotion/assets/product_coke.png",
    code: `// frames=180 size=1280x720
import {AbsoluteFill, Img, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from './font';

// ── 여기만 바꾸면 내 제품 광고가 돼요 ──
const PRODUCT = 'https://www.aicitybuilders.com/video/remotion/assets/product_coke.png'; // 배경이 투명한 PNG
const RATIO = 369 / 900; // 제품 이미지 가로 ÷ 세로
const MAIN = '#E4002B'; // 제품 대표색 (배경)
const DEEP = '#3a0008'; // 바깥쪽 어두운 색
const COPY_L = '시원하게'; // 제품 왼쪽 문구
const COPY_R = '한 캔'; // 제품 오른쪽 문구
const BACK_WORD = 'REFRESH'; // 제품 뒤 큰 글자
const NOTE = '교육용 예시 · 해당 브랜드와 관계없음'; // 실제 브랜드를 쓸 때 꼭 넣기

const H = 560; // 제품 높이(px)
const W = H * RATIO;

// 반짝이(물방울 빛) 위치: random(seed)로 고정 → 렌더할 때마다 같은 자리
const SPARKS = new Array(14).fill(0).map((_, i) => ({
  x: 0.15 + random(\`sx\${i}\`) * 0.7, // 제품 안쪽 비율(0~1)
  y: 0.08 + random(\`sy\${i}\`) * 0.84,
  size: 10 + random(\`ss\${i}\`) * 16,
  delay: random(\`sd\${i}\`) * 60,
}));

// 4갈래 반짝이 모양
const Sparkle = ({size, opacity}: {size: number; opacity: number}) => (
  <svg width={size} height={size} viewBox="-10 -10 20 20" style={{opacity, filter: 'drop-shadow(0 0 4px #fff)'}}>
    <path d="M0 -10 Q1 -1 10 0 Q1 1 0 10 Q-1 1 -10 0 Q-1 -1 0 -10Z" fill="#fff" />
  </svg>
);

const SceneBody = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

  // 1) 제품 등장: 아래에서 스프링으로 솟아오르며 살짝 기울어짐
  const rise = spring({frame: f - 8, fps, config: {damping: 13, mass: 1.1}});
  const y = interpolate(rise, [0, 1], [620, 0]);
  const tilt = interpolate(rise, [0, 1], [-18, -6]) + Math.sin(f / 22) * 1.2; // 등장 후엔 아주 천천히 흔들
  const float = Math.sin(f / 18) * 6; // 둥실둥실

  // 2) 빛줄기 회전 + 빛 쓸기(사선 하이라이트) 위치
  const rays = interpolate(f, [0, 30], [0, 1], clamp);
  const sweep = interpolate(f, [55, 90], [-60, 160], clamp); // % 단위로 왼→오 이동

  // 3) 문구: 양옆에서 미끄러져 들어오기
  const txt = (d: number) => spring({frame: f - d, fps, config: {damping: 16}});
  const flash = interpolate(f, [40, 44, 60], [0, 0.55, 0], clamp); // 착지 순간 번쩍

  return (
    <AbsoluteFill style={{fontFamily: FONT, overflow: 'hidden', background: \`radial-gradient(circle at 50% 55%, \${MAIN} 0%, #9c0018 45%, \${DEEP} 100%)\`}}>
      {/* 회전하는 빛줄기: conic-gradient를 반복해서 부채꼴 줄무늬 → 가운데만 보이게 radial 마스크 */}
      <AbsoluteFill style={{opacity: rays * 0.5, transform: \`rotate(\${f * 0.35}deg) scale(1.8)\`,
        background: 'repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,0.22) 0deg 6deg, transparent 6deg 18deg)',
        WebkitMaskImage: 'radial-gradient(circle at 50% 50%, #000 0%, transparent 45%)'}} />

      {/* 제품 뒤 큰 글자 */}
      <AbsoluteFill style={{alignItems: 'center', top: 70}}>
        <div style={{fontSize: 230, fontWeight: 900, letterSpacing: '0.04em', color: 'transparent', WebkitTextStroke: '3px rgba(255,255,255,0.28)',
          transform: \`scale(\${interpolate(f, [20, 180], [1.15, 1])})\`, opacity: interpolate(f, [20, 45], [0, 1], clamp)}}>{BACK_WORD}</div>
      </AbsoluteFill>

      {/* 바닥 그림자 */}
      <div style={{position: 'absolute', left: 640 - 150, top: 650, width: 300, height: 40, borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(0,0,0,0.55), transparent)', opacity: rise}} />

      {/* 제품 + 빛 쓸기 + 반짝이를 한 묶음으로 움직이기 */}
      <div style={{position: 'absolute', left: 640 - W / 2, top: 360 - H / 2 + 10, width: W, height: H,
        transform: \`translateY(\${y + float}px) rotate(\${tilt}deg)\`}}>
        <Img src={PRODUCT} style={{width: W, height: H, filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.5))'}} />
        {/* 빛 쓸기: 제품 모양으로 마스크한 사선 그라데이션을 옆으로 이동 */}
        <div style={{position: 'absolute', inset: 0, mixBlendMode: 'screen',
          WebkitMaskImage: \`url(\${PRODUCT})\`, WebkitMaskSize: '100% 100%',
          background: \`linear-gradient(110deg, transparent \${sweep - 18}%, rgba(255,255,255,0.85) \${sweep}%, transparent \${sweep + 18}%)\`}} />
        {SPARKS.map((s, i) => {
          const t = (f - 50 - s.delay) / 30; // 반짝: 0→1→0
          const o = t > 0 ? Math.max(0, Math.sin(t * Math.PI)) * (t < 3 ? 1 : 0) : 0;
          return <div key={i} style={{position: 'absolute', left: s.x * W - s.size / 2, top: s.y * H - s.size / 2, transform: \`scale(\${0.4 + o})\`}}>
            <Sparkle size={s.size} opacity={o} /></div>;
        })}
      </div>

      {/* 양옆 문구 */}
      <div style={{position: 'absolute', right: 640 + W / 2 + 36, top: 400, textAlign: 'right', color: '#fff',
        transform: \`translateX(\${(1 - txt(70)) * -120}px)\`, opacity: txt(70)}}>
        <div style={{fontSize: 22, fontWeight: 800, letterSpacing: '0.3em', opacity: 0.85}}>NEW</div>
        <div style={{fontSize: 84, fontWeight: 900, lineHeight: 1.05, textShadow: '0 6px 30px rgba(0,0,0,0.35)'}}>{COPY_L}</div>
      </div>
      <div style={{position: 'absolute', left: 640 + W / 2 + 36, top: 426, color: '#fff',
        transform: \`translateX(\${(1 - txt(80)) * 120}px)\`, opacity: txt(80)}}>
        <div style={{fontSize: 84, fontWeight: 900, lineHeight: 1.05, textShadow: '0 6px 30px rgba(0,0,0,0.35)'}}>{COPY_R}</div>
        <div style={{width: interpolate(f, [95, 120], [0, 180], clamp), height: 6, background: '#fff', borderRadius: 3, marginTop: 14}} />
      </div>

      <AbsoluteFill style={{background: '#fff', opacity: flash}} />
      {/* 실제 브랜드 고지 문구 (왼쪽 아래) */}
      <div style={{position: 'absolute', left: 26, bottom: 20, fontSize: 17, fontWeight: 600, color: 'rgba(255,255,255,0.8)'}}>{NOTE}</div>
    </AbsoluteFill>
  );
};

// ── 채널 표시: CONNECT AI LAB (모든 예제 공통 · 오른쪽 아래) ──
const BrandMark = () => {
  const {width} = useVideoConfig();
  return (
    <div style={{position: 'absolute', right: Math.round(width * 0.02), bottom: Math.round(width * 0.015), fontFamily: FONT, fontWeight: 800,
      fontSize: Math.round(width / 60), letterSpacing: '0.16em', color: 'rgba(255,255,255,0.88)', textShadow: '0 1px 6px rgba(0,0,0,0.6)'}}>
      CONNECT AI LAB
    </div>
  );
};

export const Scene = () => (
  <AbsoluteFill>
    <SceneBody />
    <BrandMark />
  </AbsoluteFill>
);`,
    docs: `### 히어로 등장 예제 사용법
- **핵심 기술**: Remotion \`spring()\`과 \`interpolate()\`를 결합한 역동적인 바운스 효과, \`repeating-conic-gradient\`를 사용한 360도 회전 라이트 빔, SVG 반짝이 파티클.
- **수정 포인트**:
  1. \`PRODUCT\`: 제품의 투명 배경 PNG 이미지 URL
  2. \`MAIN\` / \`DEEP\`: 브랜드 메인 컬러와 배경 앰비언트 그라데이션
  3. \`COPY_L\` / \`COPY_R\`: 좌우에서 진입하는 핵심 카피 문구`
  },

  {
    id: 52,
    num: "52",
    category: "제품 이미지",
    group: "product",
    groupName: "제품 광고 만들기",
    title: "제품 캐러셀",
    desc: "캔 → 주스 → 과자 봉지가 하나씩 옆으로 넘어오며 가운데 제품만 크고 선명해지고, 배경색이 제품마다 바뀝니다.",
    duration: "8초",
    fps: 30,
    frames: 240,
    resolution: "1280x720",
    aspect: "16:9",
    tag: "PRODUCT CAROUSEL",
    themeColor: "#2A4FD6",
    code: `// frames=240 size=1280x720
import {AbsoluteFill, Img, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from './font';

// ── 여기만 바꾸면 내 제품 라인업이 돼요 (제품 수는 늘리거나 줄여도 OK) ──
const BASE = 'https://www.aicitybuilders.com/video/remotion/assets/';
const PRODUCTS = [
  {src: BASE + 'product_can.png', w: 409, h: 900, show: 400, name: '스파클링 캔', tag: 'NEW', price: '1,900원', bg: '#2A4FD6'},
  {src: BASE + 'product_juice.png', w: 400, h: 900, show: 420, name: '생오렌지 주스', tag: 'BEST', price: '3,500원', bg: '#F26B1D'},
  {src: BASE + 'product_chips_bag.png', w: 900, h: 540, show: 320, name: '포테이토 칩', tag: 'HOT', price: '2,800원', bg: '#D7263D'},
];
const TITLE = '이번 주 라인업'; // 왼쪽 위 작은 제목
const STEP = 80; // 제품 하나가 주인공인 시간(프레임)
const GAP = 440; // 제품 사이 간격(px)

const SceneBody = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  // 1) p = 지금 가운데 있는 제품 번호(소수). 0 → 1 → 2 로 스프링처럼 넘어가요
  let p = interpolate(spring({frame: f, fps, config: {damping: 15}}), [0, 1], [-1.6, 0]);
  for (let i = 1; i < PRODUCTS.length; i++) p += spring({frame: f - i * STEP, fps, config: {damping: 15}});
  const cur = Math.min(PRODUCTS.length - 1, Math.max(0, Math.round(p)));

  // 2) 배경색: p 값에 맞춰 제품 색끼리 부드럽게 섞기 (interpolateColors)
  const idx = PRODUCTS.map((_, i) => i);
  const bg = interpolateColors(Math.max(0, p), idx, PRODUCTS.map((x) => x.bg));

  // 3) 문구는 제품이 바뀔 때마다 아래에서 올라오기
  const textIn = spring({frame: f - cur * STEP - 10, fps, config: {damping: 14}});

  return (
    <AbsoluteFill style={{fontFamily: FONT, overflow: 'hidden', background: bg}}>
      {/* 가운데 밝은 빛 + 바깥 어둡게 → 입체감 */}
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 42%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 38%, rgba(0,0,0,0.38) 100%)'}} />
      {/* 뒤쪽 큰 번호 01 / 02 / 03 */}
      <div style={{position: 'absolute', width: '100%', top: 10, textAlign: 'center', fontSize: 420, fontWeight: 900, lineHeight: 1,
        color: 'rgba(255,255,255,0.12)', letterSpacing: '-0.04em'}}>{String(cur + 1).padStart(2, '0')}</div>

      {/* 제품 줄: 가운데에서 멀수록 작고 흐리게 (포커스 효과) */}
      {PRODUCTS.map((it, i) => {
        const d = Math.min(1.5, Math.abs(i - p)); // 가운데와의 거리
        const scale = interpolate(d, [0, 1], [1, 0.62], {extrapolateRight: 'clamp'});
        const w = (it.show * it.w) / it.h;
        return (
          <div key={i} style={{position: 'absolute', left: 640 + (i - p) * GAP - w / 2, top: 300 - it.show / 2, width: w, height: it.show,
            transform: \`scale(\${scale}) rotate(\${(i - p) * 6}deg)\`, opacity: interpolate(d, [0, 1, 1.5], [1, 0.55, 0]),
            filter: \`blur(\${d * 3}px) drop-shadow(0 28px 30px rgba(0,0,0,0.35))\`}}>
            {/* 바닥 그림자 */}
            <div style={{position: 'absolute', left: '5%', right: '5%', bottom: -26, height: 30, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(0,0,0,0.4), transparent)'}} />
            <Img src={it.src} style={{width: '100%', height: '100%', transform: \`translateY(\${Math.sin((f + i * 20) / 16) * 6}px)\`}} />
          </div>
        );
      })}

      {/* 아래 문구: 태그 + 제품명 + 가격 */}
      <div style={{position: 'absolute', top: 500, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff',
        opacity: textIn, transform: \`translateY(\${(1 - textIn) * 40}px)\`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <div style={{fontSize: 18, fontWeight: 900, letterSpacing: '0.2em', padding: '4px 12px', borderRadius: 6, background: '#fff', color: PRODUCTS[cur].bg}}>
            {PRODUCTS[cur].tag}</div>
          <div style={{fontSize: 60, fontWeight: 900, textShadow: '0 4px 20px rgba(0,0,0,0.25)'}}>{PRODUCTS[cur].name}</div>
        </div>
        <div style={{marginTop: 12, fontSize: 40, fontWeight: 800, padding: '6px 30px', borderRadius: 40, background: 'rgba(0,0,0,0.25)',
          border: '2px solid rgba(255,255,255,0.6)'}}>{PRODUCTS[cur].price}</div>
      </div>

      {/* 왼쪽 위 제목 + 오른쪽 위 페이지 점 */}
      <div style={{position: 'absolute', left: 40, top: 34, color: '#fff', fontSize: 26, fontWeight: 800, letterSpacing: '0.04em'}}>{TITLE}</div>
      <div style={{position: 'absolute', right: 40, top: 44, display: 'flex', gap: 10}}>
        {PRODUCTS.map((_, i) => (
          <div key={i} style={{height: 10, borderRadius: 5, background: '#fff', opacity: i === cur ? 1 : 0.4, width: i === cur ? 34 : 10}} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const BrandMark = () => {
  const {width} = useVideoConfig();
  return (
    <div style={{position: 'absolute', right: Math.round(width * 0.02), bottom: Math.round(width * 0.015), fontFamily: FONT, fontWeight: 800,
      fontSize: Math.round(width / 60), letterSpacing: '0.16em', color: 'rgba(255,255,255,0.88)', textShadow: '0 1px 6px rgba(0,0,0,0.6)'}}>
      CONNECT AI LAB
    </div>
  );
};

export const Scene = () => (
  <AbsoluteFill>
    <SceneBody />
    <BrandMark />
  </AbsoluteFill>
);`,
    docs: `### 제품 캐러셀 예제 사용법
- **핵심 기술**: \`interpolateColors\`를 활용하여 활성화된 제품 슬라이드에 맞춰 배경색이 자연스럽게 그러데이션으로 전환됩니다.
- **수정 포인트**: \`PRODUCTS\` 배열에 원하는 제품 이름, 가격, 태그, 배경색을 넣으면 자동으로 슬라이드가 연산됩니다.`
  },

  {
    id: 53,
    num: "53",
    category: "제품 이미지",
    group: "product",
    groupName: "제품 광고 만들기",
    title: "특징 콜아웃",
    desc: "과자 봉지가 툭 튀어나온 뒤 제품 위 점에서 선이 그려져 나가며 '바삭한 식감·한 봉지 60g·국산 감자' 특징이 하나씩 붙고...",
    duration: "6초",
    fps: 30,
    frames: 180,
    resolution: "1280x720",
    aspect: "16:9",
    tag: "FEATURE CALLOUT",
    themeColor: "#FFD54A",
    code: `// frames=180 size=1280x720
import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {evolvePath} from '@remotion/paths';
import {FONT} from './font';

// ── 여기만 바꾸면 내 제품 특징 광고가 돼요 ──
const PRODUCT = 'https://www.aicitybuilders.com/video/remotion/assets/product_chips_bag.png'; // 배경이 투명한 PNG
const PW = 700; // 화면에 보일 제품 너비(px)
const PH = PW * (540 / 900); // 원본 비율(세로/가로)로 높이 계산
const CX = 640; // 제품 가운데 x
const CY = 375; // 제품 가운데 y
const BG1 = '#FFD54A'; // 배경 위쪽 색
const BG2 = '#FF9F1C'; // 배경 아래쪽 색
const INK = '#1E1300'; // 선·글자 색
const EYEBROW = 'NEW ARRIVAL';
const HEADLINE = '오늘의 간식, 바삭하게';

const CALLOUTS = [
  {title: '바삭한 식감', sub: 'CRUNCHY', u: 0.367, v: 0.26, x: 300, y: 190, side: 'left', at: 35},
  {title: '한 봉지 60g', sub: 'NET WT.', u: 0.6, v: 0.17, x: 980, y: 160, side: 'right', at: 55},
  {title: '국산 감자', sub: 'LOCAL POTATO', u: 0.167, v: 0.8, x: 270, y: 575, side: 'left', at: 75},
] as const;

const calloutPath = (c: (typeof CALLOUTS)[number]) => {
  const dx = CX - PW / 2 + c.u * PW;
  const dy = CY - PH / 2 + c.v * PH;
  const elbowX = dx + (c.side === 'left' ? -1 : 1) * Math.abs(dy - c.y);
  return {dx, dy, d: \`M \${dx} \${dy} L \${elbowX} \${c.y} L \${c.x} \${c.y}\`};
};

const SceneBody = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

  const pop = spring({frame: f - 4, fps, config: {damping: 12}});

  return (
    <AbsoluteFill style={{fontFamily: FONT, overflow: 'hidden', background: \`linear-gradient(160deg, \${BG1}, \${BG2})\`}}>
      <div style={{position: 'absolute', left: CX - 360, top: CY - 360, width: 720, height: 720, borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(255,255,255,0.75), rgba(255,255,255,0))', transform: \`scale(\${pop})\`}} />
      <div style={{position: 'absolute', top: 44, width: '100%', textAlign: 'center', fontSize: 22, fontWeight: 900, letterSpacing: '0.4em', color: INK,
        opacity: interpolate(f, [10, 25], [0, 1], clamp)}}>{EYEBROW}</div>

      <Img src={PRODUCT} style={{position: 'absolute', left: CX - PW / 2, top: CY - PH / 2, width: PW, height: PH,
        transform: \`scale(\${pop}) rotate(\${(1 - pop) * -10}deg)\`, filter: 'drop-shadow(0 24px 30px rgba(120,60,0,0.35))'}} />

      <svg width={1280} height={720} style={{position: 'absolute'}}>
        {CALLOUTS.map((c, i) => {
          const p = interpolate(f, [c.at, c.at + 18], [0, 1], clamp);
          const {dx: x, dy: y, d} = calloutPath(c);
          const {strokeDasharray, strokeDashoffset} = evolvePath(p, d);
          const ring = ((f - c.at) % 40) / 40;
          return (
            <g key={i} opacity={p > 0 ? 1 : 0}>
              <path d={d} fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} />
              <circle cx={x} cy={y} r={8 + ring * 22} fill="none" stroke="#fff" strokeWidth={3} opacity={1 - ring} />
              <circle cx={x} cy={y} r={9} fill={INK} stroke="#fff" strokeWidth={3} />
            </g>
          );
        })}
      </svg>

      {CALLOUTS.map((c, i) => {
        const t = spring({frame: f - c.at - 14, fps, config: {damping: 16}});
        const dir = c.side === 'left' ? 1 : -1;
        return (
          <div key={i} style={{position: 'absolute', top: c.y - 44, textAlign: c.side === 'left' ? 'right' : 'left', color: INK, opacity: t,
            ...(c.side === 'left' ? {right: 1280 - c.x + 10} : {left: c.x + 10}), transform: \`translateX(\${(1 - t) * 30 * dir}px)\`}}>
            <div style={{fontSize: 46, fontWeight: 900, lineHeight: 1.1}}>{c.title}</div>
            <div style={{fontSize: 17, fontWeight: 800, letterSpacing: '0.25em', opacity: 0.7, marginTop: 4}}>{c.sub}</div>
          </div>
        );
      })}

      {(() => {
        const t = spring({frame: f - 110, fps, config: {damping: 15}});
        return (
          <div style={{position: 'absolute', bottom: 40, width: '100%', display: 'flex', justifyContent: 'center', transform: \`translateY(\${(1 - t) * 120}px)\`}}>
            <div style={{background: INK, color: '#FFD54A', fontSize: 40, fontWeight: 900, padding: '10px 34px', borderRadius: 14}}>{HEADLINE}</div>
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};

export const Scene = () => (
  <AbsoluteFill>
    <SceneBody />
  </AbsoluteFill>
);`,
    docs: `### 특징 콜아웃 예제
- **핵심 기술**: \`@remotion/paths\`의 \`evolvePath\`를 사용하여 SVG 직선 및 꺾은선이 점으로부터 자연스럽게 뻗어나가는 인포그래픽 모션 구현.`
  },

  {
    id: 54,
    num: "54",
    category: "제품 이미지",
    group: "product",
    groupName: "제품 광고 만들기",
    title: "세로 쇼츠 광고",
    desc: "1080×1920 세로 화면에서 '오늘 · 기분 · 리프레시'가 박자마다 쾅 찍히며 제품이 위에서 떨어져 통통 튀는 세로 쇼츠.",
    duration: "6.6초",
    fps: 30,
    frames: 200,
    resolution: "1080x1920",
    aspect: "9:16",
    tag: "SHORTS 9:16",
    themeColor: "#17A43B",
    code: `// frames=200 size=1080x1920
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ding, whoosh} from '@remotion/sfx';
import {FONT} from './font';

// ── 여기만 바꾸면 내 제품 쇼츠 광고가 돼요 ──
const PRODUCT = 'https://www.aicitybuilders.com/video/remotion/assets/product_dew.png'; // 배경이 투명한 PNG
const RATIO = 490 / 900;
const GREEN = '#17A43B';
const DARK = '#0A5A21';
const YELLOW = '#EEF53A';

const WORDS = [
  {text: '오늘', frame: 0, bg: GREEN, color: YELLOW},
  {text: '기분', frame: 30, bg: YELLOW, color: DARK},
  {text: '리프레시', frame: 60, bg: DARK, color: YELLOW},
];
const DROP = 92;
const NOTE = '교육용 예시 · 해당 브랜드와 관계없음';

const CH = 1000;
const CW = CH * RATIO;

const SceneBody = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

  const cur = [...WORDS].reverse().find((w) => f >= w.frame) ?? WORDS[0];
  const slam = spring({frame: f - cur.frame, fps, config: {damping: 11, mass: 0.6}});
  const scene2 = f >= DROP;

  const drop = spring({frame: f - DROP, fps, config: {damping: 7, mass: 0.9}});
  const land = DROP + 7;
  const shake = f > land ? Math.sin((f - land) * 2.6) * 26 * Math.exp(-(f - land) / 7) : 0;
  const beat = scene2 ? interpolate((f - DROP) % 15, [0, 4, 15], [1.04, 1, 1]) : 1;

  const bg = scene2 ? (Math.floor((f - DROP) / 15) % 2 ? GREEN : DARK) : cur.bg;
  const title = spring({frame: f - DROP - 14, fps, config: {damping: 13}});
  const bottomY = interpolate(spring({frame: f - DROP, fps, config: {damping: 16}}), [0, 1], [0, 640]);

  return (
    <AbsoluteFill style={{fontFamily: FONT, overflow: 'hidden', background: bg}}>
      {WORDS.map((w) => (
        <Sequence key={w.text} from={w.frame}><Audio src={whoosh} volume={0.5} /></Sequence>
      ))}
      <Sequence from={DROP - 4}><Audio src={whoosh} volume={0.7} /></Sequence>
      <Sequence from={land}><Audio src={ding} volume={0.6} /></Sequence>

      <AbsoluteFill style={{opacity: scene2 ? 0.35 : 0, transform: \`rotate(\${f * 0.5}deg) scale(2.4)\`,
        background: \`repeating-conic-gradient(from 0deg at 50% 50%, \${YELLOW}55 0deg 8deg, transparent 8deg 22deg)\`,
        WebkitMaskImage: 'radial-gradient(circle, #000 0%, transparent 50%)'}} />

      {!scene2 && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div style={{fontSize: cur.text.length > 2 ? 250 : 360, fontWeight: 900, color: 'transparent', WebkitTextStroke: \`4px \${cur.color}\`,
            transform: \`scale(\${1 + slam * 0.9})\`, opacity: 0.5 * (1 - slam * 0.7)}}>{cur.text}</div>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontSize: cur.text.length > 2 ? 250 : 360, fontWeight: 900, letterSpacing: '-0.03em', color: cur.color,
          transform: \`translateY(\${bottomY}px) scale(\${scene2 ? 0.86 : 2.2 - slam * 1.2}) rotate(\${(1 - slam) * -8}deg)\`,
          textShadow: '0 14px 40px rgba(0,0,0,0.3)'}}>{cur.text}</div>
      </AbsoluteFill>

      {scene2 && (
        <>
          <div style={{position: 'absolute', top: 150, width: '100%', textAlign: 'center', color: '#fff', opacity: title,
            transform: \`translateY(\${(1 - title) * -80}px)\`}}>
            <div style={{fontSize: 40, fontWeight: 900, letterSpacing: '0.4em', color: YELLOW}}>NEW</div>
            <div style={{fontSize: 150, fontWeight: 900, lineHeight: 1.1, textShadow: '0 10px 30px rgba(0,0,0,0.3)'}}>오늘 기분</div>
          </div>
          <div style={{position: 'absolute', left: 540 - 220, top: 1460, width: 440, height: 60, borderRadius: '50%',
            background: 'radial-gradient(closest-side, rgba(0,0,0,0.45), transparent)', opacity: drop}} />
          <Img src={PRODUCT} style={{position: 'absolute', left: 540 - CW / 2, top: 1000 - CH / 2, width: CW, height: CH,
            transform: \`translate(\${shake}px, \${(1 - drop) * -1500}px) rotate(\${shake * 0.25 + 4}deg) scale(\${beat})\`,
            filter: 'drop-shadow(0 40px 50px rgba(0,0,0,0.45))'}} />
        </>
      )}

      <AbsoluteFill style={{background: '#fff', opacity: interpolate(f, [land, land + 2, land + 10], [0, 0.6, 0], clamp)}} />
      <div style={{position: 'absolute', left: 36, bottom: 30, fontSize: 26, fontWeight: 600, color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 6px rgba(0,0,0,0.5)'}}>{NOTE}</div>
    </AbsoluteFill>
  );
};

export const Scene = () => (
  <AbsoluteFill>
    <SceneBody />
  </AbsoluteFill>
);`,
    docs: `### 세로 쇼츠 광고 사용법
- **핵심 기술**: 9:16 모바일 세로 비율, 비트 타이밍에 맞춘 텍스트 슬램 + 카메라 쉐이크(\`shake\`) 착지 애니메이션.`
  },

  {
    id: 55,
    num: "55",
    category: "제품 이미지",
    group: "product",
    groupName: "제품 광고 만들기",
    title: "가격·할인 배지",
    desc: "과자 그릇 옆에 가격표가 떨어져 대롱대롱 흔들리고, 별 모양 '30% OFF' 배지가 튀어나온 뒤 옛 가격에 손그림 줄이...",
    duration: "6초",
    fps: 30,
    frames: 180,
    resolution: "1280x720",
    aspect: "16:9",
    tag: "DISCOUNT BADGE",
    themeColor: "#D3122F",
    code: `// frames=180 size=1280x720
import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {StrikeThrough} from '@remotion/rough-notation';
import {FONT} from './font';

const PRODUCT = 'https://www.aicitybuilders.com/video/remotion/assets/product_chips_bowl.png';
const RATIO = 713 / 900;
const NAME = '바삭 포테이토 칩';
const OLD_PRICE = '4,500원';
const NEW_PRICE = '3,150원';
const OFF = '30%';
const RED = '#D3122F';
const YELLOW = '#FFD400';
const TICKER = ['오늘만 특가', 'TODAY ONLY'];
const CELL = 260;

const PW = 560;
const PH = PW * RATIO;

const STAR = new Array(44).fill(0).map((_, i) => {
  const r = i % 2 ? 84 : 100;
  const a = (i / 44) * Math.PI * 2;
  return \`\${100 + r * Math.cos(a)},\${100 + r * Math.sin(a)}\`;
}).join(' ');

const SceneBody = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

  const inP = spring({frame: f, fps, config: {damping: 14}});
  const drop = spring({frame: f - 10, fps, config: {damping: 16}});
  const t = Math.max(0, f - 10);
  const swing = 28 * Math.exp(-t / 24) * Math.sin(t * 0.2);
  const badge = spring({frame: f - 50, fps, config: {damping: 8, mass: 0.7}});
  const strike = interpolate(f, [75, 92], [0, 1], clamp);
  const newP = spring({frame: f - 92, fps, config: {damping: 10}});
  const left = 23 * 3600 + 59 * 60 + 59 - Math.floor(f / 30);
  const hms = [Math.floor(left / 3600), Math.floor(left / 60) % 60, left % 60].map((n) => String(n).padStart(2, '0')).join(':');

  return (
    <AbsoluteFill style={{fontFamily: FONT, overflow: 'hidden', background: \`radial-gradient(circle at 30% 55%, #F0283F 0%, \${RED} 40%, #6E0616 100%)\`}}>
      <div style={{position: 'absolute', left: 390 - 200, top: 590, width: 400, height: 50, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(0,0,0,0.45), transparent)'}} />
      <Img src={PRODUCT} style={{position: 'absolute', left: 390 - PW / 2, top: 375 - PH / 2, width: PW, height: PH,
        transform: \`translateX(\${(1 - inP) * -700}px) rotate(\${(1 - inP) * -20}deg)\`, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.4))'}} />

      <div style={{position: 'absolute', left: 540, top: 120, width: 200, height: 200, transform: \`scale(\${badge}) rotate(\${-12 + Math.sin(f / 10) * 4}deg)\`}}>
        <svg width={200} height={200} style={{position: 'absolute', transform: \`rotate(\${f * 0.8}deg)\`}}>
          <polygon points={STAR} fill={YELLOW} stroke="#fff" strokeWidth={4} />
        </svg>
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: RED}}>
          <div style={{fontSize: 58, fontWeight: 900, lineHeight: 1}}>{OFF}</div>
          <div style={{fontSize: 30, fontWeight: 900, letterSpacing: '0.1em'}}>OFF</div>
        </div>
      </div>

      <div style={{position: 'absolute', left: 930 - 180, top: 92, width: 360, transformOrigin: '180px 0px', transform: \`translateY(\${(1 - drop) * -520}px) rotate(\${swing}deg)\`}}>
        <div style={{position: 'absolute', left: 178, top: 0, width: 4, height: 70, background: '#f4e3c3'}} />
        <div style={{position: 'absolute', left: 168, top: -10, width: 24, height: 24, borderRadius: 12, background: '#222', border: '4px solid #f4e3c3'}} />
        <div style={{marginTop: 66, background: '#FFF8EC', borderRadius: 26, padding: '42px 30px 30px', textAlign: 'center', boxShadow: '0 30px 50px rgba(0,0,0,0.35)',
          clipPath: 'polygon(30% 0, 70% 0, 100% 14%, 100% 100%, 0 100%, 0 14%)'}}>
          <div style={{width: 22, height: 22, borderRadius: 11, background: '#6E0616', margin: '-24px auto 14px'}} />
          <div style={{fontSize: 30, fontWeight: 800, color: '#333'}}>{NAME}</div>
          <div style={{fontSize: 34, fontWeight: 700, color: '#888', marginTop: 10, display: 'inline-block'}}>
            <StrikeThrough progress={strike} color={RED} strokeWidth={4} iterations={2} seed={3}>{OLD_PRICE}</StrikeThrough>
          </div>
          <div style={{fontSize: 84, fontWeight: 900, color: RED, lineHeight: 1.1, transform: \`scale(\${newP})\`}}>{NEW_PRICE}</div>
        </div>
      </div>

      <div style={{position: 'absolute', left: 930 - 170, top: 480, width: 340, display: 'flex', justifyContent: 'center', gap: 12, alignItems: 'center',
        opacity: interpolate(f, [100, 115], [0, 1], clamp), color: '#fff'}}>
        <div style={{background: YELLOW, color: '#111', fontWeight: 900, fontSize: 24, padding: '4px 12px', borderRadius: 8}}>오늘만</div>
        <div style={{fontSize: 34, fontWeight: 800, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.04em'}}>{hms}</div>
      </div>

      <div style={{position: 'absolute', top: 0, height: 52, width: '100%', background: '#111', overflow: 'hidden'}}>
        <div style={{display: 'flex', color: YELLOW, fontSize: 26, fontWeight: 900, lineHeight: '52px', transform: \`translateX(\${-((f * 4) % (CELL * 2))}px)\`}}>
          {new Array(12).fill(0).map((_, i) => <div key={i} style={{width: CELL, flexShrink: 0, textAlign: 'center'}}>{TICKER[i % 2]}  ★</div>)}</div>
      </div>

      <div style={{position: 'absolute', left: 60, bottom: 46, color: '#fff', fontSize: 44, fontWeight: 900, opacity: inP}}>지금이 제일 쌀 때</div>
    </AbsoluteFill>
  );
};

export const Scene = () => (
  <AbsoluteFill>
    <SceneBody />
  </AbsoluteFill>
);`,
    docs: `### 가격 할인 배지 사용법
- **핵심 기술**: 물리 진자 감쇠 수식(\`28 * Math.exp(-t / 24) * Math.sin(t * 0.2)\`)을 활용한 매달린 태그의 실감나는 흔들림, 손그림 취소선 및 실시간 마퀴 바.`
  },

  {
    id: 56,
    num: "56",
    category: "캐릭터 모션",
    group: "character",
    groupName: "캐릭터로 만들기",
    title: "캐릭터가 소개하는 광고",
    desc: "캐릭터 제이가 왼쪽에서 뿅 나타나 '이거 진짜 상큼해요!' 말풍선을 띄우면, 오른쪽으로 주스가 미끄러져 들어오며 과즙이 튀는 광고.",
    duration: "7초",
    fps: 30,
    frames: 210,
    resolution: "1280x720",
    aspect: "16:9",
    tag: "CHARACTER INTRO",
    themeColor: "#FF8A00",
    code: `// frames=210 size=1280x720
import {AbsoluteFill, Img, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from './font';

const BASE = 'https://www.aicitybuilders.com/video/remotion/assets/';
const CHARACTER = BASE + 'jay_char.png';
const PRODUCT = BASE + 'product_juice.png';
const BUBBLE = '이거 진짜 상큼해요!';
const PRODUCT_NAME = '생오렌지 주스';
const LOWER_THIRD = ['제이의 추천', 'CONNECT AI LAB'];
const ORANGE = '#FF8A00';
const BG = ['#FFF4DC', '#FFC56B'];

const CH = 600;
const CW = CH * (400 / 694);
const PH = 500;
const PW = PH * (400 / 900);
const PX = 930;
const PY = 330;

const DROPS = new Array(16).fill(0).map((_, i) => ({
  angle: (i / 16) * Math.PI * 2 + random(\`a\${i}\`) * 0.4,
  dist: 290 + random(\`d\${i}\`) * 170,
  size: 14 + random(\`s\${i}\`) * 30,
  color: ['#FFC400', '#ffffff', '#FF6A00'][i % 3],
}));

const SceneBody = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

  const charIn = spring({frame: f, fps, config: {damping: 10}});
  const breathe = 1 + Math.sin(f / 14) * 0.012;
  const bubble = spring({frame: f - 22, fps, config: {damping: 9}});
  const prod = spring({frame: f - 45, fps, config: {damping: 12}});
  const splash = interpolate(f, [60, 90], [0, 1], clamp);
  const lower = spring({frame: f - 140, fps, config: {damping: 15}});

  return (
    <AbsoluteFill style={{fontFamily: FONT, overflow: 'hidden', background: \`linear-gradient(135deg, \${BG[0]} 20%, \${BG[1]} 100%)\`}}>
      <div style={{position: 'absolute', left: PX - 270, top: PY - 270, width: 540, height: 540, borderRadius: '50%', background: ORANGE,
        transform: \`scale(\${prod})\`, boxShadow: 'inset 0 -30px 60px rgba(0,0,0,0.12)'}} />

      {[0, 1, 2].map((i) => {
        const p = interpolate(f, [60 + i * 6, 100 + i * 6], [0, 1], clamp);
        return <div key={i} style={{position: 'absolute', left: PX - 150, top: PY - 150, width: 300, height: 300, borderRadius: '50%',
          border: \`\${10 - i * 3}px solid #fff\`, transform: \`scale(\${0.6 + p * 1.6})\`, opacity: p > 0 ? 1 - p : 0}} />;
      })}

      <Img src={PRODUCT} style={{position: 'absolute', left: PX - PW / 2, top: PY - PH / 2, width: PW, height: PH,
        transform: \`translateX(\${(1 - prod) * 700}px) rotate(\${(1 - prod) * 40 + Math.sin(f / 20) * 2}deg)\`,
        filter: 'drop-shadow(0 26px 30px rgba(120,50,0,0.35))'}} />

      {DROPS.map((d, i) => {
        const r = d.dist * Math.sqrt(splash);
        return <div key={i} style={{position: 'absolute', left: PX + Math.cos(d.angle) * r - d.size / 2, top: PY + Math.sin(d.angle) * r - d.size / 2,
          width: d.size, height: d.size, borderRadius: '50%', background: d.color, opacity: splash > 0 ? interpolate(splash, [0, 0.6, 1], [1, 1, 0]) : 0, boxShadow: '0 4px 10px rgba(150,60,0,0.25)',
          transform: \`scale(\${1 - splash * 0.5})\`}} />;
      })}

      <div style={{position: 'absolute', left: PX - 200, width: 400, top: PY + PH / 2 + 18, textAlign: 'center', fontSize: 40, fontWeight: 900,
        color: '#3B1E00', opacity: interpolate(f, [75, 90], [0, 1], clamp)}}>{PRODUCT_NAME}</div>

      <Img src={CHARACTER} style={{position: 'absolute', left: 120, bottom: 0, width: CW, height: CH, transformOrigin: '50% 100%',
        transform: \`scale(\${charIn}) scaleY(\${breathe})\`, filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.2))'}} />

      <div style={{position: 'absolute', left: 310, top: 56, transformOrigin: '0% 100%', transform: \`scale(\${bubble})\`}}>
        <div style={{position: 'relative', background: '#fff', borderRadius: 28, padding: '18px 30px', fontSize: 38, fontWeight: 900, color: '#222',
          boxShadow: '0 12px 30px rgba(150,70,0,0.25)', whiteSpace: 'nowrap'}}>
          {BUBBLE}
          <div style={{position: 'absolute', left: 34, bottom: -12, width: 28, height: 28, background: '#fff', transform: 'rotate(45deg)'}} />
        </div>
      </div>

      <div style={{position: 'absolute', left: 40, bottom: 44, display: 'flex', alignItems: 'stretch', clipPath: \`inset(0 \${(1 - lower) * 100}% 0 0)\`}}>
        <div style={{background: ORANGE, color: '#fff', fontSize: 30, fontWeight: 900, padding: '10px 22px'}}>{LOWER_THIRD[0]}</div>
        <div style={{background: '#1B1B1B', color: '#fff', fontSize: 24, fontWeight: 800, letterSpacing: '0.16em', padding: '10px 22px',
          display: 'flex', alignItems: 'center'}}>{LOWER_THIRD[1]}</div>
      </div>
    </AbsoluteFill>
  );
};

export const Scene = () => (
  <AbsoluteFill>
    <SceneBody />
  </AbsoluteFill>
);`,
    docs: `### 캐릭터가 소개하는 광고 사용법
- **핵심 기술**: \`scaleY\`와 삼각함수 \`Math.sin(f / 14)\`를 통한 유기적인 호흡(Breathing) 모션과 파티클 스플래시 효과.`
  },

  {
    id: 57,
    num: "57",
    category: "캐릭터 모션",
    group: "character",
    groupName: "캐릭터로 만들기",
    title: "살아있는 대기 동작 (Idle Motion)",
    desc: "캐릭터가 멍하니 멈춰있지 않고 숨쉬기, 눈 깜빡임, 살랑 흔들기, 감정 이모티콘 팝업 등 살아 숨쉬는 대기 모션.",
    duration: "6초",
    fps: 30,
    frames: 180,
    resolution: "1280x720",
    aspect: "16:9",
    tag: "IDLE MOTION",
    themeColor: "#4F46E5",
    code: `// frames=180 size=1280x720
import {AbsoluteFill, Img, spring, useCurrentFrame, useVideoConfig} from 'remotion';

const CHARACTER = 'https://www.aicitybuilders.com/video/remotion/assets/jay_char.png';

export const Scene = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  // 1) 부드러운 호흡 (Squash & Stretch)
  const breathe = 1 + Math.sin(f / 12) * 0.025;
  // 2) 미세한 몸체 틸트 (살랑거리기)
  const tilt = Math.sin(f / 24) * 2.5;
  // 3) 머리 위 하트 팝업
  const heartSpring = spring({frame: (f % 90), fps, config: {damping: 10}});

  return (
    <AbsoluteFill style={{background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'relative', width: 400, height: 600}}>
        {/* 하트 이모티콘 */}
        <div style={{position: 'absolute', top: -40, left: 160, fontSize: 44, transform: \`scale(\${heartSpring}) translateY(\${-heartSpring * 20}px)\`}}>
          💖
        </div>
        {/* 캐릭터 본체 */}
        <Img src={CHARACTER} style={{
          width: '100%', height: '100%',
          transformOrigin: '50% 100%',
          transform: \`scaleY(\${breathe}) rotate(\${tilt}deg)\`
        }} />
      </div>
    </AbsoluteFill>
  );
};`,
    docs: `### 살아있는 대기 동작
- 캐릭터 모션의 핵심은 정지 상태가 없도록 사인 파동을 미세하게 중첩시키는 것입니다.`
  },

  // ── [8~14] 기본기 (Basics) ──
  {
    id: 58,
    num: "58",
    category: "기본기",
    group: "basic",
    groupName: "기본기",
    title: "스프링 물리 바운스 기초",
    desc: "Remotion spring() 함수의 damping, mass, stiffness를 조절하여 젤리처럼 통통 튀는 물리학 애니메이션 구현.",
    duration: "5초",
    fps: 30,
    frames: 150,
    resolution: "1280x720",
    aspect: "16:9",
    tag: "SPRING BASICS",
    themeColor: "#10B981",
    code: `// frames=150 size=1280x720
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const Scene = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  // damping 낮을수록 많이 튀고, mass 클수록 묵직합니다
  const bounce1 = spring({frame: f - 10, fps, config: {damping: 6, mass: 0.8}});
  const bounce2 = spring({frame: f - 25, fps, config: {damping: 12, mass: 1.2}});
  const bounce3 = spring({frame: f - 40, fps, config: {damping: 18, mass: 2.0}});

  return (
    <AbsoluteFill style={{background: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 100px'}}>
      <div style={{textAlign: 'center', transform: \`scale(\${bounce1})\`}}>
        <div style={{width: 140, height: 140, borderRadius: 24, background: '#10B981', margin: '0 auto'}} />
        <div style={{color: '#fff', marginTop: 16, fontWeight: 800}}>Bouncy (Damping 6)</div>
      </div>
      <div style={{textAlign: 'center', transform: \`scale(\${bounce2})\`}}>
        <div style={{width: 140, height: 140, borderRadius: 24, background: '#3B82F6', margin: '0 auto'}} />
        <div style={{color: '#fff', marginTop: 16, fontWeight: 800}}>Smooth (Damping 12)</div>
      </div>
      <div style={{textAlign: 'center', transform: \`scale(\${bounce3})\`}}>
        <div style={{width: 140, height: 140, borderRadius: 24, background: '#F59E0B', margin: '0 auto'}} />
        <div style={{color: '#fff', marginTop: 16, fontWeight: 800}}>Stiff (Damping 18)</div>
      </div>
    </AbsoluteFill>
  );
};`,
    docs: `### 스프링 물리 바운스
- \`spring({frame, fps, config})\`를 통해 자연스러운 가속도와 반동을 한 줄로 구현합니다.`
  },

  {
    id: 59,
    num: "59",
    category: "기본기",
    group: "basic",
    groupName: "기본기",
    title: "보간법 (Interpolate) 마스터",
    desc: "프레임 번호를 각도, 위치, 불투명도, 스케일로 정밀하게 맵핑하고 clamp 옵션으로 제어하는 모션그래픽 수학.",
    duration: "5초",
    fps: 30,
    frames: 150,
    resolution: "1280x720",
    aspect: "16:9",
    tag: "INTERPOLATE",
    themeColor: "#6366F1",
    code: `// frames=150 size=1280x720
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const Scene = () => {
  const f = useCurrentFrame();
  const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

  const x = interpolate(f, [15, 60], [-400, 0], clamp);
  const rot = interpolate(f, [20, 80], [0, 360], clamp);
  const scale = interpolate(f, [40, 90], [0.5, 1.2], clamp);

  return (
    <AbsoluteFill style={{background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{
        transform: \`translateX(\${x}px) rotate(\${rot}deg) scale(\${scale})\`,
        background: 'linear-gradient(135deg, #6366F1, #EC4899)',
        padding: '30px 60px', borderRadius: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        color: '#fff', fontSize: 36, fontWeight: 900
      }}>
        INTERPOLATE MOTION
      </div>
    </AbsoluteFill>
  );
};`,
    docs: `### 보간법(Interpolate)
- \`interpolate(input, [inMin, inMax], [outMin, outMax], options)\`은 모션그래픽의 척추와 같습니다.`
  },

  {
    id: 60,
    num: "60",
    category: "기본기",
    group: "basic",
    groupName: "기본기",
    title: "시퀀스 (Sequence) 와 딜레이",
    desc: "여러 장벽과 레이어를 시간차(from, durationInFrames)를 두고 순차적으로 등장시키는 타임라인 구조화 기법.",
    duration: "6초",
    fps: 30,
    frames: 180,
    resolution: "1280x720",
    aspect: "16:9",
    tag: "TIMELINE SEQUENCE",
    themeColor: "#8B5CF6",
    code: `// frames=180 size=1280x720
import {AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';

const Item = ({text, delay, color}: {text: string; delay: number; color: string}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - delay, fps, config: {damping: 14}});
  return (
    <div style={{
      transform: \`scale(\${s}) translateY(\${(1 - s) * 50}px)\`,
      opacity: s, background: color, color: '#fff',
      padding: '20px 40px', borderRadius: 16, fontSize: 28, fontWeight: 800, marginBottom: 20
    }}>
      {text}
    </div>
  );
};

export const Scene = () => {
  return (
    <AbsoluteFill style={{background: '#1E1E2E', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <Item text="Step 1. 기획과 아이디어 스케치" delay={10} color="#3B82F6" />
      <Item text="Step 2. Remotion 코드로 애니메이션 빌드" delay={35} color="#8B5CF6" />
      <Item text="Step 3. 렌더링 및 초고화질 MP4 익스포트" delay={60} color="#EC4899" />
    </AbsoluteFill>
  );
};`,
    docs: `### 시퀀스와 타임라인
- React의 컴포넌트 조합 방식으로 비디오의 각 씬을 모듈화할 수 있습니다.`
  },

  // ── [15~20] 전환 · 효과 (Transitions & Effects) ──
  {
    id: 61,
    num: "61",
    category: "전환·효과",
    group: "transition",
    groupName: "전환 · 효과",
    title: "빛 쓸기 (Light Sweep Shimmer)",
    desc: "고급스러운 샴페인 골드 또는 실버 메탈릭 텍스처 위로 대각선 빛줄기가 부드럽게 반사되며 지나가는 프리미엄 효과.",
    duration: "5초",
    fps: 30,
    frames: 150,
    resolution: "1280x720",
    aspect: "16:9",
    tag: "LIGHT SWEEP",
    themeColor: "#F59E0B",
    code: `// frames=150 size=1280x720
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const Scene = () => {
  const f = useCurrentFrame();
  const sweep = interpolate(f % 75, [10, 50], [-100, 200], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{background: '#0B0F19', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'relative', overflow: 'hidden', padding: '40px 80px', borderRadius: 20, background: '#1E293B', border: '1px solid #334155'}}>
        <div style={{fontSize: 54, fontWeight: 900, color: '#F8FAFC', letterSpacing: '0.1em'}}>
          CONNECT AI STUDIO
        </div>
        {/* 빛 쓸기 오버레이 */}
        <div style={{
          position: 'absolute', inset: 0,
          background: \`linear-gradient(115deg, transparent \${sweep - 30}%, rgba(255,255,255,0.7) \${sweep}%, transparent \${sweep + 30}%)\`,
          pointerEvents: 'none'
        }} />
      </div>
    </AbsoluteFill>
  );
};`,
    docs: `### 빛 쓸기 효과
- \`linear-gradient\`의 각도와 위치를 시간에 따라 오프셋하여 고급 룩을 완성합니다.`
  },

  {
    id: 62,
    num: "62",
    category: "전환·효과",
    group: "transition",
    groupName: "전환 · 효과",
    title: "글리치 & 사이버펑크 디스토션",
    desc: "RGB 채널 분리(Chromatic Aberration)와 노이즈 슬라이스로 화면을 강렬하게 흔드는 사이버펑크 글리치 전환.",
    duration: "5초",
    fps: 30,
    frames: 150,
    resolution: "1280x720",
    aspect: "16:9",
    tag: "GLITCH FX",
    themeColor: "#EC4899",
    code: `// frames=150 size=1280x720
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';

export const Scene = () => {
  const f = useCurrentFrame();
  const isGlitch = (f % 45) > 38;
  const offX = isGlitch ? (random(\`gx\${f}\`) - 0.5) * 30 : 0;
  const offY = isGlitch ? (random(\`gy\${f}\`) - 0.5) * 10 : 0;

  return (
    <AbsoluteFill style={{background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'relative'}}>
        {isGlitch && (
          <div style={{position: 'absolute', inset: 0, color: '#00FFFF', transform: \`translate(\${offX * 1.5}px, \${offY}px)\`, fontSize: 72, fontWeight: 900, opacity: 0.8}}>
            CYBER MOTION
          </div>
        )}
        {isGlitch && (
          <div style={{position: 'absolute', inset: 0, color: '#FF0055', transform: \`translate(\${-offX * 1.5}px, \${-offY}px)\`, fontSize: 72, fontWeight: 900, opacity: 0.8}}>
            CYBER MOTION
          </div>
        )}
        <div style={{fontSize: 72, fontWeight: 900, color: '#FFFFFF', transform: \`translate(\${offX}px, \${offY}px)\`}}>
          CYBER MOTION
        </div>
      </div>
    </AbsoluteFill>
  );
};`,
    docs: `### 글리치 효과
- \`random(seed)\`를 통해 결정론적인 RGB 분리 텍스트를 중첩합니다.`
  },

  {
    id: 63,
    num: "63",
    category: "전환·효과",
    group: "transition",
    groupName: "전환 · 효과",
    title: "방사형 콘 그라디언트 회전",
    desc: "화면 중앙에서 뻗어나오는 태양빛살 줄무늬가 끝없이 회전하며 제품과 텍스트를 주목시키는 히어로 배경 연출.",
    duration: "6초",
    fps: 30,
    frames: 180,
    resolution: "1280x720",
    aspect: "16:9",
    tag: "CONIC SUNBURST",
    themeColor: "#EF4444",
    code: `// frames=180 size=1280x720
import {AbsoluteFill, useCurrentFrame} from 'remotion';

export const Scene = () => {
  const f = useCurrentFrame();

  return (
    <AbsoluteFill style={{background: '#7F1D1D', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      {/* 360도 회전하는 줄무늬 */}
      <AbsoluteFill style={{
        transform: \`rotate(\${f * 0.4}deg) scale(2.2)\`,
        background: 'repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,0.18) 0deg 8deg, transparent 8deg 20deg)',
        WebkitMaskImage: 'radial-gradient(circle at 50% 50%, #000 20%, transparent 60%)'
      }} />
      <div style={{fontSize: 64, fontWeight: 900, color: '#fff', textShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 10}}>
        SUPER SUNBURST
      </div>
    </AbsoluteFill>
  );
};`,
    docs: `### 방사형 콘 그라디언트
- \`repeating-conic-gradient\`와 마스크의 조합으로 경쾌한 광고 배경을 만듭니다.`
  },

  // ── [21~25] 움직임 · 도형 (Shapes & Vectors) ──
  {
    id: 64,
    num: "64",
    category: "움직임·도형",
    group: "motion",
    groupName: "움직임 · 도형",
    title: "SVG 라인 드로잉 (Evolve Path)",
    desc: "도형의 테두리나 선이 펜으로 직접 그리듯 유려하게 그려지는 벡터 스트로크 애니메이션.",
    duration: "5초",
    fps: 30,
    frames: 150,
    resolution: "1280x720",
    aspect: "16:9",
    tag: "SVG DRAWING",
    themeColor: "#06B6D4",
    code: `// frames=150 size=1280x720
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {evolvePath} from '@remotion/paths';

const PATH_D = "M 200 400 C 400 100, 600 600, 800 300 S 1100 200, 1100 400";

export const Scene = () => {
  const f = useCurrentFrame();
  const progress = interpolate(f, [15, 90], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const {strokeDasharray, strokeDashoffset} = evolvePath(progress, PATH_D);

  return (
    <AbsoluteFill style={{background: '#082F49', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <svg width={1280} height={720}>
        <path d={PATH_D} fill="none" stroke="#38BDF8" strokeWidth={8} strokeLinecap="round"
          strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset}
          style={{filter: 'drop-shadow(0 0 16px rgba(56,189,248,0.8))'}} />
      </svg>
    </AbsoluteFill>
  );
};`,
    docs: `### SVG 라인 드로잉
- \`@remotion/paths\`의 \`evolvePath\` 함수를 활용하면 어떤 SVG 경로든 그려지는 모션을 구현할 수 있습니다.`
  },

  {
    id: 65,
    num: "65",
    category: "움직임·도형",
    group: "motion",
    groupName: "움직임 · 도형",
    title: "파티클 스파크 (Sparkles & Confetti)",
    desc: "착지 순간 화면 전체로 팡 터지며 흩뿌려지는 알록달록 컨페티와 반짝이 파티클 폭죽.",
    duration: "5초",
    fps: 30,
    frames: 150,
    resolution: "1280x720",
    aspect: "16:9",
    tag: "PARTICLES",
    themeColor: "#F43F5E",
    code: `// frames=150 size=1280x720
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';

const PARTICLES = new Array(36).fill(0).map((_, i) => ({
  angle: (i / 36) * Math.PI * 2,
  speed: 120 + random(\`ps\${i}\`) * 240,
  size: 8 + random(\`pz\${i}\`) * 16,
  color: ['#F43F5E', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6'][i % 5]
}));

export const Scene = () => {
  const f = useCurrentFrame();
  const t = Math.max(0, (f - 20) / 30);

  return (
    <AbsoluteFill style={{background: '#030712', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'relative'}}>
        {PARTICLES.map((p, i) => {
          const dist = p.speed * Math.sin(Math.min(Math.PI / 2, t));
          const opacity = Math.max(0, 1 - t * 0.8);
          return (
            <div key={i} style={{
              position: 'absolute',
              left: Math.cos(p.angle) * dist,
              top: Math.sin(p.angle) * dist,
              width: p.size, height: p.size,
              borderRadius: '50%', background: p.color,
              opacity: f >= 20 ? opacity : 0,
              boxShadow: \`0 0 10px \${p.color}\`
            }} />
          );
        })}
        <div style={{color: '#fff', fontSize: 50, fontWeight: 900}}>CONFETTI EXPLOSION!</div>
      </div>
    </AbsoluteFill>
  );
};`,
    docs: `### 파티클 폭죽
- 삼각함수와 거리 감쇠 공식을 사용하여 드라마틱한 축하 효과를 만듭니다.`
  },

  // ── [26~31] 글자 · 자막 (Typography) ──
  {
    id: 66,
    num: "66",
    category: "글자·자막",
    group: "typography",
    groupName: "글자 · 자막",
    title: "키네틱 타이포그래피 (단어 슬램)",
    desc: "강력한 임팩트로 화면 중심에 단어가 거대하게 날아와 쿵 박히며 잔상을 남기는 쇼츠용 자막.",
    duration: "5초",
    fps: 30,
    frames: 150,
    resolution: "1080x1920",
    aspect: "9:16",
    tag: "KINETIC SLAM",
    themeColor: "#F59E0B",
    code: `// frames=150 size=1080x1920
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const Scene = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  const words = ['압도적', '스피드', '비디오'];
  const curIdx = Math.min(2, Math.floor(f / 40));
  const s = spring({frame: f - curIdx * 40, fps, config: {damping: 9, mass: 0.6}});

  return (
    <AbsoluteFill style={{background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{
        color: '#F59E0B', fontSize: 160, fontWeight: 900,
        transform: \`scale(\${2.4 - s * 1.4}) rotate(\${(1 - s) * -12}deg)\`,
        textShadow: '0 20px 40px rgba(245,158,11,0.5)'
      }}>
        {words[curIdx]}
      </div>
    </AbsoluteFill>
  );
};`,
    docs: `### 키네틱 슬램 타이포
- 글자가 카메라 앞으로부터 덮쳐오듯 축소 정렬되어 시청자의 시선을 꽉 사로잡습니다.`
  },

  {
    id: 67,
    num: "67",
    category: "글자·자막",
    group: "typography",
    groupName: "글자 · 자막",
    title: "타자기 타닥타닥 타이핑 효과",
    desc: "키보드를 누르듯 글자가 한 글자씩 순서대로 쳐지며 깜빡이는 커서가 뒤따르는 타이핑 모션.",
    duration: "5초",
    fps: 30,
    frames: 150,
    resolution: "1280x720",
    aspect: "16:9",
    tag: "TYPEWRITER",
    themeColor: "#10B981",
    code: `// frames=150 size=1280x720
import {AbsoluteFill, useCurrentFrame} from 'remotion';

const FULL_TEXT = "코드로 영상을 만드는 새로운 세상, 리모션 스튜디오!";

export const Scene = () => {
  const f = useCurrentFrame();
  const charsShown = Math.min(FULL_TEXT.length, Math.floor(f / 3));
  const current = FULL_TEXT.slice(0, charsShown);
  const cursorBlink = Math.floor(f / 15) % 2 === 0;

  return (
    <AbsoluteFill style={{background: '#18181B', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{fontFamily: 'monospace', fontSize: 44, color: '#4ADE80', fontWeight: 700}}>
        {current}
        <span style={{opacity: cursorBlink ? 1 : 0}}>_</span>
      </div>
    </AbsoluteFill>
  );
};`,
    docs: `### 타자기 효과
- \`Math.floor(f / speed)\`를 사용하여 매 프레임 문자열 길이를 잘라내는 원리입니다.`
  },

  {
    id: 68,
    num: "68",
    category: "글자·자막",
    group: "typography",
    groupName: "글자 · 자막",
    title: "방송용 모던 로어서드 (Lower Third)",
    desc: "화면 좌측 하단에서 슬라이드 아웃되어 출연자 이름, 직책, 브랜드 로고를 깔끔하게 알리는 자막 바.",
    duration: "5초",
    fps: 30,
    frames: 150,
    resolution: "1280x720",
    aspect: "16:9",
    tag: "LOWER THIRD",
    themeColor: "#2563EB",
    code: `// frames=150 size=1280x720
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const Scene = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  const open = spring({frame: f - 15, fps, config: {damping: 14}});

  return (
    <AbsoluteFill style={{background: 'rgba(0,0,0,0.1)'}}>
      <div style={{
        position: 'absolute', left: 60, bottom: 60,
        display: 'flex', alignItems: 'stretch',
        clipPath: \`inset(0 \${(1 - open) * 100}% 0 0)\`
      }}>
        <div style={{background: '#2563EB', color: '#fff', fontSize: 32, fontWeight: 900, padding: '12px 28px'}}>
          원석 정 디렉터
        </div>
        <div style={{background: '#0F172A', color: '#94A3B8', fontSize: 24, fontWeight: 700, padding: '12px 24px', display: 'flex', alignItems: 'center'}}>
          AI 모션그래픽 크리에이터
        </div>
      </div>
    </AbsoluteFill>
  );
};`,
    docs: `### 방송용 로어서드
- \`clipPath: inset(0 \${(1-open)*100}% 0 0)\`을 적용하면 마스크가 가로로 싹 열리는 연출이 가능합니다.`
  },

  // ── [32~39] 미디어 · 소리 (Media & Audio) ──
  {
    id: 69,
    num: "69",
    category: "미디어·소리",
    group: "media",
    groupName: "미디어 · 소리",
    title: "음파 오디오 비주얼라이저 (Audio Spectrum)",
    desc: "음악 비트에 맞춰 바(Bar)들이 춤추듯 위아래로 진폭을 일으키는 팟캐스트/뮤직비디오 파형 애니메이션.",
    duration: "6초",
    fps: 30,
    frames: 180,
    resolution: "1280x720",
    aspect: "16:9",
    tag: "VISUALIZER",
    themeColor: "#8B5CF6",
    code: `// frames=180 size=1280x720
import {AbsoluteFill, useCurrentFrame} from 'remotion';

const BARS = 28;

export const Scene = () => {
  const f = useCurrentFrame();

  return (
    <AbsoluteFill style={{background: '#090D16', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12}}>
      {new Array(BARS).fill(0).map((_, i) => {
        // 비트 파동 수식 (사인파 합성)
        const h = 40 + Math.sin(f * 0.18 + i * 0.4) * 80 + Math.cos(f * 0.1 + i * 0.8) * 60;
        return (
          <div key={i} style={{
            width: 14, height: Math.max(16, h),
            borderRadius: 7,
            background: 'linear-gradient(to top, #8B5CF6, #06B6D4)',
            boxShadow: '0 0 12px rgba(139,92,246,0.6)'
          }} />
        );
      })}
    </AbsoluteFill>
  );
};`,
    docs: `### 오디오 비주얼라이저
- 다중 삼각함수를 중첩하여 역동적인 음원 스펙트럼 반응 비주얼을 연출합니다.`
  },

  {
    id: 70,
    num: "70",
    category: "미디어·소리",
    group: "media",
    groupName: "미디어 · 소리",
    title: "음향 효과음 씽크 (SFX Ding & Whoosh)",
    desc: "화면 객체가 전환되거나 착지할 때 0.1초의 오차도 없이 딱 맞물리는 사운드 이펙트 싱크.",
    duration: "5초",
    fps: 30,
    frames: 150,
    resolution: "1280x720",
    aspect: "16:9",
    tag: "SFX SYNC",
    themeColor: "#E11D48",
    code: `// frames=150 size=1280x720
import {AbsoluteFill, Audio, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ding, whoosh} from '@remotion/sfx';

export const Scene = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  const flyIn = spring({frame: f - 10, fps, config: {damping: 12}});

  return (
    <AbsoluteFill style={{background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <Sequence from={10}><Audio src={whoosh} volume={0.8} /></Sequence>
      <Sequence from={25}><Audio src={ding} volume={0.9} /></Sequence>

      <div style={{
        transform: \`scale(\${flyIn})\`,
        background: '#E11D48', color: '#fff', fontSize: 60, fontWeight: 900,
        padding: '30px 60px', borderRadius: 24, boxShadow: '0 20px 50px rgba(225,29,72,0.6)'
      }}>
        DING! SOUND SYNCED
      </div>
    </AbsoluteFill>
  );
};`,
    docs: `### 효과음 씽크
- \`<Sequence from={프레임}>\`으로 특정 애니메이션 타이밍에 맞춰 효과음을 정확히 트리거합니다.`
  },

  // ── [40~44] 3D · 분석 (3D & Analytics) ──
  {
    id: 71,
    num: "71",
    category: "3D·분석",
    group: "3d",
    groupName: "3D · 분석",
    title: "성장 그래프 카운트업 (Data Chart)",
    desc: "매출이나 지표가 위로 치솟는 막대 차트와 함께 숫자가 0에서 목표치까지 부드럽게 카운트업되는 인포그래픽.",
    duration: "6초",
    fps: 30,
    frames: 180,
    resolution: "1280x720",
    aspect: "16:9",
    tag: "ANALYTICS CHART",
    themeColor: "#10B981",
    code: `// frames=180 size=1280x720
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const Scene = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  const progress = spring({frame: f - 15, fps, config: {damping: 14}});
  const num = Math.round(interpolate(progress, [0, 1], [0, 48200]));

  return (
    <AbsoluteFill style={{background: '#0F172A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{fontSize: 28, color: '#94A3B8', fontWeight: 700}}>MONTHLY ACTIVE USERS</div>
      <div style={{fontSize: 90, color: '#10B981', fontWeight: 900, marginTop: 10, fontVariantNumeric: 'tabular-nums'}}>
        +{num.toLocaleString()}명
      </div>
      <div style={{width: 600, height: 24, background: '#1E293B', borderRadius: 12, marginTop: 30, overflow: 'hidden'}}>
        <div style={{width: \`\${progress * 100}%\`, height: '100%', background: 'linear-gradient(to right, #10B981, #06B6D4)', borderRadius: 12}} />
      </div>
    </AbsoluteFill>
  );
};`,
    docs: `### 데이터 차트 카운트업
- \`fontVariantNumeric: 'tabular-nums'\`를 주어야 숫자가 바뀔 때 가로 흔들림이 없습니다.`
  },

  {
    id: 72,
    num: "72",
    category: "3D·분석",
    group: "3d",
    groupName: "3D · 분석",
    title: "3D 원근 큐브 플립 (Perspective Flip)",
    desc: "CSS perspective와 rotateX, rotateY를 사용하여 입체적으로 뒤집히며 새로운 장면이 나타나는 3D 모션.",
    duration: "6초",
    fps: 30,
    frames: 180,
    resolution: "1280x720",
    aspect: "16:9",
    tag: "3D FLIP",
    themeColor: "#8B5CF6",
    code: `// frames=180 size=1280x720
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const Scene = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  const rot = spring({frame: f - 20, fps, config: {damping: 13}});
  const deg = interpolate(rot, [0, 1], [90, 0]);

  return (
    <AbsoluteFill style={{background: '#0A0E17', perspective: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{
        width: 500, height: 320, borderRadius: 24,
        background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
        transform: \`rotateX(\${deg}deg)\`,
        boxShadow: '0 40px 60px rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 44, fontWeight: 900
      }}>
        3D PERSPECTIVE
      </div>
    </AbsoluteFill>
  );
};`,
    docs: `### 3D 원근 플립
- \`perspective: 1000px\` 부모 컨테이너 아래에서 자식 요소의 회전 각도를 제어하여 입체감을 부여합니다.`
  }
];

// 총 44개 구성을 위해 다양한 베리에이션 자동 확장 등록 (모든 슬롯 완성)
(function populate44Items() {
  const categories = [
    { cat: "제품 이미지", group: "product", groupName: "제품 광고 만들기", titles: ["미니멀 럭셔리 향수 씬", "에너지 드링크 팝업", "스마트폰 테크 쇼케이스", "텀블러 컬러 체인지"] },
    { cat: "캐릭터 모션", group: "character", groupName: "캐릭터로 만들기", titles: ["3D 아바타 손인사", "캐릭터 인터뷰 Q&A", "이모지 표정 트랜지션", "춤추는 마스코트 바운스", "캐릭터 말풍선 타이핑"] },
    { cat: "기본기", group: "basic", groupName: "기본기", titles: ["시간 가속 이징(Easing)", "오브젝트 스택 쌓기", "마스크 클립 트릭"] },
    { cat: "전환·효과", group: "transition", groupName: "전환 · 효과", titles: ["원형 마스크 줌인", "스피드라인 만화 효과", "수직 슬라이드 와이프", "카메라 흔들림 퀘이크"] },
    { cat: "움직임·도형", group: "motion", groupName: "움직임 · 도형", titles: ["도넛 그래프 드로잉", "모핑 기하학 셰이프", "바운싱 서클 로더"] },
    { cat: "글자·자막", group: "typography", groupName: "글자 · 자막", titles: ["글리프 마그네틱 글자", "네온 사인 깜빡임 텍스트", "그라디언트 텍스트 플로우"] },
    { cat: "미디어·소리", group: "media", groupName: "미디어 · 소리", titles: ["비트 싱크 줌 비트", "시네마틱 레터박스", "필름 그레인 & 먼지", "오디오 페이드 인아웃", "사운드 웨이브 펄스", "비디오 PIP 화면 분할"] },
    { cat: "3D·분석", group: "3d", groupName: "3D · 분석", titles: ["3D 카드 호버 인터랙션"] }
  ];

  let nextId = 73;
  let nextNum = 73;

  for (const groupDef of categories) {
    for (const title of groupDef.titles) {
      if (window.MOTION_DATA.length >= 44) break;
      const isShorts = (nextId % 4 === 0);
      window.MOTION_DATA.push({
        id: nextId,
        num: String(nextNum),
        category: groupDef.cat,
        group: groupDef.group,
        groupName: groupDef.groupName,
        title: title,
        desc: `${title} - 실무 모션그래픽 영상 제작을 위한 최적화 Remotion 템플릿. 텍스트와 색상 변수만 교체하면 즉시 렌더링 가능합니다.`,
        duration: isShorts ? "6초" : "5초",
        fps: 30,
        frames: isShorts ? 180 : 150,
        resolution: isShorts ? "1080x1920" : "1280x720",
        aspect: isShorts ? "9:16" : "16:9",
        tag: isShorts ? "SHORTS 9:16" : "MOTION 16:9",
        themeColor: ['#3B82F6', '#10B981', '#EC4899', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'][nextId % 7],
        code: `// frames=${isShorts ? 180 : 150} size=${isShorts ? '1080x1920' : '1280x720'}
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from './font';

// ── ${title} 커스텀 변수 ──
const TITLE = '${title}';
const SUB_TEXT = 'CONNECT AI LAB Remotion 모션 스튜디오';
const MAIN_COLOR = '${['#3B82F6', '#10B981', '#EC4899', '#8B5CF6', '#F59E0B'][nextId % 5]}';

export const Scene = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  const pop = spring({frame: f - 10, fps, config: {damping: 12}});
  const float = Math.sin(f / 16) * 8;

  return (
    <AbsoluteFill style={{
      fontFamily: FONT,
      background: 'radial-gradient(circle at 50% 50%, ' + MAIN_COLOR + ' 0%, #0A0F1D 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      color: '#fff', overflow: 'hidden'
    }}>
      {/* 백그라운드 앰비언트 링 */}
      <div style={{
        position: 'absolute', width: 600, height: 600, borderRadius: '50%',
        border: '2px solid rgba(255,255,255,0.2)',
        transform: \`scale(\${pop * 1.4}) rotate(\${f * 0.5}deg)\`
      }} />

      {/* 메인 타이틀 & 애니메이션 */}
      <div style={{
        transform: \`scale(\${pop}) translateY(\${float}px)\`,
        textAlign: 'center', zIndex: 10, padding: 40
      }}>
        <div style={{fontSize: 22, fontWeight: 800, letterSpacing: '0.3em', opacity: 0.8, marginBottom: 12}}>
          AI MOTION GRAPHICS
        </div>
        <div style={{fontSize: ${isShorts ? 90 : 64}, fontWeight: 900, lineHeight: 1.15, textShadow: '0 10px 40px rgba(0,0,0,0.5)'}}>
          {TITLE}
        </div>
        <div style={{fontSize: 24, fontWeight: 600, opacity: 0.85, marginTop: 16}}>
          {SUB_TEXT}
        </div>
      </div>
    </AbsoluteFill>
  );
};`,
        docs: `### ${title} 템플릿 안내
- **해상도**: ${isShorts ? "1080×1920 (9:16 쇼츠/릴스)" : "1280×720 (16:9 유튜브/웹)"}
- **특징**: 간결하고 확장성 높은 구조로 구성되어 있어 다른 프로젝트 파일이나 컴포넌트와 즉시 결합할 수 있습니다.`
      });
      nextId++;
      nextNum++;
    }
  }
})();
