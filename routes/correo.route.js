const express = require("express");
const router = express.Router();
const correoController = require("../controllers/correo.controller");

// Ruta para crear un correo
router.post("/correos", correoController.createCorreo);

// Ruta para obtener todos los correos
router.get("/correos", correoController.getAllCorreos);

// Ruta para obtener un correo por ID
router.get("/correos/:id", correoController.getCorreoById);

// Ruta para actualizar un correo por ID
router.put("/correos/:id", correoController.updateCorreo);

// Ruta para eliminar un correo por ID
router.delete("/correos/:id", correoController.deleteCorreo);

module.exports = router;
