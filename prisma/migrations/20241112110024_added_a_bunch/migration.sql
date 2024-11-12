/*
  Warnings:

  - The values [THIRD_YEAR,FOURTH_YEAR] on the enum `GradeLevel` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `credits` to the `Module` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Module` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ModuleStatus" AS ENUM ('ACTIVE', 'REVIEW', 'ARCHIVED');

-- AlterEnum
BEGIN;
CREATE TYPE "GradeLevel_new" AS ENUM ('FIRST_YEAR', 'SECOND_YEAR');
ALTER TABLE "Student" ALTER COLUMN "currentGrade" TYPE "GradeLevel_new" USING ("currentGrade"::text::"GradeLevel_new");
ALTER TYPE "GradeLevel" RENAME TO "GradeLevel_old";
ALTER TYPE "GradeLevel_new" RENAME TO "GradeLevel";
DROP TYPE "GradeLevel_old";
COMMIT;

-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "staffCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN     "studentCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "averageScore" DOUBLE PRECISION,
ADD COLUMN     "credits" INTEGER NOT NULL,
ADD COLUMN     "passingRate" DOUBLE PRECISION,
ADD COLUMN     "status" "ModuleStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "year" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "academicStanding" TEXT,
ADD COLUMN     "courseProgress" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "emergencyContact" TEXT,
ADD COLUMN     "enrollmentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "previousEducation" TEXT,
ADD COLUMN     "specialNeeds" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "biography" TEXT,
ADD COLUMN     "officeHours" TEXT,
ADD COLUMN     "qualifications" TEXT[];

-- CreateTable
CREATE TABLE "EnrollmentTrend" (
    "id" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "studentCount" INTEGER NOT NULL,

    CONSTRAINT "EnrollmentTrend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceRate" (
    "id" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "week" TIMESTAMP(3) NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "AttendanceRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModulePrerequisite" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "prerequisiteId" TEXT NOT NULL,

    CONSTRAINT "ModulePrerequisite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningOutcome" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,

    CONSTRAINT "LearningOutcome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherModule" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TeacherModule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ModulePrerequisite_moduleId_prerequisiteId_key" ON "ModulePrerequisite"("moduleId", "prerequisiteId");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherModule_teacherId_moduleId_key" ON "TeacherModule"("teacherId", "moduleId");

-- AddForeignKey
ALTER TABLE "EnrollmentTrend" ADD CONSTRAINT "EnrollmentTrend_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRate" ADD CONSTRAINT "AttendanceRate_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModulePrerequisite" ADD CONSTRAINT "ModulePrerequisite_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModulePrerequisite" ADD CONSTRAINT "ModulePrerequisite_prerequisiteId_fkey" FOREIGN KEY ("prerequisiteId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningOutcome" ADD CONSTRAINT "LearningOutcome_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherModule" ADD CONSTRAINT "TeacherModule_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherModule" ADD CONSTRAINT "TeacherModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
