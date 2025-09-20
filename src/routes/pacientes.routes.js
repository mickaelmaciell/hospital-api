import { Router } from "express";
import { prisma } from "../prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/rbac.js";
const r = Router();

r.use(requireAuth);

r.get("/", async(req, res) => {
  try {
    const pacientes = await prisma.paciente.findMany({
      orderBy: {
        dataCadastro:"asc"
      },
      include: {
        triage: true,
        atendimentos: true
      }
    })
    return res.status(200).json(pacientes)
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})

// cadastrar (ATENDENTE)
r.post("/", requireRole("ATENDENTE"), async (req, res) => {
  try {
    const { nome, dataNascimento, documento, telefone, cep, endereco } =
      req.body;
    const p = await prisma.paciente.create({
      data: {
        nome,
        dataNascimento: new Date(dataNascimento),
        documento,
        telefone,
        cep,
        endereco,
      },
    });
    return res.status(201).json(p);
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({ error: error.message });
  }
});

r.get("/triagem", async (req, res) => {
  const pacientes = await prisma.paciente.findMany({
    where: {
      status: "CADASTRADO",
    },
    orderBy: {
      id: "asc",
    },
  });

  return res.status(200).json(pacientes);
});

r.post("/triagem", async (req, res) => {
  const {
    temperatura,
    pressao,
    freqCardiaca,
    freqRespiratoria,
    alergias,
    notas,
    motivo,
    prioridade,
    pacienteId,
    completedAt,
  } = req.body;

  const p = await prisma.triage.create({
    data: {
      temperatura: Number(temperatura),
      pressao,
      freqCardiaca: Number(freqCardiaca),
      freqRespiratoria: Number(freqRespiratoria),
      alergias,
      notas,
      motivo,
      prioridade,
      pacienteId,
      completedAt,
    },
  });

  return res.status(201).json(p);
});

// fila por prioridade
r.get("/fila", async (_req, res) => {
  const order = { ALTA: 3, MEDIA: 2, BAIXA: 1 };
  const pacientes = await prisma.paciente.findMany({
    where: { OR: [{ status: "TRIADO" }, { status: "AGUARDANDO" }] },
    include: { triage: true },
    orderBy: [{ dataCadastro: "asc" }],
  });

  const sorted = pacientes.sort(
    (a, b) =>
      order[b.triage.prioridade || "BAIXA"] -
      order[a.triage.prioridade || "BAIXA"]
  );
  res.status(200).json(sorted);
});

// alterar status
r.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const p = await prisma.paciente.update({
    where: { id: +id },
    data: { status: status.toUpperCase() },
  });
  res.json(p);
});

export default r;
