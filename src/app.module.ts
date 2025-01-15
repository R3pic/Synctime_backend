import { Module } from '@nestjs/common';
import { MeetingModule } from './meeting/meeting.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    MeetingModule, 
    PrismaModule
  ],
})
export class AppModule {}
