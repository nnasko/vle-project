/*
  Warnings:

  - You are about to drop the column `courseId` on the `Cohort` table. All the data in the column will be lost.
  - You are about to drop the column `courseId` on the `Module` table. All the data in the column will be lost.
  - You are about to drop the `Course` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[code]` on the table `Department` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `departmentId` to the `Cohort` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxStudents` to the `Cohort` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Department` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departmentId` to the `Module` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Cohort" DROP CONSTRAINT "Cohort_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "Module" DROP CONSTRAINT "Module_courseId_fkey";

-- AlterTable
ALTER TABLE "Cohort" DROP COLUMN "courseId",
ADD COLUMN     "currentStudents" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "departmentId" TEXT NOT NULL,
ADD COLUMN     "maxStudents" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "duration" "CourseDuration" NOT NULL DEFAULT 'FULL_TIME';

-- AlterTable
ALTER TABLE "Module" DROP COLUMN "courseId",
ADD COLUMN     "departmentId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Course";

-- CreateIndex
CREATE UNIQUE INDEX "Department_code_key" ON "Department"("code");

-- CreateIndex
CREATE INDEX "Module_departmentId_idx" ON "Module"("departmentId");

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cohort" ADD CONSTRAINT "Cohort_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
