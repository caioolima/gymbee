-- AlterTable
ALTER TABLE "public"."Workout" ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'user-created';
