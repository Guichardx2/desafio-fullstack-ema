import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

import { EventsService } from '../../events/events.service';
import Events from '../../events/events.entity';
import { EventProcessingGateway } from '../../events/gateways/event-processing.gateway';
import { CreateEventDTO } from '../../events/dtos/create-event.dto';
import { UpdateEventDTO } from '../../events/dtos/update-event.dto';

describe('EventsService (unit)', () => {
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

  const flushPromises = () => new Promise<void>((r) => setImmediate(() => r()));

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
    it('retorna todos os eventos', async () => {
      const events = [{ id: 1 } as Events, { id: 2 } as Events];
      repoMock.find.mockResolvedValueOnce(events);

      await expect(service.getAll()).resolves.toEqual(events);
      expect(repoMock.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('getOne', () => {
    it('retorna um evento pelo ID', async () => {
      const event = { id: 10 } as Events;
      repoMock.findOneBy.mockResolvedValueOnce(event);

      await expect(service.getOne(10)).resolves.toEqual(event);
      expect(repoMock.findOneBy).toHaveBeenCalledWith({ id: 10 });
    });

    it('retorna null quando não encontrado', async () => {
      repoMock.findOneBy.mockResolvedValueOnce(null);
      await expect(service.getOne(999)).resolves.toBeNull();
    });
  });

  describe('create', () => {
    const base: Omit<CreateEventDTO, 'startDate' | 'endDate'> = {
      title: 'Titulo',
      description: 'Descricao',
      location: 'Local',
    } as any;

    it('cria um evento e emite pelo gateway', async () => {
      const start = new Date(Date.now() + 60 * 60 * 1000);
      const end = new Date(Date.now() + 2 * 60 * 60 * 1000);
      const dto: CreateEventDTO = { ...base, startDate: start, endDate: end } as any;

      const created: Events = { id: 1, ...(dto as any) };
      repoMock.create.mockReturnValueOnce(created);
      repoMock.save.mockResolvedValueOnce(created);

      const list = [created];
      jest.spyOn(service, 'getAll').mockResolvedValueOnce(list);

      await expect(service.create(dto)).resolves.toEqual({ message: 'Evento criado com sucesso' });
      expect(repoMock.create).toHaveBeenCalledWith(dto);
      expect(repoMock.save).toHaveBeenCalledWith(created);

      await flushPromises();
      expect(gatewayMock.emitEvent).toHaveBeenCalledWith(list);
    });

    it('falha quando startDate >= endDate', async () => {
      const start = new Date(Date.now() + 2 * 60 * 60 * 1000);
      const end = new Date(Date.now() + 60 * 60 * 1000);
      const dto: CreateEventDTO = { ...base, startDate: start, endDate: end } as any;

      await expect(service.create(dto)).rejects.toEqual(
        new HttpException(
          'Erro ao criar o evento: A data de início deve ser anterior à data de término',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('falha quando startDate é no passado', async () => {
      const start = new Date(Date.now() - 60 * 1000);
      const end = new Date(Date.now() + 60 * 60 * 1000);
      const dto: CreateEventDTO = { ...base, startDate: start, endDate: end } as any;

      await expect(service.create(dto)).rejects.toEqual(
        new HttpException(
          'Erro ao criar o evento: A data de início não pode ser anterior à data atual',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('update', () => {
    it('atualiza um evento e emite pelo gateway', async () => {
      const existing: Events = {
        id: 5,
        title: 'Old',
        description: 'Old',
        startDate: new Date(Date.now() + 60 * 60 * 1000),
        endDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
        location: 'Old',
      } as any;

      repoMock.findOneBy.mockResolvedValueOnce(existing);
      const dto: UpdateEventDTO = { title: 'New' };

      repoMock.merge.mockImplementation((e, d) => Object.assign(e, d));
      repoMock.save.mockResolvedValueOnce({ ...existing, ...dto });

      const list = [{ ...existing, ...dto }];
      jest.spyOn(service, 'getAll').mockResolvedValueOnce(list);

      await expect(service.update(existing.id, dto)).resolves.toEqual({ message: 'Evento atualizado com sucesso!' });
      expect(repoMock.merge).toHaveBeenCalledWith(existing, dto);
      expect(repoMock.save).toHaveBeenCalledWith(existing);

      await flushPromises();
      expect(gatewayMock.emitEvent).toHaveBeenCalledWith(list);
    });

    it('lança NOT_FOUND quando não encontra o evento', async () => {
      repoMock.findOneBy.mockResolvedValueOnce(null);

      await expect(service.update(999, { title: 'x' })).rejects.toEqual(
        new HttpException(
          'Erro ao atualizar o evento: Evento com ID 999 não encontrado',
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  describe('delete', () => {
    it('deleta um evento e emite pelo gateway', async () => {
      const existing: Events = {
        id: 3,
        title: 'T',
        description: 'D',
        startDate: new Date(Date.now() + 60 * 60 * 1000),
        endDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
        location: 'L',
      } as any;

      repoMock.findOneBy.mockResolvedValueOnce(existing);
      repoMock.delete.mockResolvedValueOnce(undefined as any);

      const list: Events[] = [];
      jest.spyOn(service, 'getAll').mockResolvedValueOnce(list);

      await service.delete(existing.id);
      expect(repoMock.delete).toHaveBeenCalledWith(existing);

      await flushPromises();
      expect(gatewayMock.emitEvent).toHaveBeenCalledWith(list);
    });

    it('lança NOT_FOUND quando não encontra o evento', async () => {
      repoMock.findOneBy.mockResolvedValueOnce(null);

      await expect(service.delete(111)).rejects.toEqual(
        new HttpException(
          'Erro ao deletar o evento: Evento com ID 111 não encontrado',
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });
});