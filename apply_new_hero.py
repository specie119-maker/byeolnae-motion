# apply_new_hero.py
import re

with open('dist/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('CODE모음/code 01.히어로등장.tsx', 'r', encoding='utf-8') as f:
    hero_code = f.read()

# 1. getRemotionCode() 내 code === 1 코드 블록 업데이트
safe_hero_code = hero_code.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')

code1_func_needle_re = r'if \(state\.motionCode === 1\) \{[\s\S]*?return `[\s\S]*?`;\s*\}'
code1_func_replacement = f"""if (state.motionCode === 1) {{
        return `{safe_hero_code}`;
      }}"""

html = re.sub(code1_func_needle_re, code1_func_replacement, html, count=1)

# 2. renderMotionCodePreview 내 code === 1 렌더링 블록 업데이트
render_code1_re = r'if \(code === 1\) \{[\s\S]*?drawText\([^\)]*?\);\s*\}'

new_render_code1 = """if (code === 1) { // 01 히어로 등장: RedHeroScriptureScene
        // 1) 붉은 와인 방사형 배경
        const grad = ctx.createRadialGradient(W * .75, H * .50, 0, W * .75, H * .50, W * .85);
        grad.addColorStop(0, '#880c21');
        grad.addColorStop(0.55, '#44030d');
        grad.addColorStop(1, '#180004');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        // 2) [배경] 골드 방사형 라이트 빔 (천천히 회전)
        ctx.save();
        ctx.globalAlpha = .10;
        ctx.strokeStyle = '#ffd166';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 24; i++) {
          const a = (i * Math.PI / 12) + f * .006;
          ctx.beginPath();
          ctx.moveTo(W * .75, H * .50);
          ctx.lineTo(W * .75 + Math.cos(a) * W * 1.4, H * .50 + Math.sin(a) * H * 1.4);
          ctx.stroke();
        }
        ctx.restore();

        // 3) [배경] 텍스트 가독성 보호용 다크 딤
        const dimGrad = ctx.createRadialGradient(W * .35, H * .50, 0, W * .35, H * .50, W * .55);
        dimGrad.addColorStop(0, 'rgba(20, 0, 4, 0.6)');
        dimGrad.addColorStop(1, 'rgba(20, 0, 4, 0)');
        ctx.fillStyle = dimGrad;
        ctx.fillRect(0, 0, W * .65, H);

        // 4) 텍스트 순차 등장 타이밍 보간
        const pQOpen = Math.min(1, Math.max(0, (f - 10) / 15));
        const p1 = Math.min(1, Math.max(0, (f - 18) / 18));
        const p2 = Math.min(1, Math.max(0, (f - 34) / 18));
        const p3 = Math.min(1, Math.max(0, (f - 50) / 18));
        const pQClose = Math.min(1, Math.max(0, (f - 65) / 15));

        // ── 좌측: 말씀 텍스트 및 상/하 따옴표 ──
        const textLeft = W * .10;
        const fontFace = state.fontFamily || "'Gowun Batang', serif";

        // 상단 여는 따옴표 ❝
        if (pQOpen > 0) {
          ctx.save();
          ctx.globalAlpha = pQOpen;
          ctx.fillStyle = '#fbbf24';
          ctx.font = `900 ${portrait ? 32 : 44}px ${fontFace}`;
          ctx.textAlign = 'left';
          ctx.shadowColor = 'rgba(0,0,0,0.7)';
          ctx.shadowBlur = 12;
          ctx.fillText('❝', textLeft, H * .26);
          ctx.restore();
        }

        // 1번째 줄 (두려워말라)
        if (p1 > 0) {
          ctx.save();
          ctx.globalAlpha = p1;
          ctx.fillStyle = '#fde8ea';
          ctx.font = `700 ${portrait ? 24 : 36}px ${fontFace}`;
          ctx.textAlign = 'left';
          ctx.shadowColor = 'rgba(0,0,0,0.85)';
          ctx.shadowBlur = 16;
          const y1 = H * .38 + (1 - p1) * 14;
          ctx.fillText(lines[0] || '두려워말라', textLeft, y1);
          ctx.restore();
        }

        // 2번째 줄 (내가 너와 - 메인 강조 골드)
        if (p2 > 0) {
          ctx.save();
          ctx.globalAlpha = p2;
          ctx.fillStyle = '#ffd166';
          ctx.font = `900 ${portrait ? 36 : 54}px ${fontFace}`;
          ctx.textAlign = 'left';
          ctx.shadowColor = 'rgba(0,0,0,0.9)';
          ctx.shadowBlur = 24;
          const y2 = H * .53 + (1 - p2) * 14;
          ctx.fillText(lines[1] || '내가 너와', textLeft, y2);
          ctx.restore();
        }

        // 3번째 줄 (함께 함이라 - 화이트)
        if (p3 > 0) {
          ctx.save();
          ctx.globalAlpha = p3;
          ctx.fillStyle = '#ffffff';
          ctx.font = `700 ${portrait ? 26 : 40}px ${fontFace}`;
          ctx.textAlign = 'left';
          ctx.shadowColor = 'rgba(0,0,0,0.85)';
          ctx.shadowBlur = 16;
          const y3 = H * .67 + (1 - p3) * 14;
          ctx.fillText(lines[2] || '함께 함이라', textLeft, y3);
          ctx.restore();
        }

        // 하단 닫는 따옴표 ❞ (따옴표 아래도 나타나게!)
        if (pQClose > 0) {
          ctx.save();
          ctx.globalAlpha = pQClose;
          ctx.fillStyle = '#fbbf24';
          ctx.font = `900 ${portrait ? 32 : 44}px ${fontFace}`;
          ctx.textAlign = 'left';
          ctx.shadowColor = 'rgba(0,0,0,0.7)';
          ctx.shadowBlur = 12;
          ctx.fillText('❞', textLeft + (portrait ? W * .40 : W * .35), H * .77);
          ctx.restore();
        }

        // ── 우측: '뿅!' 하고 나타나는 풍성한 히어로 심볼 ──
        const heroT = Math.max(0, (f - 45) / 25);
        if (heroT > 0) {
          // 스프링 바운스 계수 근사 (140 stiffness, 10 damping)
          const heroBounce = 1 - Math.exp(-heroT * 4) * Math.cos(heroT * 8);
          const floatY = Math.sin(Math.max(0, f - 55) * 0.08) * 8;
          const pulse = 1 + Math.sin(Math.max(0, f - 55) * 0.06) * 0.03;

          const hCX = portrait ? W * .65 : W * .72;
          const hCY = H * .50;

          // 1) 등장 시 퍼지는 골드 글로우 링 (Shockwave)
          const ringScale = Math.min(2.2, 0.4 + heroT * 1.4);
          const ringAlpha = Math.max(0, 1 - (f - 45) / 35);
          if (ringAlpha > 0) {
            ctx.save();
            ctx.globalAlpha = ringAlpha * .6;
            ctx.strokeStyle = '#ffd166';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(hCX, hCY, 100 * ringScale, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }

          // 2) 메인 히어로 심볼 (비둘기/기도손/후광)
          ctx.save();
          ctx.translate(hCX, hCY + floatY);
          const totalScale = Math.max(0, heroBounce) * pulse;
          ctx.scale(totalScale, totalScale);

          // 배경 은은한 골드 후광
          const glowRad = ctx.createRadialGradient(0, 0, 10, 0, 0, 140);
          glowRad.addColorStop(0, 'rgba(255, 209, 102, 0.35)');
          glowRad.addColorStop(1, 'rgba(255, 209, 102, 0)');
          ctx.fillStyle = glowRad;
          ctx.beginPath();
          ctx.arc(0, 0, 140, 0, Math.PI * 2);
          ctx.fill();

          // 메인 이모티콘 🕊️ / 기도 손
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = `${portrait ? 110 : 140}px sans-serif`;
          ctx.shadowColor = 'rgba(0,0,0,0.8)';
          ctx.shadowBlur = 30;
          ctx.fillText('🕊️', 0, 0);

          // 회전하는 별빛 반짝이 ✨
          ctx.save();
          ctx.translate(portrait ? 45 : 60, portrait ? -45 : -60);
          ctx.rotate((f * 2 * Math.PI) / 180);
          ctx.font = `${portrait ? 34 : 44}px sans-serif`;
          ctx.fillText('✨', 0, 0);
          ctx.restore();

          ctx.restore();
        }
      }"""

html = re.sub(render_code1_re, new_render_code1, html, count=1)

# 3. 기본 상태 텍스트도 사용자의 "두려워말라 / 내가 너와 / 함께 함이라"로 설정
html = re.sub(r"line1:\s*['\"][^'\"]*['\"]", "line1: '두려워말라'", html)
html = re.sub(r"line2:\s*['\"][^'\"]*['\"]", "line2: '내가 너와'", html)
html = re.sub(r"line3:\s*['\"][^'\"]*['\"]", "line3: '함께 함이라'", html)

with open('dist/index.html', 'w', encoding='utf-8') as f:
    f.write(html)

with open('vertical_verse.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Applied RedHeroScriptureScene to dist/index.html and vertical_verse.html successfully!")
