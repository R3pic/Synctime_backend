import { Test, TestingModule } from '@nestjs/testing';
import { MeetingService } from './meeting.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import type { MeetingAddRequestBody, MeetingCreateRequestBody } from './meeting.dto';
import { PrismaService } from '../prisma/prisma.service';
import { IDGen } from '../lib/idGen';
import { UnprocessableEntityException } from '@nestjs/common';

describe('MeetingService', () => {
  let service: MeetingService;
  let mockPrisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MeetingService, PrismaService],
    })
    .overrideProvider(PrismaService)
    .useValue(mockDeep<PrismaClient>())
    .compile();

    service = module.get<MeetingService>(MeetingService);
    mockPrisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('/meeting (POST)', () => {
    const expectedID = 'ABCDEFZ';

    it('정상 요청시 코드를 반환한다.', async () => {
      const mockdata: MeetingCreateRequestBody = {
        title: '테스트데이터',
        dates: ['2024-12-30', '2024-12-29'],
        starttime: '09:00',
        endtime: '12:00',
        schedule: {
          name: "주최자",
          data: []
        }
      }
      const actual = await service.createMeeting(mockdata);
  
      expect(mockPrisma.meeting.create).toHaveBeenCalledTimes(1);
      expect(actual).toEqual(expectedID);
    })
  });

  describe('/meeting/:id (POST)', () => {
    it('정상 요청시 Schedule 데이터를 추가한다.', async () => {
      const mockInfo = {
        dates: JSON.stringify(['2024-11-24', '2024-11-25'])
      };

      const mockRequestBody: MeetingAddRequestBody = {
        name: '테스트유저',
        data: [
          {
            date: '2024-11-24',
            time: '1'.repeat(48)
          }
        ]
      }

      mockPrisma.meeting.findUnique.mockResolvedValue(mockInfo as any);
      
      await service.addSchedule('ID', mockRequestBody);

      expect(mockPrisma.meeting.findUnique).toHaveBeenCalled();
      expect(mockPrisma.schedule.create).toHaveBeenCalled();
    });

    it('info에 없는 날짜에 추가할 경우 UnprocessableEntityException을 발생시킨다.', async () => {
      const mockInfo = {
        dates: JSON.stringify(['2024-11-24', '2024-11-25'])
      };

      const mockRequestBody: MeetingAddRequestBody = {
        name: '테스트유저',
        data: [
          {
            date: '2024-11-26',
            time: '1'.repeat(48)
          }
        ]
      }

      mockPrisma.meeting.findUnique.mockResolvedValue(mockInfo as any);

      await expect(service.addSchedule('ID', mockRequestBody)).rejects.toThrow(UnprocessableEntityException);
      expect(mockPrisma.meeting.findUnique).toHaveBeenCalled();
    })
  });
});
