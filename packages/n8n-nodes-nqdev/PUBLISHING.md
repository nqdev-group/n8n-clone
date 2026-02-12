# Publishing n8n-nodes-nqdev to Registries

This guide explains how to publish the `n8n-nodes-nqdev` package to both GitHub Packages and npmjs.

## Overview

The package is published to **two registries simultaneously**:

1. **GitHub Packages**: `@nqdev-group/n8n-nodes-nqdev` (scoped)
2. **npmjs**: `n8n-nodes-nqdev` (unscoped)

Both registries receive the same version number, ensuring consistency across platforms.

## Automated Publishing via GitHub Actions

### Triggers

The package is automatically published when:

1. **Manual Trigger**: Go to Actions → "Publish: n8n-nodes-nqdev to Registries" → "Run workflow"
2. **Release Published**: When a new GitHub release is published

### Workflow Process

The workflow (`.github/workflows/publish-nqdev-package.yml`) performs the following steps:

#### Job 1: Publish to GitHub Packages
1. **Checkout Code**: Retrieves the latest code from the repository
2. **Version Management**: 
   - Reads the base version from `package.json`
   - Appends the GitHub run number to create a unique version
   - Example: `0.1.0` → `0.1.123` (where 123 is the run number)
3. **Package Configuration**:
   - Updates package name to `@nqdev-group/n8n-nodes-nqdev` (scoped)
   - Adds GitHub Packages registry configuration
   - Updates version number
4. **Build Process**:
   - Installs all dependencies
   - Builds workspace dependencies (n8n-workflow)
   - Builds the n8n-nodes-nqdev package
   - Runs type checking
5. **Publish**:
   - Publishes to GitHub Packages registry
   - Uses `GITHUB_TOKEN` for authentication

#### Job 2: Publish to npmjs (runs in parallel)
1. **Checkout Code**: Retrieves the latest code from the repository
2. **Version Management**: Same version as GitHub Packages job
3. **Package Configuration**:
   - Keeps original package name `n8n-nodes-nqdev` (unscoped)
   - Adds npmjs registry configuration
   - Updates version number
4. **Build Process**:
   - Installs all dependencies
   - Builds workspace dependencies (n8n-workflow)
   - Builds the n8n-nodes-nqdev package
   - Runs type checking
5. **Publish**:
   - Publishes to npmjs registry
   - Uses `NPM_TOKEN` secret for authentication

#### Job 3: Create Tag and Summary (runs after both jobs)
1. **Tagging**:
   - Creates a git tag: `nqdev-v<version>`
   - Pushes the tag to the repository
2. **Summary**:
   - Generates release summary showing both registries
   - Includes installation instructions for both

### Required Secrets

The workflow requires the following secrets to be configured in GitHub repository settings:

1. **GITHUB_TOKEN** - Automatically provided by GitHub Actions (for GitHub Packages)
2. **NPM_TOKEN** - Must be manually configured (for npmjs)
   - Go to repository Settings → Secrets and variables → Actions
   - Add new secret named `NPM_TOKEN`
   - Value should be your npmjs access token

To get an npmjs token:
1. Log in to [npmjs.com](https://www.npmjs.com/)
2. Go to Account → Access Tokens
3. Generate a new token (Automation type recommended)
4. Copy the token and add it to GitHub secrets

## Manual Publishing

If you need to publish manually from your local machine:

### Prerequisites

1. **GitHub Personal Access Token** with `write:packages` permission
2. **Configure npm for GitHub Packages**:

```bash
# Add to ~/.npmrc
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
@nqdev-group:registry=https://npm.pkg.github.com/
```

### Publishing Steps

1. **Navigate to package directory**:
```bash
cd packages/n8n-nodes-nqdev
```

2. **Update version** (if needed):
```bash
npm version patch  # or minor, or major
```

3. **Update package name** to scoped version:
```bash
# Temporarily update package.json
jq '.name = "@nqdev-group/n8n-nodes-nqdev"' package.json > package.tmp.json
mv package.tmp.json package.json
```

4. **Build the package**:
```bash
pnpm build
```

5. **Publish**:
```bash
pnpm publish --no-git-checks --access public
```

6. **Restore original package name** (if needed):
```bash
jq '.name = "n8n-nodes-nqdev"' package.json > package.tmp.json
mv package.tmp.json package.json
```

## Installing the Package

The package is available from **two registries**. Choose the one that best fits your needs:

### Option 1: From npmjs (Recommended - No Authentication Required)

This is the easiest option for most users:

```bash
# Install latest version
npm install n8n-nodes-nqdev@latest

# Or with pnpm
pnpm add n8n-nodes-nqdev@latest

# Install specific version
npm install n8n-nodes-nqdev@0.1.123
```

### Option 2: From GitHub Packages (Requires Authentication)

If you prefer to use GitHub Packages:

#### Configure npm for GitHub Packages

Create or update `.npmrc` in your project:

```bash
@nqdev-group:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

#### Install the package

```bash
# Install latest version
npm install @nqdev-group/n8n-nodes-nqdev@latest

# Or with pnpm
pnpm add @nqdev-group/n8n-nodes-nqdev@latest

# Install specific version
npm install @nqdev-group/n8n-nodes-nqdev@0.1.123
```

## Using in n8n

### As Community Node (npmjs - Recommended)

1. In n8n, go to **Settings** → **Community Nodes**
2. Click **Install a community node**
3. Enter: `n8n-nodes-nqdev`
4. Click **Install**
5. Restart n8n

### As Community Node (GitHub Packages - Alternative)

1. In n8n, go to **Settings** → **Community Nodes**
2. Click **Install a community node**
3. Enter: `@nqdev-group/n8n-nodes-nqdev`
4. Click **Install**
5. Restart n8n

Note: Using GitHub Packages may require additional authentication configuration in your n8n installation.

### Via npm/pnpm in n8n installation

If you have a self-hosted n8n instance:

**Using npmjs** (recommended):
```bash
cd ~/.n8n
npm install n8n-nodes-nqdev
```

**Using GitHub Packages**:

```bash
cd ~/.n8n
npm install @nqdev-group/n8n-nodes-nqdev
```

Or in Docker:

```dockerfile
FROM n8nio/n8n:latest

USER root
RUN cd /usr/local/lib/node_modules/n8n && \
    npm install @nqdev-group/n8n-nodes-nqdev

USER node
```

## Version Management

### Versioning Strategy

- **Base version**: Defined in `package.json` (e.g., `0.1.0`)
- **Build number**: Automatically appended from GitHub Actions run number
- **Final version**: `<base>.<run_number>` (e.g., `0.1.123`)

### Updating Base Version

To update the major or minor version:

1. Edit `packages/n8n-nodes-nqdev/package.json`
2. Update the `version` field (e.g., `0.1.0` → `0.2.0`)
3. Commit and push
4. Next publish will use the new base version

### Git Tags

Each published version creates a git tag:
- Format: `nqdev-v<version>`
- Example: `nqdev-v0.1.123`

View all published versions:
```bash
git tag -l "nqdev-v*"
```

## Troubleshooting

### Authentication Errors

If you get authentication errors:

1. Verify your GitHub token has `write:packages` permission
2. Check `.npmrc` configuration
3. Ensure you're authenticated:
   ```bash
   npm whoami --registry=https://npm.pkg.github.com/
   ```

### Package Not Found

If the package cannot be found after installation:

1. Verify the package was published successfully in GitHub → Packages
2. Check your `.npmrc` has the correct registry configuration
3. Ensure you have access to the `nqdev-group` organization

### Build Failures

If the workflow fails during build:

1. Check the Actions log for specific error messages
2. Verify all dependencies are correctly specified
3. Test the build locally:
   ```bash
   cd packages/n8n-nodes-nqdev
   pnpm install --no-frozen-lockfile
   pnpm build
   ```

## Package Visibility

The package is published with **public** access, meaning:
- Anyone can view the package in GitHub Packages
- Anyone with a GitHub account can install it
- Installation requires GitHub authentication via personal access token

## References

- [GitHub Packages Documentation](https://docs.github.com/en/packages)
- [Working with npm registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
- [Publishing Node.js packages](https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages)
