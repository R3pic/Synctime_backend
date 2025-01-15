import { Test, TestingModule } from '@nestjs/testing';
import { MeetingController } from './meeting.controller';
import { MeetingService } from './meeting.service';
import type { MeetingCreateRequestBody } from './meeting.dto';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

describe('MeetingController', () => {
  let controller: MeetingController;
  let service: MeetingService;
  const expectedID = 'ABCDEFG'
  beforeEach(async () => {
    const meetingService = {
      createMeeting: jest.fn(() => expectedID)
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeetingController],
      providers: [{ provide: MeetingService, useValue: meetingService }]
    }).compile();

    controller = module.get<MeetingController>(MeetingController);
    service = module.get<MeetingService>(MeetingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createMeeting', () => {
    const expectedID = 'ABCDEFG';
    it('올바른 형식으로 호출되었을 경우', async () => {
      const mockData: MeetingCreateRequestBody = {
        title: '테스트데이터',
        dates: ['2024-12-30', '2024-12-29'],
        starttime: '09:00',
        endtime: '12:00',
        schedule: {
          name: "주최자",
          data: []
        }
      };
      const mockResponse = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      await controller.createMeeting(mockData, mockResponse);

      expect(service.createMeeting).toHaveBeenCalledWith(mockData);
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Location', `/meeting/${expectedID}`);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockResponse.send).toHaveBeenCalled();
    });
  });
});
