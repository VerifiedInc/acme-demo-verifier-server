import { Application } from '../../../../src/declarations';
import { ChannelService } from '../../../../src/services/websocket/channel/channel.websocket.class';

describe('ChannelService', () => {
  describe('create', () => {
    let service: ChannelService;
    let app: Application;
    const mockJoin = jest.fn();
    const mockChannel = jest.fn(() => ({
      join: mockJoin
    }));

    beforeAll(() => {
      app = {
        channel: mockChannel
      } as unknown as Application;
      service = new ChannelService({}, app);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('adds the connection to the channel', async () => {
      const data = {
        channel: 'test'
      };

      const params = {
        connection: { provider: 'socketio' }
      };

      await service.create(data, params);

      expect(mockChannel).toBeCalledWith(data.channel);
      expect(mockJoin).toBeCalledWith(params.connection);
    });
  });
});
