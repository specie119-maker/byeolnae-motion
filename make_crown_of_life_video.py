from pathlib import Path
import math
import subprocess
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'videos' / '오늘기분_리프레시_나의생명_생명의면류관.mp4'
FRAMES = ROOT / '.crown_frames'
W, H, FPS, TOTAL = 1080, 1920, 30, 240
FONT = '/System/Library/Fonts/Supplemental/AppleGothic.ttf'

def font(size):
    return ImageFont.truetype(FONT, size)

def ease_out(t):
    t = max(0, min(1, t))
    return 1 - (1 - t) ** 3

def fade(frame, start, duration=14):
    return ease_out((frame - start) / duration)

def centered(draw, text, y, size, fill, alpha=1):
    f = font(size)
    box = draw.textbbox((0, 0), text, font=f)
    x = (W - (box[2] - box[0])) // 2
    shadow = (0, 0, 0, int(120 * alpha))
    draw.text((x + 3, y + 6), text, font=f, fill=shadow)
    draw.text((x, y), text, font=f, fill=(*fill, int(255 * alpha)))

def bg():
    im = Image.new('RGBA', (W, H))
    px = im.load()
    for y in range(H):
        top = (6, 57, 56) if y < 1240 else (2, 24, 31)
        bottom = (13, 103, 83) if y < 1240 else (2, 42, 48)
        mix = (y % 1240) / (1240 if y < 1240 else 680)
        col = tuple(round(a * (1 - mix) + b * mix) for a, b in zip(top, bottom))
        for x in range(W):
            glow = max(0, 1 - math.hypot(x - 540, y - 470) / 850) * 18
            px[x, y] = tuple(min(255, int(v + glow)) for v in col) + (255,)
    return im

def main():
    FRAMES.mkdir(exist_ok=True)
    crown = Image.open(ROOT / 'images' / 'crown_of_life.png').convert('RGBA')
    crown.thumbnail((610, 700), Image.Resampling.LANCZOS)
    base = bg()
    for n in range(TOTAL):
        im = base.copy()
        d = ImageDraw.Draw(im, 'RGBA')
        # subtle decorative grid
        for x in range(-120, W + 120, 120): d.line((x, 0, x + 360, 1240), fill=(246, 211, 101, 14), width=2)
        centered(d, '오늘 기분', 214, 112, (255, 248, 212), fade(n, 4))
        centered(d, '리프레시', 355, 172, (247, 201, 72), fade(n, 23))
        centered(d, '나의 생명', 565, 84, (255, 255, 255), fade(n, 39))
        centered(d, '오늘도 주님 안에서', 748, 50, (216, 243, 220), fade(n, 54))
        centered(d, '새 힘을 얻습니다', 817, 50, (216, 243, 220), fade(n, 64))
        # Crown appears with a gentle pop at 2.4 sec.
        cf = fade(n, 70, 20)
        if cf:
            scale = 0.78 + 0.22 * cf + math.sin(n / 10) * 0.008
            cw, ch = int(crown.width * scale), int(crown.height * scale)
            cr = crown.resize((cw, ch), Image.Resampling.LANCZOS)
            cr.putalpha(cr.getchannel('A').point(lambda a: int(a * cf)))
            shadow = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
            shadow.putalpha(cr.getchannel('A').filter(ImageFilter.GaussianBlur(22)).point(lambda a: int(a * 0.28)))
            x, y = (W - cw) // 2, 805 - int((1 - cf) * 130)
            im.alpha_composite(shadow, (x + 12, y + 32))
            im.alpha_composite(cr, (x, y))
        # Scripture enters after the crown.
        d = ImageDraw.Draw(im, 'RGBA')
        centered(d, '시련을 견디어 낸 자가', 1380, 54, (255, 255, 255), fade(n, 92))
        centered(d, '생명의 면류관을 얻을 것임이라', 1465, 52, (247, 201, 72), fade(n, 104))
        centered(d, '야고보서 1:12', 1560, 38, (216, 243, 220), fade(n, 118))
        centered(d, 'CONNECT AI LAB', 1818, 24, (220, 235, 232), fade(n, 15))
        im.convert('RGB').save(FRAMES / f'{n:04d}.png', quality=92)
    subprocess.run(['ffmpeg', '-y', '-framerate', str(FPS), '-i', str(FRAMES / '%04d.png'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(OUT)], check=True)

if __name__ == '__main__':
    main()
