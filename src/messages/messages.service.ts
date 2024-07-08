import { IContextAwareLogger } from '@application/logger/contextAwareness.logger';
import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RabbitmqService } from '@rabbitmq/rabbitmq.service';
import { Model } from 'mongoose';
import { CreateMessageDTO } from './dto/create-message-dto';
import { Message } from './schemas/messages.schema';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel('Message') private readonly messageModel: Model<Message>,
    private readonly rabbitmqService: RabbitmqService,
    @Inject('applicationLogger') private readonly logger: IContextAwareLogger,
  ) {}

  /**
   * Sends a message from one user to another.
   * @param createMessageDTO DTO containing message data (text and receiver).
   * @param userId ID of the sending user.
   * @returns Promise<Message> The saved message object.
   * @throws Error if there's an issue saving the message or sending a notification.
   */
  async sendMessage(
    createMessageDTO: CreateMessageDTO,
    userId: string,
  ): Promise<Message> {
    const { text, receiver } = createMessageDTO;
    const sender = userId;
    const content = text;

    try {
      const savedMessage = await this.messageModel.create({
        content,
        sender,
        receiver,
      });

      const messageInfo = { sender, receiver, content };
      await this.rabbitmqService.sendNotification(messageInfo);

      return savedMessage;
    } catch (err) {
      this.logger.error('Error sending message', err);
      throw err;
    }
  }

  /**
   * Retrieves unread messages sent from one user to another.
   * Marks retrieved messages as read.
   * @param userId ID of the sender.
   * @param receiversUserId ID of the receiver.
   * @returns Promise<Message[]> Array of unread messages.
   * @throws Error if there's an issue retrieving or updating messages.
   */
  async getMessages(
    userId: string,
    receiversUserId: string,
  ): Promise<Message[]> {
    try {
      const messages = await this.messageModel
        .find({
          sender: userId,
          receiver: receiversUserId,
          isRead: false,
        })
        .exec();

      if (messages.length > 0) {
        await this.messageModel
          .updateMany(
            { sender: userId, receiver: receiversUserId, isRead: false },
            { $set: { isRead: true } },
          )
          .exec();
      }

      return messages;
    } catch (error) {
      this.logger.error('Error retrieving messages', error);
      throw error;
    }
  }
}
