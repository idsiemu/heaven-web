### nextjs에 apollo 서버와 연동하여 웹 개발진행

# 주요 세팅 정보
    * typescript
    * apollo client
    * graphql
    * redux
    * redux-saga
    * styled-components
    * axios

# 서비스 플로우
* 회원가입 &#8594; 회원가입 타입 선택 &#8594; 특정 회원타입일때 &#8594; 서비스 프로필 등록

# 만들어야할 목록
[x] 로그인
[x] 카카오 로그인
[x] 회원가입
[x] 지역등록
[x] 약력등록
[x] 소개
[x] 전화번호 인증(알리고 api)
[x] 프로필 변경
[x] 주요 연령층
[x] 서비스 소개 이미지
[x] s3 이미지 업로드

# 로그인 상태 관리
* axiosInstance의 intercepter를 사용하여 jwt token refresh 처리
    * src/axios/index.ts 의 intercepter 항목을 참고하면 됩니다.
* 로그인 세션은 덕스 패턴타입의 saga를 통해서 세션값을 유지 및 체크한다.
* 세션 정보 최초 랜더링 플로우
    src/redux/features/session/saga.ts &#8594; watchSessionSaga &#8594; initialSaga &#8594; src/redux/features/session/slice.ts 세션 정보 리덕스영역 저장
