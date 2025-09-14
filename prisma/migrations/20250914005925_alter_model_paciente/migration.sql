/*
  Warnings:

  - You are about to drop the column `motivo` on the `Paciente` table. All the data in the column will be lost.
  - You are about to drop the column `prioridade` on the `Paciente` table. All the data in the column will be lost.
  - Added the required column `cep` to the `Paciente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataNascimento` to the `Paciente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `documento` to the `Paciente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endereco` to the `Paciente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefone` to the `Paciente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Paciente" DROP COLUMN "motivo",
DROP COLUMN "prioridade",
ADD COLUMN     "cep" TEXT NOT NULL,
ADD COLUMN     "dataNascimento" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "documento" TEXT NOT NULL,
ADD COLUMN     "endereco" TEXT NOT NULL,
ADD COLUMN     "telefone" TEXT NOT NULL;
