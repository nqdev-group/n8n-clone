# n8n-nodes-nqdev

This is an n8n community node package for integrating with NQDev external services.

## Features

### eSMS.vn Integration

Connect to eSMS.vn API to send:
- SMS OTP/CSKH messages
- Zalo ZNS messages

## Installation

### From GitHub Packages

This package is published to GitHub Packages. To install:

1. **Configure npm for GitHub Packages** - Create or update `.npmrc` in your project:

```bash
@nqdev-group:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

2. **Install the package**:

```bash
npm install @nqdev-group/n8n-nodes-nqdev
```

Or with pnpm:

```bash
pnpm add @nqdev-group/n8n-nodes-nqdev
```

### In n8n Community Nodes

1. In n8n, go to **Settings** → **Community Nodes**
2. Click **Install a community node**
3. Enter: `@nqdev-group/n8n-nodes-nqdev`
4. Click **Install**
5. Restart n8n

For detailed installation and publishing instructions, see [PUBLISHING.md](./PUBLISHING.md).

## Credentials

### eSMS.vn API

To use this node, you need:
- API Key from eSMS.vn dashboard
- Secret Key from eSMS.vn dashboard

Get your credentials at: https://developers.esms.vn/

## Operations

### SMS Resource

#### Send
Send SMS OTP/CSKH message with the following options:
- **Phone Number**: Recipient phone number in E.164 format (e.g., 84987654321)
- **Content**: SMS message content
- **SMS Type**: 
  - Marketing (Brandname)
  - CSKH (Customer Care) - recommended for OTP
  - Fixed Number
- **Brandname**: The sender name/brandname
- **Sandbox Mode**: Enable for testing without actually sending

### Zalo ZNS Resource

#### Send
Send Zalo ZNS message using templates:
- **Phone Number**: Recipient phone number in E.164 format
- **Template ID**: Approved Zalo ZNS template ID
- **Template Data**: JSON object with template variables
- **Tracking ID**: Optional tracking identifier
- **Sandbox Mode**: Enable for testing

## Error Handling

The node includes comprehensive error handling based on eSMS.vn error codes:
- 100: Success
- 104: Insufficient balance
- 114: Zalo template not approved
- And more... (see [eSMS error codes](https://developers.esms.vn/esms-api/bang-ma-loi))

## Resources

- [eSMS.vn API Documentation](https://developers.esms.vn/)
- [SMS API Reference](https://developers.esms.vn/esms-api/ham-gui-tin/tin-nhan-sms-otp-cskh)
- [Zalo ZNS API Reference](https://developers.esms.vn/esms-api/ham-gui-tin/tin-nhan-zalo)
- [Error Codes](https://developers.esms.vn/esms-api/bang-ma-loi)

## License

MIT
