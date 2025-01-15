import { ArrayNotEmpty, IsArray, IsDateString, IsDefined, IsNotEmpty, IsNotEmptyObject, IsString, Length, Validate, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsTimeFormat } from '../lib/validator/isTimeFormat';

export class Schedule {
    @IsNotEmpty()
    @IsString()
    @Length(1, 10)
    name: string;

    @IsNotEmpty()
    @IsArray()
    @ValidateNested()
    @Type(() => ScheduleData)
    data: ScheduleData[]
}

class ScheduleData {
    @IsDateString()
    date: string;

    @IsString()
    @Length(48, 48)
    time: string;
}

export class MeetingCreateRequestBody {
    @IsNotEmpty()
    @IsString()
    @Length(1, 30)
    title: string;

    @IsNotEmpty()
    @IsArray()
    @ArrayNotEmpty()
    @IsDateString({}, { each: true })
    dates: string[];

    @IsNotEmpty()
    @IsString()
    @Length(5, 5)
    @Validate(IsTimeFormat)
    starttime: string;

    @IsNotEmpty()
    @IsString()
    @Length(5, 5)
    @Validate(IsTimeFormat)
    endtime: string;

    @IsDefined()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => Schedule)
    schedule: Schedule;
}

export class MeetingGetRequestParam {
    @IsString()
    @Length(7, 7)
    id: string
}

export interface MeetingGetDto {
    title: string,
    starttime: string,
    endtime: string,
    dates: string[],
    schedules: Schedule[]
}

export class MeetingAddRequestBody {
    @IsString()
    name: string;

    @IsArray()
    @Type(() => ScheduleData)
    data: ScheduleData[];
}