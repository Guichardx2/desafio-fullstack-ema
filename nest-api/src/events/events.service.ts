import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import Events from "./events.entity";

//DTO imports   
import { CreateEventDTO } from "./dtos/create-event.dto";
import { UpdateEventDTO } from './dtos/update-event.dto';

@Injectable()
export class EventsService {

    constructor(

        @InjectRepository(Events)
        private readonly eventsRepository: Repository<Events>,

    ) { }

    async getAll(): Promise<Events[]> {
        return this.eventsRepository.find();
    }

    async getOne(id: number): Promise<Events | null> {
        return this.eventsRepository.findOneBy({ id });
    }

    async create(eventDto: CreateEventDTO): Promise<{ message: string }> {
        
        try {

            if (eventDto.startDate >= eventDto.endDate) {
                throw new HttpException('A data de início deve ser anterior à data de término', HttpStatus.BAD_REQUEST);
            }
            
            if (eventDto.startDate < new Date()) {
                throw new HttpException('A data de início não pode ser anterior à data atual', HttpStatus.BAD_REQUEST);
            }
            
            
            const newEvent = this.eventsRepository.create(eventDto);
            await this.eventsRepository.save(newEvent);
    
            return {
                message: 'Evento criado com sucesso',
            };
            
        } catch (error) {

            throw new HttpException(`Erro ao criar o evento: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }

    async update(id: number, eventDto: UpdateEventDTO): Promise<{ message: string }> {
        try {
            
            const event = await this.getOne(id);
    
            if (!event) {
                throw new HttpException(`Evento com ID ${id} não encontrado`, HttpStatus.NOT_FOUND);
            }
    
            this.eventsRepository.merge(event, eventDto);
            await this.eventsRepository.save(event);
    
            return {
                message: 'Evento atualizado com sucesso!',
            };
        } catch (error) {

            throw new HttpException(`Erro ao atualizar o evento: ${error.message}`, HttpStatus.NOT_FOUND);

        }
    }

    async delete(id: number): Promise<void> {
        
        try {
            
            const event = await this.getOne(id);
    
            if (!event) {
                throw new HttpException(`Evento com ID ${id} não encontrado`, HttpStatus.NOT_FOUND);
            }
    
            await this.eventsRepository.delete(event);

        } catch (error) {

            throw new HttpException(`Erro ao deletar o evento: ${error.message}`, HttpStatus.NOT_FOUND);
        }
    }
}
