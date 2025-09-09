import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

import Events from '../../events/events.entity';
import { EventsService } from '../../events/events.service';
import { EventProcessingGateway } from '../../events/gateways/event-processing.gateway';
import { CreateEventDTO } from '../../events/dtos/create-event.dto';
import { UpdateEventDTO } from '../../events/dtos/update-event.dto';

describe('EventsService', () => {
  let service: EventsService;

  const repoMock = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    delete: jest.fn(),
  } as const;

  const gatewayMock = {
    emitEvent: jest.fn(),
  } as const;

  const flushPromises = () => new Promise<void>((resolve) => setImmediate(() => resolve()));

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: getRepositoryToken(Events), useValue: { ...repoMock } },
        { provide: EventProcessingGateway, useValue: { ...gatewayMock } },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  describe('getAll', () => {
    it('Deve retornar todos os eventos', async () => {
      const events = [{ id: 1 } as Events, { id: 2 } as Events];
      (repoMock.find as jest.Mock).mockResolvedValueOnce(events);

      const result = await service.getAll();
      expect(result).toEqual(events);
      expect(repoMock.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('getOne', () => {
    it('Deve retornar um evento pelo id', async () => {
      const event = { id: 1 } as Events;
      (repoMock.findOneBy as jest.Mock).mockResolvedValueOnce(event);

      const result = await service.getOne(1);
      expect(result).toEqual(event);
      expect(repoMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('Deve retornar null se não encontrado', async () => {
      (repoMock.findOneBy as jest.Mock).mockResolvedValueOnce(null);
      const result = await service.getOne(123);
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    const baseDto: Omit<CreateEventDTO, 'startDate' | 'endDate'> = {
      title: 'Titulo',
      description: 'Descricao',
      location: 'Local',
    } as any;

    it('Deve criar um evento e emitir para o gateway', async () => {
      const start = new Date(Date.now() + 60 * 60 * 1000); // +1h
      const end = new Date(Date.now() + 2 * 60 * 60 * 1000); // +2h
      const dto: CreateEventDTO = { ...baseDto, startDate: start, endDate: end } as any;

      const created: Events = { id: 1, ...(dto as any) };
      (repoMock.create as jest.Mock).mockReturnValueOnce(created);
      (repoMock.save as jest.Mock).mockResolvedValueOnce(created);

      // Make getAll resolve to a known list to be emitted
      const list = [created];
      jest.spyOn(service, 'getAll').mockResolvedValueOnce(list);

      const result = await service.create(dto);
      expect(result).toEqual({ message: 'Evento criado com sucesso' });

      expect(repoMock.create).toHaveBeenCalledWith(dto);
      expect(repoMock.save).toHaveBeenCalledWith(created);

      // allow the internal then() to run
      await flushPromises();
      expect(gatewayMock.emitEvent).toHaveBeenCalledWith(list);
    });

    it('Deve lançar um erro se startDate >= endDate', async () => {
      const start = new Date(Date.now() + 2 * 60 * 60 * 1000);
      const end = new Date(Date.now() + 60 * 60 * 1000);
      const dto: CreateEventDTO = { ...baseDto, startDate: start, endDate: end } as any;

      await expect(service.create(dto)).rejects.toEqual(
        new HttpException(
          'Erro ao criar o evento: A data de início deve ser anterior à data de término',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('Deve lançar um erro se startDate estiver no passado', async () => {
      const start = new Date(Date.now() - 60 * 1000);
      const end = new Date(Date.now() + 60 * 60 * 1000);
      const dto: CreateEventDTO = { ...baseDto, startDate: start, endDate: end } as any;

      await expect(service.create(dto)).rejects.toEqual(
        new HttpException(
          'Erro ao criar o evento: A data de início não pode ser anterior à data atual',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('update', () => {
    it('Deve atualizar um evento e emitir para o gateway', async () => {
      const existing: Events = {
        id: 7,
        title: 'Old',
        description: 'Old',
        startDate: new Date(Date.now() + 60 * 60 * 1000),
        endDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
        location: 'Old',
      } as any;
      (repoMock.findOneBy as jest.Mock).mockResolvedValueOnce(existing);

      const dto: UpdateEventDTO = { title: 'New' };

      (repoMock.merge as jest.Mock).mockImplementation((e, d) => Object.assign(e, d));
      (repoMock.save as jest.Mock).mockResolvedValueOnce({ ...existing, ...dto });

      const list = [{ ...existing, ...dto }];
      jest.spyOn(service, 'getAll').mockResolvedValueOnce(list);

      const result = await service.update(existing.id, dto);
      expect(result).toEqual({ message: 'Evento atualizado com sucesso!' });

      expect(repoMock.merge).toHaveBeenCalledWith(existing, dto);
      expect(repoMock.save).toHaveBeenCalledWith(existing);

      await flushPromises();
      expect(gatewayMock.emitEvent).toHaveBeenCalledWith(list);
    });

    it('Deve lançar NOT_FOUND quando o evento não existir', async () => {
      (repoMock.findOneBy as jest.Mock).mockResolvedValueOnce(null);

      await expect(service.update(999, { title: 'x' })).rejects.toEqual(
        new HttpException(
          'Erro ao atualizar o evento: Evento com ID 999 não encontrado',
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  describe('delete', () => {
    it('Deve deletar um evento e emitir para o gateway', async () => {
      const existing: Events = {
        id: 3,
        title: 'T',
        description: 'D',
        startDate: new Date(Date.now() + 60 * 60 * 1000),
        endDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
        location: 'L',
      } as any;
      (repoMock.findOneBy as jest.Mock).mockResolvedValueOnce(existing);
      (repoMock.delete as jest.Mock).mockResolvedValueOnce(undefined);

      const list = [] as Events[];
      jest.spyOn(service, 'getAll').mockResolvedValueOnce(list);

      await service.delete(existing.id);
      expect(repoMock.delete).toHaveBeenCalledWith(existing);

      await flushPromises();
      expect(gatewayMock.emitEvent).toHaveBeenCalledWith(list);
    });

    it('Deve lançar NOT_FOUND quando o evento não existir', async () => {
      (repoMock.findOneBy as jest.Mock).mockResolvedValueOnce(null);

      await expect(service.delete(111)).rejects.toEqual(
        new HttpException(
          'Erro ao deletar o evento: Evento com ID 111 não encontrado',
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });
});
