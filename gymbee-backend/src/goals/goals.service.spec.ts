import { Test, TestingModule } from '@nestjs/testing';
import { GoalsService } from './goals.service';
import { PrismaService } from 'prisma/prisma.service';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { GoalType, ActivityLevel, ExperienceLevel } from '@prisma/client';

describe('GoalsService', () => {
  let service: GoalsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    userGoal: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoalsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<GoalsService>(GoalsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createGoal', () => {
    const userId = 'user-123';
    const createGoalDto = {
      goalType: GoalType.LOSE_WEIGHT,
      currentWeight: 80,
      targetWeight: 70,
      height: 175,
      activityLevel: ActivityLevel.MODERATE,
      deadline: '2024-12-31T23:59:59.000Z',
      experienceLevel: ExperienceLevel.BEGINNER,
    };

    it('should create a goal successfully', async () => {
      mockPrismaService.userGoal.findFirst.mockResolvedValue(null);
      mockPrismaService.userGoal.create.mockResolvedValue({
        id: 'goal-123',
        userId,
        ...createGoalDto,
        deadline: new Date(createGoalDto.deadline),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.createGoal(userId, createGoalDto);

      expect(result).toBeDefined();
      expect(result.userId).toBe(userId);
      expect(result.goalType).toBe(createGoalDto.goalType);
      expect(mockPrismaService.userGoal.create).toHaveBeenCalledWith({
        data: {
          userId,
          goalType: createGoalDto.goalType,
          currentWeight: createGoalDto.currentWeight,
          targetWeight: createGoalDto.targetWeight,
          height: createGoalDto.height,
          activityLevel: createGoalDto.activityLevel,
          deadline: new Date(createGoalDto.deadline),
          experienceLevel: createGoalDto.experienceLevel,
        },
      });
    });

    it('should throw ConflictException if user already has an active goal', async () => {
      mockPrismaService.userGoal.findFirst.mockResolvedValue({
        id: 'existing-goal',
        userId,
      });

      await expect(service.createGoal(userId, createGoalDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw BadRequestException if deadline is in the past', async () => {
      const pastDeadline = new Date(Date.now() - 86400000).toISOString(); // Yesterday
      const goalWithPastDeadline = { ...createGoalDto, deadline: pastDeadline };

      mockPrismaService.userGoal.findFirst.mockResolvedValue(null);

      await expect(service.createGoal(userId, goalWithPastDeadline)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if current weight equals target weight', async () => {
      const goalWithSameWeight = { ...createGoalDto, targetWeight: 80 };

      mockPrismaService.userGoal.findFirst.mockResolvedValue(null);

      await expect(service.createGoal(userId, goalWithSameWeight)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getGoals', () => {
    const userId = 'user-123';

    it('should return user goals', async () => {
      const mockGoals = [
        {
          id: 'goal-1',
          userId,
          goalType: GoalType.LOSE_WEIGHT,
          currentWeight: 80,
          targetWeight: 70,
          height: 175,
          activityLevel: ActivityLevel.MODERATE,
          deadline: new Date('2024-12-31'),
          experienceLevel: ExperienceLevel.BEGINNER,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.userGoal.findMany.mockResolvedValue(mockGoals);

      const result = await service.getGoals(userId);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('goal-1');
      expect(mockPrismaService.userGoal.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    });
  });
});
