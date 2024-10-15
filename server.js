const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/usuario.route");
const empresaRoutes = require("./routes/empresa.route");
const auth = require("./routes/auth.route");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");
global.__root = __dirname + "/";

const app = express();

var server = require("http").createServer(app);

// Middleware para parsear JSON
app.use(express.json());

mongoose.connect(
  "mongodb+srv://santiagoperron:twFsG7WWl0Hc8wZB@cluster0.lsv5b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/usuario", userRoutes); // Rutas para usuarios
app.use("/api/empresa", empresaRoutes); // Rutas para empresas
app.use("/api/auth", auth);

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Error interno del servidor" });
});

//NO REDIRIGE BIEN!!!
app.use(express.static(path.join(__dirname, "views")));
//redirigir a login
app.get("/", function (req, res, next) {
  res.sendFile(__dirname + "/views/index.html");
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
