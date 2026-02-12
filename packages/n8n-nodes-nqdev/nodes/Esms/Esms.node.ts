import type {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';
import { Logger } from '../../utils/Logger';
import { esmsApiRequest } from './GenericFunctions';

const logger = new Logger('Esms:Node');

export class Esms implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'eSMS',
		name: 'esms',
		icon: 'file:esms.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with eSMS.vn API for SMS and Zalo ZNS',
		defaults: {
			name: 'eSMS',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'esmsApi',
				required: true,
			},
		],
		properties: [
			// Resource selection
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'SMS',
						value: 'sms',
						description: 'Send SMS messages',
					},
					{
						name: 'Zalo ZNS',
						value: 'zalo',
						description: 'Send Zalo ZNS messages',
					},
				],
				default: 'sms',
			},
			// SMS Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['sms'],
					},
				},
				options: [
					{
						name: 'Send',
						value: 'send',
						action: 'Send an SMS',
						description: 'Send SMS OTP/CSKH message',
					},
				],
				default: 'send',
			},
			// Zalo Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['zalo'],
					},
				},
				options: [
					{
						name: 'Send',
						value: 'send',
						action: 'Send a Zalo ZNS message',
						description: 'Send Zalo ZNS message',
					},
				],
				default: 'send',
			},
			// SMS Send Parameters
			{
				displayName: 'Phone Number',
				name: 'phone',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['sms'],
						operation: ['send'],
					},
				},
				default: '',
				placeholder: '84987654321',
				description: 'Phone number in E.164 format (e.g., 84987654321)',
			},
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['sms'],
						operation: ['send'],
					},
				},
				default: '',
				typeOptions: {
					rows: 4,
				},
				description: 'SMS message content',
			},
			{
				displayName: 'SMS Type',
				name: 'smsType',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['sms'],
						operation: ['send'],
					},
				},
				options: [
					{
						name: 'Marketing (Brandname)',
						value: '2',
						description: 'SMS Brandname for marketing purposes',
					},
					{
						name: 'CSKH (Customer Care)',
						value: '4',
						description: 'SMS CSKH - recommended for OTP and customer care',
					},
					{
						name: 'Fixed Number',
						value: '8',
						description: 'SMS with fixed sender number',
					},
				],
				default: '4',
				description: 'Type of SMS to send',
			},
			{
				displayName: 'Brandname',
				name: 'brandname',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['sms'],
						operation: ['send'],
					},
				},
				default: '',
				description: 'The brandname/sender name for the SMS',
			},
			{
				displayName: 'Sandbox Mode',
				name: 'sandbox',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['sms'],
						operation: ['send'],
					},
				},
				default: false,
				description: 'Whether to send in sandbox mode (for testing)',
			},
			// Zalo Send Parameters
			{
				displayName: 'Phone Number',
				name: 'phone',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['zalo'],
						operation: ['send'],
					},
				},
				default: '',
				placeholder: '84987654321',
				description: 'Phone number in E.164 format (e.g., 84987654321)',
			},
			{
				displayName: 'Template ID',
				name: 'templateId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['zalo'],
						operation: ['send'],
					},
				},
				default: '',
				description: 'Zalo ZNS template ID',
			},
			{
				displayName: 'Template Data',
				name: 'templateData',
				type: 'json',
				required: true,
				displayOptions: {
					show: {
						resource: ['zalo'],
						operation: ['send'],
					},
				},
				default: '{}',
				description: 'Template data as JSON object',
				placeholder: '{"customer_name": "John Doe", "order_code": "12345"}',
			},
			{
				displayName: 'Tracking ID',
				name: 'trackingId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['zalo'],
						operation: ['send'],
					},
				},
				default: '',
				description: 'Optional tracking ID for the message',
			},
			{
				displayName: 'Sandbox Mode',
				name: 'sandbox',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['zalo'],
						operation: ['send'],
					},
				},
				default: false,
				description: 'Whether to send in sandbox mode (for testing)',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		logger.info('Starting node execution', {
			resource,
			operation,
			itemsCount: items.length,
		});

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'sms') {
					if (operation === 'send') {
						logger.debug(`Processing SMS send for item ${i}`);

						// Get parameters
						const phone = this.getNodeParameter('phone', i) as string;
						const content = this.getNodeParameter('content', i) as string;
						const smsType = this.getNodeParameter('smsType', i) as string;
						const brandname = this.getNodeParameter('brandname', i) as string;
						const sandbox = this.getNodeParameter('sandbox', i, false) as boolean;

						logger.debug('SMS parameters', {
							phone,
							contentLength: content.length,
							smsType,
							brandname,
							sandbox,
						});

						// Prepare request body
						const body: IDataObject = {
							Phone: phone,
							Content: content,
							SmsType: smsType,
							Brandname: brandname,
							Sandbox: sandbox ? '1' : '0',
						};

						// Make API request
						logger.info(`Sending SMS to ${phone}`);
						const response = await esmsApiRequest.call(
							this,
							'POST',
							'/SendMultipleMessage_V4_post_json/',
							body,
						);

						logger.info('SMS sent successfully', {
							phone,
							codeResult: response.CodeResult,
						});

						returnData.push({
							json: response,
							pairedItem: { item: i },
						});
					}
				} else if (resource === 'zalo') {
					if (operation === 'send') {
						logger.debug(`Processing Zalo ZNS send for item ${i}`);

						// Get parameters
						const phone = this.getNodeParameter('phone', i) as string;
						const templateId = this.getNodeParameter('templateId', i) as string;
						const templateDataStr = this.getNodeParameter('templateData', i) as string;
						const trackingId = this.getNodeParameter('trackingId', i, '') as string;
						const sandbox = this.getNodeParameter('sandbox', i, false) as boolean;

						logger.debug('Zalo ZNS parameters', {
							phone,
							templateId,
							hasTrackingId: !!trackingId,
							sandbox,
						});

						// Parse template data
						let templateData: IDataObject;
						try {
							templateData = typeof templateDataStr === 'string' 
								? JSON.parse(templateDataStr) 
								: templateDataStr;
							logger.debug('Template data parsed', {
								keys: Object.keys(templateData),
							});
						} catch (error) {
							logger.error('Failed to parse template data', {
								error: (error as Error).message,
								templateDataStr,
							});
							throw new Error(`Invalid JSON in Template Data parameter: ${(error as Error).message}`);
						}

						// Prepare request body
						const body: IDataObject = {
							Phone: phone,
							TempID: templateId,
							Params: Object.entries(templateData).map(([key, value]) => `${key}|${value}`),
							Sandbox: sandbox ? '1' : '0',
						};

						if (trackingId) {
							body.TrackingID = trackingId;
						}

						// Make API request
						logger.info(`Sending Zalo ZNS to ${phone}`, {
							templateId,
							trackingId,
						});
						const response = await esmsApiRequest.call(
							this,
							'POST',
							'/SendZaloMessage_V4_post_json/',
							body,
						);

						logger.info('Zalo ZNS sent successfully', {
							phone,
							codeResult: response.CodeResult,
						});

						returnData.push({
							json: response,
							pairedItem: { item: i },
						});
					}
				}
			} catch (error) {
				logger.error('Error processing item', {
					itemIndex: i,
					error: (error as Error).message,
				});

				if (this.continueOnFail()) {
					logger.warn('Continuing on fail', { itemIndex: i });
					returnData.push({
						json: {
							error: (error as Error).message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		logger.info('Node execution completed', {
			itemsProcessed: items.length,
			successCount: returnData.length,
		});

		return [returnData];
	}
}
