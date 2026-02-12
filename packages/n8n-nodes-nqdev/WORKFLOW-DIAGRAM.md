# Dual Publishing Workflow - Quick Reference

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      TRIGGER OPTIONS                            │
├─────────────────────────────────────────────────────────────────┤
│  1. Manual: Actions → Run Workflow                             │
│  2. Automatic: Create & Publish GitHub Release                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
               ┌──────────────┴──────────────┐
               │                             │
               ▼                             ▼
┌──────────────────────────────┐  ┌──────────────────────────────┐
│    JOB 1: GITHUB PACKAGES    │  │      JOB 2: NPMJS           │
│    (Parallel Execution)      │  │    (Parallel Execution)     │
└──────────────────────────────┘  └──────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│             JOB 1: PUBLISH TO GITHUB PACKAGES                   │
├─────────────────────────────────────────────────────────────────┤
│  • Checkout code                                                │
│  • Setup Node.js 22.16 with GitHub Packages registry           │
│  • Setup pnpm 10.22.0                                           │
│  • Version: 0.1.<run_number>                                   │
│  • Package: @nqdev-group/n8n-nodes-nqdev (scoped)             │
│  • Build workspace dependency: n8n-workflow                     │
│  • Build n8n-nodes-nqdev package                              │
│  • Publish to npm.pkg.github.com                               │
│  • Auth: GITHUB_TOKEN (auto-provided)                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                 JOB 2: PUBLISH TO NPMJS                         │
├─────────────────────────────────────────────────────────────────┤
│  • Checkout code                                                │
│  • Setup Node.js 22.16 with npmjs registry                      │
│  • Setup pnpm 10.22.0                                           │
│  • Version: 0.1.<run_number> (same as Job 1)                  │
│  • Package: n8n-nodes-nqdev (unscoped)                         │
│  • Build workspace dependency: n8n-workflow                     │
│  • Build n8n-nodes-nqdev package                              │
│  • Publish to registry.npmjs.org                               │
│  • Auth: NPM_TOKEN (configured secret)                          │
└─────────────────────────────────────────────────────────────────┘
                              │
               ┌──────────────┴──────────────┐
               │  Both jobs must succeed     │
               └──────────────┬──────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│          JOB 3: CREATE TAG & SUMMARY (Sequential)               │
├─────────────────────────────────────────────────────────────────┤
│  • Checkout code                                                │
│  • Calculate version                                            │
│  • Create git tag: nqdev-v<version>                            │
│  • Push tag to repository                                       │
│  • Generate summary:                                            │
│    - GitHub Packages: @nqdev-group/n8n-nodes-nqdev            │
│    - npmjs: n8n-nodes-nqdev                                    │
│    - Git tag: nqdev-v<version>                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Published Packages

### GitHub Packages
- **Name**: `@nqdev-group/n8n-nodes-nqdev`
- **Registry**: https://npm.pkg.github.com/
- **Requires**: GitHub authentication

### npmjs (Recommended)
- **Name**: `n8n-nodes-nqdev`
- **Registry**: https://registry.npmjs.org/
- **Requires**: No authentication
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     GIT TAGGING                                 │
├─────────────────────────────────────────────────────────────────┤
│  • Create tag: nqdev-v<version>                                │
│  • Push tag to repository                                       │
│                                                                  │
│  Example: nqdev-v0.1.123                                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   RELEASE SUMMARY                               │
├─────────────────────────────────────────────────────────────────┤
│  • Generate summary with package info                           │
│  • Include installation instructions                            │
│  • Show version and tag information                             │
└─────────────────────────────────────────────────────────────────┘
```

## Key Configuration

### Environment Variables
- `SERVER`: production
- `PREFIX`: 0.1
- `VERSION`: 0.1.${{ github.run_number }}
- `PACKAGE_NAME`: @nqdev-group/n8n-nodes-nqdev

### Permissions Required
- `contents`: read (checkout code)
- `packages`: write (publish to GitHub Packages)

### Authentication
Uses `GITHUB_TOKEN` secret (automatically provided by GitHub Actions)

## Manual Testing

To test locally before workflow run:

```bash
# 1. Navigate to package
cd packages/n8n-nodes-nqdev

# 2. Update package.json
jq '.name = "@nqdev-group/n8n-nodes-nqdev"' package.json > tmp.json
mv tmp.json package.json

# 3. Build dependencies
cd ../..
pnpm --filter n8n-workflow build

# 4. Build package
cd packages/n8n-nodes-nqdev
pnpm build

# 5. Verify build output
ls -la dist/

# 6. Restore original name (don't commit scoped name)
jq '.name = "n8n-nodes-nqdev"' package.json > tmp.json
mv tmp.json package.json
```

## Monitoring Workflow Runs

1. Go to repository → Actions tab
2. Select "Publish: n8n-nodes-nqdev to GitHub Packages"
3. Click on latest run to see details
4. Check each step for errors or success

## Published Package Location

After successful publish, package will be available at:
- **URL**: https://github.com/orgs/nqdev-group/packages?repo_name=n8n-clone
- **Name**: @nqdev-group/n8n-nodes-nqdev
- **Registry**: GitHub Packages (npm)

## Version History

View all published versions:
```bash
git tag -l "nqdev-v*"
```

## Quick Commands

### Trigger workflow manually
```bash
# Via GitHub CLI
gh workflow run publish-nqdev-package.yml

# Via web interface
# Actions → Select workflow → Run workflow
```

### Check latest package version
```bash
# List all tags
git tag -l "nqdev-v*" | sort -V | tail -1

# Or via GitHub API
gh api repos/nqdev-group/n8n-clone/tags
```

### Install specific version
```bash
npm install @nqdev-group/n8n-nodes-nqdev@0.1.123
```
