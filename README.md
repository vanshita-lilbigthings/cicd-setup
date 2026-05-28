# Node.js REST API — CI/CD Template

A reusable Node.js REST API with a full GitHub Actions CI/CD pipeline.

## Project Structure

```
node-api/
├── src/
│   └── index.js                        # Main API
├── tests/
│   └── api.test.js                     # Tests
├── .github/
│   ├── workflows/
│   │   └── ci.yml                      # CI/CD Pipeline
│   └── pull_request_template.md        # PR Template
├── .eslintrc.json                       # Lint rules
├── package.json
└── README.md
```

## CI/CD Pipeline (GitHub Actions)

Every push or PR triggers this pipeline in order:

```
Lint → Test → (PR Check) → Deploy
```

| Job | Trigger | What it does |
|-----|---------|--------------|
| Lint | Every push/PR | Runs ESLint — fails if code quality issues |
| Test | After lint passes | Runs Jest tests + generates coverage report |
| PR Check | PRs only | Validates PR title format (feat/fix/chore/docs) |
| Deploy | Push to main only | Deploys to Webflow Cloud via CLI |

## Setup from Scratch

### 1. Clone and install
```bash
git clone <your-repo>
cd node-api
npm install
```

### 2. Run locally
```bash
npm run dev
```

### 3. Run tests
```bash
npm test
```

### 4. Run lint
```bash
npm run lint
```

### 5. Add GitHub Secrets
Go to: GitHub Repo → Settings → Secrets → Actions → New secret

| Secret | Value |
|--------|-------|
| `WEBFLOW_TOKEN` | Your Webflow API token |

### 6. Enable Branch Protection
Go to: GitHub Repo → Settings → Branches → Add rule for `main`
- ✅ Require status checks to pass (lint, test)
- ✅ Require pull request reviews before merging

## PR Title Format
PRs must follow this format or the pipeline will fail:
```
feat: add user login
fix: resolve null error on /users
chore: update dependencies
docs: update README
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| GET | /users | Get all users |
| GET | /users/:id | Get user by ID |
| POST | /users | Create a user |
