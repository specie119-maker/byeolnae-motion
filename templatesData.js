/**
 * 별내사랑의교회 & CONNECT AI LAB 다중 모션그래픽 템플릿 레지스트리
 * 
 * ➕ 새로운 코드를 추가하는 방법:
 * 아래 TEMPLATES 배열에 새로운 객체를 추가하기만 하면
 * 웹 스튜디오 사이드바, 실시간 캔버스, 코드 뷰어, MP4 다운로드에 자동 반영됩니다!
 */

window.TEMPLATES = [
  {
    id: "church_intro",
    category: "교회 / 예배",
    title: "교회 일러스트 + 환영 말풍선",
    badge: "16:9 롱폼",
    aspect: "16:9",
    width: 1280,
    height: 720,
    durationFrames: 180,
    videoUrl: "./videos/Byeolnae_Church_Intro.mp4",
    defaultProps: {
      tag: "WELCOME",
      header: "별내사랑의교회 온라인 채널",
      text: "안녕하세요? 별내사랑의교회입니다 ✨",
      subText: "은혜와 평강이 함께하시길 축복합니다 ✨",
      stageText: "말씀 안에서 하나되는 은혜로운 공동체 · 주일예배 & 온라인 말씀 묵상",
      branding: "BYEOLNAE SARANG CHURCH"
    },
    code: `// frames=180 size=1280x720
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

const GOLD = '#F5C242';
const TEXT = '안녕하세요? 별내사랑의교회입니다 ✨';
const SUB_TEXT = '은혜와 평강이 함께하시길 축복합니다 ✨';
const LAND = 28;

// 1) 교회 일러스트 Squash & Stretch 낙하 바운스
// 2) spring() 말풍선 팝업 + 글자 한 자씩 타이핑
// 3) 하단 무대 턱 및 상단 헤더 배지 레이아웃`
  },

  {
    id: "pastor_intro",
    category: "목회자 / 안내",
    title: "3D 목사님 캐릭터 인트로",
    badge: "16:9 롱폼",
    aspect: "16:9",
    width: 1280,
    height: 720,
    durationFrames: 180,
    videoUrl: "./videos/Byeolnae_Pastor_Intro.mp4",
    defaultProps: {
      tag: "PASTOR",
      header: "별내사랑의교회 담임목사 환영 인사",
      text: "안녕하세요? 별내사랑의교회입니다 ✨",
      subText: "사랑과 축복으로 여러분을 환영합니다 ✨",
      stageText: "말씀과 기도로 든든히 서 가는 교회 · 온라인 주일예배",
      branding: "BYEOLNAE SARANG CHURCH",
      characterImage: "./images/pastor_char.png"
    },
    code: `// frames=180 size=1280x720
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';

const CHAR = staticFile('images/pastor_char.png'); // 투명 배경 3D 목사님 캐릭터
const TEXT = '안녕하세요? 별내사랑의교회입니다 ✨';
// 목사님 캐릭터 가속 낙하 → 착지 순간 바운스 → 말풍선 타이핑`
  },

  {
    id: "bible_shorts",
    category: "말씀 묵상 쇼츠",
    title: "이사야 41:10 은혜의 손 쇼츠",
    badge: "9:16 쇼츠",
    aspect: "9:16",
    width: 1080,
    height: 1920,
    durationFrames: 270,
    videoUrl: "./videos/BibleShorts_Isaiah4110.mp4",
    defaultProps: {
      tag: "TODAY'S VERSE",
      header: "이사야 41:10",
      words: ["두려워", "말라", "내가 함께함이라"],
      subText: "이사야 41장 10절 말씀 묵상 · BeeCareLab",
      branding: "BIBLE SHORTS"
    },
    code: `// frames=270 size=1080x1920 (9:16 세로형 쇼츠 · 천천히 묵상)
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame} from 'remotion';

// 1) 2초 간격으로 단어가 천천히 여유롭게 페이드 전환 (두려워 → 말라 → 내가 함께함이라)
// 2) 6초 시점 주님의 손 벡터 그래픽 낙하 및 착지 종소리
// 3) 회전하는 12방향 방사형 빛살(God Rays) 백라이트`
  },

  {
    id: "jeremiah_shorts",
    category: "성경 말씀 / 쇼츠",
    title: "일을 지어 성취하시는 하나님",
    badge: "9:16 세로 모션",
    aspect: "9:16",
    width: 1080,
    height: 1920,
    durationFrames: 240,
    videoUrl: "./videos/Jeremiah33_Shorts.mp4",
    htmlUrl: "./vertical_verse.html",
    defaultProps: {
      tag: "TODAY'S SCRIPTURE",
      header: "별내사랑의교회 · 세로 말씀 모션",
      text: "일을 행하시는 여호와\n일을 지어 성취하시는\n하나님",
      verse: "예레미야 33:2",
      youtube: "https://www.youtube.com/@별내사랑의교회1",
      blog: "https://blog.naver.com/aiyamok2015/224430812151"
    },
    code: `// frames=240 size=1080x1920 (부드러운 감속 묵상 모션 · 고운바탕체)
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const JeremiahShortsScene = () => {
  // 성경 말씀: 일을 행하시는 여호와 / 일을 지어 성취하시는 / 하나님
  // 장절: 예레미야 33:2
  // 줄바꿈 방지(nowrap) + 고운바탕체 순차 모션
};`
  }
];

