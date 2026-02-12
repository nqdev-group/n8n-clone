import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';
import { Logger } from '../../utils/Logger';

const logger = new Logger('Nqdev');

/**
 * General NQDev node - serves as a placeholder and router
 * Specific integrations (like eSMS) have their own dedicated nodes
 */
export class Nqdev implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'NQDev',
		name: 'nqdev',
		group: ['transform'],
		version: 1,
		subtitle: 'NQDev Integration Hub',
		description: 'General NQDev node - use specific integration nodes (e.g., eSMS) for actual functionality',
		defaults: {
			name: 'NQDev',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		properties: [
			{
				displayName: 'Notice',
				name: 'notice',
				type: 'notice',
				default: '',
				displayOptions: {
					show: {},
				},
				// eslint-disable-next-line n8n-nodes-base/node-param-notice-description-lowercase-first-char
				description: 'This is a general NQDev node. For specific integrations like eSMS, please use the dedicated nodes (e.g., eSMS node)',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		logger.info('NQDev general node executed', {
			itemsCount: items.length,
		});

		logger.warn('NQDev general node is a placeholder - use specific integration nodes');

		// Pass through items unchanged
		return [items];
	}
}
