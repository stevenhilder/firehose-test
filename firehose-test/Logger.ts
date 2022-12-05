export type JSONArray = Array<JSONValue>;
export type JSONObject = { [ _: string ]: JSONValue };
export type JSONScalar = boolean | null | number | string;
export type JSONValue = JSONArray | JSONObject | JSONScalar;

export interface Loggable {
	formatForLogger(): JSONValue;
}

export enum LogSeverity {
	debug,
	info,
	notice,
	warning,
	error,
	critical,
	alert,
	emergency,
}

export class Logger {

	private static singleton?: Logger = undefined;

	private static log(severity: LogSeverity, message: string, context: Record<string, JSONValue | Loggable> = {}): void {
		(
			this.singleton === undefined
			? (this.singleton = new this)
			: this.singleton
		).log(severity, message, context);
	}

	public static alert(message: string, context: Record<string, JSONValue | Loggable> = {}): void { this.log(LogSeverity.alert, message, context); }
	public static critical(message: string, context: Record<string, JSONValue | Loggable> = {}): void { this.log(LogSeverity.critical, message, context); }
	public static debug(message: string, context: Record<string, JSONValue | Loggable> = {}): void { this.log(LogSeverity.debug, message, context); }
	public static emergency(message: string, context: Record<string, JSONValue | Loggable> = {}): void { this.log(LogSeverity.emergency, message, context); }
	public static error(message: string, context: Record<string, JSONValue | Loggable> = {}): void { this.log(LogSeverity.error, message, context); }
	public static info(message: string, context: Record<string, JSONValue | Loggable> = {}): void { this.log(LogSeverity.info, message, context); }
	public static notice(message: string, context: Record<string, JSONValue | Loggable> = {}): void { this.log(LogSeverity.notice, message, context); }
	public static warning(message: string, context: Record<string, JSONValue | Loggable> = {}): void { this.log(LogSeverity.warning, message, context); }

	private readonly _context: Record<string, any> = {};

	public get context(): Record<string, any> {
		return this._context;
	}

	public set context(newContext: Record<string, any>) {
		for (const [ key, value ] of Object.entries(newContext)) {
			if ([ '_message', '_severity' ].includes(key)) {
				throw new Error(`The context property "${ key }" is reserved, use a different name`);
			}
			this._context[key] = value;
		}
	}

	private isLoggable(arg: unknown): arg is Loggable {
		return this.isObject(arg) && ('formatForLogger' in arg);
	}

	private isObject(arg: unknown): arg is Object {
		return Object.prototype.toString.call(arg).slice(8, -1) === 'Object';
	}

	private log(severity: LogSeverity, message: string, context: Record<string, JSONValue | Loggable> = {}): void {
		process.stdout.write(JSON.stringify(Object.assign(
			{
				_timestamp: (new Date).toISOString(),
				_message: message,
				_severity: LogSeverity[severity],
			},
			...Object.entries(this._context).map(([ key, value ]: [ string, JSONValue | Loggable ]): JSONValue => ({
				[key]: this.isLoggable(value) ? value.formatForLogger() : value,
			})),
			...Object.entries(context).map(([ key, value ]: [ string, JSONValue | Loggable ]): JSONValue => ({
				[key]: this.isLoggable(value) ? value.formatForLogger() : value,
			})),
		)) + '\n');
	}

	public alert(message: string, context: Record<string, JSONValue | Loggable> = {}): void { this.log(LogSeverity.alert, message, context); }
	public critical(message: string, context: Record<string, JSONValue | Loggable> = {}): void { this.log(LogSeverity.critical, message, context); }
	public debug(message: string, context: Record<string, JSONValue | Loggable> = {}): void { this.log(LogSeverity.debug, message, context); }
	public emergency(message: string, context: Record<string, JSONValue | Loggable> = {}): void { this.log(LogSeverity.emergency, message, context); }
	public error(message: string, context: Record<string, JSONValue | Loggable> = {}): void { this.log(LogSeverity.error, message, context); }
	public info(message: string, context: Record<string, JSONValue | Loggable> = {}): void { this.log(LogSeverity.info, message, context); }
	public notice(message: string, context: Record<string, JSONValue | Loggable> = {}): void { this.log(LogSeverity.notice, message, context); }
	public warning(message: string, context: Record<string, JSONValue | Loggable> = {}): void { this.log(LogSeverity.warning, message, context); }
}
