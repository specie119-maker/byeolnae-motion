#!/bin/zsh
set -euo pipefail

# 1080 × 1920 / 8-second vertical short: “오늘 기분 리프레시 · 나의 생명”
ROOT="$(cd "$(dirname "$0")" && pwd)"
OUT="$ROOT/videos/오늘기분_리프레시_나의생명_생명의면류관.mp4"
FONT='/System/Library/Fonts/Supplemental/AppleGothic.ttf'

ffmpeg -y \
  -f lavfi -i "color=c=#072e2b:s=1080x1920:r=30:d=8" \
  -loop 1 -i "$ROOT/images/crown_of_life.png" \
  -filter_complex "
    [0:v]drawbox=x=0:y=0:w=1080:h=1920:color=#0c4f43@0.75:t=fill,
    drawbox=x=0:y=1240:w=1080:h=680:color=#031c22@0.82:t=fill,
    drawgrid=w=120:h=120:t=2:c=#f6d365@0.09,
    drawtext=fontfile=${FONT}:text='오늘 기분':fontcolor=#fff8d4:fontsize=112:x=(w-text_w)/2:y=220:alpha='if(lt(t,0.15),0,if(lt(t,0.65),(t-0.15)/0.5,1))',
    drawtext=fontfile=${FONT}:text='리프레시':fontcolor=#f7c948:fontsize=172:x=(w-text_w)/2:y=355:alpha='if(lt(t,0.65),0,if(lt(t,1.15),(t-0.65)/0.5,1))',
    drawtext=fontfile=${FONT}:text='나의 생명':fontcolor=white:fontsize=84:x=(w-text_w)/2:y=560:alpha='if(lt(t,1.1),0,if(lt(t,1.6),(t-1.1)/0.5,1))',
    drawtext=fontfile=${FONT}:text='오늘도 주님 안에서':fontcolor=#d8f3dc:fontsize=50:x=(w-text_w)/2:y=755:alpha='if(lt(t,1.8),0,if(lt(t,2.2),(t-1.8)/0.4,1))',
    drawtext=fontfile=${FONT}:text='새 힘을 얻습니다':fontcolor=#d8f3dc:fontsize=50:x=(w-text_w)/2:y=825:alpha='if(lt(t,2.05),0,if(lt(t,2.45),(t-2.05)/0.4,1))',
    drawtext=fontfile=${FONT}:text='시련을 견디어 낸 자가':fontcolor=white:fontsize=54:x=(w-text_w)/2:y=1370:alpha='if(lt(t,3.0),0,if(lt(t,3.5),(t-3.0)/0.5,1))',
    drawtext=fontfile=${FONT}:text='생명의 면류관을 얻을 것임이라':fontcolor=#f7c948:fontsize=52:x=(w-text_w)/2:y=1455:alpha='if(lt(t,3.4),0,if(lt(t,3.9),(t-3.4)/0.5,1))',
    drawtext=fontfile=${FONT}:text='야고보서 1\\:12':fontcolor=#d8f3dc:fontsize=38:x=(w-text_w)/2:y=1550:alpha='if(lt(t,3.8),0,if(lt(t,4.2),(t-3.8)/0.4,1))'[base];
    [1:v]scale=620:-1,format=rgba,colorchannelmixer=aa=0.96,
    fade=t=in:st=2.25:d=0.75:alpha=1,
    fade=t=out:st=7.6:d=0.4:alpha=1[crown];
    [base][crown]overlay=x=(W-w)/2:y=805:enable='between(t,2.25,8)'[v]
  " \
  -map '[v]' -t 8 -r 30 -c:v libx264 -pix_fmt yuv420p -movflags +faststart "$OUT"

echo "$OUT"
