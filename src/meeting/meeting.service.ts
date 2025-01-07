import { Injectable } from '@nestjs/common';
import type { MeetingCreateDto } from './meeting.dto';
import { PrismaService } from '../prisma/prisma.service';
import { IDGen } from '../lib/idGen';


@Injectable()
export class MeetingService { 
    constructor(private prisma: PrismaService) {}
    async createMeeting({ title, starttime, endtime, dates}: MeetingCreateDto): Promise<string> {
        const id = IDGen.id();

        await this.prisma.meeting.create({
            data: {
                id,
                title,
                starttime,
                endtime,
                dates: JSON.stringify(dates)
            }
        });

        return id;
    }

}
