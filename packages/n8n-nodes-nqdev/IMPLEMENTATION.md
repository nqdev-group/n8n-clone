# n8n-nodes-nqdev - Implementation Summary

## Overview
Successfully created a new n8n community node package `n8n-nodes-nqdev` for integrating with NQDev external services, specifically the eSMS.vn API for sending SMS CSKH and Zalo ZNS messages.

## Package Structure

```
packages/n8n-nodes-nqdev/
├── .gitignore                          # Ignore dist/, node_modules/, etc.
├── README.md                           # Package documentation
├── package.json                        # Package configuration with n8n metadata
├── index.js                            # Empty entry point (required by n8n)
├── eslint.config.mjs                   # ESLint configuration
├── tsconfig.json                       # TypeScript configuration
├── tsconfig.build.json                 # TypeScript build configuration
├── credentials/
│   └── EsmsApi.credentials.ts         # eSMS.vn API credentials (ApiKey + SecretKey)
└── nodes/
    └── Nqdev/
        ├── GenericFunctions.ts        # API request helper functions
        ├── Nqdev.node.ts              # Main node implementation
        └── Nqdev.node.json            # Node metadata
```

## Features Implemented

### 1. eSMS.vn API Credentials (`EsmsApi.credentials.ts`)
- **API Key**: Password-protected field for eSMS.vn API Key
- **Secret Key**: Password-protected field for eSMS.vn Secret Key
- Proper credential type implementation with ICredentialType interface

### 2. Generic API Functions (`GenericFunctions.ts`)
- **esmsApiRequest()**: Centralized function for making API requests to eSMS.vn
  - Automatically includes credentials in request body
  - Handles error codes with Vietnamese error messages
  - Comprehensive error mapping based on eSMS.vn error codes (100-120)
  - Proper error handling with NodeApiError

### 3. NQDev Node (`Nqdev.node.ts`)
Main node with two resources:

#### Resource: SMS
- **Operation: Send**
  - Phone Number (E.164 format, e.g., 84987654321)
  - Content (SMS message text)
  - SMS Type options:
    - Marketing (Brandname) - Type 2
    - CSKH (Customer Care) - Type 4 (recommended for OTP)
    - Fixed Number - Type 8
  - Brandname (sender name)
  - Sandbox Mode (for testing without actually sending)
  - API Endpoint: `/SendMultipleMessage_V4_post_json/`

#### Resource: Zalo ZNS
- **Operation: Send**
  - Phone Number (E.164 format)
  - Template ID (approved Zalo ZNS template)
  - Template Data (JSON object with template variables)
  - Tracking ID (optional message tracking identifier)
  - Sandbox Mode (for testing)
  - API Endpoint: `/SendZaloMessage_V4_post_json/`
  - Template data format: `{"key1": "value1", "key2": "value2"}`
  - Converts to eSMS format: `["key1|value1", "key2|value2"]`

## Error Handling

Comprehensive error code mapping based on eSMS.vn documentation:
- **100**: Success
- **99**: Unknown error - contact eSMS support
- **101**: Authentication failed - incorrect ApiKey or SecretKey
- **102**: Account locked
- **103**: Account not activated
- **104**: Insufficient balance
- **105**: Invalid data format
- **106**: Insufficient sending quota
- **109**: Brandname not activated
- **110**: Message too long
- **111**: Marketing brandname must send between 8h-22h
- **112**: Message contains spam words
- **113**: Invalid phone number format
- **114**: Zalo template not approved
- **115**: Zalo template rejected
- **116**: Zalo template pending approval
- **117**: Zalo template ID not found
- **118**: RequestId already exists
- **119**: Brandname not found
- **120**: Message contains invalid characters

## API Integration Details

### Base URL
`https://rest.esms.vn/MainService.svc/json`

### Authentication
Credentials are sent in the request body:
```json
{
  "ApiKey": "your-api-key",
  "SecretKey": "your-secret-key",
  ...
}
```

### SMS Request Format
```json
{
  "ApiKey": "...",
  "SecretKey": "...",
  "Phone": "84987654321",
  "Content": "Your message here",
  "SmsType": "4",
  "Brandname": "YourBrand",
  "Sandbox": "0"
}
```

### Zalo ZNS Request Format
```json
{
  "ApiKey": "...",
  "SecretKey": "...",
  "Phone": "84987654321",
  "TempID": "template-id",
  "Params": ["key1|value1", "key2|value2"],
  "TrackingID": "optional-tracking-id",
  "Sandbox": "0"
}
```

## Configuration Files

### package.json
- Package name: `n8n-nodes-nqdev`
- Version: `0.1.0`
- Properly configured `n8n` metadata section pointing to compiled JS files
- Dependencies: `n8n-workflow` (workspace package)
- Dev dependencies: TypeScript, ESLint, etc.
- Build script: `tsc --build tsconfig.build.json && pnpm copy-nodes-json`

### TypeScript Configuration
- Target: ES2022
- Module: CommonJS
- Strict mode enabled
- Declaration and source maps generated
- Output directory: `dist/`

## Build Process

1. TypeScript compilation: `tsc --build tsconfig.build.json`
2. Copy node JSON metadata: `cp nodes/Nqdev/Nqdev.node.json dist/nodes/Nqdev/`
3. Output in `dist/` directory:
   - `dist/credentials/EsmsApi.credentials.js`
   - `dist/nodes/Nqdev/Nqdev.node.js`
   - `dist/nodes/Nqdev/Nqdev.node.json`
   - Type definitions (.d.ts) and source maps (.js.map)

## Integration with n8n Workspace

The package is automatically discovered by pnpm workspace through:
- Location: `packages/n8n-nodes-nqdev/`
- Workspace pattern: `packages/*` in `pnpm-workspace.yaml`
- Node registration via `package.json` `n8n` section

## Usage Instructions

### Setting up Credentials
1. In n8n, create new credentials of type "eSMS.vn API"
2. Enter your API Key from eSMS.vn dashboard
3. Enter your Secret Key from eSMS.vn dashboard
4. Save credentials

### Using the SMS Node
1. Add "NQDev" node to workflow
2. Select resource: "SMS"
3. Select operation: "Send"
4. Configure parameters:
   - Phone Number (e.g., 84987654321)
   - Content (your message)
   - SMS Type (recommend CSKH for OTP)
   - Brandname
   - Enable Sandbox for testing
5. Connect to credentials

### Using the Zalo ZNS Node
1. Add "NQDev" node to workflow
2. Select resource: "Zalo ZNS"
3. Select operation: "Send"
4. Configure parameters:
   - Phone Number
   - Template ID (from approved templates)
   - Template Data as JSON: `{"name": "John", "code": "12345"}`
   - Optional Tracking ID
   - Enable Sandbox for testing
5. Connect to credentials

## Documentation References

- [eSMS.vn API Documentation](https://developers.esms.vn/)
- [SMS API - OTP/CSKH](https://developers.esms.vn/esms-api/ham-gui-tin/tin-nhan-sms-otp-cskh)
- [Zalo ZNS API](https://developers.esms.vn/esms-api/ham-gui-tin/tin-nhan-zalo)
- [Error Codes](https://developers.esms.vn/esms-api/bang-ma-loi)

## Testing Recommendations

1. **Credential Testing**: Use Sandbox mode to verify credentials without sending actual messages
2. **SMS Testing**: Test different SMS types and verify message delivery
3. **Zalo Testing**: Ensure templates are approved before testing
4. **Error Handling**: Test with invalid credentials and data to verify error messages
5. **Phone Format**: Verify E.164 format handling (84xxxxxxxxx)

## Next Steps for Full Integration

1. Install all workspace dependencies (currently blocked by network issue with cdn.sheetjs.com)
2. Run full build process: `pnpm build`
3. Run type checking: `pnpm typecheck`
4. Run linting: `pnpm lint`
5. Test in n8n workflow editor with actual eSMS.vn API credentials
6. Create example workflows demonstrating SMS and Zalo usage
7. Consider adding additional eSMS.vn features (balance check, message history, etc.)

## Package Maintenance

### Building the Package
```bash
cd packages/n8n-nodes-nqdev
pnpm build
```

### Type Checking
```bash
pnpm typecheck
```

### Linting
```bash
pnpm lint        # Check for issues
pnpm lint:fix    # Auto-fix issues
```

### Development Mode
```bash
pnpm watch       # Auto-rebuild on changes
```

## Notes

- The package follows n8n node development best practices
- Code is written in TypeScript with strict type checking
- Error handling includes comprehensive eSMS.vn error code mapping
- All user-facing text should eventually be internationalized
- The node supports batch processing through n8n's standard execution model
- Continue on fail is supported for resilient workflows
