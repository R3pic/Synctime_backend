import { Body, Controller, HttpStatus, Post, Response } from '@nestjs/common';
import { Response as Res } from 'express';
import { MeetingCreateDto } from './meeting.dto';
import { MeetingService } from './meeting.service';

@Controller('meeting')
export class MeetingController {
    constructor(private meetingService: MeetingService) {}

    @Post('/')
    async createMeeting(
        @Body() body: MeetingCreateDto,
        @Response() res: Res
    ) {
        const id = await this.meetingService.createMeeting(body);
        res.setHeader('Location', `/meeting/${id}`);
        res.status(HttpStatus.CREATED).send();
    }
}
