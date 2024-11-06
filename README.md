# eiptest_mongo_light_api

### 요구사항

- Node.js 설치
- PM2 설치 (서버 프로세스 관리를 위해)

### PM2 기반 설치 방법

- pm2 설치
```
npm install -g pm2
```

- 프로젝트 디렉토리로 이동
```
cd ~/eiptest_mongo_light_api
```
- 의존성 설치
```
npm install
```
- pm2를 통해 서버 시작
```
pm2 start src/app.js --name eiptest_mongo_api
```
- 서버 상태 확인
```
pm2 status
```

### 서버 재배포
```
cd ~/eiptest_mongo_light_api
git pull origin main
npm install
pm2 delete eiptest_mongo_api
pm2 start src/app.js --name eiptest_mongo_api
pm2 status
```
### PM2의 추가 명령어
```
//로그 확인
pm2 logs eiptest_mongo_api
//서버 중지
pm2 stop eiptest_mongo_api
//서버 삭제
pm2 delete eiptest_mongo_api
```

### API 설명
```
POST /api/credentials:

uri, tokenId, pTokenId(optional), credential, password(optional), hash 값을 요청 본문으로 받습니다.
비밀번호가 존재하면 bcrypt로 해싱한 후 Credential 컬렉션에 저장합니다.
tokenId와 hash 값을 DocumentHash 컬렉션에 저장합니다.

GET /api/credentials:

tokenId와 password(optional)를 쿼리 파라미터로 받습니다.
tokenId에 해당하는 Credential 문서를 찾고, 비밀번호가 필요할 경우 bcrypt.compare()로 확인합니다.
비밀번호가 일치하면 Credential 문서를 반환합니다.

GET /api/credentials:
삭제(논리삭제)
```

### 테스트 예시
```
//새로운 Credential 과 DocumentHash doc 추가

curl -X POST http://localhost:3000/api/credentials \
   -H "Content-Type: application/json" \
   -d '{
      "uri": "https://example.com/resource",
      "tokenId": "112345",
      "pTokenId": "67890",
      "credential": {
         "name": "Example Credential",
         "type": "ExampleType"
      },
      "password": "mysecretpassword",
      "hash": "hashvalue12345"
   }'
```
```
//비밀번호가 없는 경우 조회
curl -X GET "http://localhost:3000/api/credentials?tokenId=112345"

//비밀번호가 있는 경우 조회
curl -X GET "http://localhost:3000/api/credentials?tokenId=112345&password=mysecretpassword"
```
```
//tokenId베이스로 Credential doc 제거 (논리삭제)

curl -X DELETE http://localhost:3000/api/credentials/112345
```