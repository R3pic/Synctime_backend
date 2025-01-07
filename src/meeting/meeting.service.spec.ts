import { Test, TestingModule } from '@nestjs/testing';
import { MeetingService } from './meeting.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import type { MeetingCreateDto } from './meeting.dto';
import { PrismaService } from '../prisma/prisma.service';
import { IDGen } from '../lib/idGen';

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
      const mockdata: MeetingCreateDto = {
        title: '테스트데이터',
        dates: ['2024-12-30', '2024-12-29'],
        starttime: '09:00',
        endtime: '12:00',
      }
      const actual = await service.createMeeting(mockdata);
  
      expect(mockPrisma.meeting.create).toHaveBeenCalledTimes(1);
      expect(actual).toEqual(expectedID);
    })
  });
});
