/*
  Warnings:

  - A unique constraint covering the columns `[documento]` on the table `Paciente` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Paciente_documento_key" ON "public"."Paciente"("documento");
