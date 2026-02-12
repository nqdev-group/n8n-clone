import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class EsmsApi implements ICredentialType {
	name = 'esmsApi';

	displayName = 'eSMS.vn API';

	documentationUrl = 'https://developers.esms.vn/';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'API Key from eSMS.vn dashboard',
		},
		{
			displayName: 'Secret Key',
			name: 'secretKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Secret Key from eSMS.vn dashboard',
		},
	];
}
