/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `areas` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "areas_name_key" ON "areas"("name");
