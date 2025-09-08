//Nest imports
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

//Services imports
import { EventsService } from './events.service';

//Controller imports
import { EventsController } from './events.controller';

//Entity imports
import Events from './events.entity';

//Gateway imports
import { EventProcessingGateway } from './gateways/event-processing.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Events])],
  controllers: [EventsController],
  providers: [EventsService, EventProcessingGateway],
  exports: [EventsService],
})
export class EventsModule {}
