/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ChannelTypeEnum, type IEmailProvider, type IEmailOptions, type ICheckIntegrationResponse, type IEmailEventBody } from '@novu/stateless';
import { createTransport } from 'nodemailer';

export class Smtp4DevEmailProvider implements IEmailProvider {
  id = 'smtp4dev';
  channelType = ChannelTypeEnum.EMAIL as ChannelTypeEnum.EMAIL;

  constructor(
    private config: {
      from: string;
			host: string;
			port: number;
			user: string;
			pass: string;
    }
  ) {
	
  }
	getMessageId?: ((body: any) => string[]) | undefined;
	parseEventBody?: ((body: any, identifier: string) => IEmailEventBody | undefined) | undefined;
	checkIntegration(_options: IEmailOptions): Promise<ICheckIntegrationResponse> {
		throw new Error('Method not implemented.');
	}

  async sendMessage(options: IEmailOptions): Promise<any> {
		const transporter = createTransport({
			host: this.config.host,
			port: this.config.port,
			auth: {
				user: this.config.user,
				pass: this.config.pass,
			},
		});
		return transporter.sendMail({
			from: options.from || this.config.from,
			to: options.to,
      html: options.html,
      subject: options.subject,
		});
  }
}