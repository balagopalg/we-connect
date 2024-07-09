import { getModelToken } from '@nestjs/mongoose';
import { TestingModule, Test } from '@nestjs/testing';
import { RabbitmqService } from '@rabbitmq/rabbitmq.service';
import { CreateMessageDTO } from './dto/create-message-dto';
import { MessagesService } from './messages.service';
import { Message } from './schemas/messages.schema';

export class MockLoggerService {
  log(message: string) {}
  error(message: string, trace: string) {}
  warn(message: string) {}
  debug(message: string) {}
  verbose(message: string) {}
}

describe('MessagesService', () => {
  let service: MessagesService;
  let messageModel: Message;
  let rabbitmqService: RabbitmqService;
  let applicationLogger: MockLoggerService;

  const mockMessageModel = {
    create: jest.fn(),
    find: jest.fn(() => ({
      exec: jest.fn(),
    })),
    updateMany: jest.fn(),
    save: jest.fn(),
  };

  const mockRabbitmqService = {
    sendNotification: jest.fn(),
  };

  const mockLoggerService = new MockLoggerService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        { provide: getModelToken('Message'), useValue: mockMessageModel },
        { provide: RabbitmqService, useValue: mockRabbitmqService },
        { provide: 'applicationLogger', useValue: mockLoggerService },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
    messageModel = module.get<Message>(getModelToken('Message'));
    rabbitmqService = module.get<RabbitmqService>(RabbitmqService);
    applicationLogger = module.get<MockLoggerService>('applicationLogger');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendMessage', () => {
    it('should save the message and send a notification', async () => {
      const createMessageDTO: CreateMessageDTO = {
        text: 'Hello',
        receiver: 'user2',
      };
      const userId = 'user1';
      const savedMessage = {
        _id: '1',
        content: 'Hello',
        sender: 'user1',
        receiver: 'user2',
      };

      mockMessageModel.create.mockResolvedValueOnce(savedMessage);
      mockRabbitmqService.sendNotification.mockResolvedValueOnce(true);

      const result = await service.sendMessage(createMessageDTO, userId);

      expect(result).toEqual(savedMessage);
      expect(mockMessageModel.create).toHaveBeenCalledWith({
        content: createMessageDTO.text,
        sender: userId,
        receiver: createMessageDTO.receiver,
      });
      expect(mockRabbitmqService.sendNotification).toHaveBeenCalledWith({
        sender: userId,
        receiver: createMessageDTO.receiver,
        content: createMessageDTO.text,
      });
    });

    it('should throw an error if message saving fails', async () => {
      const createMessageDTO: CreateMessageDTO = {
        text: 'Hello',
        receiver: 'user2',
      };
      const userId = 'user1';

      mockMessageModel.create.mockRejectedValueOnce(new Error('Save failed'));

      await expect(
        service.sendMessage(createMessageDTO, userId),
      ).rejects.toThrow('Save failed');
    });
  });

  describe('getMessages', () => {
    it('should throw an error if fetching messages fails', async () => {
      const userId = 'user1';
      const receiversUserId = 'user2';

      const execMock = jest
        .fn()
        .mockRejectedValueOnce(new Error('Fetch failed'));
      mockMessageModel.find.mockReturnValueOnce({ exec: execMock });

      await expect(
        service.getMessages(userId, receiversUserId),
      ).rejects.toThrow('Fetch failed');
    });
  });
});
