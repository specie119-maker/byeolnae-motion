const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5500;
const BASE_DIR = __dirname;

const server = http.createServer((req, res) => {
  // CORS 허용
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // 1. 강제 다운로드 전용 API: /download?file=videos/Byeolnae_Church_Intro.mp4
  if (pathname === '/download') {
    const fileRel = parsedUrl.searchParams.get('file') || '';
    const safePath = path.normalize(path.join(BASE_DIR, fileRel));
    
    if (safePath.startsWith(BASE_DIR) && fs.existsSync(safePath) && fs.statSync(safePath).isFile()) {
      const filename = path.basename(safePath);
      res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
        'Content-Length': fs.statSync(safePath).size
      });
      return fs.createReadStream(safePath).pipe(res);
    } else {
      res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
      return res.end('파일을 찾을 수 없습니다.');
    }
  }

    // 2-2. 캔버스 녹화 영상 -> 정품 MP4 (H.264) 변환 다운로드 API: /convert-video (POST)
  if (pathname === '/convert-video' && req.method === 'POST') {
    const { execFile } = require('child_process');
    const tempDir = path.join(BASE_DIR, 'temp_convert');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    let bodyChunks = [];
    req.on('data', chunk => bodyChunks.push(chunk));
    req.on('end', () => {
      try {
        const bodyStr = Buffer.concat(bodyChunks).toString('utf-8');
        const data = JSON.parse(bodyStr);
        const { videoBase64, filename = '말씀모션영상.mp4' } = data;

        if (!videoBase64) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: '비디오 데이터(videoBase64)가 필요합니다.' }));
        }

        console.log(`[convert-video] 변환 요청 접수: ${filename}, 데이터 크기: ${Math.round(bodyStr.length / 1024)}KB`);

        const id = Date.now() + '_' + Math.random().toString(36).substring(2, 7);
        const tempIn = path.join(tempDir, `in_${id}.webm`);
        const tempOut = path.join(tempDir, `out_${id}.mp4`);

        const videoBuffer = Buffer.from(videoBase64.includes(';base64,') ? videoBase64.split(';base64,')[1] : videoBase64, 'base64');
        fs.writeFileSync(tempIn, videoBuffer);

        const ffmpegPath = fs.existsSync('/opt/homebrew/bin/ffmpeg') ? '/opt/homebrew/bin/ffmpeg' : 'ffmpeg';
        const ffmpegArgs = [
          '-y',
          '-i', tempIn,
          '-c:v', 'libx264',
          '-preset', 'veryfast',
          '-pix_fmt', 'yuv420p',
          '-movflags', '+faststart',
          tempOut
        ];

        execFile(ffmpegPath, ffmpegArgs, { maxBuffer: 30 * 1024 * 1024 }, (err, stdout, stderr) => {
          if (err || !fs.existsSync(tempOut)) {
            console.error('[convert-video] FFmpeg 변환 에러:', err, stderr);
            if (fs.existsSync(tempIn)) fs.unlinkSync(tempIn);
            if (fs.existsSync(tempOut)) fs.unlinkSync(tempOut);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'MP4 변환 실패' }));
          }

          const stat = fs.statSync(tempOut);
          const safeName = encodeURIComponent(filename);
          console.log(`[convert-video] 변환 성공! 파일 크기: ${stat.size} bytes`);
          res.writeHead(200, {
            'Content-Type': 'video/mp4',
            'Content-Disposition': `attachment; filename="${safeName}"`,
            'Content-Length': stat.size
          });

          const stream = fs.createReadStream(tempOut);
          stream.pipe(res);
          stream.on('close', () => {
            try {
              if (fs.existsSync(tempIn)) fs.unlinkSync(tempIn);
              if (fs.existsSync(tempOut)) fs.unlinkSync(tempOut);
            } catch (e) {}
          });
        });
      } catch (err) {
        console.error('[convert-video] 처리 중 에러:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // 2. MP3 -> MP4 변환 전용 API: /convert-mp3 (POST)
  if (pathname === '/convert-mp3' && req.method === 'POST') {
    const { execFile } = require('child_process');
    const tempDir = path.join(BASE_DIR, 'temp_convert');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    let bodyChunks = [];
    req.on('data', chunk => bodyChunks.push(chunk));
    req.on('end', () => {
      try {
        const bodyStr = Buffer.concat(bodyChunks).toString('utf-8');
        const data = JSON.parse(bodyStr);
        const { audioBase64, imageBase64, mode = 'motion', filename = '성도말씀_찬양영상.mp4' } = data;

        if (!audioBase64) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: '오디오 데이터(audioBase64)가 필요합니다.' }));
        }

        const id = Date.now() + '_' + Math.random().toString(36).substring(2, 7);
        const tempAudio = path.join(tempDir, `audio_${id}.mp3`);
        const tempImage = path.join(tempDir, `image_${id}.png`);
        const tempOut = path.join(tempDir, `out_${id}.mp4`);

        // 오디오 base64 디코딩 및 임시 저장
        const audioBuffer = Buffer.from(audioBase64.replace(/^data:audio\/\w+;base64,/, ''), 'base64');
        fs.writeFileSync(tempAudio, audioBuffer);

        const ffmpegPath = '/opt/homebrew/bin/ffmpeg';
        let ffmpegArgs = [];

        if (mode === 'card' && imageBase64) {
          // 말씀 카드 이미지 + MP3 음원 합성
          const imgBuffer = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
          fs.writeFileSync(tempImage, imgBuffer);
          ffmpegArgs = [
            '-y',
            '-loop', '1',
            '-i', tempImage,
            '-i', tempAudio,
            '-c:v', 'libx264',
            '-tune', 'stillimage',
            '-c:a', 'aac',
            '-b:a', '192k',
            '-pix_fmt', 'yuv420p',
            '-shortest',
            tempOut
          ];
        } else {
          // 렘 33:2 고화질 모션 비디오 루프 + MP3 음원 합성
          const motionVideo = path.join(BASE_DIR, 'videos', 'Jeremiah33_Shorts.mp4');
          ffmpegArgs = [
            '-y',
            '-stream_loop', '-1',
            '-i', motionVideo,
            '-i', tempAudio,
            '-c:v', 'copy',
            '-c:a', 'aac',
            '-b:a', '192k',
            '-shortest',
            tempOut
          ];
        }

        execFile(ffmpegPath, ffmpegArgs, (err, stdout, stderr) => {
          if (err || !fs.existsSync(tempOut)) {
            console.error('FFmpeg convert error:', err, stderr);
            // 청소
            if (fs.existsSync(tempAudio)) fs.unlinkSync(tempAudio);
            if (fs.existsSync(tempImage)) fs.unlinkSync(tempImage);
            if (fs.existsSync(tempOut)) fs.unlinkSync(tempOut);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'FFmpeg 영상 변환에 실패했습니다.' }));
          }

          const stat = fs.statSync(tempOut);
          const safeDownloadName = encodeURIComponent(filename);
          res.writeHead(200, {
            'Content-Type': 'video/mp4',
            'Content-Disposition': `attachment; filename="${safeDownloadName}"`,
            'Content-Length': stat.size
          });

          const readStream = fs.createReadStream(tempOut);
          readStream.pipe(res);
          readStream.on('close', () => {
            // 변환 완료 후 임시 파일 자동 정리
            try {
              if (fs.existsSync(tempAudio)) fs.unlinkSync(tempAudio);
              if (fs.existsSync(tempImage)) fs.unlinkSync(tempImage);
              if (fs.existsSync(tempOut)) fs.unlinkSync(tempOut);
            } catch (cleanupErr) {
              console.warn('Temp cleanup warning:', cleanupErr);
            }
          });
        });

      } catch (err) {
        console.error('Convert MP3 error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // 3. 정적 웹 파일 서빙
  if (pathname === '/' || pathname === '') {
    pathname = '/vertical_verse.html';
  }

  const filePath = path.join(BASE_DIR, pathname);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.m4a': 'audio/mp4',
      '.mp4': 'video/mp4',
      '.json': 'application/json'
    };

    // MP4/MP3 파일 직접 접근 시 다운로드 파라미터 처리
    const headers = { 
      'Content-Type': mimeTypes[ext] || 'application/octet-stream',
      'Cache-Control': ext === '.html' ? 'no-cache, no-store, must-revalidate' : 'public, max-age=3600',
      'Pragma': 'no-cache',
      'Expires': '0'
    };
    if ((ext === '.mp4' || ext === '.mp3') && parsedUrl.searchParams.has('download')) {
      headers['Content-Disposition'] = `attachment; filename="${encodeURIComponent(path.basename(filePath))}"`;
    }

    res.writeHead(200, headers);
    return fs.createReadStream(filePath).pipe(res);
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('404 Not Found');
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 별내사랑의교회 모션그래픽 다운로드 서버가 시작되었습니다!`);
  console.log(`👉 브라우저 주소: http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
