# Package Structure Refactoring

## Overview

The n8n-nodes-nqdev package has been refactored to improve code organization, reusability, and debugging capabilities.

## New Structure

```
packages/n8n-nodes-nqdev/
├── credentials/
│   └── EsmsApi.credentials.ts              # eSMS API credentials
├── nodes/
│   ├── Nqdev/
│   │   ├── Nqdev.node.ts                   # General NQDev node (placeholder)
│   │   ├── Nqdev.node.json
│   │   └── GenericFunctions.ts             # (deprecated, kept for reference)
│   └── Esms/
│       ├── Esms.node.ts                    # eSMS-specific node
│       ├── Esms.node.json
│       └── GenericFunctions.ts             # eSMS-specific API functions
└── utils/
    ├── HttpClient.ts                        # Reusable HTTP client with logging
    └── Logger.ts                            # Logging utility
```

## Key Changes

### 1. Separation of Concerns

**Before:**
- Single `Nqdev.node.ts` file contained all eSMS logic
- Tightly coupled to eSMS.vn API

**After:**
- `Nqdev.node.ts` - General placeholder node
- `Esms.node.ts` - Dedicated eSMS functionality
- Clear separation enables adding more service integrations

### 2. Reusable Utilities

**HttpClient.ts:**
- Generic HTTP request wrapper
- Built-in logging for all requests
- Error handling with context
- Methods: `request()`, `post()`, `get()`, `put()`, `delete()`

**Logger.ts:**
- Consistent logging format: `[Context] LEVEL: message`
- Methods: `debug()`, `info()`, `warn()`, `error()`
- Child logger support for nested contexts

### 3. Comprehensive Logging

Logging has been added throughout the execution flow:

**HTTP Requests:**
```typescript
[Esms:API] DEBUG: Making POST request to https://rest.esms.vn/...
[Esms:API] DEBUG: Request successful
```

**Node Execution:**
```typescript
[Esms:Node] INFO: Starting node execution { resource: 'sms', operation: 'send' }
[Esms:Node] INFO: Sending SMS to 84987654321
[Esms:Node] INFO: SMS sent successfully { phone: '84...', codeResult: '100' }
```

**Error Handling:**
```typescript
[Esms:Node] ERROR: Error processing item { itemIndex: 0, error: '...' }
[Esms] ERROR: eSMS API returned error { code: '101', message: '...' }
```

## Usage

### Using the eSMS Node

In n8n, you now have two nodes available:

1. **NQDev** - General placeholder (use specific integration nodes instead)
2. **eSMS** - For eSMS.vn integration (SMS and Zalo ZNS)

The eSMS node provides the same functionality as before:
- Send SMS (OTP/CSKH/Marketing)
- Send Zalo ZNS messages
- Sandbox mode for testing

### Debugging

With the new logging system, you can debug issues by:

1. Check console output for detailed logs
2. Logs include:
   - Request parameters
   - API responses
   - Error details with context
   - Execution flow

Example log flow for successful SMS:
```
[Esms:Node] INFO: Starting node execution { resource: 'sms', operation: 'send', itemsCount: 1 }
[Esms:Node] DEBUG: Processing SMS send for item 0
[Esms:Node] DEBUG: SMS parameters { phone: '84...', contentLength: 50, ... }
[Esms] DEBUG: Making eSMS API request { endpoint: '/Send...', method: 'POST' }
[Esms:API] DEBUG: Making POST request to https://rest.esms.vn/...
[Esms:API] DEBUG: Request successful { hasData: true }
[Esms] INFO: eSMS API request successful { endpoint: '/Send...', codeResult: '100' }
[Esms:Node] INFO: SMS sent successfully { phone: '84...', codeResult: '100' }
[Esms:Node] INFO: Node execution completed { itemsProcessed: 1, successCount: 1 }
```

## Adding New Services

The new structure makes it easy to add new service integrations:

1. Create new folder: `nodes/ServiceName/`
2. Create files:
   - `ServiceName.node.ts` - Node implementation
   - `ServiceName.node.json` - Node metadata
   - `GenericFunctions.ts` - Service-specific functions
3. Reuse `utils/HttpClient.ts` for HTTP requests
4. Reuse `utils/Logger.ts` for logging
5. Update `package.json` to register the new node

Example for a hypothetical SMS service:

```
nodes/
├── Esms/           # eSMS.vn integration
├── Twilio/         # Twilio integration (new)
│   ├── Twilio.node.ts
│   ├── Twilio.node.json
│   └── GenericFunctions.ts
└── Nqdev/          # General placeholder
```

## Migration Notes

### For Users

No changes required! The eSMS node works exactly as before:
- Same credentials (EsmsApi)
- Same parameters
- Same functionality

The only visible change is the node name in the editor:
- Before: "NQDev" node
- After: "eSMS" node (dedicated), "NQDev" node (placeholder)

### For Developers

When contributing or maintaining:

1. **eSMS-specific changes** → Edit `nodes/Esms/`
2. **HTTP utilities** → Edit `utils/HttpClient.ts`
3. **Logging** → Edit `utils/Logger.ts`
4. **New services** → Add new folder in `nodes/`

## Benefits

✅ **Better Organization**: Clear separation of services
✅ **Reusability**: Shared utilities for HTTP and logging
✅ **Debugging**: Comprehensive logging throughout
✅ **Scalability**: Easy to add new service integrations
✅ **Maintainability**: Smaller, focused files
✅ **Best Practices**: Follows n8n node development patterns

## Next Steps

1. Build the package: `pnpm build`
2. Test in n8n: Use the eSMS node
3. Check logs: Monitor console for debug information
4. Add new services: Follow the structure pattern
