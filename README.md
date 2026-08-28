# 실적 캘린더

삼성전자, LG전자, SK하이닉스, 현대자동차의 공식 실적 발표 일정을 월별로 확인하는 정적 웹사이트입니다.

## 로컬 실행

```bash
npm install
npm run dev
```

## GitHub Pages 배포

저장소의 **Settings → Pages → Source**를 **GitHub Actions**로 선택한 뒤 `main` 브랜치에 푸시하면 자동 배포됩니다.

일정 데이터는 `src/main.js`의 `events` 배열에서 관리합니다. 발표일은 각 기업의 공식 IR 자료를 기준으로 하며, 향후 일정은 공식 공시 후 추가합니다.
