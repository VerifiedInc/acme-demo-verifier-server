import { Params } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import logger from '../../../logger';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ServiceOptions { }

export class ChannelService {
  private app: Application;
  private options: ServiceOptions;
  async create (data: { channel: string}, params: Params): Promise<void> {
    logger.info('channelService create');
    const { channel } = data;
    const { connection } = params;

    logger.info(`channel: ${channel}`);

    if (connection) {
      logger.info(`connection: ${JSON.stringify(connection)}`);
      this.app.channel(channel).join(connection);
    }
  }

  constructor (options: ServiceOptions = {}, app: Application) {
    this.app = app;
    this.options = options;
  }
}
