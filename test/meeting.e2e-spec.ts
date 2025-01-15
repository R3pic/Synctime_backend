import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { MeetingModule } from '../src/meeting/meeting.module';
import { MeetingService } from '../src/meeting/meeting.service';
import { MeetingCreateRequestBody } from 'src/meeting/meeting.dto';

describe('MeetingController (e2e)', () => {
  let app: INestApplication;
  const expectedID = 'ABCDEFG' 
  const meetingService = {
    createMeeting: () => expectedID
  };
  
  beforeAll(async () => {
    const module = await Test.createTestingModule({
        imports: [MeetingModule]
    })
        .overrideProvider(MeetingService)
        .useValue(meetingService)
        .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe())
    await app.init();
  })

  describe('/meeting (POST) 모임 생성', () => {
    it('올바른 MeetingCreateDto로 요청시 201와 Location 헤더를 반환한다.', () => {
      const data: MeetingCreateRequestBody = {
        title: '테스트 값',
        dates: ['2024-12-29', '2024-12-30'],
        starttime: '09:00',
        endtime: '12:00',
        schedule: {
          name: "주최자",
          data: []
        }
      }
  
      return request(app.getHttpServer())
        .post('/meeting')
        .send(data)
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual({});
          expect(res.headers['location']).toBeDefined();
          expect(res.headers['location']).toEqual(`/meeting/${expectedID}`);
        });
    });

    it('time Format이 올바르지 않을 시 400 BadRequest를 반환한다.', () => {
      const data: Partial<MeetingCreateRequestBody> = {
        title: '테스트 값',
        dates: ['2024-12-29', '2024-12-30'],
        starttime: '09:0d',
        endtime: '12:00'
      }

      return request(app.getHttpServer())
      .post('/meeting')
      .send(data)
      .expect(400)
      .expect((res) => {
        expect(res.error).not.toBeFalsy();
        if (res.error) {
          expect(res.error.text).toContain('must be a valid time in the format HH:MM')
        }
      })
    })

    it('dates 내부 형식이 YYYY-MM-DD 형식이 아닐 경우 400 BadRequest를 반환한다.', () => {
      const data: Partial<MeetingCreateRequestBody> = {
        title: '테스트 값',
        dates: ['2024-12-1', '2024-12-30'],
        starttime: '09:00',
        endtime: '12:00'
      }

      return request(app.getHttpServer())
      .post('/meeting')
      .send(data)
      .expect(400)
      .expect((res) => {
        expect(res.error).not.toBeFalsy();
        if (res.error) {
          expect(res.error.text).toContain('each value in dates must be a valid ISO 8601 date string')
        }
      })
    })
  })
});
