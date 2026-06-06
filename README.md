# layer-harness

[docs.md](docs.md)의 모듈 레이어 구현과 바 메뉴 POC 예제를 담은 pnpm 모노레포입니다.

## 구조

```
package/
  layer/                    @layer-harness/layer — createModuleComponent, UIModeModule, ConditionModeModule
  eslint-plugin-module/     @layer-harness/eslint-plugin-module — 모듈 규약 ESLint 규칙

example/
  bar-menu/                 @layer-harness/example-bar-menu — Vite 앱 (domain + spec)
```

## 스크립트

```bash
pnpm install
pnpm dev          # example/bar-menu 개발 서버
pnpm lint         # 전 패키지 lint
pnpm typecheck    # 전 패키지 타입 검사
pnpm build        # 전 패키지 빌드
```
