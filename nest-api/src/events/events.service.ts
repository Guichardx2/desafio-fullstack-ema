import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import Events from "./events.entity";

//DTO imports   
import { CreateEventDTO } from "./dtos/create-event.dto";
import { UpdateEventDTO } from './dtos/update-event.dto';

//Gateway imports
import { EventProcessingGateway } from './gateways/event-processing.gateway';


@Injectable()
/**
 * Service responsible for managing Events CRUD operations and notifying
 * connected clients via the EventProcessingGateway.
 *
 * Responsibilities:
 * - Query, create, update and delete events in the database via TypeORM.
 * - Emit real-time updates to clients after mutations.
 */
export class EventsService {
    //Logs
    private readonly logger = new Logger(EventsService.name);

    constructor(

        @InjectRepository(Events)
        private readonly eventsRepository: Repository<Events>,
        private readonly eventProcessingGateway: EventProcessingGateway,

    ) { }

     /**
      * Retrieve all events.
      * @returns Promise resolving to an array of {@link Events}.
      */
    async getAll(): Promise<Events[]> {
        return this.eventsRepository.find();
    }

     /**
      * Retrieve a single event by its identifier.
      * @param id Unique identifier of the event.
      * @returns Promise resolving to the {@link Events} entity or null if not found.
      */
    async getOne(id: number): Promise<Events | null> {
        return this.eventsRepository.findOneBy({ id });
    }

     /**
      * Create a new event.
      *
      * Validations:
      * - startDate must be before endDate.
      * - startDate must not be in the past.
      *
      * Side effects:
      * - Emits the updated list of events to connected clients after creation.
      *
      * @param eventDto The data required to create the event.
      * @returns Promise resolving to a success message object.
      * @throws HttpException If validation fails or persistence errors occur.
      */
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
            this.logger.debug(`Evento criado com ID ${newEvent.id}`);

            this.getAll().then(events => {
                this.eventProcessingGateway.emitEvent(events);
            });
    
            return {
                message: 'Evento criado com sucesso',
            };
            
        } catch (error) {

            throw new HttpException(`Erro ao criar o evento: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }

     /**
      * Update an existing event.
      *
      * Side effects:
      * - Emits the updated list of events to connected clients after update.
      *
      * @param id The identifier of the event to update.
      * @param eventDto Partial data to merge into the event.
      * @returns Promise resolving to a success message object.
      * @throws HttpException If the event is not found or update fails.
      */
    async update(id: number, eventDto: UpdateEventDTO): Promise<{ message: string }> {
        try {
            
            const event = await this.getOne(id);
    
            if (!event) {
                throw new HttpException(`Evento com ID ${id} não encontrado`, HttpStatus.NOT_FOUND);
            }
    
            this.eventsRepository.merge(event, eventDto);
            await this.eventsRepository.save(event);
            this.logger.debug(`Evento atualizado com ID ${event.id}`);

            this.getAll().then(events => {
                this.eventProcessingGateway.emitEvent(events);
            });
    
            return {
                message: 'Evento atualizado com sucesso!',
            };
        } catch (error) {

            throw new HttpException(`Erro ao atualizar o evento: ${error.message}`, HttpStatus.NOT_FOUND);

        }
    }

     /**
      * Delete an event by its identifier.
      *
      * Side effects:
      * - Emits the updated list of events to connected clients after deletion.
      *
      * @param id The identifier of the event to delete.
      * @returns Promise resolving to void.
      * @throws HttpException If the event is not found or deletion fails.
      */
    async delete(id: number): Promise<void> {
        
        try {
            
            const event = await this.getOne(id);
    
            if (!event) {
                throw new HttpException(`Evento com ID ${id} não encontrado`, HttpStatus.NOT_FOUND);
            }
    
            await this.eventsRepository.delete(event);
            this.logger.debug(`Evento deletado com ID ${event.id}`);

            this.getAll().then(events => {
                this.eventProcessingGateway.emitEvent(events);
            });

        } catch (error) {

            throw new HttpException(`Erro ao deletar o evento: ${error.message}`, HttpStatus.NOT_FOUND);
        }
    }
}
