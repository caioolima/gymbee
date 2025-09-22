/*
  Warnings:

  - Added the required column `initialWeight` to the `UserGoal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."UserGoal" ADD COLUMN     "initialWeight" DOUBLE PRECISION NOT NULL;
