import { Params } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import logger from '../../../logger';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ServiceOptions { }

export class ChannelService {
  private app: Application;
  private options: ServiceOptions;

  /**
   * Add the client connection to a specified channel.
   * If the channel does not exist, it will be created.
   *
   * Primarily used to re-join previous session channel after a disconnect
   *
   * @param {{ channel: string}} data
   * @param {Params} params
   * @returns {Promise<{ success: boolean }>}
   * @memberof ChannelService
   */
  async create (data: { channel: string}, params: Params): Promise<{ success: boolean }> {
    logger.info('channelService create');
    const { channel } = data;
    const { connection } = params;

    logger.info(`channel: ${channel}`);

    if (connection) {
      try {
        logger.info(`connection: ${JSON.stringify(connection)}`);
        this.app.channel(channel).join(connection);

        return { success: true };
      } catch (e) {
        logger.error(`error joining channel ${channel}`);
        logger.error(e);
        throw e;
      }
    }

    return { success: false };
  }

  constructor (options: ServiceOptions = {}, app: Application) {
    this.app = app;
    this.options = options;
  }
}
