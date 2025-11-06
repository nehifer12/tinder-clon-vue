import express from "express";
import seedrandom from "seedrandom";

const router = express.Router();

// === BASE DE DATOS EN MEMORIA === //
let baseDeDatos = { usuarios: [] };

// === DATOS DE APOYO === //
const cities = [
  "Bogotá","Medellín","Cali","Barranquilla","Cartagena","Bucaramanga","Pereira",
  "Santa Marta","Cúcuta","Ibagué","Manizales","Villavicencio","Neiva",
  "Pasto","Montería","Armenia","Sincelejo","Valledupar","Riohacha",
  "Tunja","Popayán","Palmira"
];

const maleNames = ["Carlos","Juan","Andrés","Julián","Mateo","Santiago","Camilo","Felipe","Esteban","David"];
const femaleNames = ["Laura","Mariana","Ana","Valentina","Carolina","Isabella","Paula","Camila","Natalia","Andrea"];
const lastNames = ["Gómez","Pérez","Rodríguez","Martínez","López","Fernández","García","Torres","Ramírez","Castro"];
const hobbies = ["leer","bailar","viajar","cocinar","hacer deporte","ver películas","dibujar","salir con amigos","jugar videojuegos","ir a conciertos","acampar","andar en bici","hacer senderismo"];
const orientations = ["heterosexual","homosexual","bisexual","pansexual","asexual"];
const lookingFor = ["amistad","relación seria","aventura","compañía","conversar","algo casual"];

// === FUNCIÓN PARA GENERAR USUARIOS ALEATORIOS === //
function generateUsers(count = 100, seed = null) {
  if (seed) seedrandom(seed, { global: true });

  const profiles = [];
  for (let i = 0; i < count; i++) {
    const isMale = Math.random() > 0.5;
    const firstName = isMale
      ? maleNames[Math.floor(Math.random() * maleNames.length)]
      : femaleNames[Math.floor(Math.random() * femaleNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const avatarId = Math.floor(Math.random() * 90);
    const city = cities[Math.floor(Math.random() * cities.length)];
    const hobbySample = hobbies.sort(() => 0.5 - Math.random()).slice(0, 3);
    const orientation = orientations[Math.floor(Math.random() * orientations.length)];
    const search = lookingFor[Math.floor(Math.random() * lookingFor.length)];

    profiles.push({
      id: i + 1,
      name: `${firstName} ${lastName}`,
      gender: isMale ? "masculino" : "femenino",
      age: Math.floor(Math.random() * 40) + 18,
      city,
      avatar: `https://randomuser.me/api/portraits/${isMale ? "men" : "women"}/${avatarId}.jpg`,
      orientation,
      drinks: Math.random() > 0.5,
      smokes: Math.random() > 0.4,
      hasChildren: Math.random() > 0.3,
      interests: hobbySample,
      lookingFor: search,
      description: `Soy ${firstName}, me gusta ${hobbySample[0]} y busco ${search}.`
    });
  }
  return profiles;
}

// === INICIALIZAR BASE === //
baseDeDatos.usuarios = generateUsers(100);

// === RUTAS === //

// Verificación rápida
router.get("/", (req, res) => {
  res.send("🚀 API de usuarios activa correctamente");
});

// Listar todos los usuarios
router.get("/users", (req, res) => {
  res.json({
    status: "success",
    total: baseDeDatos.usuarios.length,
    data: baseDeDatos.usuarios,
  });
});

// Obtener un usuario por ID
router.get("/user/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = baseDeDatos.usuarios.find((u) => u.id === id);
  if (!user)
    return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
  res.json({ status: "success", data: user });
});

// Agregar un nuevo usuario
router.post("/user", (req, res) => {
  const { name, age, city, gender, interests } = req.body;
  if (!name || !age || !city)
    return res.status(400).json({ status: "error", message: "Faltan campos obligatorios." });

  const newUser = {
    id: baseDeDatos.usuarios.length + 1,
    name,
    gender: gender || "no especificado",
    age,
    city,
    interests: interests || ["charlar", "viajar"],
    avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? "men" : "women"}/${Math.floor(Math.random() * 90)}.jpg`,
    description: `Soy ${name} y me gusta ${interests ? interests[0] : "pasar el rato"}.`,
  };

  baseDeDatos.usuarios.push(newUser);
  res.status(201).json({
    status: "success",
    message: "Usuario agregado correctamente",
    data: newUser,
  });
});

// === BASE DE MENSAJES === //
if (!baseDeDatos.mensajes) baseDeDatos.mensajes = [];

// === RUTAS DE MENSAJES === //

// Obtener mensajes recibidos por email
router.get("/messages/:email", (req, res) => {
  const { email } = req.params;
  const mensajes = baseDeDatos.mensajes.filter(m => m.to === email);
  res.json({ status: "success", data: mensajes });
});

// Enviar un nuevo mensaje
router.post("/messages", (req, res) => {
  const { from, to, content } = req.body;

  if (!from || !to || !content) {
    return res.status(400).json({ status: "error", message: "Faltan campos obligatorios." });
  }

  const newMessage = {
    id: baseDeDatos.mensajes.length + 1,
    from,
    to,
    content,
    date: new Date().toISOString()
  };

  baseDeDatos.mensajes.push(newMessage);

  res.status(201).json({
    status: "success",
    message: "Mensaje enviado correctamente",
    data: newMessage
  });
});
// === EXPORTAR ROUTER === //
export default router;