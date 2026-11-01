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

## Cloudflare Pages 배포

이 프로젝트는 정적 Astro 사이트입니다. Cloudflare Pages의 Git 연동으로 빌드하고 `dist`를 배포합니다. 설정 절차는 [Cloudflare Git 연동 가이드](https://developers.cloudflare.com/pages/get-started/git-integration/)를 따릅니다.

### 최초 연결

1. 로컬 커밋을 GitHub `main`에 직접 푸시합니다.
2. [Cloudflare 대시보드](https://dash.cloudflare.com/)에 로그인합니다.
3. **Workers & Pages → Create application → Pages → Connect to Git**를 선택합니다.
4. GitHub를 연결하고 Cloudflare GitHub 앱에 `subaksubak/portfolio` 저장소 접근을 허용합니다.
5. 저장소 `subaksubak/portfolio`를 선택하고 빌드 설정을 입력합니다.

| 설정 | 입력값 |
| --- | --- |
| Project name | 원하는 사용 가능한 이름. 생성 화면에서 실제 `pages.dev` 주소를 확인합니다. |
| Production branch | `main` |
| Framework preset | `Astro` |
| Root directory | 비워 둠. 저장소 루트를 사용합니다. |
| Build command | `npm run check && npm run build` |
| Build output directory | `dist` |

6. Production 환경변수를 설정합니다.

| 변수 | 입력값 |
| --- | --- |
| `NODE_VERSION` | `22.23.4` (`.node-version`과 동일) |
| `BASE_PATH` | `/` |
| `SITE_URL` | 생성 화면에 표시된 실제 운영 주소. 예: `https://<project-name>.pages.dev` |

7. **Save and Deploy**를 실행합니다.
8. 빌드 성공 후 운영 주소에서 메인 페이지, Contact 탭, 프로젝트 상세 페이지를 확인합니다.

정적 출력이므로 Cloudflare adapter, Wrangler 설정, API 토큰은 필요하지 않습니다. Cloudflare는 연결된 GitHub 저장소에서 소스를 가져옵니다. 이 개발 환경의 `gh auth login`은 Cloudflare 연결에 필요하지 않습니다.

연결 후에는 직접 `main`에 푸시할 때마다 Cloudflare가 운영 사이트를 자동 배포합니다. 기존 GitHub Pages 워크플로도 같은 푸시에서 실행됩니다.

### Preview 환경

프로젝트의 **Settings → Variables and Secrets**에서 Preview에도 `NODE_VERSION=22.23.4`와 `BASE_PATH=/`를 설정합니다. Preview의 `SITE_URL`은 비워 둡니다. `main` 이외의 브랜치로 푸시하면 미리보기 배포를 만들 수 있습니다.

`astro.config.mjs`는 `SITE_URL`, Cloudflare의 `CF_PAGES_URL`, 기본 GitHub Pages 주소 순서로 사이트 URL을 선택합니다. 운영 환경의 `SITE_URL`은 고정 운영 주소를 canonical URL에 사용하고, Preview는 해당 배포 URL을 사용합니다. Production의 `SITE_URL`을 Preview에 복사하지 마세요.

빌드 명령과 출력 경로는 [빌드 설정](https://developers.cloudflare.com/pages/configuration/build-configuration/), Node 버전 지정은 [빌드 이미지](https://developers.cloudflare.com/pages/configuration/build-image/) 문서를 참고하세요.

### 커스텀 도메인 연결

도메인이 없어도 `pages.dev` 주소로 운영할 수 있습니다. 커스텀 도메인을 사용할 때는 Pages 프로젝트의 **Custom domains**에서 연결 절차를 진행합니다. 연결 후 Production의 `SITE_URL`을 `https://실제도메인`으로 바꾸고 다시 배포합니다.

### 로컬에서 Cloudflare 설정 확인

아래 주소는 검증용 예시입니다. 실제 배포 프로젝트를 생성하지 않습니다.

```sh
npm run check
SITE_URL=https://portfolio-example.pages.dev BASE_PATH=/ npm run build
BASE_PATH=/ npm run preview
```

운영 빌드의 `dist/index.html`에서 canonical URL이 설정한 `SITE_URL`인지 확인합니다. 프로젝트 링크는 `/projects/sample-project/`, Contact 링크는 `/#contact`여야 합니다.

Preview URL 자동 선택은 다음 명령으로 확인합니다. 이때 `SITE_URL`은 설정하지 않습니다.

```sh
env -u SITE_URL CF_PAGES_URL=https://preview-example.pages.dev BASE_PATH=/ npm run build
```

## pstack

58개 pstack 스킬을 프로젝트의 `.agents/skills/`에 설치했습니다. 다음 Codex 턴부터 이 저장소에서 인식할 수 있습니다. 다른 환경에서 clone한 뒤 `npm run setup:pstack`으로 같은 버전을 복원할 수 있습니다. 스킬 원본은 Git에서 제외했습니다. 필요한 스킬을 선택해서 사용하세요. 설치 기록과 라이선스는 `PSTACK.md`와 `licenses/pstack-MIT.txt`에 있습니다. 모델 설정과 자동 위임은 별도로 활성화하지 않았습니다.
