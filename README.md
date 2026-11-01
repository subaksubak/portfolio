# Designer Portfolio

Astro 기반 JAMstack 포트폴리오입니다. Markdown 프로젝트를 빌드 시 HTML로 생성합니다.

## 개발과 실시간 미리보기

Node 버전은 `.nvmrc` / `.node-version`에 고정되어 있습니다.

이 환경에는 mise로 Node 설치를 완료했습니다. mise를 사용하면:

```sh
mise install
mise exec -- npm ci
mise exec -- npm run dev
```

nvm을 사용하는 다른 환경에서는:

```sh
nvm install
nvm use
npm ci
npm run dev
```

http://localhost:4321 에서 확인합니다. `.astro`, CSS, 프로젝트 Markdown을 저장하면 개발 서버가 변경을 감지하고 브라우저를 갱신합니다. 원격 호스트에서 개발한다면 IDE의 **4321 포트 포워딩**으로 접속합니다. 개발 서버는 모든 인터페이스에서 수신하므로 신뢰하는 개발 환경에서 사용하세요.

실시간 미리보기는 개발 서버 기능입니다. GitHub Pages는 `main` push 후 Actions 빌드·배포가 끝나면 갱신되며, PR별 미리보기 URL은 제공하지 않습니다. PR은 빌드 검증만 실행합니다.

```sh
npm run check
npm run build
npm run preview
```

`preview`는 마지막 `dist/` 결과를 확인하는 명령이며 실시간 편집용은 아닙니다.

## 콘텐츠 편집

- 메인 소개: `src/pages/index.astro`
- 브랜드, 공통 메타데이터: `src/layouts/Layout.astro`
- 스타일: `src/styles/global.css`
- 프로젝트: `src/content/projects/*.md`
- 이미지: `public/images/`

샘플 프로젝트는 실제 작업으로 교체하세요. Markdown frontmatter에는 `title`, `description`, `category`, `year`가 필요합니다. `order`로 정렬하고 `draft: true`로 목록과 상세 페이지 양쪽에서 제외합니다. 내부 링크와 공개 이미지 경로에는 `import.meta.env.BASE_URL`을 사용해야 GitHub Pages의 하위 경로에서도 동작합니다. Markdown에서 이미지를 직접 연결할 때는 배포 경로에 종속된 `/images/...` 대신 `src/assets/`의 이미지를 상대 경로로 참조하는 방식을 권장합니다.

## GitHub Pages

저장소: https://github.com/subaksubak/portfolio

1. 저장소 **Settings → Pages → Build and deployment → Source → GitHub Actions**를 선택합니다. 관리자 또는 Pages 설정 변경 권한이 필요합니다.
2. `main`에 push하거나 **Actions → Deploy to GitHub Pages → Run workflow**를 실행합니다.
3. 성공한 배포의 URL은 Actions의 `github-pages` environment에서 확인합니다. 기본 예상 주소는 https://subaksubak.github.io/portfolio/ 입니다.

CLI에서 Pages를 처음 활성화할 수도 있습니다.

```sh
gh auth login
gh api --method POST repos/subaksubak/portfolio/pages -f build_type=workflow
```

이미 Pages가 생성되어 있고 Source를 바꿔야 한다면 POST 대신 PUT을 사용합니다.

워크플로가 `configure-pages` 결과에서 `SITE_URL`과 `BASE_PATH`를 읽습니다. `/portfolio/` 경로와 추후 커스텀 도메인 루트에 모두 대응합니다. 개인 토큰을 저장소 시크릿에 넣을 필요 없이 기본 `GITHUB_TOKEN`과 OIDC로 배포합니다.

GitHub Pages와 동일한 경로로 로컬 빌드하려면:

```sh
SITE_URL=https://subaksubak.github.io BASE_PATH=/portfolio npm run build
BASE_PATH=/portfolio npm run preview
```

환경변수는 빌드를 실행하는 프로세스에 전달합니다. `.env.example`은 설정 예시이며 이 프로젝트의 `astro.config.mjs`는 `.env`를 자동으로 읽지 않습니다.

## 이후 Cloudflare Pages 추가

GitHub Pages를 유지하면서 같은 Git 저장소를 Cloudflare Pages에 연결할 수 있습니다. 현재는 Cloudflare 계정·도메인·배포를 생성하지 않았습니다.

| 설정 | 값 |
| --- | --- |
| Production branch | `main` |
| Build command | `npm run check && npm run build` |
| Build output directory | `dist` |
| `NODE_VERSION` | `.node-version`과 같은 값 |
| `SITE_URL` | Cloudflare 배포 도메인의 origin (예: `https://your-project.pages.dev`) |
| `BASE_PATH` | `/` |

정적 출력이므로 Cloudflare SSR adapter나 Worker가 필요하지 않습니다. Cloudflare 연결 후 PR별 Preview deployments를 활성화할 수 있습니다. Preview의 canonical URL을 각 preview 주소로 맞추려면 Preview 환경에서 빌드 명령을 `SITE_URL=$CF_PAGES_URL npm run build`로 설정합니다. GitHub workflow의 경로 변수는 Cloudflare 빌드와 독립적입니다.

## pstack

58개 pstack 스킬을 프로젝트의 `.agents/skills/`에 설치했습니다. 다음 Codex 턴부터 이 저장소에서 인식할 수 있습니다. 다른 환경에서 clone한 뒤 `npm run setup:pstack`으로 같은 버전을 복원할 수 있습니다. 스킬 원본은 Git에서 제외했습니다. 필요한 스킬을 선택해서 사용하세요. 설치 기록과 라이선스는 `PSTACK.md`와 `licenses/pstack-MIT.txt`에 있습니다. 모델 설정과 자동 위임은 별도로 활성화하지 않았습니다.
