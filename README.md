# Portfolio

React + Vite + Tailwind site that showcases GitHub repositories and coding activity.

**Repo metadata is not fetched in the browser.** A Node script pulls GitHub (and LeetCode) data into JSON under `public/`, and the site only reads those files. A scheduled GitHub Action refreshes them daily.

## Quick start

```bash
npm install
cp .env.example .env   # optional: GITHUB_TOKEN for local fetch
npm run fetch-data     # writes public/data/projects.json + activity JSON
npm run dev
```

## Add a project

Edit `data/repo-urls.json` and add a GitHub URL. Optional per-repo fields live in `data/project-overrides.json` (keyed by `owner/repo`):

```json
{
  "frederickpek/trueshot": {
    "deployUrl": "https://frederickpek.github.io/trueshot",
    "featured": true,
    "description": "Custom blurb"
  }
}
```

**Live demo** links come from the repo’s GitHub **Website** field (`homepage` in the API), or from `deployUrl` in overrides. A README link alone is not picked up automatically.

Then refresh the cache:

```bash
npm run fetch-data
```

## Secrets & env (safe for production)

| Variable | Where | Purpose |
| --- | --- | --- |
| `GITHUB_TOKEN` | Local `.env` or GitHub Actions secret `GH_PAT` | **Server-side only** — used by `fetch-data`, never shipped to visitors |
| `LEETCODE_USERNAME` | Local env or repo **Variable** `LEETCODE_USERNAME` | LeetCode prefetch in CI |
| `VITE_BASE_PATH` | `.env` at **build** time | e.g. `/portfolio/` for GitHub Pages project sites |
| `VITE_LEETCODE_USERNAME` | `.env` | UI only: override/hide LeetCode section |

### Deployed site (what runs in the visitor’s browser)

The production app only **GETs static JSON** from your host (`public/data/projects.json`, `public/activity/*.json`). It does **not** call `api.github.com` and has **no** GitHub token in source or env. Tokens are used only when **you** (or the sync workflow) run `npm run fetch-data` on a machine/CI runner, then commit/deploy the updated JSON.

### Local `.env`

```env
GITHUB_TOKEN=ghp_...   # read-only PAT, optional but helps rate limits when fetching many repos
```

Restart is not required for fetch scripts; only restart `npm run dev` when changing `VITE_*` vars.

### GitHub Actions

Workflow: `.github/workflows/sync-portfolio-data.yml`

- Runs **daily** and on pushes that change `data/repo-urls.json` / overrides
- Uses `secrets.GITHUB_TOKEN` by default (fine for public repos)
- Optional: add repository secret **`GH_PAT`** if you need a personal PAT (e.g. private repos you own)
- Optional: repository variable **`LEETCODE_USERNAME`**

The job commits updated files under `public/data/` and `public/activity/` when they change.

## GitHub Pages

Workflow: `.github/workflows/deploy-pages.yml` — builds with `VITE_BASE_PATH=/portfolio/` and publishes `dist/`.

**Repository name must be `portfolio`** so the site URL is `https://<username>.github.io/portfolio/`.

After the first push:

1. **Settings → Pages → Build and deployment → Source:** GitHub Actions (not “Deploy from a branch”).
2. Wait for the **Deploy GitHub Pages** workflow to finish on the Actions tab.

The deploy job does not run `fetch-data`; it ships whatever JSON is already in `public/` on that commit. Commit refreshed JSON before pushing, or push once and let **Sync portfolio data** commit JSON, then push again (or re-run deploy) so the live site picks it up.

## Profile

Edit `src/config/profile.ts` for name, tagline, and GitHub username (activity calendar).

## Scripts

| Command | Description |
| --- | --- |
| `npm run fetch-data` | Fetch all repo cards + LeetCode cache (uses `GITHUB_TOKEN`) |
| `npm run dev` | Dev server |
| `npm run build` | Production bundle (expects JSON already in `public/`) |
| `npm run preview` | Preview production build |

## Note on activity widgets

Project cards, GitHub contributions, and LeetCode calendars all read from **`public/data/`** and **`public/activity/`** JSON produced by `npm run fetch-data` (refreshed daily by the GitHub Action). No GitHub PAT is shipped to the browser.
