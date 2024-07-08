import {
  Controller,
  Post,
  UseGuards,
  Res,
  Body,
  Req,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateMessageDTO } from './dto/create-message-dto';
import { MessagesService } from './messages.service';

@Controller('api')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  /**
   * Sends a message for the authenticated user.
   * @param response The HTTP response object.
   * @param createMessageDTO DTO containing message data.
   * @param request The HTTP request object.
   * @returns A success message upon successful message creation.
   */
  @Post('/sendMessage')
  @UseGuards(AuthGuard())
  async sendMessage(
    @Res() response,
    @Body() createMessageDTO: CreateMessageDTO,
    @Req() request,
  ) {
    try {
      const userId = request.user.id;
      await this.messagesService.sendMessage(createMessageDTO, userId);
      return response.status(HttpStatus.CREATED).json({
        message: 'Message has been sent successfully',
      });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to send message',
        error: error.message,
      });
    }
  }

  /**
   * Retrieves messages for a specific user.
   * @param request The HTTP request object.
   * @param userId The ID of the user to retrieve messages for.
   * @returns Messages for the specified user.
   */
  @Get('viewMessages/:userId')
  @UseGuards(AuthGuard())
  async getMessagesForUser(@Req() request, @Param('userId') userId: string) {
    try {
      const receiverUserId = request.user.id;
      const messages = await this.messagesService.getMessages(
        userId,
        receiverUserId,
      );
      return messages;
    } catch (error) {
      throw error;
    }
  }
}
