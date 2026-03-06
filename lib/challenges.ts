export const CHALLENGES = [
  {
    id: 1,
    title: "눈에 보이지 않는 것들",
    difficulty: 1,
    description: "화면에 없는 비밀을 찾아라",
    category: "View Source",
    flag: "FLAG{y0u_f0und_th3_s3cr3t}",
  },
  {
    id: 2,
    title: "쿠키는 달콤하다",
    difficulty: 2,
    description: "브라우저 쿠키를 조작해 관리자가 되어보자",
    category: "Cookie Manipulation",
    flag: "FLAG{c00k13s_4r3_t4sty_but_d4ng3r0us}",
  },
  {
    id: 3,
    title: "마법의 따옴표",
    difficulty: 3,
    description: "특별한 입력으로 로그인을 우회해보자",
    category: "SQL Injection",
    flag: "FLAG{sql_1nj3ct10n_1s_p0w3rful}",
  },
];

export type Challenge = (typeof CHALLENGES)[number];
