const express = require("express");
const router = express.Router();
const empresaController = require("../controllers/empresa.controller");

router.post("/empresas", empresaController.createEmpresa);
router.get("/empresas", empresaController.getEmpresas);
router.get("/empresas/:id", empresaController.getEmpresaById);
router.put("/empresas/:id", empresaController.updateEmpresa);
router.delete("/empresas/:id", empresaController.deleteEmpresa);
//router.post("/sendEmail", empresaController.sendEmail);
router.post("/sendMultipleEmails", empresaController.sendMultipleEmails);

module.exports = router;
