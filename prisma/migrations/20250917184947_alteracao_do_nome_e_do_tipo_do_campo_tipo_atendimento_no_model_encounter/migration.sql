/*
  Warnings:

  - You are about to drop the column `tipo` on the `Encounter` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."TipoAtendimento" AS ENUM ('AMBULATORIAL', 'URGENCIA', 'INTERNACAO');

-- AlterTable
ALTER TABLE "public"."Encounter" DROP COLUMN "tipo",
ADD COLUMN     "tipoAtendimento" "public"."TipoAtendimento";
