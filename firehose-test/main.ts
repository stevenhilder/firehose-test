import * as crypto from 'node:crypto';

import { JSONValue, Loggable, Logger } from './Logger';

class User implements Loggable {

	private static readonly classLogger: Logger = new Logger;

	public static get logger(): Logger {
		return this.classLogger;
	}

	private readonly id: number;

	private readonly logger: Logger;

	private readonly username: string;

	public constructor(id: number, username: string) {
		this.id = id;
		this.username = username;
		this.logger = User.classLogger;
		this.log('User created');
	}

	public formatForLogger(): JSONValue { return { id: this.id, username: this.username }; }

	private log(message: string): void {
		this.logger.info(message, { user: this });
	}

	public doSomething(): void {
		this.log('Something happened!!!');
		Logger.warning('This message won\'t have any context');
		Logger.notice('This message *should* have context', { user: this });
		this.log('And this one should definitely have context');
	}
}

async function main(): Promise<void> {
	try {
		User.logger.context = {
			serverID: '34y2ro3rof',
			version: '0.23.0',
		};
		setInterval((): void => {
			const user: User = new User(Math.floor(Math.random() * 1000000), crypto.randomUUID());
			user.doSomething();
		}, 5000);
		await new Promise((resolve: (...args: Array<any>) => void): void => void setTimeout(resolve, 86_400_000));
	} catch (error: Error | unknown) {
		process.stderr.write(`Error: ${ error instanceof Error ? error.message : String(error) }\n`);
	}
}

main();
