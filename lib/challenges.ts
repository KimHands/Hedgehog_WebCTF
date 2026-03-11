export const CHALLENGES = [
  {
    id: 1,
    title: "보이지 않는 잉크",
    difficulty: 1,
    description: "페이지 소스 코드에 숨겨진 비밀을 찾아라",
    category: "View Source",
    flag: "FLAG{html_c0mm3nts_4r3_v1s1bl3}",
  },
  {
    id: 2,
    title: "브라우저의 기억",
    difficulty: 2,
    description: "브라우저 로컬 저장소를 조작해 관리자가 되어보자",
    category: "Client Storage",
    flag: "FLAG{l0c4l_st0r4g3_1snt_s3cr3t}",
  },
  {
    id: 3,
    title: "개발자 도구의 마법",
    difficulty: 3,
    description: "콘솔을 통해 숨겨진 함수를 찾아 실행해보자",
    category: "JS Console",
    flag: "FLAG{c0ns0l3_1s_y0ur_fr13nd}",
  },
];

export const SPEEDRUN_CHALLENGES = [
  {
    id: 1,
    title: "인코딩된 비밀",
    difficulty: 2,
    description: "JS 소스의 인코딩된 시크릿을 찾아 디코딩하라",
    category: "JS Obfuscation",
    flag: "FLAG{b4s364_1s_n0t_3ncrypt10n}",
  },
  {
    id: 2,
    title: "헤더를 보내라",
    difficulty: 2,
    description: "HTTP 요청 헤더를 조작해 API 접근 제어를 우회하라",
    category: "HTTP Headers",
    flag: "FLAG{cust0m_h34d3rs_byp4ss_4ccess}",
  },
  {
    id: 3,
    title: "UNION 탈출",
    difficulty: 3,
    description: "UNION 기반 SQL Injection으로 숨겨진 테이블을 조회하라",
    category: "Advanced SQLi",
    flag: "FLAG{un10n_s3l3ct_pwn3d}",
  },
];

export type Challenge = (typeof CHALLENGES)[number];
