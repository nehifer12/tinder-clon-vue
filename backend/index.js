import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { verificarEdad } from "./middlewares/verificarEdad.js";
import { verificarReporte } from "./middlewares/verificarReporte.js";

// === CONFIGURACIÓN BASE === //
const app = express();
const PORT = process.env.PORT || 6060;

app.use(cors());
app.use(express.json());

// === RUTAS DE ARCHIVOS === //
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE = path.join(__dirname, "users.json");
const MESSAGES_FILE = path.join(__dirname, "messages.json");
const LIKES_FILE = path.join(__dirname, "likes.json");

// === FUNCIONES DE PERSISTENCIA === //
function loadJSON(file) {
  try {
    if (fs.existsSync(file)) {
      const data = fs.readFileSync(file, "utf8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error(`⚠️ Error al leer ${file}:`, err);
  }
  return [];
}

function saveJSON(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`⚠️ Error al guardar ${file}:`, err);
  }
}

// === DATOS BASE === //
// === DATOS BASE === //
const cities = [
    // — Principales —
  "Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Bucaramanga", "Pereira", "Manizales", "Santa Marta",
  "Cúcuta", "Villavicencio", "Ibagué", "Neiva", "Tunja", "Popayán", "Armenia", "Montería", "Sincelejo", 
  "Pasto", "Valledupar", "Riohacha", "Palmira", "Soacha", "Chía", "Zipaquirá", "Yopal", "Leticia", "Florencia",
  "Mocoa", "Arauca", "Quibdó", "San Andrés", "Turbo", "Girardot", "Sogamoso", "Facatativá", "Tuluá", "Cartago",
  "Envigado", "Itagüí", "Rionegro", "Bello", "Dosquebradas", "Jamundí", "Ciénaga", "Malambo", "Soledad", "Magangué",

  // — Capitales departamentales —
  "Arauca", "Armenia", "Barranquilla", "Bogotá", "Bucaramanga", "Cali", "Cartagena", "Cúcuta", "Florencia",
  "Ibagué", "Leticia", "Manizales", "Medellín", "Mitú", "Mocoa", "Montería", "Neiva", "Pasto", "Pereira",
  "Popayán", "Puerto Carreño", "Quibdó", "Riohacha", "San Andrés", "San José del Guaviare", "Santa Marta",
  "Sincelejo", "Tunja", "Valledupar", "Villavicencio", "Yopal",

  // — Intermedias y turísticas —
  "Guatapé", "Melgar", "La Vega", "Sopó", "Villeta", "Fusagasugá", "Apulo", "Guaduas", "Barichara", "Villa de Leyva",
  "Mompox", "Honda", "San Gil", "Coveñas", "Tolú", "Ráquira", "Cajicá", "Tabio", "Tenjo", "Anapoima", "Paipa",
  "Zipaquirá", "Nemocón", "La Mesa", "Girón", "Barbosa", "Socorro", "El Carmen de Viboral", "Copacabana",
  "Sabaneta", "La Ceja", "La Dorada", "Pitalito", "Garzón", "Gigante", "Tame", "Saravena", "Apartadó", "Carepa",
  "Planeta Rica", "Lorica", "Cereté", "Sahagún", "Ciénaga de Oro", "Montelíbano", "Fundación", "El Banco",
  "Plato", "Chinchiná", "Supía", "La Virginia", "Belalcázar", "Risaralda", "Aguadas", "Salamina", "Caldas",
  "Mariquita", "Líbano", "Espinal", "Purificación", "Chaparral", "Candelaria", "Yumbo", "Palmira", "Buga",
  "Tuluá", "Buenaventura", "La Unión", "Roldanillo", "Cartago", "Zarzal", "Pradera", "Florida", "Duitama",
  "Sogamoso", "Moniquirá", "Chiquinquirá", "Garagoa", "Tunja", "Samacá", "Tibasosa", "Soracá", "Villa de Leyva",

  // — Pueblos reconocidos —
  "Jericó", "Jardín", "Santa Fe de Antioquia", "El Retiro", "Guarne", "San Rafael", "Amagá", "Venecia", "Fredonia",
  "Titiribí", "Santa Rosa de Osos", "Donmatías", "Entrerríos", "San Pedro de los Milagros", "San Vicente",
  "Copacabana", "Ituango", "Urrao", "Necoclí", "Mutatá", "Chigorodó", "Turbo", "Apartadó", "Carepa", "Arboletes",
  "Frontino", "Dabeiba", "Peque", "Yarumal", "Angostura", "Belmira", "Gómez Plata", "Toledo", "Campamento",
  "Anorí", "Remedios", "Segovia", "Caucasia", "El Bagre", "Nechí"
];

const maleNames = [
  "Carlos", "Juan", "Andrés", "Julián", "Mateo", "Santiago", "Camilo", "Felipe", "Esteban", "David",
  "Sebastián", "Daniel", "Nicolás", "Tomás", "Simón", "Alejandro", "Cristian", "Diego", "Luis", "Miguel",
  "Fernando", "Adrián", "Kevin", "Oscar", "Eduardo", "Pablo", "Jorge", "Iván", "Leonardo", "Mauricio",
  "Brayan", "Darío", "Samuel", "Martín", "Emilio", "Erick", "Ángel"
];

const femaleNames = [
  "Laura", "Mariana", "Ana", "Valentina", "Carolina", "Isabella", "Paula", "Camila", "Natalia", "Andrea",
  "Daniela", "Sara", "Juliana", "Gabriela", "María", "Lina", "Vanessa", "Nicole", "Tatiana", "Sofía",
  "Ángela", "Adriana", "Catalina", "Fernanda", "Luisa", "Rosa", "Claudia", "Gloria", "Viviana", "Mónica",
  "Melisa", "Estefanía", "Diana", "Yulieth", "Jennifer", "Susana", "Valeria"
];

const lastNames = [
  "Gómez", "Pérez", "Rodríguez", "Martínez", "López", "Fernández", "García", "Torres", "Ramírez", "Castro",
  "Jiménez", "Morales", "Rojas", "Ruiz", "Vargas", "Sánchez", "Ortiz", "Guerrero", "Mendoza", "Herrera",
  "Cortés", "Cardona", "Navarro", "Cano", "Suárez", "Salazar", "Muñoz", "Aguilar", "Gutiérrez", "Reyes",
  "Pardo", "Valencia", "Ospina", "Cuellar", "Luna", "Escobar", "Martelo", "Montoya", "Restrepo"
];

const hobbies = [
  "leer", "bailar", "viajar", "cocinar", "hacer deporte", "ver películas", "dibujar", "salir con amigos",
  "jugar videojuegos", "ir a conciertos", "acampar", "andar en bici", "hacer senderismo", "fotografía", 
  "yoga", "meditación", "ir al gimnasio", "pintar", "tocar guitarra", "ver series", "coleccionar vinilos", 
  "salir a comer", "jugar fútbol", "explorar cafés nuevos", "surfear", "ver documentales", "ir al teatro",
  "patinar", "ir a museos", "aprender idiomas", "ver el atardecer", "cantar", "escribir poesía"
];

const orientations = [
  "heterosexual", "homosexual", "bisexual", "pansexual", "asexual", "demisexual", "queer", "prefiero no decirlo"
];

const lookingFor = [
  "amistad", "relación seria", "aventura", "compañía", "conversar", "algo casual", "una cita divertida", 
  "nuevas experiencias", "viajar juntos", "conocer gente nueva", "una conexión real", "una relación estable"
];

// === FUNCIÓN AUXILIAR: NOMBRE Y APELLIDOS === //
function randomName(isMale) {
  const firstArray = isMale ? maleNames : femaleNames;
  const numNames = Math.random() > 0.5 ? 2 : 1; // 1 o 2 nombres
  const names = [];

  while (names.length < numNames) {
    const n = firstArray[Math.floor(Math.random() * firstArray.length)];
    if (!names.includes(n)) names.push(n);
  }

  // Siempre 2 apellidos
  const surname1 = lastNames[Math.floor(Math.random() * lastNames.length)];
  let surname2;
  do {
    surname2 = lastNames[Math.floor(Math.random() * lastNames.length)];
  } while (surname2 === surname1);

  return `${names.join(" ")} ${surname1} ${surname2}`;
}

// === BASE DE DATOS LOCAL === //
let users = loadJSON(USERS_FILE);
let messages = loadJSON(MESSAGES_FILE);
let likes = loadJSON(LIKES_FILE);

// === GENERAR USUARIOS INICIALES === //
if (users.length === 0) {
  users = [
    {
      id: 1,
      name: "Nehifer Geronimo",
      email: "admin@admin.com",
      password: "1234",
      role: "admin",
      city: "Santa Marta",
      age: 26,
      blocked: false,
      online: true,
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      interests: ["gestión", "supervisión"],
      orientation: "heterosexual",
      lookingFor: "gestión",
      drinks: false,
      smokes: false,
      hasChildren: false,
      description: "Soy el creador y administrador de una buena página."
    },
  ];

  // Generar usuarios aleatorios
  function generateRandomUsers(count = 100) {
    for (let i = 0; i < count; i++) {
      const isMale = Math.random() > 0.5;
      const interestsSample = hobbies.sort(() => 0.5 - Math.random()).slice(0, 3);
      const looking = lookingFor[Math.floor(Math.random() * lookingFor.length)];

      const newUser = {
        id: users.length + 1,
        name: randomName(isMale),
        email: `user${users.length + 1}@example.com`,
        password: "1234",
        role: "user",
        city: cities[Math.floor(Math.random() * cities.length)],
        age: Math.floor(Math.random() * 40) + 18,
        blocked: false,
        online: false,
        avatar: `https://randomuser.me/api/portraits/${isMale ? "men" : "women"}/${Math.floor(Math.random() * 90)}.jpg`,
        interests: interestsSample,
        orientation: orientations[Math.floor(Math.random() * orientations.length)],
        lookingFor: looking,
        drinks: Math.random() > 0.5,
        smokes: Math.random() > 0.4,
        hasChildren: Math.random() > 0.3,
        description: `Soy ${isMale ? "un chico" : "una chica"}, me gusta ${interestsSample[0]} y busco ${looking}.`
      };
      users.push(newUser);
    }
  }

  generateRandomUsers(100);
  saveJSON(USERS_FILE, users);
}

// === RUTAS === //

// Raíz
app.get("/", (_, res) => res.send("🚀 API funcionando correctamente"));

// Listar usuarios
app.get("/api/users", (_, res) => res.json(users));

// === LISTAR CIUDADES === //
app.get("/api/cities", (_, res) => {
  res.json(cities);
});

// LOGIN
app.post("/api/users/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: "Credenciales incorrectas" });
  res.json(user);
});

// CREAR USUARIO
app.post("/api/users", verificarEdad, verificarReporte, (req, res) => {
  const { name, email, password, role, city, age } = req.body;
  if (users.some(u => u.email === email))
    return res.status(400).json({ error: "Correo ya registrado" });

  const isMale = Math.random() > 0.5;
  const newUser = {
    id: users.length + 1,
    name: name || randomName(isMale),
    email,
    password,
    role: role || "user",
    city,
    age,
    blocked: false,
    online: false,
    avatar: `https://randomuser.me/api/portraits/${isMale ? "men" : "women"}/${Math.floor(Math.random() * 90)}.jpg`,
    interests: hobbies.sort(() => 0.5 - Math.random()).slice(0, 3),
    orientation: orientations[Math.floor(Math.random() * orientations.length)],
    lookingFor: lookingFor[Math.floor(Math.random() * lookingFor.length)],
    drinks: Math.random() > 0.5,
    smokes: Math.random() > 0.4,
    hasChildren: Math.random() > 0.3,
    description: `Soy ${name || "usuario nuevo"}, me gusta ${hobbies[0]} y busco ${lookingFor[Math.floor(Math.random() * lookingFor.length)]}.`
  };

  users.push(newUser);
  saveJSON(USERS_FILE, users);
  res.json(newUser);
});

// ACTUALIZAR USUARIO
app.put("/api/users/:id", verificarEdad, verificarReporte, (req, res) => {
  const { id } = req.params;
  const i = users.findIndex(u => u.id == id);
  if (i === -1) return res.status(404).json({ error: "Usuario no encontrado" });
  users[i] = { ...users[i], ...req.body };
  saveJSON(USERS_FILE, users);
  res.json(users[i]);
});

// ELIMINAR USUARIO
app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  users = users.filter(u => u.id != id);
  saveJSON(USERS_FILE, users);
  res.json({ message: "Usuario eliminado" });
});

// BLOQUEAR/DESBLOQUEAR
app.put("/api/users/:id/toggleBlock", (req, res) => {
  const { id } = req.params;
  const i = users.findIndex(u => u.id == id);
  if (i === -1) return res.status(404).json({ error: "Usuario no encontrado" });
  users[i].blocked = !users[i].blocked;
  saveJSON(USERS_FILE, users);
  res.json(users[i]);
});

// === MENSAJES === //
app.post("/api/messages", (req, res) => {
  const { from, to, content } = req.body;
  if (!from || !to || !content)
    return res.status(400).json({ error: "Faltan campos obligatorios" });

  const newMessage = {
    id: messages.length + 1,
    from,
    to,
    content,
    date: new Date().toISOString(),
  };
  messages.push(newMessage);
  saveJSON(MESSAGES_FILE, messages);
  res.json(newMessage);
});

app.get("/api/messages/:email", (req, res) => {
  const { email } = req.params;
  const userMessages = messages.filter(m => m.to === email);
  res.json(userMessages);
});

// === LIKES === //
app.post("/api/users/:id/like", (req, res) => {
  const { id } = req.params;
  const { from } = req.body;
  if (!from) return res.status(400).json({ error: "Falta usuario que da el like" });

  if (!likes.find(l => l.from === from && l.to == id)) {
    likes.push({ from, to: parseInt(id), date: new Date().toISOString() });
    saveJSON(LIKES_FILE, likes);
  }
  res.json({ message: `Usuario ${from} le dio like a ${id}` });
});

app.get("/api/users/:email/likes", (req, res) => {
  const { email } = req.params;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
  const receivedLikes = likes.filter(l => l.to === user.id);
  res.json(receivedLikes);
});

// === INICIAR SERVIDOR === //
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});