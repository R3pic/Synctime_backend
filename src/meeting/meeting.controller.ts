import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Response } from '@nestjs/common';
import { Response as Res } from 'express';
import { MeetingAddRequestBody, MeetingCreateRequestBody, MeetingGetRequestParam } from './meeting.dto';
import { MeetingService } from './meeting.service';

@Controller('meeting')
export class MeetingController {
    constructor(private meetingService: MeetingService) {}

    @Post('/')
    async createMeeting(
        @Body() body: MeetingCreateRequestBody,
        @Response() res: Res
    ) {
        const id = await this.meetingService.createMeeting(body);
        res.setHeader('Location', `/meeting/${id}`);
        res.status(HttpStatus.CREATED).send();
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
