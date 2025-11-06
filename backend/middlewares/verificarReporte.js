const usuariosReportados = ["Carlos Gómez", "Ana Torres", "Camila López"];

export function verificarReporte(req, res, next) {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "El nombre es obligatorio" });
  }

  if (usuariosReportados.includes(name)) {
    return res.status(403).json({
      error: "Este usuario ha sido reportado y no puede crear otra cuenta."
    });
  }

  next();
}