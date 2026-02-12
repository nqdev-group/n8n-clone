# Quick Start Guide - n8n-nodes-nqdev

## Prerequisites

1. Access to eSMS.vn dashboard
2. API Key and Secret Key from eSMS.vn
3. n8n instance (v0.160.0 or higher)

## Installation

### In n8n Workspace (Development)

The package is already part of the workspace:

```bash
# Install dependencies
pnpm install

# Build the package
cd packages/n8n-nodes-nqdev
pnpm build

# Or build from root
pnpm --filter n8n-nodes-nqdev build
```

### As Community Node (Production)

In n8n Community Nodes settings:
1. Go to Settings > Community Nodes
2. Install package: `n8n-nodes-nqdev`
3. Restart n8n

## Setup Credentials

1. In n8n, click on "Credentials" in the left menu
2. Click "New Credential"
3. Search for "eSMS.vn API"
4. Enter your credentials:
   - **API Key**: Your API key from eSMS.vn dashboard
   - **Secret Key**: Your secret key from eSMS.vn dashboard
5. Test the connection (optional)
6. Save

## Example 1: Send SMS OTP

1. Create new workflow
2. Add "Manual Trigger" node
3. Add "NQDev" node
4. Configure:
   - **Credential**: Select your eSMS.vn API credential
   - **Resource**: SMS
   - **Operation**: Send
   - **Phone Number**: `84987654321` (E.164 format)
   - **Content**: `Mã OTP của bạn là: {{$json.otp}}. Có hiệu lực trong 5 phút.`
   - **SMS Type**: CSKH (Customer Care)
   - **Brandname**: Your approved brandname
   - **Sandbox**: Enable for testing
5. Execute workflow

## Example 2: Send Zalo ZNS

1. Create new workflow
2. Add trigger (Manual, Webhook, etc.)
3. Add "NQDev" node
4. Configure:
   - **Credential**: Select your eSMS.vn API credential
   - **Resource**: Zalo ZNS
   - **Operation**: Send
   - **Phone Number**: `84987654321`
   - **Template ID**: Your approved template ID
   - **Template Data**: 
     ```json
     {
       "customer_name": "Nguyễn Văn A",
       "order_code": "DH12345",
       "delivery_date": "20/02/2026"
     }
     ```
   - **Tracking ID**: `order-12345` (optional)
   - **Sandbox**: Enable for testing
5. Execute workflow

## Example 3: Dynamic SMS from Form Data

```
[Form Submit] → [Set] → [NQDev (SMS)] → [Save to DB]
```

In the NQDev node, use expressions:
- **Phone Number**: `{{$json.phone}}`
- **Content**: `Xin chào {{$json.name}}, mã xác thực của bạn là {{$json.code}}`

## Common Use Cases

### 1. OTP Verification Flow
```
[User Signup] → [Generate OTP] → [Send SMS] → [Store OTP] → [Return Success]
```

### 2. Order Notification
```
[Order Created] → [Get Customer] → [Send Zalo ZNS] → [Update Status]
```

### 3. Bulk SMS Campaign
```
[Get Customers] → [Filter] → [Loop] → [Send SMS] → [Track Results]
```

### 4. Two-Factor Authentication
```
[Login Request] → [Generate Code] → [Send SMS] → [Verify Code] → [Grant Access]
```

## Testing Tips

1. **Always test in Sandbox mode first**: Set `Sandbox` to `true` to avoid charges
2. **Verify phone format**: Must be E.164 (84xxxxxxxxx for Vietnam)
3. **Check brandname**: Ensure your brandname is approved in eSMS.vn dashboard
4. **Test error handling**: Try with invalid data to see error messages
5. **Monitor balance**: Check your eSMS.vn account balance regularly

## Troubleshooting

### Error 101: Authentication Failed
- **Solution**: Verify your API Key and Secret Key in credentials

### Error 104: Insufficient Balance
- **Solution**: Add credits to your eSMS.vn account

### Error 109: Brandname Not Activated
- **Solution**: Contact eSMS.vn to activate your brandname

### Error 113: Invalid Phone Number
- **Solution**: Ensure phone is in E.164 format (84xxxxxxxxx)

### Error 114: Zalo Template Not Approved
- **Solution**: Submit template for approval in eSMS.vn dashboard

### Node Not Appearing in n8n
- **Solution**: 
  1. Check if package is built: `ls packages/n8n-nodes-nqdev/dist`
  2. Rebuild if needed: `pnpm --filter n8n-nodes-nqdev build`
  3. Restart n8n

## Best Practices

1. **Use Environment Variables**: Store credentials as environment variables
2. **Enable Sandbox for Testing**: Always test with sandbox mode first
3. **Handle Errors Gracefully**: Use "Continue On Fail" in node settings
4. **Rate Limiting**: Implement delays for bulk operations
5. **Template Validation**: Validate Zalo templates before deployment
6. **Phone Validation**: Validate phone numbers before sending
7. **Message Length**: Keep SMS under 160 characters (or 70 for Unicode)
8. **Tracking**: Use tracking IDs for important messages

## API Limits

- Check eSMS.vn documentation for current limits
- Consider implementing retry logic for failed messages
- Monitor your quota usage

## Support

- eSMS.vn API Documentation: https://developers.esms.vn/
- Package Issues: Report in repository issues
- n8n Community: https://community.n8n.io/

## Next Steps

1. Import example workflow from `examples/esms-example-workflow.json`
2. Customize for your use case
3. Test thoroughly in sandbox mode
4. Deploy to production
5. Monitor message delivery and errors

## Advanced Features (Future)

Consider implementing:
- Message history retrieval
- Balance checking
- Delivery status tracking
- Template management
- Bulk sending optimization
