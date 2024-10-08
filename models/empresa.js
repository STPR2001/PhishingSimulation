var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var EmpresaSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  nombre: { type: String, required: true, max: 100 },
  usuarios: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },
  ],
});

module.exports = mongoose.model("Empresa", EmpresaSchema);
