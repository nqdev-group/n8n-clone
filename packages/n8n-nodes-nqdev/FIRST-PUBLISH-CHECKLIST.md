# First-Time Publishing Checklist

Use this checklist when publishing the n8n-nodes-nqdev package for the first time.

## Pre-Publishing Checklist

### 1. Repository Setup
- [ ] Repository is public (GitHub Packages requires authentication for private packages)
- [ ] You have admin access to the repository
- [ ] GitHub Actions are enabled in repository settings

### 2. Package Configuration
- [x] `package.json` has `repository` field
- [x] `package.json` has `publishConfig` with GitHub Packages registry
- [x] Package version is set correctly in `package.json`
- [x] Package name is `n8n-nodes-nqdev` (will be scoped during workflow)

### 3. Workflow Configuration
- [x] Workflow file exists: `.github/workflows/publish-nqdev-package.yml`
- [x] Workflow has correct permissions (contents: read, packages: write)
- [x] Workflow uses correct Node.js version (22.16)
- [x] Workflow uses correct pnpm version (10.22.0)

### 4. Build Verification
Before publishing, verify the package builds successfully:

```bash
# From repository root
cd packages/n8n-nodes-nqdev

# Install dependencies
pnpm install --no-frozen-lockfile

# Build workspace dependencies
cd ../..
pnpm --filter n8n-workflow build

# Build the package
cd packages/n8n-nodes-nqdev
pnpm build

# Verify dist directory exists
ls -la dist/
```

Expected output:
```
dist/
├── credentials/
│   └── EsmsApi.credentials.js
├── nodes/
│   └── Nqdev/
│       ├── GenericFunctions.js
│       ├── Nqdev.node.js
│       └── Nqdev.node.json
└── *.d.ts files
```

### 5. Documentation Review
- [x] README.md has installation instructions
- [x] PUBLISHING.md exists with comprehensive guide
- [x] WORKFLOW-DIAGRAM.md exists with workflow visualization
- [ ] All documentation is up to date

## Publishing Steps

### Option 1: Manual Trigger (Recommended for First Time)

1. **Navigate to GitHub Actions**
   - Go to repository on GitHub
   - Click "Actions" tab
   - Select "Publish: n8n-nodes-nqdev to GitHub Packages"

2. **Run Workflow**
   - Click "Run workflow" button
   - Select branch: `copilot/add-n8n-node-for-esms` (or your working branch)
   - Click green "Run workflow" button

3. **Monitor Execution**
   - Click on the running workflow
   - Watch each step execute
   - Check for any errors
   - Review the summary at the end

4. **Verify Success**
   - Check that all steps completed successfully (green checkmarks)
   - Review the release summary
   - Note the version number created

### Option 2: Release Trigger

1. **Create a Release**
   - Go to repository → Releases
   - Click "Draft a new release"
   - Choose a tag (or create new): `v0.1.0`
   - Fill in release title and description
   - Click "Publish release"

2. **Workflow Triggers Automatically**
   - Workflow runs automatically when release is published
   - Monitor in Actions tab

## Post-Publishing Verification

### 1. Check Package on GitHub
- [ ] Go to repository → Packages
- [ ] Verify `n8n-nodes-nqdev` package appears
- [ ] Check version number is correct
- [ ] Verify package is marked as public

### 2. Check Git Tags
```bash
# List all tags
git fetch --tags
git tag -l "nqdev-v*"

# Expected output: nqdev-v0.1.1 (or similar)
```

### 3. Test Installation

Create a test project and try installing:

```bash
# Create test directory
mkdir /tmp/test-nqdev-install
cd /tmp/test-nqdev-install

# Initialize npm project
npm init -y

# Configure for GitHub Packages
cat > .npmrc << EOF
@nqdev-group:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
EOF

# Try installing
npm install @nqdev-group/n8n-nodes-nqdev

# Verify installation
ls node_modules/@nqdev-group/n8n-nodes-nqdev/
```

Expected: Package installs successfully with all files

### 4. Verify Package Contents

```bash
# Check package includes correct files
ls node_modules/@nqdev-group/n8n-nodes-nqdev/dist/

# Expected:
# - credentials/EsmsApi.credentials.js
# - nodes/Nqdev/Nqdev.node.js
# - nodes/Nqdev/Nqdev.node.json
```

## Troubleshooting First Publish

### Workflow Fails at Build Step

**Problem**: Build fails with "Cannot find module 'n8n-workflow'"

**Solution**:
1. Check if workspace dependencies are being built
2. Verify the build step includes: `pnpm --filter n8n-workflow build`
3. May need to build more workspace dependencies

### Workflow Fails at Publish Step

**Problem**: Authentication error or permission denied

**Solution**:
1. Verify workflow has `packages: write` permission
2. Check that GITHUB_TOKEN is being used correctly
3. Ensure repository allows GitHub Packages

### Package Not Found After Publishing

**Problem**: Package published but cannot be found

**Solutions**:
1. Check package visibility (should be public)
2. Verify scoped name: `@nqdev-group/n8n-nodes-nqdev`
3. Check GitHub Packages registry URL in .npmrc
4. Ensure GitHub token has `read:packages` permission

### Version Conflict

**Problem**: Version already exists

**Solution**:
1. Cannot republish same version
2. Either:
   - Increment base version in package.json
   - Delete the existing package version (if allowed)
   - Use a different version number

## Success Criteria

After first successful publish, you should have:

- ✅ Package visible in GitHub Packages
- ✅ Git tag created: `nqdev-vX.Y.Z`
- ✅ Workflow completed successfully
- ✅ Package installable via npm/pnpm
- ✅ All files present in installed package
- ✅ Documentation updated

## Next Steps

After successful first publish:

1. **Update Documentation**
   - Update README with actual version number
   - Update PUBLISHING.md if any issues were found
   - Document any special requirements

2. **Set Up Automated Releases**
   - Consider setting up release automation
   - Document release process for team
   - Establish versioning strategy

3. **Monitor Usage**
   - Track package downloads (if metrics available)
   - Watch for issues or bug reports
   - Plan for future updates

4. **Team Communication**
   - Notify team of successful publish
   - Share installation instructions
   - Provide feedback channel for issues

## Getting Help

If you encounter issues:

1. Check workflow logs in GitHub Actions
2. Review error messages carefully
3. Consult PUBLISHING.md for detailed troubleshooting
4. Check GitHub Packages documentation
5. Verify all prerequisites are met

## Notes

- First publish may take longer due to dependency downloads
- Subsequent publishes will be faster
- Version numbers are automatic (base + run number)
- Manual version updates only need to change base in package.json
