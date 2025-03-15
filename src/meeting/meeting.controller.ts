import {Body, Controller, Get, HttpCode, HttpStatus, Logger, Param, Post, Response} from '@nestjs/common';
import { Response as Res } from 'express';
import { MeetingAddRequestBody, MeetingCreateRequestBody, MeetingGetRequestParam } from './meeting.dto';
import { MeetingService } from './meeting.service';

@Controller('meeting')
export class MeetingController {
    private readonly logger = new Logger(MeetingController.name);
    constructor(private meetingService: MeetingService) {}

    @Post('/')
    @HttpCode(HttpStatus.CREATED)
    async createMeeting(
      @Body() body: MeetingCreateRequestBody,
    ) {
        this.logger.log('미팅 생성 요청');
        const id = await this.meetingService.createMeeting(body);
        // res.setHeader('Location', `/meeting/${id}`);
        this.logger.log(`${id} 생성 완료`);
        return {
            href: `/meeting/${id}`,
        }
    }

    @Get(':id')
    async getMeeting(
      @Param() params: MeetingGetRequestParam,
      @Response() res: Res
    ) {
        const { id } = params;
        const data = await this.meetingService.getById(id);

        res.status(200);
        res.json(data);
    }

    @Post(':id')
    async addSchedule(
      @Param('id') id: string,
      @Body() body: MeetingAddRequestBody,
      @Response() res: Res
    ) {
        const data = await this.meetingService.addSchedule(id, body);

        res.status(201).send();
    }
}
