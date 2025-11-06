export function verificarEdad(req, res, next) {
  const { age } = req.body;

  if (!age) {
    return res.status(400).json({ error: "La edad es obligatoria" });
  }

  if (age < 18) {
    return res.status(403).json({
      error: "Debes ser mayor de 18 años para usar esta plataforma"
    });
  }

  next();
}