import { HttpException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import type { MeetingAddRequestBody, MeetingCreateRequestBody, MeetingGetDto, Schedule } from './meeting.dto';
import { PrismaService } from '../prisma/prisma.service';
import { IDGen } from '../lib/idGen';


@Injectable()
export class MeetingService { 
    constructor(private prisma: PrismaService) {}
    async createMeeting({ title, starttime, endtime, dates, schedule }: MeetingCreateRequestBody): Promise<string> {
        const id = IDGen.id();

        await this.prisma.meeting.create({
            data: {
                id,
                title,
                starttime,
                endtime,
                dates: JSON.stringify(dates),
                schedules: {
                    create: {
                        name: schedule.name,
                        data: JSON.stringify(schedule.data)
                    }
                }
            }
        });

        return id;
    }

    async getById(id: string): Promise<MeetingGetDto> {
        const data = await this.prisma.meeting.findUnique({
            select: {
                title: true,
                starttime: true,
                endtime: true,
                dates: true,
                schedules: {
                    select: {
                        name: true,
                        data: true
                    }
                }
            },
            where: {
                id
            }
        })

        if (data == null)
            throw new NotFoundException(`Meeting ID ${id} Not Found`);

        return {
            title: data.title,
            starttime: data.starttime,
            endtime: data.endtime,
            dates: JSON.parse(data.dates),
            schedules: data.schedules.map(({ name, data }) => {
                return {
                    name,
                    data: JSON.parse(data)
                }
            })
        };
    }

    async addSchedule(id: string, body: MeetingAddRequestBody) {
        const info = await this.prisma.meeting.findUnique({
            select: {
                dates: true
            },
            where: {
                id
            }
        });

        if (info == null)
            throw new NotFoundException(`Meeting ID ${id} Not Found`);

        const dates = JSON.parse(info.dates) as string[];

        body.data.forEach((data) => {
            if (!dates.includes(data.date))
                throw new UnprocessableEntityException(`Unexpected Date. Date should be defined on Meeting`)
        })

        const data = await this.prisma.schedule.create({
            data: {
                meeting_id: id,
                name: body.name,
                data: JSON.stringify(body.data)
            }
        })

        return data;
    }

}
