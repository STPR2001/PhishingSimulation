const mongoose = require("mongoose");
const Empresa = require("../models/empresa");
const Usuario = require("../models/empresa");
const nodemailer = require("nodemailer");

// Crear una nueva empresa
exports.createEmpresa = async (req, res) => {
  try {
    const { nombre, usuarios } = req.body;

    // Comprobar si los usuarios proporcionados existen
    const usuariosExistentes = await Usuario.find({ _id: { $in: usuarios } });

    if (usuariosExistentes.length !== usuarios.length) {
      return res.status(400).json({ message: "Uno o más usuarios no existen" });
    }

    const empresa = new Empresa({
      _id: new mongoose.Types.ObjectId(),
      nombre,
      usuarios,
    });

    const savedEmpresa = await empresa.save();
    res.status(201).json(savedEmpresa);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la empresa", error });
  }
};

// Obtener todas las empresas
exports.getEmpresas = async (req, res) => {
  try {
    const empresas = await Empresa.find().populate(
      "usuarios",
      "nombre apellido correo"
    );
    res.status(200).json(empresas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las empresas", error });
  }
};

// Obtener una empresa por ID
exports.getEmpresaById = async (req, res) => {
  try {
    const empresa = await Empresa.findById(req.params.id).populate(
      "usuarios",
      "nombre apellido correo"
    );
    if (!empresa) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }
    res.status(200).json(empresa);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la empresa", error });
  }
};

// Actualizar una empresa
exports.updateEmpresa = async (req, res) => {
  try {
    const { nombre, usuarios } = req.body;

    // Comprobar si los usuarios proporcionados existen
    const usuariosExistentes = await Usuario.find({ _id: { $in: usuarios } });

    if (usuariosExistentes.length !== usuarios.length) {
      return res.status(400).json({ message: "Uno o más usuarios no existen" });
    }

    const empresaActualizada = await Empresa.findByIdAndUpdate(
      req.params.id,
      { nombre, usuarios },
      { new: true, runValidators: true }
    ).populate("usuarios", "nombre apellido correo");

    if (!empresaActualizada) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }

    res.status(200).json(empresaActualizada);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la empresa", error });
  }
};

// Eliminar una empresa
exports.deleteEmpresa = async (req, res) => {
  try {
    const empresaEliminada = await Empresa.findByIdAndDelete(req.params.id);
    if (!empresaEliminada) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }
    res.status(200).json({ message: "Empresa eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la empresa", error });
  }
};

// Enviar correo
exports.sendEmail = async (req, res) => {
  const { recipientEmail, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "santiagotomasperron2001@gmail.com",
      pass: "cgyk udxs rfmo bcue",
    },
  });

  const mailOptions = {
    from: "santiagotomasperron2001@gmail.com",
    to: recipientEmail,
    subject: subject,
    html: `<h1>¡Hola!</h1><p>${message}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ success: true, message: "Correo enviado correctamente" });
  } catch (error) {
    console.error("Error enviando el correo: ", error);
    res
      .status(500)
      .json({ success: false, message: "Error enviando el correo", error });
  }
};
