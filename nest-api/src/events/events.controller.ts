//Nest imports
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

//Service imports
import { EventsService } from './events.service';

//DTO imports
import { UpdateEventDTO } from './dtos/update-event.dto';
import { CreateEventDTO } from './dtos/create-event.dto';

//Model imports
import { Events } from './events.entity';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('all')
  async getAll(): Promise<Events[]> {
    return this.eventsService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: number): Promise<Events | null> {
    return this.eventsService.getOne(id);
  }


  @Post('create')
  async create(@Body() eventDto: CreateEventDTO): Promise<{ message: string }> {
    return this.eventsService.create(eventDto);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() eventDto: UpdateEventDTO): Promise<{ message: string }> {
    return this.eventsService.update(id, eventDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.eventsService.delete(id);
  }

}
