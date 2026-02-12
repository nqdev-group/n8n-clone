import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IDataObject,
	JsonObject,
	IRequestOptions,
	IHttpRequestMethods,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { Logger } from './Logger';

/**
 * Generic HTTP client utility for making API requests
 * Provides logging and error handling
 */
export class HttpClient {
	private logger: Logger;

	constructor(context: string) {
		this.logger = new Logger(context);
	}

	/**
	 * Make an HTTP request with logging and error handling
	 */
	async request(
		executeFunctions: IExecuteFunctions | ILoadOptionsFunctions,
		method: IHttpRequestMethods,
		url: string,
		options: Partial<IRequestOptions> = {},
	): Promise<any> {
		this.logger.debug(`Making ${method} request to ${url}`, {
			method,
			url,
			hasBody: !!options.body,
			hasQs: !!options.qs,
		});

		const requestOptions: IRequestOptions = {
			method,
			uri: url,
			json: true,
			...options,
		};

		try {
			const response = await executeFunctions.helpers.request.call(
				executeFunctions,
				requestOptions,
			);

			this.logger.debug(`Request successful`, {
				statusCode: response.statusCode,
				hasData: !!response,
			});

			return response;
		} catch (error) {
			this.logger.error(`Request failed`, {
				method,
				url,
				error: (error as Error).message,
			});
			throw new NodeApiError(executeFunctions.getNode(), error as JsonObject);
		}
	}

	/**
	 * Make a POST request
	 */
	async post(
		executeFunctions: IExecuteFunctions | ILoadOptionsFunctions,
		url: string,
		body: IDataObject = {},
		qs: IDataObject = {},
	): Promise<any> {
		return this.request(executeFunctions, 'POST', url, { body, qs });
	}

	/**
	 * Make a GET request
	 */
	async get(
		executeFunctions: IExecuteFunctions | ILoadOptionsFunctions,
		url: string,
		qs: IDataObject = {},
	): Promise<any> {
		return this.request(executeFunctions, 'GET', url, { qs });
	}

	/**
	 * Make a PUT request
	 */
	async put(
		executeFunctions: IExecuteFunctions | ILoadOptionsFunctions,
		url: string,
		body: IDataObject = {},
		qs: IDataObject = {},
	): Promise<any> {
		return this.request(executeFunctions, 'PUT', url, { body, qs });
	}

	/**
	 * Make a DELETE request
	 */
	async delete(
		executeFunctions: IExecuteFunctions | ILoadOptionsFunctions,
		url: string,
		qs: IDataObject = {},
	): Promise<any> {
		return this.request(executeFunctions, 'DELETE', url, { qs });
	}
}
