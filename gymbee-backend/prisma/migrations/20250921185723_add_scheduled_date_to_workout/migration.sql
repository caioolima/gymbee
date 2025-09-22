-- CreateEnum
CREATE TYPE "public"."WorkoutType" AS ENUM ('STRENGTH', 'CARDIO', 'FLEXIBILITY', 'MIXED');

-- CreateEnum
CREATE TYPE "public"."AchievementType" AS ENUM ('WELCOME_TO_HIVE', 'FIRST_WORKOUT', 'WEEK_STREAK', 'MONTH_STREAK', 'WEIGHT_GOAL', 'CONSISTENCY', 'MILESTONE');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "public"."UserGoal" ALTER COLUMN "deadline" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."ChallengeParticipation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "participatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "ChallengeParticipation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Workout" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."WorkoutType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "duration" INTEGER NOT NULL,
    "calories" INTEGER,
    "exercises" JSONB,
    "notes" TEXT,
    "scheduledDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserAchievement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."AchievementType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,

    CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WeightEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeightEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeParticipation_userId_challengeId_participatedAt_key" ON "public"."ChallengeParticipation"("userId", "challengeId", "participatedAt");

-- AddForeignKey
ALTER TABLE "public"."ChallengeParticipation" ADD CONSTRAINT "ChallengeParticipation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChallengeParticipation" ADD CONSTRAINT "ChallengeParticipation_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "public"."Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Workout" ADD CONSTRAINT "Workout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserAchievement" ADD CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WeightEntry" ADD CONSTRAINT "WeightEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
