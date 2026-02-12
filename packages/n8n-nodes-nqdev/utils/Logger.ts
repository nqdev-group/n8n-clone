/**
 * Simple logger utility for n8n nodes
 * Helps with debugging by providing consistent logging format
 */

export class Logger {
	private context: string;

	constructor(context: string) {
		this.context = context;
	}

	/**
	 * Log debug information
	 */
	debug(message: string, data?: any): void {
		console.log(`[${this.context}] DEBUG: ${message}`, data ? JSON.stringify(data, null, 2) : '');
	}

	/**
	 * Log informational message
	 */
	info(message: string, data?: any): void {
		console.log(`[${this.context}] INFO: ${message}`, data ? JSON.stringify(data, null, 2) : '');
	}

	/**
	 * Log warning message
	 */
	warn(message: string, data?: any): void {
		console.warn(`[${this.context}] WARN: ${message}`, data ? JSON.stringify(data, null, 2) : '');
	}

	/**
	 * Log error message
	 */
	error(message: string, error?: any): void {
		console.error(`[${this.context}] ERROR: ${message}`, error ? error : '');
	}

	/**
	 * Create a child logger with extended context
	 */
	child(subContext: string): Logger {
		return new Logger(`${this.context}:${subContext}`);
	}
}
