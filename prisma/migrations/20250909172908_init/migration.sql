-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('MEDICO', 'ATENDENTE');

-- CreateEnum
CREATE TYPE "public"."Priority" AS ENUM ('ALTA', 'MEDIA', 'BAIXA');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('CADASTRADO', 'TRIADO', 'AGUARDANDO', 'EM_ATENDIMENTO', 'CONCLUIDO');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Medico" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "especialidade" TEXT NOT NULL,

    CONSTRAINT "Medico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Atendente" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Atendente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Paciente" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "motivo" TEXT,
    "prioridade" "public"."Priority",
    "status" "public"."Status" NOT NULL DEFAULT 'CADASTRADO',
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Triage" (
    "id" SERIAL NOT NULL,
    "pacienteId" INTEGER NOT NULL,
    "temperatura" DOUBLE PRECISION,
    "pressao" TEXT,
    "freqCardiaca" INTEGER,
    "freqRespiratoria" INTEGER,
    "alergias" TEXT,
    "motivo" TEXT,
    "prioridade" "public"."Priority",
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Triage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Encounter" (
    "id" SERIAL NOT NULL,
    "pacienteId" INTEGER NOT NULL,
    "medicoId" INTEGER NOT NULL,
    "horaInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "horaFim" TIMESTAMP(3),
    "status" "public"."Status",
    "sintomas" TEXT,
    "cid10" TEXT,
    "tipo" TEXT,
    "prescricao" TEXT,
    "observacoes" TEXT,
    "anamnese" TEXT,
    "exames" TEXT,
    "procedimentos" TEXT,
    "diagnostico" TEXT,
    "plano" TEXT,
    "documentos" TEXT,

    CONSTRAINT "Encounter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Medico_userId_key" ON "public"."Medico"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Atendente_userId_key" ON "public"."Atendente"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Triage_pacienteId_key" ON "public"."Triage"("pacienteId");

-- AddForeignKey
ALTER TABLE "public"."Medico" ADD CONSTRAINT "Medico_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Atendente" ADD CONSTRAINT "Atendente_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Triage" ADD CONSTRAINT "Triage_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "public"."Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Encounter" ADD CONSTRAINT "Encounter_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "public"."Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Encounter" ADD CONSTRAINT "Encounter_medicoId_fkey" FOREIGN KEY ("medicoId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
