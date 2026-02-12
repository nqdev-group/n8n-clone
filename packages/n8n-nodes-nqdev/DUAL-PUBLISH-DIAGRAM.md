# Dual Publishing Workflow - Quick Reference

## Updated Workflow Overview

The package is now published to **TWO registries simultaneously**:

```
┌─────────────────────────────────────────────────────────────────┐
│                    DUAL PUBLISHING WORKFLOW                     │
└─────────────────────────────────────────────────────────────────┘

                         TRIGGER
                    (Manual or Release)
                            │
                            ▼
            ┌───────────────┴───────────────┐
            │                               │
            ▼                               ▼
    ┌───────────────┐               ┌──────────────┐
    │ Job 1: GitHub │               │ Job 2: npmjs │
    │   Packages    │               │              │
    └───────┬───────┘               └──────┬───────┘
            │                               │
            │  PARALLEL EXECUTION           │
            │                               │
            └───────────────┬───────────────┘
                            │
                            ▼
                  ┌─────────────────┐
                  │  Job 3: Tag &   │
                  │     Summary     │
                  └─────────────────┘
```

## Two Packages Published

### Package 1: GitHub Packages
```
Name:     @nqdev-group/n8n-nodes-nqdev
Registry: https://npm.pkg.github.com/
Auth:     GITHUB_TOKEN (auto-provided)
Scope:    @nqdev-group
```

### Package 2: npmjs
```
Name:     n8n-nodes-nqdev
Registry: https://registry.npmjs.org/
Auth:     NPM_TOKEN (manual secret)
Scope:    (none - unscoped)
```

## Detailed Workflow Steps

### Job 1: Publish to GitHub Packages

```
1. Checkout repository
2. Calculate version (base + run number)
3. Update package.json:
   ├─ Name: @nqdev-group/n8n-nodes-nqdev
   ├─ Version: 0.1.<run_number>
   └─ Registry: npm.pkg.github.com
4. Setup Node.js (with GitHub Packages)
5. Setup pnpm
6. Install dependencies
7. Build workspace (n8n-workflow)
8. Build package
9. Publish to GitHub Packages
   └─ Uses: GITHUB_TOKEN
```

### Job 2: Publish to npmjs (Parallel)

```
1. Checkout repository
2. Calculate version (same as Job 1)
3. Update package.json:
   ├─ Name: n8n-nodes-nqdev (unscoped)
   ├─ Version: 0.1.<run_number>
   └─ Registry: registry.npmjs.org
4. Setup Node.js (with npmjs)
5. Setup pnpm
6. Install dependencies
7. Build workspace (n8n-workflow)
8. Build package
9. Publish to npmjs
   └─ Uses: NPM_TOKEN (secret)
```

### Job 3: Create Tag & Summary (Sequential)

```
1. Wait for both Job 1 and Job 2 to complete
2. Checkout repository
3. Calculate version
4. Create git tag: nqdev-v<version>
5. Push tag to repository
6. Generate summary:
   ├─ GitHub Packages installation
   └─ npmjs installation
```

## Installation Options for Users

### Option 1: npmjs (Recommended ⭐)

**Why recommended:**
- ✅ No authentication required
- ✅ Simpler installation
- ✅ Works everywhere

```bash
# Simple one-liner
npm install n8n-nodes-nqdev

# In n8n Community Nodes
Package name: n8n-nodes-nqdev
```

### Option 2: GitHub Packages (Alternative)

**Use when:**
- You prefer GitHub ecosystem
- You already have GitHub auth configured

```bash
# Requires .npmrc configuration
@nqdev-group:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=YOUR_TOKEN

# Then install
npm install @nqdev-group/n8n-nodes-nqdev

# In n8n Community Nodes
Package name: @nqdev-group/n8n-nodes-nqdev
```

## Setup Requirements

### For Repository Maintainers

**Required GitHub Secret:**
- Name: `NPM_TOKEN`
- How to get:
  1. Login to npmjs.com
  2. Go to Account → Access Tokens
  3. Generate new "Automation" token
  4. Copy token
  5. Add to GitHub: Settings → Secrets → Actions → New secret

**Auto-provided:**
- `GITHUB_TOKEN` (automatically provided by GitHub Actions)

### For Package Users

**npmjs:** No setup required ✓

**GitHub Packages:** Requires GitHub token in `.npmrc`

## Version Synchronization

Both registries receive the **exact same version**:

```
Example: Workflow run #123

GitHub Packages: @nqdev-group/n8n-nodes-nqdev@0.1.123
npmjs:          n8n-nodes-nqdev@0.1.123
Git Tag:        nqdev-v0.1.123
```

## Workflow Execution Timeline

```
0:00  ━━━━━━━━━━━━━━━━━━━━━━ Trigger
0:01  │
      ├─ Job 1 (GitHub) starts
      └─ Job 2 (npmjs) starts
      │                    │
0:02  │ Setup             │ Setup
0:03  │ Build             │ Build
0:04  │ Publish           │ Publish
0:05  │ ✓ Complete        │ ✓ Complete
      │                    │
      └────────┬───────────┘
0:06           │
               └─ Job 3 (Tag) starts
0:07              Create tag
0:08              Generate summary
0:09              ✓ Complete
```

**Total time:** ~9 minutes (parallel execution saves time!)

## Monitoring Workflow

### Via GitHub UI

1. Go to repository → Actions
2. Select "Publish: n8n-nodes-nqdev to Registries"
3. Click on latest run
4. View all three jobs:
   - ✓ Publish to GitHub Packages
   - ✓ Publish to npmjs
   - ✓ Create tag and summary

### Via Summary

After completion, view the summary showing:
- ✅ Version published
- 📦 GitHub Packages installation command
- 📮 npmjs installation command
- 🏷️ Git tag created

## Troubleshooting

### npmjs Job Fails

**Problem:** "npm ERR! 401 Unauthorized"

**Solution:**
1. Check NPM_TOKEN secret is configured
2. Verify token is valid (not expired)
3. Ensure token has publish permissions

### GitHub Packages Job Fails

**Problem:** "Error: 403 Forbidden"

**Solution:**
1. Verify workflow has `packages: write` permission
2. Check repository allows GitHub Packages
3. Ensure GITHUB_TOKEN is being used correctly

### Both Jobs Fail

**Problem:** Build errors

**Solution:**
1. Check build logs for specific errors
2. Verify workspace dependencies build correctly
3. Test build locally first

### Tag Not Created

**Problem:** Tag job skipped

**Solution:**
Tag job only runs if BOTH publish jobs succeed. Check which job failed and fix it.

## Quick Commands

### Trigger Manual Publish
```bash
# Via GitHub CLI
gh workflow run publish-nqdev-package.yml

# Via web interface
# Actions → Select workflow → Run workflow
```

### Check Published Versions

**npmjs:**
```bash
npm view n8n-nodes-nqdev versions
```

**GitHub Packages:**
```bash
# Via GitHub UI
# Repository → Packages → n8n-nodes-nqdev
```

**Git tags:**
```bash
git tag -l "nqdev-v*" | sort -V
```

### Install Specific Version

**npmjs:**
```bash
npm install n8n-nodes-nqdev@0.1.123
```

**GitHub Packages:**
```bash
npm install @nqdev-group/n8n-nodes-nqdev@0.1.123
```

## Best Practices

1. **Always configure NPM_TOKEN** before first publish
2. **Test locally** before triggering workflow
3. **Monitor both jobs** during publish
4. **Verify both registries** after successful publish
5. **Update documentation** when changing versions
6. **Use npmjs** for end users (simpler)
7. **Keep versions synchronized** across registries

## Summary

✅ Dual publishing to GitHub Packages and npmjs
✅ Parallel execution for speed
✅ Same version across registries
✅ Comprehensive error handling
✅ Detailed release summaries
✅ npmjs recommended for users
