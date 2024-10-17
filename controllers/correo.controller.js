const Correo = require("../models/correo");
const mongoose = require("mongoose");

// Crear un nuevo correo
exports.createCorreo = async (req, res) => {
  try {
    const correo = new Correo({
      _id: new mongoose.Types.ObjectId(),
      asunto: req.body.asunto,
      contenido: req.body.contenido,
    });
    const result = await correo.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el correo", error });
  }
};

// Obtener todos los correos
exports.getAllCorreos = async (req, res) => {
  try {
    const correos = await Correo.find();
    res.status(200).json(correos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los correos", error });
  }
};

// Obtener un correo por ID
exports.getCorreoById = async (req, res) => {
  try {
    const correo = await Correo.findById(req.params.id);
    if (correo) {
      res.status(200).json(correo);
    } else {
      res.status(404).json({ message: "Correo no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el correo", error });
  }
};

// Actualizar un correo por ID
exports.updateCorreo = async (req, res) => {
  try {
    const updatedCorreo = await Correo.findByIdAndUpdate(
      req.params.id,
      {
        asunto: req.body.asunto,
        contenido: req.body.contenido,
      },
      { new: true }
    );
    if (updatedCorreo) {
      res.status(200).json(updatedCorreo);
    } else {
      res.status(404).json({ message: "Correo no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el correo", error });
  }
};

// Eliminar un correo por ID
exports.deleteCorreo = async (req, res) => {
  try {
    const correo = await Correo.findByIdAndDelete(req.params.id);
    if (correo) {
      res.status(200).json({ message: "Correo eliminado" });
    } else {
      res.status(404).json({ message: "Correo no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el correo", error });
  }
};
