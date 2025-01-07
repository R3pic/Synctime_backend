import { ArrayNotEmpty, IsArray, IsDateString, IsNotEmpty, IsString, Length, Validate } from 'class-validator';
import { IsTimeFormat } from '../lib/validator/isTimeFormat';

export class MeetingCreateDto {
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
}