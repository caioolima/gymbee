import { Injectable, Logger, NotFoundException, BadRequestException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { SwipeTrainerDto, CreateServiceDto, CreateScheduleDto, CreateContractDto, TrainerFiltersDto } from './dto/TrainerDTO';
import { TrainerProfileDto, TrainerCardDto, SwipeResponseDto, ContractViewDto, ServiceViewDto, ScheduleViewDto } from './view/TrainerViewDTO';
import { SwipeAction, ContractStatus } from '@prisma/client';

@Injectable()
export class TrainersService {
  private readonly logger = new Logger(TrainersService.name);

  constructor(private prisma: PrismaService) {}

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    
    return age;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(2));
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  async getTrainers(userId: string, filters: TrainerFiltersDto): Promise<TrainerCardDto[]> {
    try {
      // Buscar trainers que o usuário ainda não deu swipe
      const swipedTrainerIds = await this.prisma.trainerSwipe.findMany({
        where: { userId },
        select: { trainerId: true },
      });

      const swipedIds = swipedTrainerIds.map(swipe => swipe.trainerId);

      const whereClause: any = {
        id: {
          notIn: swipedIds,
        },
        user: {
          role: 'TRAINER',
        },
      };

      // Aplicar filtros
      if (filters.gender) {
        whereClause.user.gender = filters.gender;
      }

      if (filters.minAge || filters.maxAge) {
        const today = new Date();
        if (filters.maxAge) {
          const minBirthDate = new Date(today.getFullYear() - filters.maxAge - 1, today.getMonth(), today.getDate());
          whereClause.user.birthDate = { ...whereClause.user.birthDate, gte: minBirthDate };
        }
        if (filters.minAge) {
          const maxBirthDate = new Date(today.getFullYear() - filters.minAge, today.getMonth(), today.getDate());
          whereClause.user.birthDate = { ...whereClause.user.birthDate, lte: maxBirthDate };
        }
      }

      const trainers = await this.prisma.trainer.findMany({
        where: whereClause,
        include: {
          user: true,
          services: true,
        },
        take: 20,
      });

      return trainers.map(trainer => {
        const age = this.calculateAge(trainer.user.birthDate);
        const averageRating = 4.5; // TODO: Implementar sistema de avaliações

        const trainerCard: TrainerCardDto = {
          id: trainer.id,
          fullName: trainer.user.fullName,
          username: trainer.user.username,
          gender: trainer.user.gender,
          age,
          cref: trainer.cref,
          services: trainer.services.map(service => ({
            id: service.id,
            name: service.name,
            description: service.description,
            price: service.price,
            duration: service.duration,
            createdAt: service.createdAt,
          })),
          averageRating,
        };

        // Calcular distância se coordenadas fornecidas
        if (filters.lat && filters.lon) {
          // TODO: Implementar localização dos trainers
          trainerCard.distance = Math.random() * 10; // Mock por enquanto
        }

        return trainerCard;
      });
    } catch (error) {
      this.logger.error(`Erro ao buscar trainers: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Erro ao buscar trainers');
    }
  }

  async swipeTrainer(userId: string, swipeDto: SwipeTrainerDto): Promise<SwipeResponseDto> {
    try {
      // Verificar se o trainer existe
      const trainer = await this.prisma.trainer.findUnique({
        where: { id: swipeDto.trainerId },
      });

      if (!trainer) {
        throw new NotFoundException('Personal trainer não encontrado');
      }

      // Verificar se já existe um swipe para este trainer
      const existingSwipe = await this.prisma.trainerSwipe.findFirst({
        where: {
          userId,
          trainerId: swipeDto.trainerId,
        },
      });

      if (existingSwipe) {
        throw new ConflictException('Você já deu swipe neste personal trainer');
      }

      // Criar o swipe
      const swipe = await this.prisma.trainerSwipe.create({
        data: {
          userId,
          trainerId: swipeDto.trainerId,
          action: swipeDto.action,
        },
      });

      const message = swipeDto.action === SwipeAction.LIKE 
        ? 'Interesse registrado! Se o personal trainer também demonstrar interesse, vocês poderão se conectar.'
        : 'Personal trainer pulado.';

      this.logger.log(`Swipe realizado: usuário ${userId} ${swipeDto.action} trainer ${swipeDto.trainerId}`);

      return {
        id: swipe.id,
        userId: swipe.userId,
        trainerId: swipe.trainerId,
        action: swipe.action,
        createdAt: swipe.createdAt,
        message,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`Erro ao fazer swipe: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Erro ao fazer swipe');
    }
  }

  async getTrainerProfile(trainerId: string): Promise<TrainerProfileDto> {
    try {
      const trainer = await this.prisma.trainer.findUnique({
        where: { id: trainerId },
        include: {
          user: true,
          services: true,
          schedules: {
            where: {
              isAvailable: true,
              date: {
                gte: new Date(),
              },
            },
            orderBy: { date: 'asc' },
          },
        },
      });

      if (!trainer) {
        throw new NotFoundException('Personal trainer não encontrado');
      }

      const age = this.calculateAge(trainer.user.birthDate);
      const activeClients = await this.prisma.contract.count({
        where: {
          trainerId,
          status: ContractStatus.ACTIVE,
        },
      });

      return {
        id: trainer.id,
        userId: trainer.userId,
        cref: trainer.cref,
        fullName: trainer.user.fullName,
        username: trainer.user.username,
        email: trainer.user.email,
        gender: trainer.user.gender,
        birthDate: trainer.user.birthDate,
        age,
        services: trainer.services.map(service => ({
          id: service.id,
          name: service.name,
          description: service.description,
          price: service.price,
          duration: service.duration,
          createdAt: service.createdAt,
        })),
        schedules: trainer.schedules.map(schedule => ({
          id: schedule.id,
          date: schedule.date,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          isAvailable: schedule.isAvailable,
          createdAt: schedule.createdAt,
        })),
        activeClients,
        averageRating: 4.5, // TODO: Implementar sistema de avaliações
        createdAt: trainer.createdAt,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Erro ao buscar perfil do trainer: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Erro ao buscar perfil do trainer');
    }
  }

  async createService(trainerId: string, createServiceDto: CreateServiceDto): Promise<ServiceViewDto> {
    try {
      const service = await this.prisma.service.create({
        data: {
          trainerId,
          name: createServiceDto.name,
          description: createServiceDto.description,
          price: createServiceDto.price,
          duration: createServiceDto.duration,
        },
      });

      this.logger.log(`Serviço criado: ${service.id} para trainer ${trainerId}`);

      return {
        id: service.id,
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration,
        createdAt: service.createdAt,
      };
    } catch (error) {
      this.logger.error(`Erro ao criar serviço: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Erro ao criar serviço');
    }
  }

  async createSchedule(trainerId: string, createScheduleDto: CreateScheduleDto): Promise<ScheduleViewDto> {
    try {
      const date = new Date(createScheduleDto.date);
      
      // Validar se a data é futura
      if (date <= new Date()) {
        throw new BadRequestException('Data deve ser futura');
      }

      // Validar horários
      const startTime = createScheduleDto.startTime;
      const endTime = createScheduleDto.endTime;
      
      if (startTime >= endTime) {
        throw new BadRequestException('Horário de início deve ser anterior ao horário de fim');
      }

      const schedule = await this.prisma.schedule.create({
        data: {
          trainerId,
          date,
          startTime,
          endTime,
        },
      });

      this.logger.log(`Agendamento criado: ${schedule.id} para trainer ${trainerId}`);

      return {
        id: schedule.id,
        date: schedule.date,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        isAvailable: schedule.isAvailable,
        createdAt: schedule.createdAt,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Erro ao criar agendamento: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Erro ao criar agendamento');
    }
  }

  async createContract(userId: string, trainerId: string, createContractDto: CreateContractDto): Promise<ContractViewDto> {
    try {
      // Verificar se o serviço existe e pertence ao trainer
      const service = await this.prisma.service.findFirst({
        where: {
          id: createContractDto.serviceId,
          trainerId,
        },
      });

      if (!service) {
        throw new NotFoundException('Serviço não encontrado ou não pertence a este trainer');
      }

      // Verificar se já existe um contrato ativo entre o usuário e o trainer
      const existingContract = await this.prisma.contract.findFirst({
        where: {
          userId,
          trainerId,
          status: {
            in: [ContractStatus.PENDING, ContractStatus.ACTIVE],
          },
        },
      });

      if (existingContract) {
        throw new ConflictException('Já existe um contrato ativo com este trainer');
      }

      const startDate = new Date(createContractDto.startDate);
      const endDate = new Date(createContractDto.endDate);

      if (startDate >= endDate) {
        throw new BadRequestException('Data de início deve ser anterior à data de fim');
      }

      const contract = await this.prisma.contract.create({
        data: {
          userId,
          trainerId,
          serviceId: createContractDto.serviceId,
          startDate,
          endDate,
          totalPrice: service.price,
          status: ContractStatus.PENDING,
        },
        include: {
          service: true,
          trainer: {
            include: {
              user: true,
            },
          },
        },
      });

      this.logger.log(`Contrato criado: ${contract.id} entre usuário ${userId} e trainer ${trainerId}`);

      return {
        id: contract.id,
        userId: contract.userId,
        trainerId: contract.trainerId,
        serviceId: contract.serviceId,
        status: contract.status,
        startDate: contract.startDate,
        endDate: contract.endDate,
        totalPrice: contract.totalPrice,
        serviceName: contract.service.name,
        trainerName: contract.trainer.user.fullName,
        createdAt: contract.createdAt,
        updatedAt: contract.updatedAt,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Erro ao criar contrato: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Erro ao criar contrato');
    }
  }

  async getUserContracts(userId: string): Promise<ContractViewDto[]> {
    try {
      const contracts = await this.prisma.contract.findMany({
        where: { userId },
        include: {
          service: true,
          trainer: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return contracts.map(contract => ({
        id: contract.id,
        userId: contract.userId,
        trainerId: contract.trainerId,
        serviceId: contract.serviceId,
        status: contract.status,
        startDate: contract.startDate,
        endDate: contract.endDate,
        totalPrice: contract.totalPrice,
        serviceName: contract.service.name,
        trainerName: contract.trainer.user.fullName,
        createdAt: contract.createdAt,
        updatedAt: contract.updatedAt,
      }));
    } catch (error) {
      this.logger.error(`Erro ao buscar contratos: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Erro ao buscar contratos');
    }
  }
}
