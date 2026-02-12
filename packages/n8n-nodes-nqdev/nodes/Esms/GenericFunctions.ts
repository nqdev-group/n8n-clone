import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IDataObject,
	IHttpRequestMethods,
} from 'n8n-workflow';
import { HttpClient } from '../../utils/HttpClient';
import { Logger } from '../../utils/Logger';

const logger = new Logger('Esms');
const httpClient = new HttpClient('Esms:API');

/**
 * Make an API request to eSMS.vn
 */
export async function esmsApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<any> {
	logger.debug('Making eSMS API request', { endpoint, method });

	const credentials = await this.getCredentials('esmsApi');

	const requestBody = {
		ApiKey: credentials.apiKey as string,
		SecretKey: credentials.secretKey as string,
		...body,
	};

	logger.debug('Request body prepared', {
		endpoint,
		hasApiKey: !!requestBody.ApiKey,
		hasSecretKey: !!requestBody.SecretKey,
		bodyKeys: Object.keys(body),
	});

	const url = `https://rest.esms.vn/MainService.svc/json${endpoint}`;

	try {
		const response = await httpClient.request(this, method, url, {
			body: requestBody,
			qs,
		});

		logger.debug('eSMS API response received', {
			codeResult: response.CodeResult,
			hasData: !!response,
		});

		// Check for API errors
		if (response.CodeResult && response.CodeResult !== '100') {
			const errorMessage = getEsmsErrorMessage(response.CodeResult);
			logger.error('eSMS API returned error', {
				code: response.CodeResult,
				message: errorMessage,
			});
			throw new Error(`eSMS API Error (${response.CodeResult}): ${errorMessage}`);
		}

		logger.info('eSMS API request successful', {
			endpoint,
			codeResult: response.CodeResult,
		});

		return response;
	} catch (error) {
		logger.error('eSMS API request failed', {
			endpoint,
			error: (error as Error).message,
		});
		throw error;
	}
}

/**
 * Get error message from eSMS error code
 * Reference: https://developers.esms.vn/esms-api/bang-ma-loi
 */
function getEsmsErrorMessage(code: string): string {
	const errorCodes: { [key: string]: string } = {
		'100': 'Gửi tin thành công',
		'99': 'Lỗi không xác định. Bạn cần liên hệ với eSMS để được hỗ trợ',
		'101': 'Đăng nhập không thành công. Sai tên ApiKey hoặc SecretKey',
		'102': 'Tài khoản bị khóa',
		'103': 'Tài khoản chưa được kích hoạt',
		'104': 'Không đủ số dư khả dụng (nạp tiền và kiểm tra lại)',
		'105': 'Sai định dạng dữ liệu',
		'106': 'Hạn mức gửi tin không đủ',
		'109': 'Brandname chưa được kích hoạt',
		'110': 'Tin nhắn có độ dài vượt quá quy định',
		'111': 'Brandname quảng cáo phải gửi vào khung giờ từ 8h - 22h hàng ngày',
		'112': 'Tin nhắn chứa các từ ngữ spam',
		'113': 'Số điện thoại không đúng định dạng',
		'114': 'Mẫu tin nhắn Zalo chưa được duyệt',
		'115': 'Mẫu tin nhắn Zalo đã bị từ chối',
		'116': 'Mẫu tin nhắn Zalo đang chờ duyệt',
		'117': 'Zalo template ID không tồn tại',
		'118': 'RequestId đã tồn tại trên hệ thống',
		'119': 'Brandname không tồn tại',
		'120': 'Tin nhắn chứa ký tự không hợp lệ',
	};

	return errorCodes[code] || `Mã lỗi không xác định: ${code}`;
}
