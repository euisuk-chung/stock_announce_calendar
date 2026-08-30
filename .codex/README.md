# 실적 캘린더 Codex 서브에이전트

이 디렉터리는 주간 IR 점검에 사용하는 영구 서브에이전트 역할을 저장합니다.

## 역할

| 역할 이름 | 설정 파일 | 책임 |
| --- | --- | --- |
| `samsung_ir` | `agents/samsung-ir.toml` | 삼성전자 공식 IR 조사 |
| `lg_ir` | `agents/lg-ir.toml` | LG전자 공식 IR 조사 |
| `sk_hynix_ir` | `agents/sk-hynix-ir.toml` | SK하이닉스 공식 IR 조사 |
| `hyundai_ir` | `agents/hyundai-ir.toml` | 현대자동차 공식 IR 조사 |
| `toss_verifier` | `agents/toss-verifier.toml` | 토스증권 교차검증 |
| `calendar_publisher` | `agents/calendar-publisher.toml` | 기록·캘린더 반영 및 배포 |

역할 등록은 `.codex/config.toml`에서 관리합니다. 경로는 해당 파일을 기준으로 상대 해석되므로 저장소를 복제하거나 공유해도 동일한 구조를 유지해야 합니다.

기업 조사 에이전트는 읽기와 결과 반환만 담당합니다. 파일 변경과 배포는 `calendar_publisher` 역할만 수행하도록 책임을 분리했습니다.
