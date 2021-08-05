import { ServiceAddons } from '@feathersjs/feathers';

import { Application } from '../../../declarations';
import { ChannelService } from './channel.websocket.class';

// add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    channel: ChannelService & ServiceAddons<any>
  }
}

export default function (app: Application) {
  app.use('/channel', new ChannelService({}, app));
}
