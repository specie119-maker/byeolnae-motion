/**
 * MotionGraphics Engine & Video Exporter
 * - 실시간 캔버스 렌더러 (Remotion 수식 호환 모션 시뮬레이션)
 * - AI 프롬프트 기반 자동 모션 생성기 (가로 16:9 & 세로 9:16)
 * - 브라우저 실시간 MP4 다운로더 (MediaRecorder & Canvas Stream)
 */

window.MotionEngine = (function() {
  let animFrameId = null;
  let currentScene = null;
  let currentFrame = 0;
  let isPlaying = true;
  let totalFrames = 180;
  let fps = 30;
  let canvas = null;
  let ctx = null;

  // 스프링 물리 보조 함수 (Remotion spring 모델 근사)
  function springVal(frame, delay = 0, damping = 12, mass = 1) {
    const t = Math.max(0, (frame - delay) / 30);
    if (t <= 0) return 0;
    const omega = 12 / Math.sqrt(mass);
    const zeta = damping / (2 * Math.sqrt(mass * 12));
    const val = 1 - Math.exp(-zeta * omega * t) * Math.cos(omega * Math.sqrt(Math.max(0, 1 - zeta * zeta)) * t);
    return Math.min(1.4, Math.max(0, val));
  }

  // 선형 보간 함수
  function lerp(start, end, progress) {
    const p = Math.max(0, Math.min(1, progress));
    return start + (end - start) * p;
  }

  // 이미지 프리로더 캐시
  const imageCache = {};
  function getCachedImage(src) {
    if (!src) return null;
    if (imageCache[src]) return imageCache[src];
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    imageCache[src] = img;
    return img;
  }

  // ── [씬 1] 히어로 등장 렌더링 ──
  function renderHeroScene(ctx, w, h, f) {
    // 배경 방사형 그라데이션
    const grad = ctx.createRadialGradient(w * 0.5, h * 0.55, 0, w * 0.5, h * 0.55, w * 0.7);
    grad.addColorStop(0, '#E4002B');
    grad.addColorStop(0.45, '#9c0018');
    grad.addColorStop(1, '#3a0008');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // 회전하는 빛줄기
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate((f * 0.35 * Math.PI) / 180);
    const rayCount = 18;
    for (let i = 0; i < rayCount; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      const a1 = (i / rayCount) * Math.PI * 2;
      const a2 = a1 + (Math.PI * 2) / (rayCount * 2.2);
      ctx.arc(0, 0, w * 1.5, a1, a2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
      ctx.fill();
    }
    ctx.restore();

    // 뒤쪽 큰 글자 REFRESH
    const wordScale = lerp(1.15, 1, Math.min(1, f / 180));
    ctx.save();
    ctx.font = '900 140px Pretendard, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 3;
    ctx.strokeText('REFRESH', w / 2, h * 0.28);
    ctx.restore();

    // 제품 캔 스프링 솟아오름
    const rise = springVal(f, 8, 13, 1.1);
    const yOff = lerp(h * 0.7, 0, Math.min(1, rise));
    const float = Math.sin(f / 18) * 8;
    const tilt = lerp(-18, -6, Math.min(1, rise)) + Math.sin(f / 22) * 1.2;

    // 바닥 그림자
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(w / 2, h * 0.88, 140 * rise, 20 * rise, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fill();
    ctx.restore();

    // 제품 캔 렌더링
    const cokeImg = getCachedImage('https://www.aicitybuilders.com/video/remotion/assets/product_coke.png');
    const prodH = h * 0.65;
    const prodW = prodH * (369 / 900);
    const prodX = w / 2;
    const prodY = h / 2 + 30 + yOff + float;

    ctx.save();
    ctx.translate(prodX, prodY);
    ctx.rotate((tilt * Math.PI) / 180);

    if (cokeImg && cokeImg.complete && cokeImg.naturalWidth > 0) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 35;
      ctx.shadowOffsetY = 25;
      ctx.drawImage(cokeImg, -prodW / 2, -prodH / 2, prodW, prodH);
      ctx.shadowColor = 'transparent';

      // 캔 위로 지나가는 사선 빛 쓸기(Light sweep)
      const sweepProgress = Math.max(0, Math.min(1, (f - 55) / 35));
      if (sweepProgress > 0 && sweepProgress < 1) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const swX = lerp(-prodW, prodW * 2, sweepProgress);
        const lGrad = ctx.createLinearGradient(swX - 40, -prodH / 2, swX + 40, prodH / 2);
        lGrad.addColorStop(0, 'rgba(255,255,255,0)');
        lGrad.addColorStop(0.5, 'rgba(255,255,255,0.7)');
        lGrad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = lGrad;
        ctx.fillRect(-prodW / 2, -prodH / 2, prodW, prodH);
        ctx.restore();
      }
    } else {
      // 대체 캔 셰이프
      ctx.fillStyle = '#CC0000';
      ctx.beginPath();
      ctx.roundRect(-prodW / 2, -prodH / 2, prodW, prodH, 20);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '900 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('COLA', 0, 0);
    }

    // 반짝이 파티클
    for (let i = 0; i < 8; i++) {
      const spF = (f - 50 - i * 15);
      if (spF > 0 && spF < 30) {
        const op = Math.sin((spF / 30) * Math.PI);
        const sx = ((i % 3) - 1) * 60;
        const sy = ((Math.floor(i / 3)) - 1) * 80;
        ctx.save();
        ctx.translate(sx, sy);
        ctx.globalAlpha = op;
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    ctx.restore();

    // 양옆 문구
    const txtL = springVal(f, 65, 16);
    const txtR = springVal(f, 75, 16);

    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.font = '900 52px Pretendard, sans-serif';
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 20;
    const offL = (1 - txtL) * -80;
    ctx.globalAlpha = Math.min(1, txtL);
    ctx.fillText('시원하게', prodX - prodW / 2 - 40 + offL, h * 0.52);

    ctx.textAlign = 'left';
    const offR = (1 - txtR) * 80;
    ctx.globalAlpha = Math.min(1, txtR);
    ctx.fillText('한 캔', prodX + prodW / 2 + 40 + offR, h * 0.52);

    // 하단 밑줄
    const lineW = lerp(0, 120, Math.max(0, Math.min(1, (f - 95) / 25)));
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(prodX + prodW / 2 + 40, h * 0.58, lineW, 5);
    ctx.restore();

    // 브랜드 워터마크
    drawBrandMark(ctx, w, h);
  }

  // ── [씬 2] 제품 캐러셀 렌더링 ──
  function renderCarouselScene(ctx, w, h, f) {
    const products = [
      { name: '스파클링 캔', price: '1,900원', tag: 'NEW', bg: '#2A4FD6', img: 'https://www.aicitybuilders.com/video/remotion/assets/product_can.png' },
      { name: '생오렌지 주스', price: '3,500원', tag: 'BEST', bg: '#F26B1D', img: 'https://www.aicitybuilders.com/video/remotion/assets/product_juice.png' },
      { name: '포테이토 칩', price: '2,800원', tag: 'HOT', bg: '#D7263D', img: 'https://www.aicitybuilders.com/video/remotion/assets/product_chips_bag.png' }
    ];

    const step = 80;
    const progress = (f % (step * 3)) / step;
    const curIdx = Math.floor(progress) % 3;
    const nextIdx = (curIdx + 1) % 3;
    const subP = progress - Math.floor(progress);

    // 배경색 전환
    ctx.fillStyle = products[curIdx].bg;
    ctx.fillRect(0, 0, w, h);

    // 뒤쪽 큰 번호
    ctx.font = '900 240px Pretendard, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`0${curIdx + 1}`, w / 2, h * 0.35);

    // 캐러셀 슬라이드 아이템들
    const gap = 340;
    products.forEach((prod, i) => {
      const dist = i - progress;
      const x = w / 2 + dist * gap;
      const scale = Math.max(0.5, 1 - Math.abs(dist) * 0.35);
      const alpha = Math.max(0.2, 1 - Math.abs(dist) * 0.5);

      ctx.save();
      ctx.translate(x, h * 0.44);
      ctx.scale(scale, scale);
      ctx.globalAlpha = alpha;

      const pImg = getCachedImage(prod.img);
      const sz = 240;
      if (pImg && pImg.complete && pImg.naturalWidth > 0) {
        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        ctx.shadowBlur = 24;
        ctx.drawImage(pImg, -sz / 2, -sz / 2, sz, sz);
      } else {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.roundRect(-sz / 2, -sz / 2, sz, sz, 20);
        ctx.fill();
      }
      ctx.restore();
    });

    // 제품 텍스트
    const curP = products[curIdx];
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 태그
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 16px Pretendard, sans-serif';
    ctx.fillRect(w / 2 - 35, h * 0.72 - 14, 70, 28);
    ctx.fillStyle = curP.bg;
    ctx.fillText(curP.tag, w / 2, h * 0.72);

    // 이름
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 48px Pretendard, sans-serif';
    ctx.fillText(curP.name, w / 2, h * 0.81);

    // 가격
    ctx.font = '800 28px Pretendard, sans-serif';
    ctx.fillText(curP.price, w / 2, h * 0.89);
    ctx.restore();

    drawBrandMark(ctx, w, h);
  }

  // ── [씬 3] 세로 쇼츠 광고 렌더링 ──
  function renderShortsScene(ctx, w, h, f) {
    const isScene2 = f >= 92;
    const beat = isScene2 ? (Math.floor((f - 92) / 15) % 2 === 0 ? '#17A43B' : '#0A5A21') : '#17A43B';
    ctx.fillStyle = beat;
    ctx.fillRect(0, 0, w, h);

    if (!isScene2) {
      // 1장면: 단어 슬램 (오늘, 기분, 리프레시)
      const words = [
        { text: '오늘', frame: 0, color: '#EEF53A' },
        { text: '기분', frame: 30, color: '#FFFFFF' },
        { text: '리프레시', frame: 60, color: '#EEF53A' }
      ];
      const curWord = [...words].reverse().find(w => f >= w.frame) || words[0];
      const slam = springVal(f, curWord.frame, 11, 0.6);

      ctx.save();
      ctx.translate(w / 2, h / 2);
      const s = 2.0 - slam * 1.0;
      ctx.scale(s, s);
      ctx.fillStyle = curWord.color;
      ctx.font = '900 120px Pretendard, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 30;
      ctx.fillText(curWord.text, 0, 0);
      ctx.restore();
    } else {
      // 2장면: 제품 낙하 바운스
      const drop = springVal(f, 92, 7, 0.9);
      const yDrop = (1 - drop) * -h * 0.8;

      ctx.save();
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.font = '900 36px Pretendard, sans-serif';
      ctx.fillText('NEW', w / 2, h * 0.14);
      ctx.font = '900 80px Pretendard, sans-serif';
      ctx.fillText('오늘 기분', w / 2, h * 0.22);

      // 음료 캔 드롭
      const dewImg = getCachedImage('https://www.aicitybuilders.com/video/remotion/assets/product_dew.png');
      const cw = 260;
      const ch = 480;
      ctx.translate(w / 2, h * 0.52 + yDrop);

      if (dewImg && dewImg.complete && dewImg.naturalWidth > 0) {
        ctx.shadowColor = 'rgba(0,0,0,0.45)';
        ctx.shadowBlur = 40;
        ctx.drawImage(dewImg, -cw / 2, -ch / 2, cw, ch);
      } else {
        ctx.fillStyle = '#EEF53A';
        ctx.beginPath();
        ctx.roundRect(-cw / 2, -ch / 2, cw, ch, 24);
        ctx.fill();
      }
      ctx.restore();

      // 하단 리프레시 텍스트
      ctx.save();
      ctx.fillStyle = '#EEF53A';
      ctx.font = '900 90px Pretendard, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('리프레시', w / 2, h * 0.86);
      ctx.restore();
    }

    drawBrandMark(ctx, w, h);
  }

  // ── [씬 4] 캐릭터가 소개하는 광고 렌더링 ──
  function renderCharacterScene(ctx, w, h, f) {
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#FFF4DC');
    bgGrad.addColorStop(1, '#FFC56B');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // 제품 뒤 원형 무대
    ctx.save();
    ctx.beginPath();
    ctx.arc(w * 0.72, h * 0.48, 220, 0, Math.PI * 2);
    ctx.fillStyle = '#FF8A00';
    ctx.fill();

    // 주스 제품 슬라이드
    const juiceImg = getCachedImage('https://www.aicitybuilders.com/video/remotion/assets/product_juice.png');
    if (juiceImg && juiceImg.complete && juiceImg.naturalWidth > 0) {
      ctx.shadowColor = 'rgba(120,50,0,0.35)';
      ctx.shadowBlur = 30;
      ctx.drawImage(juiceImg, w * 0.72 - 110, h * 0.48 - 180, 220, 420);
    }
    ctx.restore();

    // 캐릭터 점프 진입 + 숨쉬기
    const charIn = springVal(f, 0, 10, 1);
    const breathe = 1 + Math.sin(f / 14) * 0.02;
    const charImg = getCachedImage('https://www.aicitybuilders.com/video/remotion/assets/jay_char.png');

    ctx.save();
    ctx.translate(w * 0.28, h);
    ctx.scale(charIn, charIn * breathe);
    if (charImg && charImg.complete && charImg.naturalWidth > 0) {
      ctx.drawImage(charImg, -170, -480, 340, 520);
    } else {
      ctx.fillStyle = '#3B82F6';
      ctx.beginPath();
      ctx.arc(0, -320, 100, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 말풍선
    const bubble = springVal(f, 22, 9);
    if (bubble > 0.05) {
      ctx.save();
      ctx.translate(w * 0.34, h * 0.24);
      ctx.scale(bubble, bubble);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0,0,0,0.15)';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.roundRect(-20, -40, 280, 70, 24);
      ctx.fill();

      ctx.fillStyle = '#111827';
      ctx.font = '900 24px Pretendard, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('이거 진짜 상큼해요! 🍊', 120, -5);
      ctx.restore();
    }

    // 하단 라벨
    ctx.save();
    ctx.fillStyle = '#FF8A00';
    ctx.fillRect(40, h - 80, 140, 45);
    ctx.fillStyle = '#1E1E1E';
    ctx.fillRect(180, h - 80, 180, 45);
    ctx.fillStyle = '#fff';
    ctx.font = '900 20px Pretendard, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText('제이의 추천', 60, h - 57);
    ctx.font = '700 16px Pretendard, sans-serif';
    ctx.fillText('CONNECT AI LAB', 195, h - 57);
    ctx.restore();

    drawBrandMark(ctx, w, h);
  }

  // ── [씬 5] AI 프롬프트 기반 자동 생성 씬 렌더링 ──
  function renderAIGeneratedScene(ctx, w, h, f, config) {
    const isVertical = h > w;
    const mainColor = config.themeColor || '#2563EB';
    const subColor = config.subColor || '#1E1B4B';
    const mainTitle = config.mainTitle || 'AI MOTION STUDIO';
    const subTitle = config.subTitle || '코드로 만드는 마법같은 모션그래픽';
    const badge = config.badge || 'PROMOTION';

    // 배경 그라데이션
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h));
    bgGrad.addColorStop(0, mainColor);
    bgGrad.addColorStop(1, subColor);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // 회전하는 백라이트 광선
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate((f * 0.4 * Math.PI) / 180);
    const count = 16;
    for (let i = 0; i < count; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      const a1 = (i / count) * Math.PI * 2;
      const a2 = a1 + (Math.PI * 2) / (count * 2);
      ctx.arc(0, 0, Math.max(w, h) * 1.5, a1, a2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fill();
    }
    ctx.restore();

    // 중앙 원형 펄스 링
    const pop = springVal(f, 8, 12, 1);
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.beginPath();
    ctx.arc(0, 0, (isVertical ? 220 : 180) * pop, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 4;
    ctx.stroke();

    // 부유 애니메이션
    const float = Math.sin(f / 16) * 10;
    ctx.translate(0, float);

    // 상단 배지
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.roundRect(-70, (isVertical ? -220 : -140), 140, 36, 18);
    ctx.fill();
    ctx.fillStyle = mainColor;
    ctx.font = '900 16px Pretendard, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(badge, 0, (isVertical ? -202 : -122));

    // 메인 타이틀
    ctx.fillStyle = '#FFFFFF';
    ctx.font = isVertical ? '900 72px Pretendard, sans-serif' : '900 64px Pretendard, sans-serif';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 30;
    ctx.fillText(mainTitle, 0, (isVertical ? -90 : -20));

    // 서브 카피
    ctx.font = isVertical ? '700 32px Pretendard, sans-serif' : '700 26px Pretendard, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText(subTitle, 0, (isVertical ? 0 : 50));

    // 바닥 CTA 버튼 모션
    const btnSpring = springVal(f, 35, 14);
    ctx.save();
    ctx.scale(btnSpring, btnSpring);
    ctx.fillStyle = '#FFD700';
    ctx.shadowColor = 'rgba(255, 215, 0, 0.6)';
    ctx.shadowBlur = 24;
    ctx.beginPath();
    ctx.roundRect(-130, (isVertical ? 120 : 120), 260, 56, 28);
    ctx.fill();

    ctx.fillStyle = '#111827';
    ctx.font = '900 22px Pretendard, sans-serif';
    ctx.fillText('지금 바로 시작하기 →', 0, (isVertical ? 148 : 148));
    ctx.restore();

    ctx.restore();

    drawBrandMark(ctx, w, h);
  }

  // 브랜드 워터마크 공통 함수
  function drawBrandMark(ctx, w, h) {
    ctx.save();
    ctx.font = '800 14px Pretendard, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 6;
    ctx.letterSpacing = '0.15em';
    ctx.fillText('CONNECT AI LAB', w - 24, h - 18);
    ctx.restore();
  }

  function renderCrownLife(ctx, w, h, f) {
    const g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#073d37'); g.addColorStop(.64, '#08705b'); g.addColorStop(.65, '#02151c'); g.addColorStop(1, '#02151c');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); ctx.textAlign = 'center';
    const text = (s, y, size, color, delay) => { const a = Math.max(0, Math.min(1, (f - delay) / 16)); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = color; ctx.font = `800 ${size}px Pretendard, sans-serif`; ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 10; ctx.fillText(s, w / 2, y); ctx.restore(); };
    text('오늘 기분', h*.14, w*.095, '#fff3c4', 4); text('리프레시', h*.24, w*.14, '#f7c948', 24); text('나의 생명', h*.31, w*.07, '#fff', 42);
    const img = getCachedImage('images/crown_of_life.png'), a = Math.max(0, Math.min(1, (f - 70) / 20));
    if (img && img.complete) { const cw=w*.58*(.8+.2*a), ch=cw*img.height/img.width; ctx.save();ctx.globalAlpha=a;ctx.shadowColor='rgba(0,0,0,.5)';ctx.shadowBlur=28;ctx.drawImage(img,w/2-cw/2,h*.35-(1-a)*h*.06,cw,ch);ctx.restore(); }
    text('시련을 견디어 낸 자가', h*.74, w*.047, '#fff', 94); text('생명의 면류관을 얻을 것임이라', h*.80, w*.043, '#f7c948', 106); text('야고보서 1:12', h*.86, w*.035, '#d8f3dc', 120); drawBrandMark(ctx,w,h);
  }

  // ── 메인 프레임 렌더 함수 ──
  function renderFrame(targetCtx, w, h, frameNum, sceneItem) {
    targetCtx.clearRect(0, 0, w, h);
    if (!sceneItem) return;

    if (sceneItem.customAI) {
      renderAIGeneratedScene(targetCtx, w, h, frameNum, sceneItem.customAI);
    } else if (sceneItem.id === 95) {
      renderCrownLife(targetCtx, w, h, frameNum);
    } else if (sceneItem.id === 51) {
      renderHeroScene(targetCtx, w, h, frameNum);
    } else if (sceneItem.id === 52) {
      renderCarouselScene(targetCtx, w, h, frameNum);
    } else if (sceneItem.id === 54 || sceneItem.aspect === '9:16') {
      renderShortsScene(targetCtx, w, h, frameNum);
    } else if (sceneItem.id === 56) {
      renderCharacterScene(targetCtx, w, h, frameNum);
    } else {
      // 일반 모션 씬
      renderAIGeneratedScene(targetCtx, w, h, frameNum, {
        themeColor: sceneItem.themeColor || '#4F46E5',
        subColor: '#090D16',
        mainTitle: sceneItem.title,
        subTitle: sceneItem.desc ? sceneItem.desc.slice(0, 32) : 'CONNECT AI LAB',
        badge: sceneItem.category || 'REMOTION'
      });
    }
  }

  // ── 애니메이션 루프 관리 ──
  function startLoop(targetCanvas, sceneItem) {
    stopLoop();
    canvas = targetCanvas;
    ctx = canvas.getContext('2d');
    currentScene = sceneItem;
    currentFrame = 0;
    isPlaying = true;
    totalFrames = sceneItem.frames || 180;
    fps = sceneItem.fps || 30;

    function step() {
      if (isPlaying) {
        currentFrame = (currentFrame + 1) % totalFrames;
        renderFrame(ctx, canvas.width, canvas.height, currentFrame, currentScene);
        
        // 타임라인 UI 업데이트 콜백
        if (window.onMotionFrameUpdate) {
          window.onMotionFrameUpdate(currentFrame, totalFrames);
        }
      }
      animFrameId = requestAnimationFrame(step);
    }
    step();
  }

  function stopLoop() {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
  }

  function togglePlay() {
    isPlaying = !isPlaying;
    return isPlaying;
  }

  function seekToFrame(targetFrame) {
    currentFrame = Math.max(0, Math.min(totalFrames - 1, targetFrame));
    if (ctx && canvas && currentScene) {
      renderFrame(ctx, canvas.width, canvas.height, currentFrame, currentScene);
    }
  }

  // ── MP4 비디오 익스포터 (Canvas -> WebM/MP4 고속 인코딩 & 다운로드) ──
  async function exportCanvasToMP4(sceneItem, onProgress) {
    return new Promise(async (resolve, reject) => {
      try {
        const isVert = sceneItem.aspect === '9:16';
        const exportW = isVert ? 720 : 1280;
        const exportH = isVert ? 1280 : 720;
        const expCanvas = document.createElement('canvas');
        expCanvas.width = exportW;
        expCanvas.height = exportH;
        const expCtx = expCanvas.getContext('2d');

        const expFrames = sceneItem.frames || 180;
        const stream = expCanvas.captureStream(30);

        let mimeType = 'video/webm;codecs=vp9';
        if (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1')) {
          mimeType = 'video/mp4;codecs=avc1';
        } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
          mimeType = 'video/webm;codecs=vp8';
        }

        const recorder = new MediaRecorder(stream, {
          mimeType: mimeType,
          videoBitsPerSecond: 6000000
        });

        const recordedChunks = [];
        recorder.ondataavailable = e => {
          if (e.data && e.data.size > 0) recordedChunks.push(e.data);
        };

        recorder.onstop = () => {
          const blob = new Blob(recordedChunks, { type: 'video/mp4' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          const cleanTitle = (sceneItem.title || 'motion_scene').replace(/[^a-zA-Z0-9가-힣]/g, '_');
          a.download = `${cleanTitle}_${sceneItem.aspect === '9:16' ? 'Shorts' : '16x9'}.mp4`;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          }, 100);
          resolve(true);
        };

        recorder.start();

        // 프레임 순차 렌더링
        for (let f = 0; f < expFrames; f++) {
          renderFrame(expCtx, exportW, exportH, f, sceneItem);
          if (onProgress) {
            onProgress(Math.round(((f + 1) / expFrames) * 100));
          }
          await new Promise(r => setTimeout(r, 1000 / 30));
        }

        recorder.stop();
      } catch (err) {
        console.error("Export MP4 error:", err);
        reject(err);
      }
    });
  }

  // ── AI 프롬프트 분석 및 모션 객체 생성기 ──
  function generateFromPrompt(promptText, mode = 'horizontal') {
    const isVertical = mode === 'vertical';
    const text = promptText.trim();

    // 테마 컬러 추론
    let themeColor = '#2563EB';
    let subColor = '#0F172A';
    let badge = 'AI MOTION';

    if (/여름|음료|시원|탄산|콜라|주스|사이다/i.test(text)) {
      themeColor = '#0284C7';
      subColor = '#082F49';
      badge = 'COOL SUMMER';
    } else if (/할인|특가|세일|이벤트|쿠폰|가격/i.test(text)) {
      themeColor = '#DC2626';
      subColor = '#450A0A';
      badge = 'SPECIAL SALE 50%';
    } else if (/쇼츠|유튜브|릴스|감성|명언|묵상/i.test(text)) {
      themeColor = '#7C3AED';
      subColor = '#2E1065';
      badge = 'DAILY SHORTS';
    } else if (/신제품|런칭|출시|오픈/i.test(text)) {
      themeColor = '#F59E0B';
      subColor = '#451A03';
      badge = 'NEW ARRIVAL';
    } else if (/네온|사이버|IT|테크|AI/i.test(text)) {
      themeColor = '#10B981';
      subColor = '#064E3B';
      badge = 'TECH INNOVATION';
    }

    const titleCandidate = text.split(/[,\.\n]/)[0] || 'AI Generated Motion';
    const subCandidate = text.split(/[,\.\n]/)[1] || 'CONNECT AI LAB Remotion Studio';

    const newScene = {
      id: Date.now(),
      num: 'AI',
      category: isVertical ? '세로 쇼츠 생성' : '가로 영상 생성',
      group: 'ai_gen',
      groupName: 'AI 생성',
      title: titleCandidate,
      desc: `프롬프트 "${text}" 로부터 자동 생성된 ${isVertical ? '9:16 모바일 세로' : '16:9 와이드 가로'} 모션그래픽 비디오.`,
      duration: '6초',
      fps: 30,
      frames: 180,
      resolution: isVertical ? '1080x1920' : '1280x720',
      aspect: isVertical ? '9:16' : '16:9',
      tag: isVertical ? 'AI SHORTS 9:16' : 'AI MOTION 16:9',
      themeColor: themeColor,
      customAI: {
        themeColor: themeColor,
        subColor: subColor,
        mainTitle: titleCandidate,
        subTitle: subCandidate,
        badge: badge
      },
      code: `// frames=180 size=${isVertical ? '1080x1920' : '1280x720'}
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

// ── AI 자동 생성 파라미터 (프롬프트: ${text}) ──
const MAIN_TITLE = "${titleCandidate}";
const SUB_TITLE = "${subCandidate}";
const THEME_COLOR = "${themeColor}";
const BADGE = "${badge}";

export const Scene = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  const pop = spring({frame: f - 8, fps, config: {damping: 12}});
  const float = Math.sin(f / 16) * 10;

  return (
    <AbsoluteFill style={{
      background: \`radial-gradient(circle at 50% 50%, \${THEME_COLOR} 0%, #0B0F19 100%)\`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      color: '#fff', overflow: 'hidden'
    }}>
      {/* 360도 회전 라이트 빔 */}
      <AbsoluteFill style={{
        transform: \`rotate(\${f * 0.4}deg) scale(2)\`,
        background: 'repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,0.08) 0deg 10deg, transparent 10deg 22deg)'
      }} />

      <div style={{transform: \`scale(\${pop}) translateY(\${float}px)\`, textAlign: 'center', zIndex: 10}}>
        <div style={{background: '#fff', color: THEME_COLOR, padding: '6px 20px', borderRadius: 20, fontSize: 18, fontWeight: 900, display: 'inline-block', marginBottom: 20}}>
          {BADGE}
        </div>
        <div style={{fontSize: ${isVertical ? 80 : 64}, fontWeight: 900, textShadow: '0 10px 40px rgba(0,0,0,0.5)'}}>
          {MAIN_TITLE}
        </div>
        <div style={{fontSize: ${isVertical ? 32 : 24}, fontWeight: 700, opacity: 0.85, marginTop: 16}}>
          {SUB_TITLE}
        </div>
      </div>
    </AbsoluteFill>
  );
};`,
      docs: `### 프롬프트 기반 자동 생성 씬
- **입력 프롬프트**: "${text}"
- **화면비**: ${isVertical ? '9:16 (1080x1920 세로 쇼츠/릴스)' : '16:9 (1280x720 가로 유튜브)'}
- **자동 추출 태그**: ${badge}, 메인 테마색: ${themeColor}`
    };

    return newScene;
  }

  return {
    startLoop,
    stopLoop,
    togglePlay,
    seekToFrame,
    renderFrame,
    exportCanvasToMP4,
    generateFromPrompt
  };
})();
